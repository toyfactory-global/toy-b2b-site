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
  ['battery-toys-shipping', 'Shipping Battery Toys: UN38.3, MSDS and What the Forwarder Needs', '2026-11-21'],
  ['amazon-fba-toy-packaging', 'FBA Toys: The Packaging Decisions That Decide Your Landed Cost', '2026-11-21'],
  ['aql-inspection-toys', 'AQL Inspection for Toys: How Many Pieces Actually Get Checked', '2026-11-21'],
  ['toy-moq-cartons-guide', 'Toy MOQ Explained: Why a 300-Piece Minimum Is Not a 300-Piece Order', '2026-11-21'],
  ['20gp-vs-40hq-toys', '20GP or 40HQ for Toys? The Carton Maths That Decides It', '2026-11-21'],
  ['toy-packaging-formats', 'Colour Box, Display Box or Sealed Box: Choosing Toy Packaging', '2026-11-21'],
  ['how-to-pay-china-toy-supplier', 'How to Pay a Chinese Toy Supplier Without Losing the Deposit', '2026-11-21'],
  ['water-gun-models-compared', 'Electric Water Guns Compared: Every Model by Price, MOQ and Container Load', '2026-11-04'],
  ['verify-china-toy-factory', 'How to Verify a China Toy Factory Before You Pay a Deposit', '2026-11-04'],
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
out.push('# TOYFACTORY');
out.push('');
out.push('> B2B toy manufacturer and exporter based in Chenghai, Shantou (Guangdong, China), established 2001.');
out.push('> 41 wholesale SKUs across bubble toys, water guns, track toys and educational toys.');
out.push('> 5,000 m2 factory in Chenghai, Shantou, assessed on site by SGS in August 2026. OEM/ODM for importers, distributors and retail chains. FOB Shantou or Yantian.');
out.push('');

out.push('## Key facts');
out.push('');
out.push('Company: TOYFACTORY, toy manufacturer and exporter.');
out.push('Location: Chenghai, Shantou, Guangdong, China.');
out.push('Established: 2001.');
out.push('Factory: 5,000 m2, 5 production lines, 69 staff, 4 in-house QC inspectors. Assessed on site by SGS, August 2026.');
out.push(`Catalog: ${products.length} SKUs in 4 categories.`);
out.push(`Unit price range: USD ${Math.min(...prices).toFixed(2)} to USD ${Math.max(...prices).toFixed(2)} per piece (ex-works), tiered by quantity.`);
out.push(`MOQ range: ${Math.min(...moqs)} to ${Math.max(...moqs)} pieces, set per model.`);
out.push('Port of loading: Yantian (Shenzhen) or Shantou.');
out.push('Lead time: an average of 20 days from order confirmation to delivery, with a 7-day shortest sample turnaround (SGS assessment, August 2026). Custom packaging adds to that and is quoted per order.');
out.push('Batteries: dry-cell batteries are never included with shipments; lithium batteries are installed in the unit and included.');
out.push('Customization: OEM and ODM - custom colour, private label, packaging built from your artwork, or a new mould. Light customisation, sample-based builds and artwork-based builds are quoted separately because the tooling differs.');
out.push('Testing scope varies by model and by destination market. Ask for the exact item number plus the target country and the answer is given in writing; no blanket certificate is claimed for the catalogue.');
out.push('Contact: hntoys7@sinuotoys.com | WhatsApp +86 159 7691 7707');
out.push('');

out.push('## Factory and company');
out.push('');
out.push(`- [Inside the factory](${SITE}/factory): 5,000 m2 floor space, 5 production lines, 69 staff (55 full-time, 14 part-time), 4 in-house QC inspectors, 24 machines across 12 types, no subcontracting. Assessed on site by SGS on 2026-08-17, valid to 2027-08-17.`);
out.push(`- [OEM / ODM process](${SITE}/oem-odm): three customisation routes (light customisation, from your sample, from your artwork), 7-day shortest sample, 20-day average lead time, FOB/CIF/EXW/CFR.`);
out.push(`- [About](${SITE}/about): who we are, where we ship (North America 40%, Eastern Europe 20%, South America 10%, Middle East 10%, Western Europe 10%, South Asia 10%), and who answers the email.`);
out.push('');

out.push('## Buyer types');
out.push('');
out.push(`One page per type of buyer, because a party distributor, a gift shop and a school need different things from the same catalogue. Index: ${SITE}/industries`);
out.push(`- Party and novelty distributors: ${SITE}/industries/party-supplies-distributors`);
out.push(`- Gift shops and novelty retailers: ${SITE}/industries/gift-and-novelty-retailers`);
out.push(`- Marketplace and Shopify sellers: ${SITE}/industries/online-sellers`);
out.push(`- Schools and educational distributors: ${SITE}/industries/schools-and-educational-distributors`);
out.push(`- Private label brands: ${SITE}/industries/private-label-brands`);
out.push(`- Wholesale distributors filling mixed containers: ${SITE}/industries/wholesale-distributors`);
out.push('');

out.push('## Tools and open data');
out.push('');
out.push(`- Packing dataset: ${SITE}/packing-data — MOQ, pieces per carton, carton size, CBM, weights and pieces per 20GP/40HQ for every published model. CSV: ${SITE}/data/packing-data.csv`);
out.push(`- Container calculator: ${SITE}/container-calculator — enter quantities, get cartons, CBM and container fill (28 CBM for 20GP, 68 CBM for 40HQ, stated as assumptions)`);
out.push(`- Full catalogue content: ${SITE}/llms-full.txt`);
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
