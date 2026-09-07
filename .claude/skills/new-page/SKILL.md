---
name: new-page
description: Use when creating a new blog post or case study page for the OpenRateLab site (openratelab.com), or when a drafted post (e.g. from /orl-write) needs to be built into the live Astro site. Trigger on requests like "add a new blog post", "write a new case study", "publish a new article", "put this draft on the site".
---

# Adding a new blog post or case study (Astro site)

**Rewritten 2026-09-07** to match the live Astro rebuild — the previous
version of this skill described the pre-migration static-HTML site
(root-level `blog/*.html`, `scripts/check_pages.py`). That system is no
longer what's deployed; see `CLAUDE.md` section 1 for the rollback-only
status of the old files. Read `CLAUDE.md` section 1b ("Working in
astro-site/") first if you haven't this session.

## Why this is simpler than it used to be

The Astro migration moved canonical URL, OG/Twitter tags, full JSON-LD
(Article/BreadcrumbList/FAQPage/Organization/Person/ImageObject), the
sitemap, and `llms.txt` out of hand-maintained HTML and into code that
derives all of it from each `.mdx` file's frontmatter
(`astro-site/src/pages/blog/[slug].astro`,
`astro-site/src/pages/case-studies/[slug].astro`,
`astro-site/src/pages/sitemap.xml.ts`, `astro-site/src/pages/llms.txt.ts`).
**Don't hand-edit sitemap.xml or llms.txt — they're generated, editing them
directly does nothing.** The job here is almost entirely: write a
schema-valid `.mdx` file in the right place.

## Steps

1. **Confirm the content exists as a draft** (from `/orl-write`, or written
   directly). It should already be roughly schema-shaped — frontmatter plus
   markdown body with `##` section headings.

2. **Check the schema**, `astro-site/src/content.config.ts` — required
   fields:
   - Every page (`seoFields`): `title` (ends with `| OpenRateLab`),
     `description` (**50-160 characters, enforced by the schema — count
     it**), `datePublished`, `dateModified` (both real dates, today's date
     for a new page), `ogImage`/`ogImageWidth`/`ogImageHeight` (all have
     defaults, omit unless this page needs a custom image).
   - Blog posts additionally: `category`, `readTime`, `excerpt`,
     `author` (defaults to "Uros Korene"), `faq` (defaults to `[]`, but see
     below), `dataDisclaimer` (optional).
   - Case studies additionally: `caseStudyNumber`, `industryLabel`,
     `isComposite` (defaults `true` — see the anonymization rule in
     `/orl-strategy` if this came from that pipeline: always `true`, no
     exceptions, NDA), `heroHeadline`, `heroSubtext`, `primaryMetric`
     (`value`/`label`), `faq`, `furtherReading` (array of
     `{title, url}` — link 1-2 relevant blog posts), `authorQuote`
     (optional).

3. **FAQ isn't optional in practice**: every live blog post and case study
   has one (it drives both the on-page accordion and FAQPage JSON-LD — see
   `[slug].astro` for exactly how). Skipping it is a real regression against
   the site's own established standard, not just a nice-to-have.

4. **Place the file**:
   - Blog post → `astro-site/src/content/blog/{slug}.mdx`
   - Case study → `astro-site/src/content/case-studies/{slug}.mdx`
   `{slug}` becomes the URL path (`/blog/{slug}`, `/case-studies/{slug}`) —
   keep it short, hyphenated, matching the target keyword where natural.
   Check it doesn't collide with an existing slug.

5. **Internal links**: use real relative paths (`/blog/{slug}`,
   `/case-studies/{slug}`, `/#contact`) to content that actually exists —
   run `python socials/scripts/build-seo-registry.py` and check
   `socials/seo-registry.json` rather than guessing what's published.

6. **Validate before committing** — this catches schema errors (wrong
   field, description out of range, missing required field) that a visual
   read-through will miss:
   ```bash
   cd astro-site && npx astro build
   ```
   Must complete with no errors and show the new route
   (`/blog/{slug}/index.html` or `/case-studies/{slug}/index.html`) in the
   build output. Then spot-check `dist/sitemap.xml` and `dist/llms.txt`
   contain the new slug (confirms auto-generation picked it up).

7. **Visually verify** before pushing — start the dev server
   (`astro-site` config in `.claude/launch.json`, port 4321) and check the
   rendered page: nav/footer intact, FAQ accordion present, internal links
   resolve, no leftover placeholder text.

8. **Commit and push.** This repo auto-deploys to openratelab.com via
   Netlify on push to `main` (confirm this is still the active deploy
   trigger if it's been a while — check `netlify.toml`'s `[build]` block
   and the Netlify dashboard's own settings per `CLAUDE.md` section 1, since
   the dashboard can silently override the file). Stage only the files this
   change actually touches, not an unrelated `git add -A`.

## What this skill does NOT need to do (auto-generated, don't hand-edit)

- `sitemap.xml` — derived from the content collections at build time.
- `llms.txt` — same.
- Canonical URL, OG/Twitter meta, JSON-LD `@graph` — all derived from the
  frontmatter fields above by `[slug].astro`. If something's wrong here,
  fix the frontmatter, not the page template (unless the template itself
  has a bug, which is a different, rarer kind of fix).

## What this skill does NOT do at all

Writing the actual content — this skill assumes it already exists (from
`/orl-write` or written directly) and is about correctly landing it on the
live site with the schema and process intact.
