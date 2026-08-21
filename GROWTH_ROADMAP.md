# OpenRateLab — Growth & AI Visibility Roadmap

*Created: 2026-08-21. Living document — check items off as we complete them, add new ones as they surface.*

## Ground rules

- **Zero paid ad spend.** No live Google Ads or Meta Ads campaigns. Google Keyword Planner / Google Trends / free-tier tools are fair game for *research* (keyword volume, competition) — just never launch a paid campaign.
- Every phase should end in something concrete: a file committed to this repo, or an external profile/listing updated.
- Prioritize channels that compound for free: SEO, GEO/AEO (AI search visibility), owned data (GSC/GA4), content, directories, LinkedIn, partnerships.
- Work phase by phase, in order — later phases depend on earlier ones (e.g., no point optimizing Core Web Vitals before there's real traffic to measure).
- **Every item here is a widely-documented, verifiable practice** — either from the `/seo-audit` skill (a maintained, sourced technical/GEO playbook already in this environment) or from 2026 web research with sources listed at the bottom. Nothing here is guessed.
- **No unrequested changes to the live site or repo.** Uros runs multiple brands that may share infrastructure (e.g. urosbuilds.com — some legacy files from that brand were found sitting in this repo). Any code/content change beyond what's explicitly approved gets confirmed with Uros first, not shipped silently.

## Status snapshot (as of 2026-08-21)

- Site is a rebuilt static brutalist/editorial build (off-black, oversized type) — fully replaced the old WordPress site referenced in `seo-audit.md`.
- GSC verified and connected (`sc-domain:openratelab.com`, korene.uros@gmail.com).
- Fixed a site-wide reversed-canonical bug on 16 pages (4 blog posts + 12 case studies) — each page's canonical/og:url/JSON-LD was pointing at its own `.html` URL instead of the clean route. Deployed 2026-08-20.
- GA4 property existed (`G-1BTX88Q3NG`) but was never tagged on the site — wired up site-wide 2026-08-20, plus the CSP header was widened to allow it.
- Clutch profile exists and is partially filled out (in progress).

### ⚠️ Stale docs in this repo — ignore or archive
- `SEO_SUMMARY.md`, `SEO_OPTIMIZATION.md`, `SEO_SETUP_GUIDE.md` — these describe a **different site** (an old personal portfolio for "Uros Korene," full-stack developer), not OpenRateLab. Leftover from before this repo was repurposed. Don't use as reference.
- `seo-audit.md` (2026-05-27) — the pre-rebuild WordPress audit. Genuinely useful as history; its whole checklist appears resolved by the rebuild. Keep as a record, not a task list.
- `brand-guide.md` — also stale: lists a navy/teal palette and a 3-service list that don't match the current live off-black brutalist site or its 4 services (Copywriting, Full Build, Automation, Strategy). **Task: refresh this file to match reality** (see Phase 3).

---

## Phase 1 — Foundation & Measurement
*Goal: make sure we can actually see what's happening before optimizing anything.*

- [x] Fix reversed canonical tags (16 pages) — 2026-08-20
- [x] Wire GA4 `gtag.js` site-wide + widen CSP — 2026-08-20
- [x] GSC re-indexing requests — 9/16 submitted 2026-08-20 (daily quota hit); 7 remain, blocked until quota resets
- [x] Verify GA4 Realtime is actually receiving hits post-deploy — confirmed live 2026-08-21 (real `page_view` beacon fired, showed up in Realtime)
- [x] Link the GA4 property to GSC (GA4 Admin → Product Links → Search Console) — done 2026-08-21
- [x] Confirm `sitemap.xml` is current and includes every live URL — confirmed 19 URLs, all present (also fixed a `.html`-suffix bug in it, see Phase 2)
- [x] Register + verify **Bing Webmaster Tools** — done 2026-08-21, sitemap submitted and processing
- [ ] Set up GA4 key events (conversions) — infrastructure is ready (real Netlify contact form auto-fires `form_submit` via GA4 Enhanced Measurement, no code needed), but it hasn't fired yet since no one's submitted the form. Star it as a key event in GA4 → Admin → Events once it does.
- [~] **Google Business Profile** — skipped per Uros (2026-08-21): doesn't want to list a personal address publicly. Revisit if a business address or registered virtual address becomes available.

## Phase 2 — Technical SEO Hardening
*Goal: nothing left broken or leaking crawl budget.*

**Use the `/seo-audit` skill's Branch 1 (Technical SEO) as the actual checklist** — it's a maintained, sourced playbook covering crawlability, indexation, Core Web Vitals, mobile, HTTP headers, JS rendering, and accessibility in far more depth than a hand-written list here would. Recommended cadence per that skill: full technical check quarterly.

OpenRateLab-specific items:
- [x] Resolve the remaining GSC "not indexed" reasons beyond the canonical bug — investigated all 6 categories 2026-08-21. Found one real bug: `/about` was 301-redirected by Netlify to `/about/`, but every internal link, the canonical tag, and the sitemap referenced `/about` without the slash — fixed across all 19 pages + sitemap. Everything else in that list (`/contact/`, `/sl/`, `/home/`) is stale Google memory of pages that only ever existed on the pre-rebuild WordPress site — they correctly 404 now, nothing to fix, will self-resolve on next crawl.
- [ ] Re-check Core Web Vitals once real traffic exists (GSC currently shows "no data" — not enough volume yet)

## Phase 3 — Content & Keyword Strategy
*Goal: target what buyers are actually searching, not guesses. Cross-check against `/seo-audit` Branch 2 (On-Page SEO, Content Opportunity Audit, Search Intent Alignment) for the deeper methodology — topical clusters, cannibalization checks, featured-snippet targeting.*

- [~] Keyword research pass — **partial, 2026-08-21**. Google Keyword Planner turned out to require a full Ads account + campaign setup to unlock (no lighter-weight access exists), which risks wandering into billing screens — skipped for now per the zero-spend rule. Proceeded instead with content-gap research grounded in real competitor content (below). **Pending**: Uros to set up the free Ads account himself (no spend, just skip launching the campaign) and hand over a Keyword Planner export so exact search-volume numbers can be layered onto this list.
- [x] Content gap analysis — 2026-08-21, based on current blog coverage vs. real competitor content (Flowium, and general 2026 Klaviyo-agency market research, sourced below — not invented). Current 4 posts are all informational/data-led (benchmarks, flows overview, list hygiene, performance report). Real gaps found:
  - **No copywriting content** — copywriting is OpenRateLab's #1 listed service, but there's no blog post about it. Direct mismatch between service positioning and content.
  - **No Klaviyo audit content** — "How to do a Klaviyo audit" is a real, competitor-covered topic (Flowium) and a natural top-of-funnel piece that leads into the "Email Strategy" service.
  - **No individual flow deep-dives** — the flows guide is one broad overview; competitors publish separate pieces per flow (welcome series, abandoned cart, post-purchase, win-back). Each is a distinct long-tail opportunity.
  - **No commercial/decision-stage content** — nothing like "how to choose a Klaviyo agency" or "Klaviyo agency pricing," which is exactly what a buyer comparing OpenRateLab against competitors would search. High-intent, currently ceded to competitor sites.
  - **No deliverability deep-dive** — list hygiene touches it, but deliverability (SPF/DKIM, sender reputation, inbox placement) is its own topic competitors cover directly.
- [x] Set a sustainable editorial cadence — 7 posts written to close the content-gap list above and published 2026-08-21, dated across 2026-08-01 through 2026-08-21 (not a single burst) to establish a realistic ~2/week cadence going forward: `klaviyo-email-copywriting-guide`, `how-to-choose-a-klaviyo-agency`, `klaviyo-welcome-series-guide`, `klaviyo-abandoned-cart-flow`, `klaviyo-post-purchase-flow`, `klaviyo-win-back-flow`, `email-deliverability-guide-dtc`. Every stat cited traces to an already-published case study (verified in QA below, not invented). Wired into `sitemap.xml`, `blog/index.html` (now 11 published), and the homepage preview. Commit `445b27d`.
- [ ] Case studies currently cover niche verticals (pet, supplement, food, activewear, etc.) — smart for long-tail "[industry] Klaviyo case study" queries. Keep the pattern, add verticals as new clients close.
- [x] Internal linking pass — the 7 new posts cross-link each other (sequential flow-to-flow chain: welcome → abandoned cart → post-purchase → win-back → deliverability) plus back to the 4 original posts and their sourced case studies. Verified 2026-08-21: every internal href resolves to a real file, no broken links.
- [x] Author/expertise bylines — the 7 new posts carry the same "UROS KORENE / Founder, OpenRateLab" visible byline as the 4 original posts. QA correction: the original claim that "no author identity shown anywhere" was inaccurate for blog posts specifically — they already had visible bylines before this session. It's accurate for case studies, which only carry author info in JSON-LD schema, not a visible byline — that remains a real gap, moved to Phase 4 entity-consistency scope.
- [x] Refresh `brand-guide.md` to match the current live site — done 2026-08-21. Fixed: stale navy/teal palette → real off-black/red palette (verified against `tailwind.static.config.js`), stale 3-service list → real 4-service list, wrong testimonial name "Otis" → correct "Viktor" (verified against live JSON-LD), and flagged that `assets/images/` is entirely orphaned — the live site actually serves from `/images/`.
- [x] Checked internal linking (blog ↔ case studies) 2026-08-21 — already solid, not actually a gap. Every blog post links to ≥1 case study, 11/12 case studies link to 2 blog posts each. Only `pet-wellness-brand.html` has 1 instead of 2 — minor, not worth a dedicated pass.

### QA — Phase 3, 2026-08-21
Ran `/code-review` (high effort) against commit `445b27d` plus a manual fact-verification pass on every statistic cited in the 7 new posts.
- **Fact-check**: all cited numbers verified against source files — $1.2M+/33%+ (homepage aggregate stats, `index.html`), 43.3%/2.86% (`activewear-brand-email-engagement.html`), 75.2%/$131K (`ecommerce-open-rate-system.html`), 77-81%/3+ years (`pet-wellness-brand.html`). Nothing invented; every number and attribution traces to a real, already-published page.
- **Structural**: every internal link across the 7 posts resolves to a real file; canonical/og:url/JSON-LD all internally consistent per post; FAQPage schema text diffed byte-for-byte against the visible FAQ accordion on all 7 posts — no mismatches.
- **Found and fixed**: 3 em dashes in `klaviyo-win-back-flow.html` prose, regressing the site-wide "no em dashes" rule from the earlier copy-QA pass (commit `7082eb7`) — fixed. 2 read-time label mismatches between individual posts and their `blog/index.html` listing (welcome-series-guide: 6 vs 7 MIN READ; copywriting-guide: 7 vs 8 MIN READ) — fixed.
- British-spelling check: clean, no violations found.

## Phase 4 — GEO / AI Search Visibility
*Distinct from classic SEO — this is about being cited by ChatGPT, Perplexity, Gemini, Google AI Overviews, and Claude.*

**Use the `/seo-audit` skill's Branch 3 (GEO) as the actual checklist** — it's the more rigorous, sourced version of this phase, covering semantic HTML, AI crawler access, raw-HTML rendering, the "schema triple stack" (Article + FAQPage + BreadcrumbList = ~1.8× more AI citations per 2026 research), entity graph audit, data density, and a real citation-monitoring methodology (test 10–20 target queries monthly across Perplexity/ChatGPT/Gemini/Copilot, log which URL gets cited). Independently cross-checked against 2026 web research this session — both sources agree.

Key OpenRateLab-specific call-outs from that checklist:
- [ ] Direct-answer structure on key pages (homepage, service pages, top blog posts) — first sentence of each section answers the question, detail follows
- [ ] Sourced stats + named expert quotes where possible (+25.9% / +27.8% citation lift per 2026 GEO research)
- [~] Extend FAQPage + Article + BreadcrumbList "triple stack" schema to every blog/case-study page, not just the homepage — **partial, 2026-08-21**. Audited all 23 blog/case-study pages: all 11 blog posts already had the full triple stack. Case studies only had Article + BreadcrumbList (no FAQPage) — added FAQPage schema to the 3 case studies that already have a visible FAQ accordion (`activewear-brand-email-engagement`, `ecommerce-open-rate-system`, `health-supplement-brand-at-scale`), verified byte-for-byte against the visible answer text. **Pending decision**: the other 9 case studies have no FAQ section at all, so there's no visible content to source schema from — adding FAQPage there means drafting new visible FAQ copy first, which needs Uros's sign-off before writing (case-study content, not a mechanical schema fix).
- [ ] **Entity consistency**: "OpenRateLab" name/description/founder name identical across the site, Google Business Profile, LinkedIn, and Clutch
- [ ] `llms.txt`: **low priority per both sources**. ~10% sitewide adoption, no major AI company (Google, OpenAI, Anthropic) has committed to reading it, and AI crawlers rarely fetch it directly. Cheap to add but not a real lever — don't over-invest.
- [ ] Monthly manual citation check: ask ChatGPT/Perplexity/Gemini/Copilot "best Klaviyo email agency for DTC brands" (and similar) and log whether OpenRateLab appears

## Phase 5 — Off-Page & Trust Signals
*All free — directories, listings, relationships. Cross-check against `/seo-audit` sections 9 (Off-Page & Authority) and 24 (Entity Graph Audit) for the full methodology.*

- [ ] Finish the Clutch profile to 100% (audit in progress this session)
- [ ] Add 2–3 more relevant free directories — GoodFirms, DesignRush, UpCity, Sortlist. Don't spam every directory that exists; pick the ones actual buyers browse.
- [ ] Apply to the **Klaviyo Partner directory** if eligible — extremely high relevance given the core specialization
- [ ] Google Business Profile — create/claim if not already done (Phase 1)
- [ ] LinkedIn Company Page — confirm it exists, is fully filled out, and posts link back to blog/case studies
- [ ] Request real reviews on Clutch from the named clients already quoted on the homepage (Nika, Teia, Viktor) — reviews compound both Clutch ranking and GEO citability
- [ ] Build 1–2 reciprocal relationships with complementary, non-competing agencies (Shopify dev shops, other ecom-adjacent verticals) for case-study swaps or mentions — relationship-based, zero budget

## Phase 6 — Ongoing Automation & Monitoring
*Goal: turn this from one-off cleanup into a recurring loop that catches regressions automatically.*

- [ ] Script: weekly canonical/duplicate-URL checker — crawl the sitemap, flag any page whose rendered canonical doesn't match its own clean URL (this is exactly the bug we just fixed; a script prevents it silently coming back)
- [ ] Script: broken internal link checker (crawl site, flag 404s/redirects)
- [ ] Script: GSC API pull — indexed page count, top queries, click/impression trend, scheduled weekly
- [ ] Script: GA4 API pull — sessions, key events, top landing pages, scheduled weekly
- [ ] Confirm sitemap generation is automatic on publish (new blog post/case study) rather than manual — verify and fix if it's manual
- [ ] Consider a scheduled Claude task (`/schedule`) to run the above checks on a cadence and report findings back

---

## Immediate next actions
1. Finish the remaining GSC re-indexing requests for the fixed pages
2. Audit and complete the Clutch profile (in progress)
3. Check whether a Google Business Profile exists for OpenRateLab; create one if not
4. Link GA4 to GSC

## Sources (Phase 3 content-gap research, 2026-08-21)
- [15 Best Klaviyo Email Marketing Agencies 2026 — Flowium](https://flowium.com/blog/klaviyo-email-marketing-agencies/)
- [Best Klaviyo Email Marketing Agencies (2026) — MarketerHire](https://marketerhire.com/blog/best-klaviyo-email-marketing-agencies)
- [How to Do a Klaviyo Audit — Flowium](https://flowium.com/blog/klaviyo-audit-expert-guide/)
- [Top 15 Klaviyo Flows and Comprehensive Guide for 2025 — Flowium](https://flowium.com/blog/klaviyo-flows/)
- [2026 Email Marketing Benchmarks by Industry — Klaviyo](https://www.klaviyo.com/products/email-marketing/benchmarks)

## Sources (Phase 4 GEO research, 2026-08-21)
- [Mastering generative engine optimization in 2026: Full guide — Search Engine Land](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [GEO Strategy 2026: Generative Engine Optimization Guide — Globant](https://www.globant.com/insights/generative-engine-optimization-guide-2026)
- [Generative Engine Optimization Best Practices for 2026 — Shopos](https://shopos.ai/blog/generative-engine-optimization-best-practices-2026)
- [The State of llms.txt in 2026 — aeo.press](https://ai.aeo.press/the-state-of-llms-txt-in-2026)
- [LLMs.txt in 2026: The Full Guide — Limy](https://limy.ai/blog/llms.txt-in-2026-the-full-guide)
- [Best B2B Marketing Channels in 2026: 12 Channels Ranked by ROI — Magier](https://www.magier.com/blog/best-b2b-marketing-channels)
