/* The USD figure on a product page is the published selling price.
   The factory-gate cost lives in the ERP and is not published.
   So the published figure must never be labelled "ex-works". */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
let n = 0, missed = [];

function sub(rel, pairs) {
  const f = path.join(root, rel);
  let s = fs.readFileSync(f, 'utf8');
  for (const [a, b] of pairs) {
    const c = s.split(a).length - 1;
    if (!c) { missed.push(rel + ' :: ' + a.slice(0, 60)); continue; }
    s = s.split(a).join(b);
    n += c;
  }
  fs.writeFileSync(f, s, 'utf8');
}

sub('src/data/industries.ts', [
  ['we quote the ex-works or FOB price and you choose the route.', 'we quote on FOB terms and you choose the route.'],
]);

sub('scripts/gen-llms.cjs', [
  ['per piece (ex-works, tiered by quantity)', 'per piece, tiered by quantity'],
  ["'- Prices are ex-works unit prices at the smallest quantity tier; volume tiers are quoted per SKU.'",
   "'- Prices are the published unit prices at the smallest quantity tier; volume tiers are quoted per SKU.'"],
]);

sub('scripts/gen-llms-full.cjs', [
  ['–${Math.max(...prices).toFixed(2)} ex-works, MOQ', '–${Math.max(...prices).toFixed(2)} per piece, MOQ'],
  ['Unit price: USD ${p.price.toFixed(2)}/pc ex-works. MOQ', 'Unit price: USD ${p.price.toFixed(2)}/pc. MOQ'],
]);

sub('src/pages/blog/toy-moq-cartons-guide.astro', [
  ['is about $${byCash[0].cash.toLocaleString(\'en-US\')} ex-works, which is', 'is about $${byCash[0].cash.toLocaleString(\'en-US\')} in goods value, which is'],
  ['Cash to enter is minimum × unit price, ex-works, before freight and before any packaging run. It is not a',
   'Cash to enter is the minimum multiplied by the published unit price, before freight and before any packaging run. It is not a'],
]);

sub('src/pages/packing-data.astro', [
  ["'Unit price (USD, ex-works)',", "'Unit price (USD, per piece)',"],
  ['per unit once freight is added, even when the ex-works price looks lower.', 'per unit once freight is added, even when the unit price looks lower.'],
]);

sub('src/pages/container-calculator.astro', [
  ["a: 'No. The price shown is the ex-works unit price multiplied by quantity, which is what the factory invoices before freight and duties. Freight depends on your port, the term and the forwarder, and is not estimated here.'",
   "a: 'No. The figure shown is the published unit price multiplied by quantity — the goods value before freight, insurance and duties. Freight depends on your port, the term and the forwarder, and is not estimated here.'"],
  ['<th class="text-right px-5 py-3 font-bold">Ex-works</th>', '<th class="text-right px-5 py-3 font-bold">Goods value</th>'],
  ['<div class="text-[9px] uppercase tracking-[0.25em] text-gray-500 mt-2">Ex-works</div>',
   '<div class="text-[9px] uppercase tracking-[0.25em] text-gray-500 mt-2">Goods value</div>'],
  ['Two models can show the same ex-works price and land at very different costs per piece.',
   'Two models can show the same unit price and land at very different costs per piece.'],
]);

console.log('replacements:', n);
if (missed.length) { console.log('NOT FOUND:'); missed.forEach((m) => console.log('  ' + m)); }

// Any remaining "ex-works" that refers to our own price?
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(astro|cjs|ts)$/.test(e.name)) out.push(p);
  }
  return out;
};
for (const f of walk(path.join(root, 'src')).concat(walk(path.join(root, 'scripts')))) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/ex-works|ex works/i.test(line)) console.log('left:', path.relative(root, f) + ':' + (i + 1), line.trim().slice(0, 90));
  });
}
