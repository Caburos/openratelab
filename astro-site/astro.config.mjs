// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://openratelab.com',
  integrations: [
    react(),
    sitemap({
      // CLAUDE.md's URL convention: trailing slash on "/", "/about/",
      // "/blog/", but NOT on individual blog posts or case studies.
      // @astrojs/sitemap defaults every URL to a trailing slash, which
      // violates that for content pages — strip it there, keep it for
      // the three index-style routes.
      serialize(item) {
        const url = new URL(item.url);
        const isIndexRoute = ['/', '/about/', '/blog/'].includes(url.pathname);
        if (!isIndexRoute && url.pathname.endsWith('/')) {
          url.pathname = url.pathname.slice(0, -1);
        }
        return { ...item, url: url.toString() };
      },
    }),
    mdx(),
  ],

  vite: {
    plugins: [tailwindcss()]
  }
});