const fs = require('fs');
const path = require('path');
const DIST = path.resolve(__dirname, '../dist');

const text = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const words = (h) => text(h).split(/\s+/).filter(Boolean).length;

const targets = ['index', 'factory', 'oem-odm', 'about', 'contact', 'products'];
for (const t of targets) {
  const f = path.join(DIST, `${t}.html`);
  if (!fs.existsSync(f)) { console.log(`${t}: MISSING`); continue; }
  const h = fs.readFileSync(f, 'utf8');
  const lds = [...h.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => {
    try { const j = JSON.parse(m[1]); return [].concat(j['@type']).join('+'); } catch { return 'ERR'; }
  });
  const h2 = (h.match(/<h2[\s>]/g) || []).length;
  const h3 = (h.match(/<h3[\s>]/g) || []).length;
  const qs = (h.match(/<h3[^>]*>[^<]*\?/g) || []).length;
  console.log(`${t.padEnd(10)} words=${String(words(h)).padStart(5)} h2=${h2} h3=${h3} qH3=${qs} ld=[${lds.join(', ')}]`);
}

console.log('\n--- product page check (TF208740) ---');
const p = fs.readFileSync(path.join(DIST, 'product/TF208740.html'), 'utf8');
console.log('words:', words(p));
console.log('h3 questions:', (p.match(/<h3[^>]*>[^<]*\?/g) || []).length);
console.log('details tags:', (p.match(/<details/g) || []).length);
console.log('ISO mentions:', (p.match(/ISO.?9001/gi) || []).length);
console.log('AQL mentions:', (p.match(/AQL/gi) || []).length);

console.log('\n--- residual forbidden claims across dist ---');
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) walk(f, out); else if (e.name.endsWith('.html')) out.push(f);
  }
  return out;
};
const hits = {};
for (const f of walk(DIST)) {
  const s = fs.readFileSync(f, 'utf8');
  for (const pat of [/Huanuo/gi, /ISO.?9001/gi, /BSCI/gi, /SEDEX/gi, /GSV/gi, /GMPC/gi]) {
    const n = (s.match(pat) || []).length;
    if (n) hits[pat.source] = (hits[pat.source] || 0) + n;
  }
}
console.log(hits);
