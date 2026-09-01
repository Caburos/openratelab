# OpenRateLab — working notes for any Claude Code session

Read this before touching any page. It exists because the same class of bug
(inconsistent header/footer, drifted meta tags) has already shipped more than
once across different sessions. This file — not a session's memory, not a
skill that may or may not be installed — is the source of truth, because it's
the one thing guaranteed to travel with the repo.

## 1. What is actually deployed

**As of 2026-09-01, the live site (openratelab.com) is built from
`astro-site/`** — an Astro project with React islands for interactivity
(contact form, mobile menu, nav scroll-spy, scroll animations) and
content collections for the 12 case studies + 11 blog posts
(`astro-site/src/content/`). `netlify.toml`'s `[build]` block sets
`base = "astro-site"`, `command = "npm ci && npm run build"`, `publish =
"astro-site/dist"`. Confirm this yourself if in doubt, and **also check
the Netlify dashboard's own Build & deploy → Continuous deployment
settings** — those can silently override `netlify.toml` (this exact
thing happened once already: the dashboard had a stale `npm run
build:client` command overriding the file's setting).

**The root-level static HTML files (`index.html`, `about/`, `blog/`,
`case-studies/`) are no longer what's deployed.** They're kept in the
repo as historical reference and an emergency rollback path — see
Section 1a — but editing them will not change anything live. The rest of
this file (Sections 2–8 below) describes that legacy static-HTML system
in detail; treat it as historical/rollback documentation, not a
description of the live architecture, until it's rewritten.

**`client/` and `server/` at the repo root are a *different*, older,
unused React/Express starter template** — not the same thing as
`astro-site/`. Don't confuse them. `client/`/`server/` predate this
migration entirely and were never wired into deployment; `astro-site/`
is the real, live app.

`AGENTS.md` describes the generic starter template and predates this
project's real architecture — don't use it as a description of what's live.

### 1a. Rollback path

If the Astro site needs to be rolled back to the old static HTML:
1. `git tag pre-astro-migration` marks the exact commit the static site
   was last known-good at — `git show pre-astro-migration:netlify.toml`
   has the old build config to restore.
2. The old root-level HTML files are still present in the repo (not
   deleted) — reverting `netlify.toml`'s `[build]` block to `base = "."`,
   `command = "npm ci && npm run build:static-css"`, `publish = "."`
   brings back the static site immediately.
3. Don't forget to also revert the Netlify dashboard's build-setting
   overrides if they were changed for the Astro cutover (see Section 1).

### 1b. Working in `astro-site/`

- Content lives in `astro-site/src/content/{case-studies,blog}/*.mdx` —
  frontmatter schema is `astro-site/src/content.config.ts`. Edit content
  there, not in the old root HTML files.
- Shared layout (nav/footer/head/mobile-menu) is
  `astro-site/src/layouts/BaseLayout.astro`.
- Page templates: `astro-site/src/pages/case-studies/[slug].astro`,
  `astro-site/src/pages/blog/[slug].astro`, `astro-site/src/pages/index.astro`,
  `astro-site/src/pages/about/index.astro`.
- `llms.txt` and the sitemap generate automatically from the content
  collections — don't hand-edit them.
- Astro bundles `<script>` tags as deferred ES modules: **don't wrap
  script logic in a `DOMContentLoaded` listener** — by the time a
  deferred module runs, that event has usually already fired, so the
  listener never executes. This broke the mobile menu and animations
  site-wide once already. Just run the code directly (an IIFE if you
  need to scope variables).
- `astro-site/` has its own `postcss.config.mjs` (deliberately empty) to
  stop Vite's config resolution from walking up to the repo root and
  picking up the legacy `client/` scaffold's Tailwind v3 `postcss.config.js`.
  Don't delete it.

## 2. Page inventory (as of 2026-08-26)

- `index.html` — homepage. Contains the only instances of `#services`,
  `#results`, `#ledger`, `#expertise`, `#testimonials`, `#contact` as actual
  in-page sections.
- `about/index.html` — standalone page.
- `blog/index.html` — blog listing page.
- `blog/*.html` — 11 articles.
- `case-studies/*.html` — 12 case studies. **No listing/index page exists for
  case studies** — they're only linked from the homepage slider and directly.
- `data/content.json` — currently unreferenced by anything. Don't assume it
  drives any page; it doesn't.

There is no templating engine, includes system, or static-site generator.
Every `.html` file is a fully independent, hand-authored document. **Any
shared-chrome change (nav, footer, tracking script) must be applied file by
file** — there is nothing that propagates a change automatically.

## 3. Canonical nav (top navigation)

This part is already consistent across every non-homepage page — keep it
that way. Two variants only:

**Homepage variant** (in-page anchors, includes Results/Expertise which only
exist on this page):
```html
<nav class="fixed top-0 z-50 flex justify-between items-center w-full px-4 md:px-16 h-20 bg-surface-primary border-b border-muted-silver/20">
  <a href="#home" class="font-headline-md text-base md:text-headline-md font-bold tracking-tighter text-on-surface-warm uppercase hover:text-accent-performance transition-colors">OPENRATELAB</a>
  <div class="hidden md:flex items-center space-x-12">
    <a class="nav-link text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="#services" data-section="services">SERVICES</a>
    <a class="nav-link text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="#results" data-section="results">RESULTS</a>
    <a class="nav-link text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="#ledger" data-section="ledger">CASE STUDIES</a>
    <a class="text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="/about/">ABOUT</a>
    <a class="nav-link text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="#expertise" data-section="expertise">EXPERTISE</a>
    <a class="text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="/blog/">BLOG</a>
    <a class="nav-link text-on-surface-warm font-label-button uppercase border-b-2 border-transparent hover:text-accent-performance transition-colors duration-150" href="#contact" data-section="contact">CONTACT</a>
  </div>
  <div class="flex items-center gap-2">
    <a href="#contact" class="bg-on-surface-warm text-surface-primary px-3 py-2 md:px-6 md:py-3 font-label-button uppercase hover:bg-accent-performance hover:text-on-surface-warm transition-all duration-150 active:scale-95">BOOK AUDIT</a>
    <button class="md:hidden p-2" id="menu-toggle" aria-label="Open menu">
      <span class="material-symbols-outlined text-on-surface-warm" aria-hidden="true">menu</span>
    </button>
  </div>
</nav>
```

**Subpage variant** (used on `/about/`, `/blog/`, every blog post, every case
study — anchors get a `/#` prefix since the target sections only exist on the
homepage; no Results/Expertise since those aren't standalone destinations):
```html
<nav class="fixed top-0 z-50 flex justify-between items-center w-full px-4 md:px-16 h-20 bg-surface-primary border-b border-muted-silver/20">
  <a href="/" class="font-headline-md text-base md:text-headline-md font-bold tracking-tighter text-on-surface-warm uppercase hover:text-accent-performance transition-colors">OPENRATELAB</a>
  <div class="hidden md:flex items-center space-x-12">
    <a class="text-on-surface-warm font-label-button uppercase hover:text-accent-performance transition-colors duration-150" href="/#services">SERVICES</a>
    <a class="text-on-surface-warm font-label-button uppercase hover:text-accent-performance transition-colors duration-150" href="/#ledger">CASE STUDIES</a>
    <a class="text-on-surface-warm font-label-button uppercase hover:text-accent-performance transition-colors duration-150" href="/about/">ABOUT</a>
    <a class="text-on-surface-warm font-label-button uppercase hover:text-accent-performance transition-colors duration-150" href="/blog/">BLOG</a>
    <a class="text-on-surface-warm font-label-button uppercase hover:text-accent-performance transition-colors duration-150" href="/#contact">CONTACT</a>
  </div>
  <div class="flex items-center gap-2">
    <a href="/#contact" class="bg-on-surface-warm text-surface-primary px-3 py-2 md:px-6 md:py-3 font-label-button uppercase hover:bg-accent-performance hover:text-on-surface-warm transition-all duration-150 active:scale-95">BOOK AUDIT</a>
    <button class="md:hidden p-2" id="menu-toggle" aria-label="Open menu">
      <span class="material-symbols-outlined text-on-surface-warm" aria-hidden="true">menu</span>
    </button>
  </div>
</nav>
```
On the subpage variant, whichever link matches the current page gets
`text-accent-performance` (and, for BLOG specifically, also
`border-b border-accent-performance`) in place of
`text-on-surface-warm ... hover:text-accent-performance transition-colors duration-150`
— see `/about/index.html` or any blog post for the exact active-state class swap.

## 4. Canonical footer

**This is where drift actually exists today.** Two confirmed bugs to treat as
the standard to enforce everywhere, not just fix once:

1. The copyright year must always be `<span id="year">YYYY</span>`, never a
   hardcoded plain number. It's populated by
   `document.getElementById('year').textContent = new Date().getFullYear()`
   in the shared inline script block. `index.html` and `about/index.html` do
   this correctly; every blog post, every case study, and `blog/index.html`
   currently hardcode the year as plain text — treat that as a bug, not a
   variant.
2. The footer's NAVIGATION list on every subpage must include **Services,
   Case Studies, About, Blog, Contact** — the same 5 destinations as the top
   nav's subpage variant. `about/index.html` and the case-study pages
   currently omit the Blog link — that's a bug, not a variant.

**Homepage footer** (includes Results/Expertise/Testimonials as in-page
anchors, since only the homepage has those sections):
```html
<footer class="grid grid-cols-12 gap-gutter px-8 md:px-16 py-40 w-full bg-surface-primary border-t border-muted-silver/30">
  <div class="col-span-12 md:col-span-6 mb-20 md:mb-0">
    <div class="font-headline-lg text-2xl md:text-headline-lg font-black text-on-surface-warm uppercase tracking-tighter mb-8 leading-none">OPENRATELAB.</div>
    <p class="font-label-technical text-label-technical text-muted-silver max-w-md">PRECISION RETENTION SYSTEMS. ANALYTICALLY DRIVEN. EDITORIALLY EXECUTED. &copy;<span id="year">2026</span> OPENRATELAB.</p>
  </div>
  <div class="col-span-12 md:col-span-3">
    <span class="font-label-technical text-label-technical text-accent-performance mb-8 block uppercase">NAVIGATION</span>
    <ul class="space-y-4">
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#services">SERVICES</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#results">RESULTS</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#ledger">CASE STUDIES</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#expertise">EXPERTISE</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/about/">ABOUT</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#testimonials">TESTIMONIALS</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#contact">CONTACT</a></li>
    </ul>
  </div>
  <div class="col-span-12 md:col-span-3">
    <span class="font-label-technical text-label-technical text-accent-performance mb-8 block uppercase">CONTACT</span>
    <ul class="space-y-4">
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="mailto:uros@openratelab.com">uros@openratelab.com</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="#contact">BOOK FREE AUDIT</a></li>
    </ul>
  </div>
</footer>
```

**Subpage footer** (used on `/about/`, `/blog/`, every blog post, every case
study):
```html
<footer class="grid grid-cols-12 gap-gutter px-8 md:px-16 py-40 w-full bg-surface-primary border-t border-muted-silver/30">
  <div class="col-span-12 md:col-span-6 mb-20 md:mb-0">
    <div class="font-headline-lg text-2xl md:text-headline-lg font-black text-on-surface-warm uppercase tracking-tighter mb-8 leading-none">OPENRATELAB.</div>
    <p class="font-label-technical text-label-technical text-muted-silver max-w-md">PRECISION RETENTION SYSTEMS. ANALYTICALLY DRIVEN. EDITORIALLY EXECUTED. &copy;<span id="year">2026</span> OPENRATELAB.</p>
  </div>
  <div class="col-span-12 md:col-span-3">
    <span class="font-label-technical text-label-technical text-accent-performance mb-8 block uppercase">NAVIGATION</span>
    <ul class="space-y-4">
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/#services">SERVICES</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/#ledger">CASE STUDIES</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/about/">ABOUT</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/blog/">BLOG</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/#contact">CONTACT</a></li>
    </ul>
  </div>
  <div class="col-span-12 md:col-span-3">
    <span class="font-label-technical text-label-technical text-accent-performance mb-8 block uppercase">CONTACT</span>
    <ul class="space-y-4">
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="mailto:uros@openratelab.com">uros@openratelab.com</a></li>
      <li><a class="font-label-button text-muted-silver uppercase hover:text-on-surface-warm underline transition-all" href="/#contact">BOOK FREE AUDIT</a></li>
    </ul>
  </div>
</footer>
```
Note: `about/index.html` currently uses `col-span-6 md:col-span-3` (not
`col-span-12 md:col-span-3`) on its two footer columns — that's a separate,
smaller layout inconsistency to reconcile in Phase 2, not part of this
template decision.

## 5. Meta / SEO checklist (per page)

Verified current state (2026-08-26): all 26 pages have a title, meta
description, and self-referential canonical — none missing, no duplicates.
Keep it that way. Every page must have:

- `<title>` — unique, includes `| OpenRateLab`.
- `<meta name="description">` — **50–160 characters**. Six pages currently
  exceed this (up to 194 chars) — to fix in Phase 3, not now.
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://openratelab.com/...">` — matching the
  page's real published path exactly (trailing slash on `/`, `/about/`,
  `/blog/`; no trailing slash on individual posts/case studies).
- Open Graph (`og:type`, `og:title`, `og:description`, `og:url`, `og:image`
  + width/height) and matching Twitter card tags.
- JSON-LD `@graph`. For every blog post and case study, the required
  `@type` set is: `Article`, `BreadcrumbList`, `FAQPage`, `Question`,
  `Answer`, `Organization`, `Person`, `ImageObject` — this is currently
  100% consistent across all 24 articles; keep new ones matching it.
  `blog/index.html` currently has **no JSON-LD at all** — gap to close in
  Phase 3.

## 6. Adding a new blog post or case study

1. Copy the nearest existing sibling file (a blog post for a new post, a
   case study for a new case study) rather than starting from scratch —
   this is how the nav/footer/meta structure stays consistent by default.
2. Update title, description, canonical, OG/Twitter tags, and every
   `@type` block in the JSON-LD `@graph` (dates, url, headline).
3. Set the correct active-nav-link class (Section 3) if applicable.
4. Add an entry to `sitemap.xml` (`<loc>`, `<lastmod>` in `YYYY-MM-DD`,
   `<changefreq>`, `<priority>` — match the pattern of neighboring entries).
5. Add an entry to `llms.txt` under the matching `## Blog` or
   `## Case Studies` section — this file is hand-maintained and only useful
   if kept in sync.
6. Run the consistency checker (Section 7) before committing.

## 7. Automated consistency checker

`scripts/check_pages.py` — run with `python3 scripts/check_pages.py` from
the repo root. Checks every `.html` page against Sections 3–5 above (nav/
footer link sets, hardcoded-year regression, meta description length,
canonical self-reference, required JSON-LD types) and exits non-zero if
anything drifts. Run this before every commit that touches page markup —
it is the actual enforcement mechanism; this file is the explanation of
*why* the rules are what they are.

## 8. Skills are session-local unless they're committed here

`GROWTH_ROADMAP.md` repeatedly cites a `/seo-audit` skill as "a maintained,
sourced technical/GEO playbook already in this environment," with a full
audit dated 2026-08-21. **That skill does not exist in this repo
(`.claude/skills/`) and is not in the account's enabled/searchable skill
list either** — confirmed 2026-08-26 via both a repo search and the
`ListSkills`/`SearchSkills` tools, which returned nothing for "seo,"
"audit," or "geo." It clearly ran once, in some session, on some machine —
but it lived only in that session's local environment, was never committed
to the repo, and so didn't travel here. This is the same root cause as the
`.gitignore`'s old blanket `.claude/` rule (Section 6/skill history): a
skill isn't durable just because a past session had it — only what's
committed to this repo is guaranteed to be here for the next session.

Practical consequence: **`scripts/check_pages.py` is not a replacement for
`/seo-audit`.** It only enforces the narrow, structural rules in Sections
3–5 (nav/footer consistency, basic meta presence/length, required JSON-LD
types). Per `GROWTH_ROADMAP.md`'s own description, `/seo-audit` covered
substantially more — Core Web Vitals, HTTP headers, JS-rendering/
crawlability, mobile, accessibility, entity-graph audits, and AI-citation
monitoring — none of which this checker touches. Don't assume a clean
`check_pages.py` run means the site is technically/GEO sound; it means the
site matches *this repo's* documented consistency rules, nothing broader.

If `/seo-audit` (or an equivalent) is available in a future session, the
fix is to save it into this repo as a project skill
(`.claude/skills/seo-audit/SKILL.md`, same pattern as `new-page/`) so it
stops being session-local. Rebuilding it from scratch based only on the
roadmap's summary of its branches isn't done here — that would risk
producing a lower-quality, unsourced imitation of a skill whose actual
checklist content isn't recoverable from this repo.
