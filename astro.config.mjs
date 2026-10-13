import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://toyfactoryglobal.com',
  trailingSlash: 'never',
  // Emit /blog/foo.html instead of /blog/foo/index.html so Cloudflare Pages
  // serves the clean, slash-less URL that our canonical tag + sitemap use.
  build: { format: 'file' },
  integrations: [tailwind()],
});
