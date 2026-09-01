import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Generated from the content collections instead of hand-maintained, so it
// can't silently drift out of sync with the actual published pages (the
// failure mode CLAUDE.md flagged for the old hand-written llms.txt).

// Title tags follow "Clean Title | OpenRateLab[ Case Study]" — llms.txt
// wants just the clean title without the site-name suffix.
const cleanTitle = (title: string) => title.split('|')[0].trim();

export const GET: APIRoute = async () => {
  const [blogPosts, caseStudies] = await Promise.all([
    getCollection('blogPosts'),
    getCollection('caseStudies'),
  ]);

  const sortedBlog = [...blogPosts].sort(
    (a, b) => a.data.datePublished.getTime() - b.data.datePublished.getTime()
  );
  const sortedCaseStudies = [...caseStudies].sort((a, b) =>
    a.data.caseStudyNumber.localeCompare(b.data.caseStudyNumber)
  );

  const lines = [
    '# OpenRateLab',
    '',
    '> OpenRateLab is a Klaviyo email marketing agency for e-commerce and DTC brands, founded by Uros Korene in 2023. Services: email copywriting, full Klaviyo account builds, Klaviyo automation (flows, segmentation), and email strategy audits.',
    '',
    '## Site',
    '',
    '- [Homepage](https://openratelab.com/): services, case studies, and contact',
    '- [About](https://openratelab.com/about/): founder background and agency approach',
    '- [Blog](https://openratelab.com/blog/): Klaviyo guides, benchmarks, and flow deep-dives',
    '',
    '## Blog',
    '',
    ...sortedBlog.map(
      (post) => `- [${cleanTitle(post.data.title)}](https://openratelab.com/blog/${post.id})`
    ),
    '',
    '## Case Studies',
    '',
    ...sortedCaseStudies.map(
      (study) => `- [${cleanTitle(study.data.title)}](https://openratelab.com/case-studies/${study.id})`
    ),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
