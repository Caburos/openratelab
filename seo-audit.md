# OpenRateLab — SEO Audit
*Audited: 2026-05-27 | Current site: openratelab.com (WordPress)*

## 🔴 CRITICAL

1. **noindex on all pages** — both `/` and `/contact` have `meta robots: noindex, follow`. Google has been told to skip the site entirely. Zero organic visibility.
2. **Stats section has empty numbers** — the 4 metrics (% revenue from email, % from flows, $ per campaign, ×conversion rate) are blank animated counters. Google sees no content there.

## 🟠 HIGH

3. **Only 2 pages** — Home + Contact. No standalone indexable pages for services, case studies, about.
4. **No meta descriptions** — `<meta name="description">` missing on both pages. Only `og:description` is set (social only, not Google snippets).
5. **Titles formatted wrong** — "Home - OpenRateLab | Copy That Prints Money" — "Home -" is wasted prefix, tagline is noise. Google truncates at ~60 chars.
6. **H1 has no keyword** — "Turn Email Into Your Most Reliable Revenue Channel" — no searchable terms. Should include "email marketing," "Klaviyo," "email copywriting."
7. **Competing brand names** — "OpenRateLab" vs "Copy That Prints Money" dilutes brand in Google results.

## 🟡 MEDIUM

8. **No schema markup** — no `LocalBusiness`, `Service`, or `Review` schema. Testimonials won't show as rich results.
9. **Images have no alt text** — all `<img>` tags are empty strings. Zero keyword signals from images.
10. **WordPress generator tag exposed** — `<meta name="generator" content="WordPress">` (disappears with new stack).
11. **Contact page `og:type: article`** — should be `website`.
12. **Email not a mailto link** — `uros(at)openratelab.com` has friction on mobile.

## 🟢 GOOD (keep in new build)

- HTTPS ✓
- Canonical tags ✓
- OG / Twitter cards ✓
- Copy quality is strong ✓
- Page structure: hero → services → about → stats → testimonials → CTA ✓

## New build checklist
- [ ] Remove noindex entirely
- [ ] Separate pages: Home, Services, Case Studies, About, Contact
- [ ] Fill in real stats numbers
- [ ] Add schema: Service, Review, LocalBusiness
- [ ] Proper title + H1 keyword targeting per page
- [ ] Case studies as individual indexed pages
- [ ] Alt text on all images
- [ ] mailto: link for email
