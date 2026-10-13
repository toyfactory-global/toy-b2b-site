// Quick inspection helper: show structured data + head tags of built pages.
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, '..', 'dist');
const targets = process.argv.slice(2);

function inspect(rel) {
  const file = path.join(DIST, rel);
  if (!fs.existsSync(file)) return console.log(`${rel}: NOT FOUND`);
  const t = fs.readFileSync(file, 'utf8');
  console.log(`\n=== ${rel} ===`);

  const blocks = [...t.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)];
  console.log(`  JSON-LD blocks: ${blocks.length}`);
  blocks.forEach((b, i) => {
    try {
      const o = JSON.parse(b[1]);
      const types = Array.isArray(o) ? o.map((x) => x['@type']).join(',') : o['@type'];
      console.log(`    [${i + 1}] OK   @type=${types}`);
    } catch (e) {
      console.log(`    [${i + 1}] FAIL ${e.message}`);
    }
  });

  const canon = t.match(/rel="canonical"[^>]*href="([^"]+)"/);
  const og = t.match(/property="og:url"\s+content="([^"]+)"/);
  const icon = t.match(/rel="icon"[^>]*href="([^"]+)"/);
  console.log(`  canonical: ${canon ? canon[1] : 'MISSING'}`);
  console.log(`  og:url   : ${og ? og[1] : 'MISSING'}`);
  if (icon) {
    const p = path.join(DIST, icon[1].replace(/^\//, ''));
    console.log(`  favicon  : ${icon[1]} ${fs.existsSync(p) ? '(file exists)' : '(FILE MISSING)'}`);
  }
}

if (targets.length === 0) {
  targets.push('index.html', 'product/TF200892.html', 'blog.html');
}
targets.forEach(inspect);
