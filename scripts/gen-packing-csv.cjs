/* Writes public/data/packing-data.csv — the same numbers shown on /packing-data,
   so the dataset can be downloaded and cited. Derived columns use 28 CBM (20GP)
   and 68 CBM (40HQ) of usable volume; those two constants are assumptions about
   container space, stated on the page, not measurements of our cartons. */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const raw = JSON.parse(fs.readFileSync(path.join(root, 'src/data/products.json'), 'utf8'));
const products = Array.isArray(raw) ? raw : raw.products;

const CBM_20 = 28;
const CBM_40HQ = 68;

const num = (s) => {
  const m = String(s || '').match(/([0-9]+(?:\.[0-9]+)?)/);
  return m ? parseFloat(m[1]) : 0;
};

const rows = products.map((p) => {
  const s = p.specs || {};
  const cbm = num(s.cbm);
  const qpc = parseInt(String(s.qty_per_carton || '0'), 10) || 0;
  const cartons20 = cbm > 0 ? Math.floor(CBM_20 / cbm + 1e-9) : 0;
  const cartons40 = cbm > 0 ? Math.floor(CBM_40HQ / cbm + 1e-9) : 0;
  return {
    sku: p.id,
    name: p.name,
    category: p.category,
    moq_pcs: p.moq,
    unit_price_usd: p.price,
    pcs_per_carton: qpc,
    cartons_at_moq: qpc ? Math.ceil(p.moq / qpc) : '',
    packaging_size: s.packing_size || '',
    carton_size: s.carton_size || '',
    gw_nw: s.gw_nw || '',
    cbm_per_carton: s.cbm || '',
    cartons_20gp: cartons20 || '',
    pcs_20gp: cartons20 && qpc ? cartons20 * qpc : '',
    cartons_40hq: cartons40 || '',
    pcs_40hq: cartons40 && qpc ? cartons40 * qpc : '',
  };
});

const headers = Object.keys(rows[0]);
const esc = (v) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const csv = [headers.join(',')]
  .concat(rows.map((r) => headers.map((h) => esc(r[h])).join(',')))
  .join('\n');

const outDir = path.join(root, 'public/data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'packing-data.csv'), csv + '\n', 'utf8');

const withCbm = rows.filter((r) => r.cbm_per_carton).length;
console.log(`packing-data.csv: ${rows.length} models, ${withCbm} with CBM, ${(csv.length / 1024).toFixed(1)} KB`);
