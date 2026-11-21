/* One-off claim correction.
   Background: the site asserted ISO 9001:2015, BSCI, SEDEX, GSV, GMPC and ISO 22716.
   The SGS Production & Trading Assessment (2026-08-17) supports none of them.
   Everything below is replaced with figures that the assessment actually records. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
let changed = 0, missed = [];

function sub(rel, pairs) {
  const file = path.join(root, rel);
  let s = fs.readFileSync(file, 'utf8');
  for (const [find, replace] of pairs) {
    if (!s.includes(find)) { missed.push(`${rel} :: ${find.slice(0, 70)}`); continue; }
    const n = s.split(find).length - 1;
    s = s.split(find).join(replace);
    changed += n;
  }
  fs.writeFileSync(file, s, 'utf8');
}

const SGS_DESC = 'B2B toy manufacturer in Chenghai, Shantou, China: 5,000 m2 factory, 5 production lines, 4 in-house QC inspectors, SGS-assessed in August 2026. OEM and ODM for importers, distributors and retail chains.';

sub('src/layouts/Layout.astro', [
  ['"name": "TOYFACTORY - Huanuo Toys",', '"name": "TOYFACTORY",'],
  ['"description": "Premium B2B toy manufacturer specializing in bubble machines, STEM robots, and precision track toys. ISO 9001:2015 certified factory with global OEM/ODM solutions.",',
   `"description": "${SGS_DESC}",`],
]);

sub('src/pages/index.astro', [
  ['alt="Huanuo Toy Factory"', 'alt="Toy factory floor in Chenghai, Shantou"'],
  ['TOYFACTORY is an ISO 9001:2015 certified manufacturer in Shantou, China, specializing in high-volume bubble machines, electric bubble guns, and garden lamp bubble machines. We offer direct factory pricing with MOQ starting from 72 units and global shipping from Yantian port.',
   'TOYFACTORY is a toy manufacturer in Chenghai, Shantou, China, working from a 5,000 m2 factory with 5 production lines and 4 in-house QC inspectors, assessed on site by SGS in August 2026. Direct factory pricing runs from 30 to 720 units depending on the model, shipping from Shantou or Yantian.'],
  ['Factory level: ISO 9001:2015 quality management, plus BSCI, SEDEX and GSV factory audits.',
   'Factory level: 5,000 m2 floor space, 5 production lines, 69 staff and 4 in-house QC inspectors, assessed on site by SGS in August 2026.'],
  ['The factory covers more than 5,000m², passing audits such as GMPC, ISO 22716, GSV, BSCI, and SEDEX.',
   'The factory covers 5,000m² with five production lines, 69 staff and four in-house QC inspectors, assessed on site by SGS in August 2026.'],
  ["{['EN-71', 'ASTM', 'BSCI', 'ISO 22716', 'GSV', 'SEDEX'].map(cert => (",
   "{['SGS ASSESSED', '5,000 M²', '5 LINES', '69 STAFF', '4 QC', 'OEM / ODM'].map(cert => ("],
  ["{ name: 'ISO 9001:2015', desc: 'Quality Management' },", "{ name: '5,000 m²', desc: 'Factory Floor Space' },"],
  ["{ name: 'BSCI', desc: 'Ethical Manufacturing' },", "{ name: '5', desc: 'Production Lines' },"],
  ["{ name: 'SEDEX / SMETA', desc: 'Social Compliance' },", "{ name: '69', desc: 'Staff On Site' },"],
  ["{ name: 'GSV', desc: 'Supply Chain Security' },", "{ name: '4', desc: 'In-House QC Inspectors' },"],
  ["{ name: 'EN-71 / CE', desc: 'EU Toy Safety' },", "{ name: '7,000', desc: 'Models In The Wider Range' },"],
  ["{ name: 'ASTM F963', desc: 'US Toy Safety' },", "{ name: '20 Days', desc: 'Average Lead Time' },"],
  ["{ name: 'GMPC / ISO 22716', desc: 'Cosmetics GMP' }", "{ name: 'SGS', desc: 'Assessed Aug 2026' }"],
  ['ISO 9001:2015 Certified Facility.', 'SGS-assessed on site, August 2026.'],
]);

sub('src/pages/products.astro', [
  ['<dd class="text-base font-display font-extrabold text-white">ISO 9001:2015</dd>',
   '<dd class="text-base font-display font-extrabold text-white">4 in-house inspectors</dd>'],
]);

sub('src/pages/product/[id].astro', [
  ['ISO-9001 / AQL 2.5', '4 QC Inspectors · Every Line'],
  ['<li>ISO 9001:2015 Certified</li>', '<li>SGS-Assessed Factory (2026)</li>'],
]);

sub('src/pages/blog/china-toy-sourcing-guide.astro', [
  ['At TOYFACTORY, the factory-level audits cover <strong class="text-white">ISO 9001:2015, BSCI, SEDEX/SMETA, GSV and GMPC</strong>, while product-level safety reports (CE, EN-71, ASTM F963, RoHS) are issued per model and per destination market.',
   'At TOYFACTORY the factory-level figures are published in full &mdash; 5,000m² of floor space, five production lines, 69 staff and four in-house QC inspectors, assessed on site by SGS in August 2026 &mdash; while product-level safety reports (CE, EN-71, ASTM F963, RoHS) are issued per model and per destination market.'],
]);

sub('src/pages/blog/stem-toys-import-guide.astro', [
  ['Our 5,000m² Chenghai facility has passed <strong class="text-white">GMPC, ISO 22716, GSV, BSCI, and SEDEX audits</strong>.',
   'Our 5,000m² Chenghai facility runs four in-house QC inspectors across five production lines and was <strong class="text-white">assessed on site by SGS in August 2026</strong>.'],
  ['TOYFACTORY holds the factory-level audits, and product test reports are issued per model and per market &mdash; so ask which of these six exist for the exact SKU you are considering.',
   'TOYFACTORY publishes its factory figures and its SGS assessment, but claims no blanket certificate for the catalogue: product test reports are issued per model and per market, so ask which of these six exist for the exact SKU you are considering.'],
]);

sub('src/pages/blog/water-gun-models-compared.astro', [
  ['Factory-level, we operate an ISO 9001:2015 quality management system and have been audited under BSCI, SEDEX and GSV.',
   'Factory-level, the figures are published in full on the factory page: 5,000m², five production lines, 69 staff and four in-house QC inspectors, assessed on site by SGS in August 2026.'],
]);

sub('src/pages/blog/verify-china-toy-factory.astro', [
  ['Factory level: ISO 9001:2015 quality management, with audits under GMPC, ISO 22716, BSCI, SEDEX and GSV. Established 2001 in Chenghai, Shantou, with a factory of more than 5,000m².',
   'Factory level: a 5,000m² plant in Chenghai, Shantou, with five production lines, 69 staff and four in-house QC inspectors, assessed on site by SGS in August 2026.'],
]);

sub('src/pages/blog/water-gun-wholesale-guide.astro', [
  ['TOYFACTORY issues these reports per model: tell us the destination market and we confirm which ones exist for the exact item number before you order.',
   'Reports are issued per model, never for a catalogue as a whole: tell us the destination market and we confirm in writing which ones exist for the exact item number before you order.'],
]);

sub('scripts/gen-llms.cjs', [
  ["'# TOYFACTORY - Huanuo Toys'", "'# TOYFACTORY'"],
  ["'> ISO 9001:2015 quality system. OEM/ODM for importers, distributors and retail chains. FOB Yantian or Shantou.'",
   "'> 5,000 m2 factory in Chenghai, Shantou, assessed on site by SGS in August 2026. OEM/ODM for importers, distributors and retail chains. FOB Shantou or Yantian.'"],
  ["'Company: TOYFACTORY (Huanuo Toys), toy manufacturer and exporter.'", "'Company: TOYFACTORY, toy manufacturer and exporter.'"],
  ["'Quality system: ISO 9001:2015. Inspection standard: AQL 2.5.'", "'Factory: 5,000 m2, 5 production lines, 69 staff, 4 in-house QC inspectors. Assessed on site by SGS, August 2026.'"],
]);

// products.json: 30 seo_descriptions carry the same unverified phrase.
const pj = path.join(root, 'src/data/products.json');
let pjson = fs.readFileSync(pj, 'utf8');
const before = (pjson.match(/ISO 9001:2015 certified B2B toy factory/g) || []).length;
pjson = pjson.split('ISO 9001:2015 certified B2B toy factory').join('SGS-assessed B2B toy factory');
fs.writeFileSync(pj, pjson, 'utf8');
changed += before;

console.log('replacements:', changed, '| products.json desc fixed:', before);
if (missed.length) {
  console.log('NOT FOUND (' + missed.length + '):');
  missed.forEach((m) => console.log('  - ' + m));
}

// Re-scan for anything still claiming a certificate we cannot evidence.
const walk = (dir, out = []) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (/\.(astro|cjs|json|txt)$/.test(e.name) && e.name !== 'factory.json') out.push(p);
  }
  return out;
};
const bad = [];
for (const f of walk(path.join(root, 'src')).concat(walk(path.join(root, 'public')))) {
  const s = fs.readFileSync(f, 'utf8');
  s.split('\n').forEach((line, i) => {
    if (/huanuo|ISO.?9001|BSCI|SEDEX|GSV|GMPC|ISO.?22716/i.test(line)) {
      bad.push(`${path.relative(root, f)}:${i + 1}: ${line.trim().slice(0, 110)}`);
    }
  });
}
console.log('\nremaining mentions (' + bad.length + '):');
bad.forEach((b) => console.log('  ' + b));
