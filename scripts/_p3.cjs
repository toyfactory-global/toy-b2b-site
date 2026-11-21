const fs = require('fs');
const path = require('path');
const D = path.resolve(__dirname, '../dist/blog');
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

const slugs = ['toy-moq-cartons-guide', '20gp-vs-40hq-toys', 'toy-packaging-formats', 'how-to-pay-china-toy-supplier'];
for (const s of slugs) {
  const p = path.join(D, s + '.html');
  if (!fs.existsSync(p)) { console.log(s, 'MISSING'); continue; }
  const h = fs.readFileSync(p, 'utf8');
  const words = text(h).split(/\s+/).filter(Boolean).length;
  const h2 = (h.match(/<h2[\s>]/g) || []).length;
  const q = (h.match(/<h3[^>]*>[^<]*\?/g) || []).length;
  const types = [...new Set([...h.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]))];
  const internal = [...new Set([...h.matchAll(/href="(\/(?:product|industries|blog|packing-data|container-calculator|factory|oem-odm|products)[^"]*)"/g)].map((m) => m[1]))];
  console.log(`${s.padEnd(32)} words=${String(words).padStart(5)} h2=${h2} qH3=${q} inlinks=${internal.length}`);
  console.log('   schema:', types.join(','));
}
console.log('\n--- titles of new posts ---');
for (const s of slugs) {
  const h = fs.readFileSync(path.join(D, s + '.html'), 'utf8');
  const t = (h.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  console.log(' ', t, `(${t.length} chars)`);
}
