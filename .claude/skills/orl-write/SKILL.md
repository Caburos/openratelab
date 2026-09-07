# /orl-write — OpenRateLab Blog + LinkedIn Copywriter

Takes a `brief.md` from `/orl-strategy` and writes the actual copy: a
long-form blog post and a short LinkedIn post derived from it. Blog is
canonical — LinkedIn is written from the finished blog, not independently,
so the two never drift in claims or framing.

Phase 1 (current): output is local markdown for manual review. Publishing
(into the live Astro site, onto LinkedIn) is a separate, later step — this
skill does not publish anything.

## Invocation

```
/orl-write --brief socials/drafts/2026-09-07-topic-slug/brief.md
/orl-write 2026-09-07-topic-slug          → shorthand, resolves to the folder above
```

## Step 0: Preflight

Required: the brief folder and `brief.md` inside it exist; `brand-guide.md`
(repo root) exists. If either is missing, stop and say so — do not write
from memory of a previous brief.

## Step 1: Load Context

Regenerate the registry first, same as `/orl-strategy` does (cheap, keeps it
current even if strategy ran a while ago):
```bash
python socials/scripts/build-seo-registry.py
```

Then read, in order:
1. `brief.md` from the target folder — topic, angle, mode, outline, evidence,
   and its "Suggested internal links" (a starting point, not the final list)
2. `brand-guide.md` (repo root) — voice, positioning, services, color/type
   are irrelevant here; only **Voice & Tone**, **Brand Names**, **Services**,
   **Target audience** sections matter for copy
3. `socials/seo-registry.json` — every existing blog post and case study
   (slug, url, title, description/category), plus `evergreen_links` (contact,
   services, about). This is what Step 3's internal-linking draws from.
4. One or two existing posts of the same mode, for structural reference only
   (not to copy phrasing):
   - blog-trend → skim `astro-site/src/content/blog/*.mdx` (any one)
   - case-study → skim `astro-site/src/content/case-studies/*.mdx` (any one)

## Step 2: Voice Rules (apply on top of brand-guide.md)

- **We/our, never I/my.** Brand guide rule — no exceptions.
- **No em dashes.** Use a period, comma, or colon instead. (Learned
  preference — the client has flagged em dashes in copy twice now.)
- Confident, direct, no fluff, data-led. Every specific number must trace
  back to something in the brief — never round up, never invent a stat to
  fill a gap.
- Don't over-claim team size or use "agency" language unless the brief/brand
  guide already does (brand guide's own `<title>` tags do use "agency" — that
  positioning is fine, just don't invent capabilities).

## Step 3: Write the Blog Post

Output to `{brief-folder}/blog.md`.

### If mode = blog-trend

Structure (see `content.config.ts` for the exact frontmatter schema — this
file doesn't need to be schema-valid yet, phase 1 is a review draft, but get
close so publishing later is a copy-paste, not a rewrite):

```markdown
---
title: "{working title} | OpenRateLab"
description: "{50-160 char meta description}"
category: "{e.g. KLAVIYO / FLOWS}"
excerpt: "{short card blurb, distinct from description}"
readTime: "{N} MIN READ"
faq:
  - question: "{a real question a reader/searcher would ask}"
    answer: "{150-300+ words, matches the site's existing FAQ depth}"
  - question: "{second question}"
    answer: "{...}"
---

{2-3 short opening paragraphs — state the problem/topic directly, no throat-clearing}

## {H2 from outline}
{...}

## {H2 from outline}
{...}
```

**FAQ block (required, not optional):** the live schema's `faq` array
feeds both an on-page accordion and FAQPage JSON-LD at publish time — every
existing post has one, skipping it is a real SEO regression, not just a
style choice. 2-3 questions, phrased how someone would actually search or
ask (check the brief's source evidence and the target keyword for real
phrasing), answered at the same depth as the body copy — not a one-line
recap.

**Keyword placement (required):** the brief's target keyword (or a natural
variant of it) must appear in: the title, the meta description, the first
paragraph, and at least one H2. If it doesn't fit anywhere naturally without
sounding forced, the target keyword itself may be wrong — flag that back
rather than stuffing it in.

**Lead with the answer, not the setup** (this site's existing posts already
do this — keep it consistent, and it also helps AI-search
tools quote the post directly): open each major section with a direct,
one-sentence answer to what that H2 asks, then support it. Don't bury the
point at the end of the paragraph.

Follow the brief's outline as section headings (adjust wording, don't
invent new sections it didn't call for). Cite specific figures only when the
brief's evidence supports them; if citing an industry benchmark rather than
OpenRateLab's own data, hedge it the way existing posts do (e.g. "the
industry average is roughly...") rather than stating it as OpenRateLab's own
verified result.

**Internal linking (required, from the registry, not guessed):**
- 1-2 links to existing blog posts, `[anchor text](/blog/{slug})` — pick the
  ones from `seo-registry.json` that are genuinely topically relevant to the
  section they're placed in (the brief's "Suggested internal links" is a
  starting point; swap in something better from the registry if it fits the
  actual copy better). Never link a post that isn't in the registry.
- 1 link to a relevant case study if one genuinely fits the topic,
  `[anchor text](/case-studies/{slug})` — skip this if nothing in the
  registry is a natural fit; don't force it.
- 1 link to the contact/audit CTA near the end, using
  `evergreen_links.contact` from the registry (currently `/#contact`) — e.g.
  "if your flows need a second look, [book a free audit](/#contact)."
  Exactly one per post — don't turn the piece into a pitch.

Target length: match the existing posts, roughly 900-1500 words. Don't pad
to hit a number.

### If mode = case-study

Structure, matching the case-study schema's spirit:

```markdown
---
title: "{primary metric} — {short label} | OpenRateLab Case Study"
description: "{50-160 char meta description}"
industryLabel: "{industry, from brief}"
isComposite: {true/false, per brief's Composite field}
primaryMetric:
  value: "{value}"
  label: "{label}"
---

## The Problem
{...}

## What We Did
{...}

## The Result
{numbers from brief.md's "Numbers provided" section — verbatim, no rounding}
```

Every number in this file must appear in the brief's "Numbers provided"
list. If the copy wants to state something the brief didn't provide, go back
to `/orl-strategy` and get it confirmed rather than filling the gap here.

Case studies have a `furtherReading` field in the live schema (see any
existing `astro-site/src/content/case-studies/*.mdx`) — populate it with 1-2
relevant blog posts from `seo-registry.json`, same relevance rule as above.

## Step 4: Write the LinkedIn Post

Output to `{brief-folder}/linkedin.md`. Derive this from the finished
`blog.md` you just wrote, not from the brief directly.

Rules:
- 100-200 words
- Open with the curiosity-gap hook from the brief's "LinkedIn angle" field
- Make one point well, not a summary of the whole post
- We/our voice, no em dashes, same as blog
- End with a link placeholder: `→ Full breakdown: {BLOG_URL}` (the real
  URL gets filled in once the post is actually published and has a live
  path — leave the placeholder as-is)
- No hashtag stuffing — 0-2 relevant hashtags max, only if they add
  something a reader would actually search

## Step 5: Update the Log

In `socials/content-log.md`, find the row for this folder and change its
status from `briefed` to `drafted`.

## Step 6: Report Back

Print both files' content (or their paths if long) and say what's next:
manual review, then export to a Google Doc for that review with:

```bash
python socials/scripts/export-to-gdoc.py --draft socials/drafts/{folder} --open
```

This produces one doc: title, then a BLOG POST section, then a LINKEDIN POST
section — no tables, just the readable draft. Re-running it after edits to
`blog.md`/`linkedin.md` replaces the doc's content in place (same URL).

**What this skill does NOT do, and where it happens instead:** canonical
URL, robots meta, OG/Twitter tags, full JSON-LD (Article/BreadcrumbList/
Organization/Person/ImageObject — FAQPage is covered by the `faq` field
above), the `sitemap.xml` entry, and the `llms.txt` entry are all handled by
the existing `new-page` skill when this draft actually gets built into the
live site. Don't skip that step once a draft is approved — say so explicitly
when reporting back, so it doesn't quietly fall through the gap between
"drafted" and "published."
