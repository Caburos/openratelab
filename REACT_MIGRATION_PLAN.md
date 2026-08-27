# OpenRateLab → React/prerender migration plan

**Status: PLANNING ONLY. Do not start implementation until the user
explicitly approves starting a specific phase below.** This file exists so
a session working from a different environment (including one with access
to local files this session couldn't reach) can pick up this work with full
context, without re-deriving everything from scratch. Read this whole file,
and `CLAUDE.md` in this repo, before touching anything.

## 1. Why this exists

Investigated 2026-08-27: OpenRateLab and a sibling project, `Caburos/urosbuilds`,
both started from the identical "Fusion Starter" boilerplate (Vite + React +
React Router + Express — confirmed via `package.json`'s `"name": "fusion-starter"`
in both repos). They diverged:

- **urosbuilds** kept the React app and added a build-time prerender script.
  Its `netlify.toml` runs `vite build && tsx scripts/generate-seo-pages.ts`
  and publishes `dist/spa` — a real compiled React SPA that also emits a
  fully-baked static `index.html` per route for crawlers.
- **OpenRateLab** instead deployed a separately-designed static HTML export
  (built in Google Stitch) directly, and left `client/` — the React
  scaffold — completely untouched since the repo's first commit. See
  `CLAUDE.md` section 1 for the full detail on what's actually live today
  (spoiler: the static HTML, not `client/`).

Today's session already did six phases of work bringing the *current static
site* into internal consistency (canonical nav/footer, meta tags, JSON-LD,
a `scripts/check_pages.py` checker, a `new-page` skill) — see the git log
(`cb48d5d` through `2cda318`) and `CLAUDE.md` for what that covers. That
work is NOT wasted by this migration: the rules documented in `CLAUDE.md`
sections 3–5 (canonical nav/footer markup, required meta fields, required
JSON-LD `@type` sets per page type) are exactly what the new architecture
needs to reproduce structurally instead of by hand-maintained convention.

**Goal of this migration:** rebuild OpenRateLab on the same pattern as
urosbuilds — a real interactive React app for visitors, with a build-time
step that guarantees every route also has fully-baked, crawlable HTML with
correct meta/schema, generated from one data source instead of 26
hand-duplicated files.

## 2. Reference implementation: read urosbuilds first, don't guess

`Caburos/urosbuilds` (private repo, already added to this session — attach
it again if working from a fresh session: `add_repo owner=Caburos
repo=urosbuilds`) is the concrete, working example. Read these files before
writing anything new:

- `scripts/generate-seo-pages.ts` (948 lines) — the post-build prerender
  script. Does NOT use React SSR (`renderToString`). Instead: takes the
  Vite-built `dist/spa/index.html` as a template, and for every route in a
  single `ALL_ROUTES` array (built from `STATIC_ROUTES` plus routes
  generated from the data files below), injects route-specific
  `<title>`/description/canonical/OG/Twitter tags, the correct JSON-LD
  schema per page type (`buildWebPageSchema`, `buildCaseStudySchema`,
  `buildArticleSchema`, `buildFaqSchema`, `buildBreadcrumbSchema`), and real
  readable body content (`geoContentForRoute` / `blogPostGeoContent` /
  `caseStudyGeoContent`) so a crawler that never executes JS still sees the
  full article/case-study text. Writes the result to
  `dist/spa/<route-path>/index.html`. Also generates `sitemap.xml` from the
  exact same `ALL_ROUTES` array (can't drift from real pages by
  construction) and writes it to both `dist/spa/` and `public/`.
- `client/data/emailCaseStudies.ts`, `websiteCaseStudies.ts`,
  `aiCaseStudies.ts`, `blogPosts.ts` — content lives as plain TypeScript
  data arrays, read by both the live React components and the prerender
  script. This is the piece that kills the "hand-duplicated HTML page per
  post" drift problem OpenRateLab has today.
- `netlify.toml` — `command = "pnpm run build:client"`,
  `publish = "dist/spa"`, plus a `/* → /index.html` SPA-fallback redirect
  (only reached for a route with no prerendered file), the same security
  headers OpenRateLab already has, and a `/:path/ → /:path` redirect
  normalizing trailing slashes.

## 3. What must NOT regress

Everything in `CLAUDE.md` was hard-won today (real bugs found and fixed —
hardcoded copyright years, missing footer links, canonical drift
historically, missing schema). The new architecture should make these
categories of bug structurally impossible (one nav/footer component, one
meta-injection function), but verify, don't assume:

- Every one of the 24 existing blog posts/case studies must keep its exact
  current copy, dates, and URL path (no trailing slash on posts/case
  studies; trailing slash on `/`, `/about/`, `/blog/` — see `CLAUDE.md`
  section 5). This is a structural migration, not a content rewrite —
  don't paraphrase or regenerate copy that's already published and indexed.
  Changing live URLs without redirects would break existing search
  rankings and backlinks.
- The required JSON-LD `@type` set per page type (documented in `CLAUDE.md`
  section 5) must still be present on every equivalent generated page.
- `llms.txt` (hand-maintained today) should become generated by the same
  script that generates `sitemap.xml`, from the same data source — one
  more file that currently has to be remembered separately.
- The Phase 7 scroll animations (line-draw, count-up, fade/slide reveals —
  see `index.html`'s inline `<script>`/`<style>` blocks, or just the git
  history for "Phase 7") need a React equivalent. `framer-motion` is
  already a dependency in `client/`'s `package.json` — likely the more
  idiomatic path in React than porting the vanilla IntersectionObserver
  code verbatim, but keep the same easing/timing feel (slow, ~1-1.4s,
  triggers early in scroll) since that was tuned based on real user
  feedback on mobile.
- The contact form currently posts to Netlify Forms *and* a Resend-backed
  Netlify Function in parallel (see the inline `<script>` in `index.html`
  and `netlify/functions/`) — both integrations need to keep working.

## 4. Proposed phases

Same discipline as today's work: one phase at a time, build → QA → ship,
don't jump ahead without a checkpoint. Suggested breakdown (the executing
agent/session should confirm this breakdown with the user before starting,
not treat it as locked):

1. **Content extraction.** Convert the current 12 blog posts + 12 case
   studies + homepage/about copy into structured data files (mirroring
   urosbuilds' `client/data/*.ts` pattern). Copy must match what's
   currently live byte-for-byte in substance (titles, dates, body text,
   FAQs, stats) — this phase is data-modeling, not copywriting.
2. **Component rebuild.** Rebuild `client/`'s components to match the
   *current* live Stitch-based design (colors, type, layout, the exact
   nav/footer from `CLAUDE.md` sections 3–4) — not the stale placeholder
   content currently sitting in `client/components/sections/*.tsx` today,
   which predates the real site and doesn't match it.
3. **Prerender script.** Build an OpenRateLab equivalent of
   `generate-seo-pages.ts`: meta injection, JSON-LD injection per page
   type, GEO readable-content injection, sitemap.xml generation, llms.txt
   generation — all reading from the Phase 1 data files.
4. **Interactive features.** Port the contact form (Netlify Forms +
   Resend), the case-study/ledger slider, the mobile menu, nav scroll-spy,
   and the Phase 7 scroll animations into React.
5. **Build wiring.** Update `netlify.toml` to build the real app and
   publish `dist/spa`, matching urosbuilds' pattern (headers, redirects,
   SPA fallback, trailing-slash normalization).
6. **Validation before cutover.** Every generated route checked against
   current live equivalents: meta/schema parity (adapt or replace
   `scripts/check_pages.py` for the new output), full crawlability (raw
   HTML has complete content with JS disabled — verify in a real browser,
   the way today's animation work was verified, not by assumption),
   visual/functional parity (screenshots, animations, forms) via a real
   browser test pass.
7. **Cutover.** Only after Phase 6 passes clean: switch `netlify.toml` to
   the new build, confirm the live site, then retire the old static HTML
   files. Keep a rollback path (the old files, or at minimum the ability to
   revert the `netlify.toml` change) until confidence is high.
8. **Update `CLAUDE.md`.** Once live, rewrite section 1 (and whatever else
   no longer applies) to describe the new architecture as reality — the
   whole point of that file is staying accurate for the next session.

## 5. One loose thread from today, worth folding in

`CLAUDE.md` section 8 documents that a `/seo-audit` skill referenced in
`GROWTH_ROADMAP.md` isn't in this repo or in the account's cloud-accessible
skill list — it apparently only exists in a local environment this cloud
session couldn't reach. If whatever picks up this plan has access to that
local folder, worth locating that skill and committing it into this repo at
`.claude/skills/seo-audit/` (same pattern as `.claude/skills/new-page/`)
while in there — otherwise it stays a session-local one-off, per the
`.gitignore` bug already found and fixed today (see git commit `c77fbec`).

## 6. Explicit non-goals for now

- Do not start writing code against this plan until the user says which
  phase to start on.
- Do not treat this phase breakdown as final — confirm scope with the user
  first, the same way this session did before Phase 2 today.
- Do not touch the live static site's content/behavior while this
  migration is in progress unless the user asks for an unrelated fix — the
  current site is live, working, and SEO-clean; don't destabilize it
  mid-migration.
