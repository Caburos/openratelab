import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Custom sitemap instead of @astrojs/sitemap: that integration emits a
// sitemap-index.xml + sitemap-0.xml pair with no <lastmod>, which both
// broke robots.txt's "/sitemap.xml" reference (404) and dropped the
// lastmod/changefreq/priority signals the old static sitemap.xml had.
// Generating it from the content collections keeps it in sync the same
// way llms.txt.ts does.

const dateStr = (d: Date) => d.toISOString().slice(0, 10);

const url = (loc: string, lastmod: string, changefreq: string, priority: string) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

export const GET: APIRoute = async () => {
  const [blogPosts, caseStudies] = await Promise.all([
    getCollection('blogPosts'),
    getCollection('caseStudies'),
  ]);

  const today = dateStr(new Date());

  const mostRecent = (dates: Date[]) =>
    dates.length ? dateStr(new Date(Math.max(...dates.map((d) => d.getTime())))) : today;

  const entries = [
    url('https://openratelab.com/', mostRecent(blogPosts.map((p) => p.data.dateModified).concat(caseStudies.map((c) => c.data.dateModified))), 'monthly', '1.0'),
    url('https://openratelab.com/about/', today, 'monthly', '0.8'),
    url('https://openratelab.com/blog/', mostRecent(blogPosts.map((p) => p.data.dateModified)), 'weekly', '0.8'),
    ...caseStudies.map((c) =>
      url(`https://openratelab.com/case-studies/${c.id}`, dateStr(c.data.dateModified), 'monthly', '0.9')
    ),
    ...blogPosts.map((p) =>
      url(`https://openratelab.com/blog/${p.id}`, dateStr(p.data.dateModified), 'monthly', '0.7')
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.join('')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
