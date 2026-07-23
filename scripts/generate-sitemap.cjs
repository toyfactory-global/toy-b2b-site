const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://toyfactoryglobal.com';
const TODAY = new Date().toISOString().split('T')[0];

// Static pages
const pages = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/privacy', priority: 0.3, changefreq: 'monthly' },
  { loc: '/terms', priority: 0.3, changefreq: 'monthly' },
  { loc: '/return', priority: 0.3, changefreq: 'monthly' },
];

// Load products and generate product detail URLs
const productsPath = path.join(__dirname, '..', 'src', 'data', 'products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
const productPages = products.map(p => ({
  loc: `/product/${p.id}`,
  priority: 0.8,
  changefreq: 'monthly',
}));

const allPages = [...pages, ...productPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(p => `  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemap);
console.log(`Sitemap generated: ${outputPath}`);
console.log(`Total URLs: ${allPages.length} (${pages.length} static + ${productPages.length} product)`);
