# OpenRateLab — working notes for any Claude Code session

Read this before touching any page. It exists because the same class of bug
(inconsistent header/footer, drifted meta tags) has already shipped more than
once across different sessions. This file — not a session's memory, not a
skill that may or may not be installed — is the source of truth, because it's
the one thing guaranteed to travel with the repo.

## 1. What is actually deployed

The live site (openratelab.com) is the **static HTML** at the repo root —
`index.html`, `about/`, `blog/`, `case-studies/` — styled by `styles.css`
(compiled from `static.css` via `tailwind.static.config.js`). Confirm this
yourself if in doubt: `netlify.toml`'s build command only runs
`build:static-css` and publishes `.` — it never runs `vite build`.

**`client/` and `server/` are an unused, stale React/Express starter
template** (Vite + React Router + Express), inherited from the project's
original scaffold and never wired into deployment. It has had one commit
since this repo's initial commit. Do not edit it expecting changes to reach
production, and do not treat its content (fade/slide `framer-motion`
animations, its own copy, its own components) as representative of the real
site. If a future decision is made to migrate to it, that requires
server-side rendering or static export (Next.js static export, Astro, etc.)
— the current `client/` app is a plain client-rendered SPA, which would
regress SEO/crawlability versus the current fully-static HTML.

`AGENTS.md` describes the generic starter template and predates this
project's real architecture — don't use it as a description of what's live.

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
