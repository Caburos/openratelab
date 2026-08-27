---
name: new-page
description: Use when creating a new blog post or case study page for the OpenRateLab static site (openratelab.com). Guides the full checklist — copying the right template, meta tags, JSON-LD, sitemap, llms.txt — so new pages don't drift from the site's consistency standard documented in CLAUDE.md. Trigger on requests like "add a new blog post", "write a new case study", "publish a new article".
---

# Adding a new blog post or case study

Read `CLAUDE.md` at the repo root first (sections 3–6) if you haven't already
this session — it documents *why* each of these steps exists and shows the
exact canonical nav/footer markup. This skill is the actionable checklist
version of that document; don't skip steps because they seem redundant with
what you already know — the whole reason this skill exists is that sessions
have skipped them before.

## Steps

1. **Copy the nearest sibling file**, not a blank template:
   - New blog post → copy the most recently published file in `blog/`.
   - New case study → copy the most recently published file in `case-studies/`.
   Copying an existing file is how the nav/footer/meta structure stays
   correct by default — starting from scratch is how it drifts.

2. **Update the `<head>` block:**
   - `<title>` — unique, ends with `| OpenRateLab`.
   - `<meta name="description">` — rewrite for the new content, **50–160
     characters**. Count it; don't eyeball it.
   - `<link rel="canonical">` — must exactly match the page's real published
     URL (no trailing slash on individual posts/case studies — see
     CLAUDE.md section 5 for the pattern).
   - `og:title`, `og:description`, `og:url` — update to match.
   - `twitter:title`, `twitter:description` — update to match.

3. **Update the JSON-LD `@graph`:**
   - `Article.headline`, `.description`, `.url`, `.datePublished`,
     `.dateModified` — all must match the new page's real content and URL.
   - `BreadcrumbList.itemListElement` — update the final breadcrumb's `name`
     and `item` to the new page.
   - Every other node in the `@graph` (`FAQPage`/`Question`/`Answer`,
     `Organization`, `Person`, `ImageObject`) should already carry over
     correctly from the copied file — verify `Person` still points at the
     real author, don't leave a placeholder.
   - Required `@type` set for every blog post and case study: `Article`,
     `BreadcrumbList`, `FAQPage`, `Question`, `Answer`, `Organization`,
     `Person`, `ImageObject`. All eight must be present.

4. **Nav active-state:** blog posts and case studies don't get their own nav
   highlight (only `/about/` and `/blog/` do) — leave the nav as copied.

5. **Add to `sitemap.xml`:** new `<url>` block with `<loc>`, `<lastmod>`
   (`YYYY-MM-DD`, today's date), `<changefreq>`, `<priority>` — match the
   values used by neighboring entries of the same page type.

6. **Add to `llms.txt`:** one line under the matching `## Blog` or
   `## Case Studies` section, same link-text format as the existing entries.

7. **Run the checker before calling this done:**
   ```
   python3 scripts/check_pages.py
   ```
   It must report `0 issue(s) found`. If it doesn't, fix what it flags —
   don't commit with known failures.

8. Only after the checker passes: commit, and follow whatever branch/push
   workflow the current session is already using for this repo.
