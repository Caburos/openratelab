import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared FAQ shape — one source feeds both the visible accordion and the
// FAQPage JSON-LD, eliminating the manual byte-for-byte sync CLAUDE.md
// flags as today's QA burden.
const faqEntry = z.object({
  question: z.string(),
  answer: z.string(),
});

// Shared SEO/meta fields every page type needs (CLAUDE.md section 5).
const seoFields = {
  title: z.string(), // full <title>, must include "| OpenRateLab"
  description: z.string().min(50).max(160), // enforces CLAUDE.md's own rule at schema level
  datePublished: z.coerce.date(),
  dateModified: z.coerce.date(),
  ogImage: z.string().default('/images/og-image.png'),
  ogImageWidth: z.number().default(1200),
  ogImageHeight: z.number().default(630),
};

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    ...seoFields,
    caseStudyNumber: z.string(), // e.g. "007", used in the [ CASE_STUDY:00X ] eyebrow tag
    industryLabel: z.string(), // e.g. "Health & Supplement Brand" — eyebrow tag + breadcrumb name
    isComposite: z.boolean().default(true),
    compositeDisclaimer: z
      .string()
      .default(
        'This case study is a representative composite created to demonstrate the strategy and potential application. Brand details, timelines and figures have been modified and should not be interpreted as the verified results of one identifiable client.'
      ),
    heroHeadline: z.string(), // supports \n for the <br/> line breaks seen in current H1s
    heroSubtext: z.string(),
    primaryMetric: z.object({
      value: z.string(), // e.g. "54.8%"
      label: z.string(), // e.g. "AVG OPEN RATE"
    }),
    faq: z.array(faqEntry),
    furtherReading: z
      .array(z.object({ title: z.string(), url: z.string() }))
      .default([]),
    authorQuote: z
      .object({
        quote: z.string(),
        attribution: z.string(), // free text on purpose — the dtc-brand-attribution-system.html
        // page currently has a named quote ("Amanda R., Founder, DTC Brand") flagged as the same
        // category of issue as the testimonials work; keeping this a plain string means it's a
        // one-line content edit to fix later, not a schema change.
      })
      .optional(),
  }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    ...seoFields,
    author: z.string().default('Uros Korene'),
    readTime: z.string(), // e.g. "7 MIN READ"
    faq: z.array(faqEntry).default([]),
  }),
});

export const collections = { caseStudies, blogPosts };
