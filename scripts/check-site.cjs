#!/usr/bin/env node
/**
 * Site integrity gate — runs AFTER `astro build`, BEFORE deploy.
 *
 * Why this exists: a build can succeed while the OUTPUT is wrong. The 2026-07-28
 * WebP batch script silently mangled UTF-8 in text files (destroying an en dash
 * AND the following digit), the site built fine, deployed fine, and shipped broken
 * content for 2.5 months. Nothing checked the rendered result.
 *
 * Cloudflare Pages runs `npm run build`; if this script exits non-zero the deploy
 * fails and the previously working version stays live.
 *
 * Output is ASCII-only on purpose — no console-encoding surprises.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PUBLIC = path.join(ROOT, 'public');
const ALLOWED_LINK_EXT = /\.(html|xml|txt|webp|png|jpg|jpeg|gif|svg|ico|mp4|webm|css|js|json|pdf)$/i;
const CF_MAX_FILE = 25 * 1024 * 1024; // Cloudflare Pages per-file limit

const errors = [];
const warnings = [];
const fail = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

/* ------------------------------------------------------------------ helpers */

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function readUtf8(file) {
  const buf = fs.readFileSync(file);
  const text = buf.toString('utf8');
  // Node replaces undecodable bytes with U+FFFD, so a valid round-trip is not
  // enough — scan incrementally and report the first bad offset.
  const bad = text.indexOf('\uFFFD');
  return { text, hasInvalid: bad !== -1, badAt: bad };
}

function stripTrailingSlash(u) {
  return u.length > 1 ? u.replace(/\/+$/, '') : u;
}

/* ------------------------------------------------- 1. encoding / mojibake */

// High-confidence corruption signatures only (kept narrow to avoid false alarms).
const MOJIBAKE = [
  ['U+FFFD replacement char', /\uFFFD/],
  ['double-encoded CJK mojibake', /[\u9225\u9525\u94df]/, ],
  ['classic UTF-8-as-GBK run', /(锟|鈥|鉁|锛|鐨)/],
  ['latin1-as-UTF8 artifact', /â€|Ã©|ï»¿|Â£/],
  ['dash followed by stray "?"', /[\u2013\u2014]\?/],
  ['broken closing tag from eaten char', /\?\s*\/\s*(span|a|p|div|strong|em|li|h[1-6])\s*>/],
];

function checkEncodingFiles() {
  const targets = [
    ...walk(path.join(ROOT, 'src')).filter((f) => /\.(astro|json|ts|mjs|js|css|md)$/i.test(f)),
    ...walk(PUBLIC).filter((f) => /\.(html|xml|txt|json)$/i.test(f)),
    ...walk(DIST).filter((f) => /\.(html|xml|txt|json|css|js)$/i.test(f)),
  ].filter((f) => !f.includes('node_modules'));

  for (const file of targets) {
    const rel = path.relative(ROOT, file).replace(/\\/g, '/');
    let text;
    try {
      ({ text } = readUtf8(file));
    } catch (e) {
      fail(`ENCODING cannot read ${rel}: ${e.message}`);
      continue;
    }
    for (const [label, re] of MOJIBAKE) {
      const m = re.exec(text);
      if (m) {
        const line = text.slice(0, m.index).split('\n').length;
        const ctx = text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ');
        fail(`ENCODING [${label}] ${rel}:${line}  ...${ctx}...`);
      }
    }
  }
}

/* ------------------------------------- 2. canonical == actual served path */

function expectedPathFromFile(file) {
  const rel = path.relative(DIST, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'/index.html'.length);
  if (rel.endsWith('.html')) return '/' + rel.slice(0, -'.html'.length);
  return null;
}

function checkCanonical() {
  const pages = walk(DIST).filter((f) => f.endsWith('.html'));
  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const expected = expectedPathFromFile(file);
    const { text } = readUtf8(file);

    const canon = text.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/);
    if (!canon) {
      fail(`CANONICAL missing in ${rel} (expected ${expected})`);
      continue;
    }
    let canonPath;
    try {
      canonPath = new URL(canon[1]).pathname;
    } catch {
      canonPath = canon[1];
    }
    if (stripTrailingSlash(canonPath) !== stripTrailingSlash(expected)) {
      fail(`CANONICAL mismatch ${rel}: tag says "${canonPath}" but file is served at "${expected}"`);
    }
    // og:url must agree with canonical, otherwise social crawlers see a third URL
    const og = text.match(/property="og:url"\s+content="([^"]+)"/);
    if (og) {
      let ogPath;
      try {
        ogPath = new URL(og[1]).pathname;
      } catch {
        ogPath = og[1];
      }
      if (stripTrailingSlash(ogPath) !== stripTrailingSlash(canonPath)) {
        warn(`OG-URL differs from canonical in ${rel}: og="${ogPath}" canonical="${canonPath}"`);
      }
    }
  }
  return pages;
}

/* ------------------------------------------------- 3. sitemap consistency */

function checkSitemap(pages) {
  const smPath = path.join(DIST, 'sitemap.xml');
  if (!fs.existsSync(smPath)) {
    fail('SITEMAP dist/sitemap.xml missing');
    return;
  }
  const { text } = readUtf8(smPath);
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

  const siteMatch = fs
    .readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8')
    .match(/site:\s*'([^']+)'/);
  const base = siteMatch ? siteMatch[1].replace(/\/$/, '') : '';

  const inSitemap = new Set();
  for (const loc of locs) {
    if (base && !loc.startsWith(base)) {
      fail(`SITEMAP wrong origin: ${loc} (expected prefix ${base})`);
      continue;
    }
    const p = loc.slice(base.length) || '/';
    if (p !== '/' && p.endsWith('/')) {
      fail(`SITEMAP has trailing slash: ${loc} — served path has none (308 redirect would fire)`);
    }
    inSitemap.add(stripTrailingSlash(p));
  }

  const built = new Set(pages.map(expectedPathFromFile));
  for (const p of inSitemap) {
    if (!built.has(p)) fail(`SITEMAP lists ${p} but no such built page exists`);
  }
  for (const p of built) {
    if (!inSitemap.has(p)) warn(`Page ${p} is built but missing from sitemap.xml`);
  }
}

/* ----------------------------------------------------- 4. internal links */

function checkLinks(pages) {
  const allFiles = new Set(walk(DIST).map((f) => path.relative(DIST, f).replace(/\\/g, '/')));
  const broken = new Map();

  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const { text } = readUtf8(file);
    for (const m of text.matchAll(/href="(\/[^"#?]*)"/g)) {
      let target = m[1];
      if (target.startsWith('//')) continue;
      const clean = target.split('?')[0].split('#')[0];
      const trimmed = stripTrailingSlash(clean);
      const candidates = [
        trimmed.replace(/^\//, '') || 'index.html',
        (trimmed.replace(/^\//, '') || 'index') + '.html',
        path.posix.join(trimmed.replace(/^\//, ''), 'index.html'),
      ];
      if (candidates.some((c) => allFiles.has(c))) continue;
      if (ALLOWED_LINK_EXT.test(trimmed) && allFiles.has(trimmed.replace(/^\//, ''))) continue;
      if (!broken.has(target)) broken.set(target, new Set());
      broken.get(target).add(rel);
    }
  }
  for (const [target, sources] of broken) {
    fail(`LINK /-> ${target} does not resolve (found on: ${[...sources].slice(0, 3).join(', ')})`);
  }
}

/* --------------------------------------------------- 5. JSON-LD validity */

function checkJsonLd(pages) {
  for (const file of pages) {
    const rel = path.relative(DIST, file).replace(/\\/g, '/');
    const { text } = readUtf8(file);
    const blocks = [...text.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
    if (blocks.length === 0) continue;
    blocks.forEach((b, i) => {
      try {
        JSON.parse(b[1]);
      } catch (e) {
        fail(`JSON-LD invalid in ${rel} (block ${i + 1}): ${e.message}`);
      }
    });
  }
}

/* ------------------------------------------- 6. product data + assets */

function checkProducts() {
  const pj = path.join(ROOT, 'src', 'data', 'products.json');
  let products;
  try {
    products = JSON.parse(fs.readFileSync(pj, 'utf8'));
  } catch (e) {
    fail(`PRODUCTS src/data/products.json is not valid JSON: ${e.message}`);
    return;
  }
  if (!Array.isArray(products) || products.length === 0) {
    fail('PRODUCTS products.json is empty or not an array');
    return;
  }
  const ids = new Set();
  for (const p of products) {
    const id = p.id || '(no id)';
    for (const field of ['id', 'name', 'moq', 'price', 'category', 'images']) {
      if (p[field] === undefined || p[field] === null || p[field] === '') {
        fail(`PRODUCTS ${id}: missing required field "${field}"`);
      }
    }
    if (ids.has(id)) fail(`PRODUCTS duplicate id: ${id}`);
    ids.add(id);

    if (typeof p.moq !== 'number' || p.moq <= 0) fail(`PRODUCTS ${id}: moq must be a positive number (got ${JSON.stringify(p.moq)})`);
    if (typeof p.price !== 'number' || p.price <= 0) fail(`PRODUCTS ${id}: price must be a positive number (got ${JSON.stringify(p.price)})`);

    const imgs = p.images || [];
    if (imgs.length < 3) warn(`PRODUCTS ${id}: only ${imgs.length} image(s) — listings should have 3+`);
    for (const img of imgs) {
      const f = path.join(PUBLIC, img.replace(/^\//, ''));
      if (!fs.existsSync(f)) fail(`PRODUCTS ${id}: image missing on disk: ${img}`);
      else if (fs.statSync(f).size === 0) fail(`PRODUCTS ${id}: image is 0 bytes: ${img}`);
      else if (fs.statSync(f).size > CF_MAX_FILE) fail(`PRODUCTS ${id}: image over 25MB, Cloudflare will reject: ${img}`);
    }
    if (p.video) {
      const v = p.video;
      if (v.startsWith('/')) {
        const f = path.join(PUBLIC, v.replace(/^\//, ''));
        if (!fs.existsSync(f)) fail(`PRODUCTS ${id}: video missing on disk: ${v}`);
        else {
          const size = fs.statSync(f).size;
          if (size === 0) fail(`PRODUCTS ${id}: video is 0 bytes: ${v}`);
          else if (size > CF_MAX_FILE) fail(`PRODUCTS ${id}: video ${(size / 1048576).toFixed(1)}MB exceeds Cloudflare's 25MB limit — deploy would break`);
        }
      }
    }
  }
  console.log(`  products checked: ${products.length}`);
}

/* --------------------------------------- 7. zero-byte / oversized assets */

// Files that .gitignore excludes never reach the Cloudflare build machine, so
// they cannot break a deploy and must not be reported as failures.
function loadIgnorePatterns() {
  const gi = path.join(ROOT, '.gitignore');
  if (!fs.existsSync(gi)) return [];
  return fs
    .readFileSync(gi, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#') && !l.startsWith('!'));
}

function isIgnored(rel, patterns) {
  return patterns.some((raw) => {
    const pat = raw.replace(/^\//, '').replace(/\/$/, '');
    if (!pat) return false;
    if (pat.startsWith('*.')) return rel.endsWith(pat.slice(1));
    if (pat.includes('*')) {
      const re = new RegExp(
        '^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$'
      );
      return re.test(rel);
    }
    return rel === pat || rel.startsWith(pat + '/') || rel.split('/').includes(pat);
  });
}

function checkAssets() {
  const ignore = loadIgnorePatterns();
  const pubFiles = walk(PUBLIC);
  let zero = 0;
  let skipped = 0;
  for (const f of pubFiles) {
    const rel = path.relative(PUBLIC, f).replace(/\\/g, '/');
    if (isIgnored(rel, ignore)) {
      skipped++;
      continue;
    }
    const size = fs.statSync(f).size;
    if (size === 0) {
      fail(`ASSET 0 bytes: public/${rel}`);
      zero++;
    } else if (size > CF_MAX_FILE) {
      fail(
        `ASSET ${(size / 1048576).toFixed(1)}MB exceeds Cloudflare's 25MB limit: public/${rel}`
      );
    }
  }
  console.log(
    `  public assets: ${pubFiles.length} (${zero} empty, ${skipped} gitignored/skipped)`
  );
}

/* ------------------------------------------------------------- runner */

console.log('Site integrity check');
console.log('====================');

const pages = checkCanonical();
console.log(`  pages: ${pages.length}`);
checkEncodingFiles();
checkSitemap(pages);
checkLinks(pages);
checkJsonLd(pages);
checkProducts();
checkAssets();

console.log('');
if (warnings.length) {
  console.log(`WARNINGS (${warnings.length}) — not blocking:`);
  for (const w of warnings) console.log('  ~ ' + w);
  console.log('');
}
if (errors.length) {
  console.log(`FAILED: ${errors.length} problem(s) — deploy blocked:`);
  for (const e of errors) console.log('  x ' + e);
  process.exit(1);
}
console.log('PASS: site is clean.');
