const fs = require('fs');
const path = require('path');
const D = path.resolve(__dirname, '../dist');
const read = (p) => fs.readFileSync(path.join(D, p), 'utf8');
const text = (h) => h.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim();

const aql = read('blog/aql-inspection-toys.html');
console.log('aql post: words=' + text(aql).split(/\s+/).length, 'q=' + (aql.match(/<h3[^>]*>[^<]*\?/g) || []).length, 'schema=' + [...new Set([...aql.matchAll(/"@type"\s*:\s*"([A-Za-z]+)"/g)].map((m) => m[1]))].join(','));

const cat = read('category/water-guns.html');
console.log('category has industry link:', cat.includes('/industries/party-supplies-distributors'), '| calculator link:', cat.includes('/container-calculator'));

const prod = read('product/TF208740.html');
console.log('product has calculator link:', prod.includes('/container-calculator'), '| packing data link:', prod.includes('/packing-data'), '| "all 41":', prod.includes('all 41'));

let exw = 0;
const walk = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.html')) out.push(p); } return out; };
const hits = [];
for (const f of walk(D)) {
  const s = fs.readFileSync(f, 'utf8');
  const n = (s.match(/ex-works/gi) || []).length;
  if (n) { exw += n; hits.push(path.relative(D, f) + ' ×' + n); }
}
console.log('ex-works occurrences in dist:', exw, hits);
console.log('csv header row:', read('data/packing-data.csv').split('\n')[0]);
