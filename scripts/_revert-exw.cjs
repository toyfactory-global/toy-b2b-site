/* Revert the previous wording change.
   Correction from the site owner (2026-11-21): the USD figure on a product page
   IS an EXW selling price and should be labelled as one. The number that must
   never appear on the site is the ERP "出厂价" (cost, in CNY). */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
let n = 0;
const missed = [];

function sub(rel, pairs) {
  const f = path.join(root, rel);
  let s = fs.readFileSync(f, 'utf8');
  for (const [a, b] of pairs) {
    const c = s.split(a).length - 1;
    if (!c) { missed.push(rel + ' :: ' + a.slice(0, 70)); continue; }
    s = s.split(a).join(b);
    n += c;
  }
  fs.writeFileSync(f, s, 'utf8');
}

sub('src/data/industries.ts', [
  ['we quote on FOB terms and you choose the route.', 'we quote the ex-works or FOB price and you choose the route.'],
]);

sub('scripts/gen-llms.cjs', [
  ['per piece, tiered by quantity)', 'per piece (ex-works, tiered by quantity)'],
  ["'- Prices are the published unit prices at the smallest quantity tier; volume tiers are quoted per SKU.'",
   "'- Prices are ex-works unit prices at the smallest quantity tier; volume tiers are quoted per SKU.'"],
]);

sub('scripts/gen-llms-full.cjs', [
  ['per piece, MOQ', 'ex-works, MOQ'],
  ['Unit price: USD ${p.price.toFixed(2)}/pc. MOQ', 'Unit price: USD ${p.price.toFixed(2)}/pc ex-works. MOQ'],
]);

sub('src/pages/blog/toy-moq-cartons-guide.astro', [
  ["in goods value, which is", "ex-works, which is"],
  ['Cash to enter is the minimum multiplied by the <em>first</em> price tier shown on the product page.',
   'Cash to enter is the minimum multiplied by the <em>first</em> ex-works tier shown on the product page.'],
]);

sub('src/pages/packing-data.astro', [
  ["'Unit price (USD, per piece)',", "'Unit price (USD, ex-works)',"],
  ['per unit once freight is added, even when the unit price looks lower.', 'per unit once freight is added, even when the ex-works price looks lower.'],
]);

sub('src/pages/container-calculator.astro', [
  ["a: 'No. The figure shown is the published unit price multiplied by quantity — the goods value before freight, insurance and duties. Freight depends on your port, the term and the forwarder, and is not estimated here.'",
   "a: 'No. The figure shown is the published ex-works unit price multiplied by quantity — the goods value before freight, insurance and duties. Freight depends on your port, the term and the forwarder, and is not estimated here.'"],
  ['<th class="text-right px-5 py-3 font-bold">Goods value</th>', '<th class="text-right px-5 py-3 font-bold">Ex-works</th>'],
  ['<div class="text-[9px] uppercase tracking-[0.25em] text-gray-500 mt-2">Goods value</div>',
   '<div class="text-[9px] uppercase tracking-[0.25em] text-gray-500 mt-2">Ex-works</div>'],
  ['Two models can show the same unit price and land at very different costs per piece.',
   'Two models can show the same ex-works price and land at very different costs per piece.'],
]);

console.log('reverted:', n);
if (missed.length) { console.log('NOT FOUND:'); missed.forEach((m) => console.log('  ' + m)); }
