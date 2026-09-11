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
  const [blogPosts, caseStudies, services, industries, platforms] = await Promise.all([
    getCollection('blogPosts'),
    getCollection('caseStudies'),
    getCollection('services'),
    getCollection('industries'),
    getCollection('platforms'),
  ]);

  const today = dateStr(new Date());

  const mostRecent = (dates: Date[]) =>
    dates.length ? dateStr(new Date(Math.max(...dates.map((d) => d.getTime())))) : today;

  const entries = [
    url('https://openratelab.com/', mostRecent(blogPosts.map((p) => p.data.dateModified).concat(caseStudies.map((c) => c.data.dateModified))), 'monthly', '1.0'),
    url('https://openratelab.com/services/', mostRecent(services.map((s) => s.data.dateModified)), 'monthly', '0.9'),
    url('https://openratelab.com/klaviyo-agency/', today, 'monthly', '0.9'),
    url('https://openratelab.com/email-marketing-agency/', today, 'monthly', '0.9'),
    url('https://openratelab.com/ecommerce-email-marketing-agency/', today, 'monthly', '0.9'),
    url('https://openratelab.com/shopify-email-marketing-agency/', today, 'monthly', '0.9'),
    url('https://openratelab.com/benchmarks/', today, 'weekly', '0.9'),
    url('https://openratelab.com/platforms/', mostRecent(platforms.map((p) => p.data.dateModified)), 'monthly', '0.8'),
    ...platforms.map((p) =>
      url(`https://openratelab.com/platforms/${p.id}`, dateStr(p.data.dateModified), 'monthly', '0.75')
    ),
    url('https://openratelab.com/industries/', mostRecent(industries.map((i) => i.data.dateModified)), 'monthly', '0.85'),
    ...industries.map((i) =>
      url(`https://openratelab.com/industries/${i.id}`, dateStr(i.data.dateModified), 'monthly', '0.8')
    ),
    url('https://openratelab.com/compare/klaviyo-vs-mailchimp/', today, 'monthly', '0.75'),
    url('https://openratelab.com/compare/klaviyo-vs-omnisend/', today, 'monthly', '0.75'),
    url('https://openratelab.com/compare/klaviyo-agency-vs-freelancer/', today, 'monthly', '0.75'),
    url('https://openratelab.com/guides/klaviyo-agency-cost/', today, 'monthly', '0.75'),
    url('https://openratelab.com/guides/best-klaviyo-agency-for-dtc-brands/', today, 'monthly', '0.75'),
    url('https://openratelab.com/guides/when-to-hire-a-klaviyo-agency/', today, 'monthly', '0.75'),
    url('https://openratelab.com/guides/klaviyo-audit-checklist/', today, 'monthly', '0.75'),
    url('https://openratelab.com/about/', today, 'monthly', '0.8'),
    url('https://openratelab.com/blog/', mostRecent(blogPosts.map((p) => p.data.dateModified)), 'weekly', '0.8'),
    ...services.map((s) =>
      url(`https://openratelab.com/services/${s.id}`, dateStr(s.data.dateModified), 'monthly', '0.85')
    ),
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
