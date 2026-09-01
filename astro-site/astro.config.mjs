// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://openratelab.com',
  integrations: [
    react(),
    // Sitemap is a custom src/pages/sitemap.xml.ts endpoint, not the
    // @astrojs/sitemap integration — see that file for why.
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});