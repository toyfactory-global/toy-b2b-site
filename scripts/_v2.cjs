const fs = require('fs');
const path = require('path');
const D = path.resolve(__dirname, '../dist');
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const w = (h) => text(h).split(/\s+/).filter(Boolean).length;

const files = [
  'industries.html',
  'industries/party-supplies-distributors.html',
  'industries/online-sellers.html',
  'industries/private-label-brands.html',
  'packing-data.html',
  'container-calculator.html',
];
for (const f of files) {
  const p = path.join(D, f);
  if (!fs.existsSync(p)) { console.log(f, 'MISSING'); continue; }
  const h = fs.readFileSync(p, 'utf8');
  const types = [...h.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]);
  const uniq = [...new Set(types)];
  const q = (h.match(/<h3[^>]*>[^<]*\?/g) || []).length;
  console.log(`${f.padEnd(52)} words=${String(w(h)).padStart(5)} qH3=${q} script=${(h.match(/<script/g) || []).length} schema=${uniq.join(',')}`);
}

console.log('\n--- industry table sanity (party page) ---');
const p = fs.readFileSync(path.join(D, 'industries/party-supplies-distributors.html'), 'utf8');
const rows = [...p.matchAll(/\/product\/(TF\d+)[\s\S]{0,900}?<td class="px-5 py-4 text-right text-gray-300">(\d+)<\/td>\s*<td class="px-5 py-4 text-right text-gold font-bold">([^<]+)</g)];
rows.forEach((m) => console.log(' ', m[1], 'moq=' + m[2], 'cartons=' + m[3]));

console.log('\n--- csv ---');
const csv = path.join(D, 'data/packing-data.csv');
console.log(fs.existsSync(csv) ? `${(fs.statSync(csv).size / 1024).toFixed(1)} KB, lines=${fs.readFileSync(csv, 'utf8').split('\n').length}` : 'MISSING');
