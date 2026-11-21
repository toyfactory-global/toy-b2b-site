const fs = require('fs');
const path = require('path');
const f = path.resolve(__dirname, '../src/pages/product/[id].astro');
let s = fs.readFileSync(f, 'utf8');
const pairs = [
  ['ISO 9001:2015 certified B2B manufacturer.', 'SGS-assessed B2B manufacturer in Shantou, China.'],
  ['"name": "Huanuo Toys"', '"name": "TOYFACTORY"'],
  ['Factory-direct wholesale from TOYFACTORY, ISO 9001:2015 certified.', 'Factory-direct wholesale from TOYFACTORY, an SGS-assessed factory in Shantou, China.'],
];
for (const [a, b] of pairs) {
  const n = s.split(a).length - 1;
  console.log(n, '×', a.slice(0, 60));
  s = s.split(a).join(b);
}
fs.writeFileSync(f, s, 'utf8');
console.log('done');
