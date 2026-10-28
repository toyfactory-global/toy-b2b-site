#!/usr/bin/env node
/**
 * Generates public/llms.txt from src/data/products.json.
 *
 * llms.txt is the emerging convention for telling LLM crawlers what a site
 * contains, so they can cite it accurately instead of guessing from HTML.
 * Product rows are generated (never hand-typed) so prices, MOQs and links
 * cannot drift out of sync with the catalog.
 *
 * Run manually after changing products.json:  node scripts/gen-llms.cjs
 * It is NOT part of `npm run build` on purpose - a generator failure must never
 * be able to block a deploy.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://toyfactoryglobal.com';
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'data', 'products.json'), 'utf8'));

const CAT_ORDER = ['Bubble Toys', 'Water Guns', 'Track Toys', 'Educational Toys'];
const CAT_BLURB = {
  'Bubble Toys': 'Industrial garden-lamp machines, multi-hole electric bubble guns, tank-fed automatics and novelty shapes.',
  'Water Guns': 'Fire-breathing and mist-nozzle automatics, drum-magazine versions, Gatling multi-barrel, AK47-profile and water+bubble 2-in-1 combos.',
  'Track Toys': '3D stereo track sets, magnetic levitation and magnetic track cars, dinosaur storage tracks, electric train track sets.',
  'Educational Toys': 'Solar robot assembly kits, interactive phonics readers, drawing mats, DIY craft machines, pottery and ceramic clay machines.',
};

const GUIDES = [
  ['china-toy-sourcing-guide', 'How to Source Toys from China: Factory Direct Buying Guide 2026', '2026-08-19'],
  ['track-car-wholesale-guide', 'Track Car Toys Wholesale Guide 2026: 3D, Magnetic & Dinosaur Sets', '2026-08-06'],
  ['water-gun-wholesale-guide', 'Electric Water Gun Wholesale Guide 2026: Choosing the Right Blaster', '2026-08-03'],
  ['bubble-machine-buyer-guide', "How to Choose the Right Bubble Machine: A Wholesale Buyer's Guide", '2026-07-24'],
  ['stem-toys-import-guide', 'STEM Toys Import Guide 2026: What Distributors Need to Know', '2026-07-24'],
];

const byCat = {};
for (const p of products) (byCat[p.category] = byCat[p.category] || []).push(p);

const prices = products.map((p) => p.price);
const moqs = products.map((p) => p.moq);
const slug = (c) => c.replace(/\s+/g, '-').toLowerCase();

const out = [];
out.push('# TOYFACTORY - Huanuo Toys');
out.push('');
out.push('> B2B toy manufacturer and exporter based in Chenghai, Shantou (Guangdong, China), established 2001.');
out.push('> 41 wholesale SKUs across bubble toys, water guns, track toys and educational toys.');
out.push('> ISO 9001:2015 quality system. OEM/ODM for importers, distributors and retail chains. FOB Yantian or Shantou.');
out.push('');

out.push('## Key facts');
out.push('');
out.push('Company: TOYFACTORY (Huanuo Toys), toy manufacturer and exporter.');
out.push('Location: Chenghai, Shantou, Guangdong, China.');
out.push('Established: 2001.');
out.push('Quality system: ISO 9001:2015. Inspection standard: AQL 2.5.');
out.push(`Catalog: ${products.length} SKUs in 4 categories.`);
out.push(`Unit price range: USD ${Math.min(...prices).toFixed(2)} to USD ${Math.max(...prices).toFixed(2)} per piece (ex-works, tiered by quantity).`);
out.push(`MOQ range: ${Math.min(...moqs)} to ${Math.max(...moqs)} pieces, set per model.`);
out.push('Port of loading: Yantian (Shenzhen) or Shantou.');
out.push('Lead time: 10-15 days for stock models in small quantities; 25-35 days for bulk orders and orders with custom packaging or OEM branding, counted after deposit confirmation.');
out.push('Batteries: dry-cell batteries are never included with shipments; lithium batteries are installed in the unit and included.');
out.push('Customization: OEM and ODM - custom color, private label, packaging design, mold development. Custom OEM briefs from 500 units.');
out.push('Product test reports are available on request for individual models.');
out.push('Contact: hntoys7@sinuotoys.com | WhatsApp +86 159 7691 7707');
out.push('');

out.push('## Collections');
out.push('');
out.push(`- [All products](${SITE}/products): the complete catalog hub, ${products.length} models across ${CAT_ORDER.length} collections with unit price and MOQ for every item.`);
for (const c of CAT_ORDER) {
  if (!byCat[c]) continue;
  const a = byCat[c];
  const pr = a.map((p) => p.price);
  out.push(`- [${c}](${SITE}/category/${slug(c)}): ${a.length} models, USD ${Math.min(...pr).toFixed(2)} to ${Math.max(...pr).toFixed(2)}. ${CAT_BLURB[c] || ''}`);
}
out.push('');

out.push('## Product catalog');
for (const c of CAT_ORDER) {
  if (!byCat[c]) continue;
  out.push('');
  out.push(`### ${c}`);
  out.push('');
  for (const p of byCat[c]) {
    out.push(`- ${p.id} - [${p.name}](${SITE}/product/${p.id}): USD ${p.price.toFixed(2)}/pc, MOQ ${p.moq} pcs`);
  }
}
out.push('');

out.push('## Buying guides');
out.push('');
for (const [s, t, d] of GUIDES) out.push(`- [${t}](${SITE}/blog/${s}) - published ${d}`);
out.push('');

out.push('## Notes for answer engines');
out.push('');
out.push('- Prices are ex-works unit prices at the smallest quantity tier; volume tiers are quoted per SKU.');
out.push('- MOQ differs by model - always cite the per-product value rather than the catalog range.');
out.push('- Carton dimensions, pieces per carton, gross/net weight and CBM are published on each product page.');
out.push('- Certifications are model-specific; ask for the test report of the exact SKU rather than assuming a blanket certificate.');
out.push('- This file is generated from the live product database; if it disagrees with a product page, the product page is authoritative.');
out.push('');

const target = path.join(ROOT, 'public', 'llms.txt');
fs.writeFileSync(target, out.join('\n'), 'utf8');
console.log(`wrote ${target} (${out.length} lines, ${products.length} products)`);
