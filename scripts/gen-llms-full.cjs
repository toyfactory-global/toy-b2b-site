/* Generates public/llms-full.txt — the whole catalogue in one markdown file so an
   answer engine can read the site in a single request instead of crawling 61 pages.
   Every number comes from products.json / factory.json / product-content.json.
   Nothing is added here that is not already published on a page. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const SITE = 'https://toyfactoryglobal.com';
const PRODUCTS = JSON.parse(fs.readFileSync(path.join(root, 'src/data/products.json'), 'utf8'));
const CONTENT = JSON.parse(fs.readFileSync(path.join(root, 'src/data/product-content.json'), 'utf8'));
const FACTORY = JSON.parse(fs.readFileSync(path.join(root, 'src/data/factory.json'), 'utf8'));

const CAT_ORDER = ['Bubble Toys', 'Water Guns', 'Track Toys', 'Educational Toys'];
const products = Array.isArray(PRODUCTS) ? PRODUCTS : PRODUCTS.products;
const prices = products.map((p) => p.price);
const moqs = products.map((p) => p.moq);

const out = [];
out.push('# TOYFACTORY — full site content for answer engines');
out.push('');
out.push(`> Generated ${new Date().toISOString().slice(0, 10)} from the published pages. ${products.length} models in ${CAT_ORDER.length} collections. Unit prices USD ${Math.min(...prices).toFixed(2)}–${Math.max(...prices).toFixed(2)} per piece, MOQ ${Math.min(...moqs)}–${Math.max(...moqs)} pieces.`);
out.push('');
out.push('## Factory facts (SGS Production & Trading Assessment, 2026-08-17)');
out.push('');
out.push(`- Floor space: ${FACTORY.facility.floorSpaceSqm.toLocaleString('en-US')} m2`);
out.push(`- Production lines: ${FACTORY.facility.productionLines} (${FACTORY.facility.lineSupervisors} supervisors, ${FACTORY.facility.lineOperators} operators)`);
out.push(`- Staff: ${FACTORY.people.total} total (${FACTORY.people.fullTime} full-time, ${FACTORY.people.partTime} part-time); production ${FACTORY.people.byDepartment[0].total}, QC ${FACTORY.facility.qcInspectors}, sales ${FACTORY.people.byDepartment[1].total}`);
out.push(`- Machines: ${FACTORY.machinery.reduce((s, m) => s + m.qty, 0)} units across ${FACTORY.machinery.length} types`);
out.push(`- Subcontracting: ${FACTORY.facility.subcontracting === 'none' ? 'none — all eight production steps run in house' : FACTORY.facility.subcontracting}`);
out.push(`- QC: ${FACTORY.facility.qcInspectors} inspectors covering all lines; finished goods by ${FACTORY.quality.finishedGoods.toLowerCase()}; written instructions and records kept; lot traceability to main raw material; closed-loop corrective action`);
out.push(`- Lead time: ${FACTORY.trade.averageLeadTimeDays} days average (order confirmation to delivery); shortest sample ${FACTORY.trade.shortestSampleDays} days`);
out.push(`- Ports: ${FACTORY.trade.ports.join(', ')}`);
out.push(`- Terms: ${FACTORY.trade.incoterms.join(', ')}; payment ${FACTORY.trade.paymentMethods.join(', ')}`);
out.push(`- Export experience: ${FACTORY.trade.exportExperienceYears} years, ${FACTORY.trade.foreignTradeStaff} trade staff`);
out.push(`- Markets: ${FACTORY.markets.map((m) => `${m.region} ${m.share}%`).join(', ')}`);
out.push(`- Clients: ${FACTORY.clientTypes.join(', ')}`);
out.push('- Not claimed anywhere on the site: ISO 9001, BSCI, SEDEX, GSV, GMPC, or any certificate held for the catalogue as a whole. Testing is per model and per market.');
out.push('');

for (const cat of CAT_ORDER) {
  const list = products.filter((p) => p.category === cat);
  if (!list.length) continue;
  out.push(`## ${cat} (${list.length} models)`);
  out.push('');
  for (const p of list) {
    const c = CONTENT[p.id] || {};
    out.push(`### ${p.id} — ${p.name}`);
    out.push('');
    out.push(`URL: ${SITE}/product/${p.id}`);
    out.push(`Unit price: USD ${p.price.toFixed(2)}/pc. MOQ ${p.moq} pcs.`);
    const s = p.specs || {};
    const specBits = [];
    if (s.packing_size) specBits.push(`Packaging ${s.packing_size}`);
    if (s.carton_size) specBits.push(`Carton ${s.carton_size}`);
    if (s.qty_per_carton) specBits.push(`${s.qty_per_carton} pcs/carton`);
    if (s.inner_qty) specBits.push(`Inner ${s.inner_qty}`);
    if (s.gw_nw) specBits.push(`G.W./N.W. ${s.gw_nw}`);
    if (s.cbm) specBits.push(`${s.cbm} CBM`);
    if (specBits.length) {
      out.push(`Specs: ${specBits.join(' · ')}`);
    }
    if (c.overview && c.overview.length) {
      out.push('');
      out.push(c.overview[0]);
    }
    if (c.visible_features && c.visible_features.length) {
      out.push('');
      out.push('Visible in the photos:');
      for (const f of c.visible_features.slice(0, 4)) out.push(`- ${f}`);
    }
    out.push('');
  }
}

out.push('## Pages');
out.push('');
out.push(`- ${SITE}/ — home`);
out.push(`- ${SITE}/products — full catalogue with prices and MOQ`);
out.push(`- ${SITE}/factory — floor space, headcount, machinery, QC, production flow`);
out.push(`- ${SITE}/oem-odm — customisation routes, sampling, lead time, commercial terms`);
out.push(`- ${SITE}/about — who we are, markets, client types`);
out.push(`- ${SITE}/contact — email hntoys7@sinuotoys.com, WhatsApp +86 15976917707`);
out.push(`- ${SITE}/blog — sourcing, compliance and logistics guides`);
out.push('');

fs.writeFileSync(path.join(root, 'public/llms-full.txt'), out.join('\n'), 'utf8');
const size = fs.statSync(path.join(root, 'public/llms-full.txt')).size;
console.log(`wrote public/llms-full.txt — ${out.length} lines, ${(size / 1024).toFixed(1)} KB, ${products.length} products`);
