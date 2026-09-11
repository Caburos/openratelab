import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

// Generated from the content collections instead of hand-maintained, so it
// can't silently drift out of sync with the actual published pages (the
// failure mode CLAUDE.md flagged for the old hand-written llms.txt).

// Title tags follow "Clean Title | OpenRateLab[ Case Study]" — llms.txt
// wants just the clean title without the site-name suffix.
const cleanTitle = (title: string) => title.split('|')[0].trim();

export const GET: APIRoute = async () => {
  const [blogPosts, caseStudies, services, industries, platforms] = await Promise.all([
    getCollection('blogPosts'),
    getCollection('caseStudies'),
    getCollection('services'),
    getCollection('industries'),
    getCollection('platforms'),
  ]);

  const sortedBlog = [...blogPosts].sort(
    (a, b) => a.data.datePublished.getTime() - b.data.datePublished.getTime()
  );
  const sortedCaseStudies = [...caseStudies].sort((a, b) =>
    a.data.caseStudyNumber.localeCompare(b.data.caseStudyNumber)
  );
  const sortedServices = [...services].sort((a, b) =>
    a.data.serviceNumber.localeCompare(b.data.serviceNumber)
  );
  const sortedIndustries = [...industries].sort((a, b) =>
    a.data.industryLabel.localeCompare(b.data.industryLabel)
  );
  const sortedPlatforms = [...platforms].sort((a, b) =>
    a.data.platformLabel.localeCompare(b.data.platformLabel)
  );

  const lines = [
    '# OpenRateLab',
    '',
    '> OpenRateLab is a Klaviyo email marketing agency for e-commerce and DTC brands, founded by Uros Korene in 2023. Ten services: Klaviyo management, email marketing management, email copywriting, Klaviyo flows and automation, Klaviyo audits, email deliverability, segmentation, email strategy, Klaviyo setup, and Klaviyo migration.',
    '',
    '## Site',
    '',
    '- [Homepage](https://openratelab.com/): services, case studies, and contact',
    '- [Services](https://openratelab.com/services/): all ten services in detail',
    '- [Benchmarks](https://openratelab.com/benchmarks/): Klaviyo open rate, click rate, and flow-depth data from managed accounts',
    '- [Platforms](https://openratelab.com/platforms/): email platforms managed (Klaviyo, Mailchimp, Omnisend, MailerLite, ActiveCampaign, SendGrid)',
    '- [Klaviyo Agency](https://openratelab.com/klaviyo-agency/): full-service Klaviyo agency positioning',
    '- [Email Marketing Agency](https://openratelab.com/email-marketing-agency/): general email marketing agency positioning',
    '- [Ecommerce & DTC Email Marketing Agency](https://openratelab.com/ecommerce-email-marketing-agency/): ecommerce-specific positioning',
    '- [Shopify Email Marketing Agency](https://openratelab.com/shopify-email-marketing-agency/): Shopify + Klaviyo positioning',
    '- [Industries](https://openratelab.com/industries/): email marketing by vertical',
    '- [Klaviyo vs Mailchimp](https://openratelab.com/compare/klaviyo-vs-mailchimp/)',
    '- [Klaviyo vs Omnisend](https://openratelab.com/compare/klaviyo-vs-omnisend/)',
    '- [Klaviyo Agency vs Freelancer](https://openratelab.com/compare/klaviyo-agency-vs-freelancer/)',
    '- [How Much Does a Klaviyo Agency Cost](https://openratelab.com/guides/klaviyo-agency-cost/)',
    '- [Best Klaviyo Agency for DTC Brands](https://openratelab.com/guides/best-klaviyo-agency-for-dtc-brands/)',
    '- [When to Hire a Klaviyo Agency](https://openratelab.com/guides/when-to-hire-a-klaviyo-agency/)',
    '- [Klaviyo Audit Checklist](https://openratelab.com/guides/klaviyo-audit-checklist/)',
    '- [About](https://openratelab.com/about/): founder background and agency approach',
    '- [Blog](https://openratelab.com/blog/): Klaviyo guides, benchmarks, and flow deep-dives',
    '',
    '## Services',
    '',
    ...sortedServices.map(
      (service) => `- [${cleanTitle(service.data.title)}](https://openratelab.com/services/${service.id})`
    ),
    '',
    '## Industries',
    '',
    ...sortedIndustries.map(
      (industry) => `- [${cleanTitle(industry.data.title)}](https://openratelab.com/industries/${industry.id})`
    ),
    '',
    '## Platforms',
    '',
    ...sortedPlatforms.map(
      (platform) => `- [${cleanTitle(platform.data.title)}](https://openratelab.com/platforms/${platform.id})`
    ),
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
