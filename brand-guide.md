# OpenRateLab — Brand Guide

*Refreshed 2026-08-21 to match the live off-black brutalist rebuild. Previous version described the old navy/teal WordPress-era site and was stale — see git history if that context is ever needed.*

## Voice & Tone
- **We/our** always — never I/my. The brand presents as a team.
- Do not specify team size. "We" implies more than one person without committing to a number.
- Confident, direct, results-focused. No fluff.
- Copy quality is a core proof point — every line should model what the brand sells.
- Data-led: lead with real numbers (open rates, revenue figures, flow counts) over vague claims.

## Brand Names
- Primary: **OpenRateLab**
- Positioning line used in the live `<title>` tags: "Klaviyo Email Marketing Agency for DTC Brands"
- On-page tagline (hero section): "RETENTION SYSTEMS. EMAIL THAT COMPOUNDS."
- Category label used in hero: "[ EMAIL MARKETING AGENCY // KLAVIYO SPECIALISTS ]"
- Use "OpenRateLab" as the canonical brand name in all headings, titles, and schema.
- Founded 2023 (per Clutch company profile).

## Services
Current 4 services, as listed on the homepage "SYSTEMS ARCHITECTURE" section:
1. **Email Copywriting** — flows, campaigns, and sequences written to convert
2. **Full Email Build** — Klaviyo account setup, flow architecture, segmentation, campaign calendar from zero
3. **Klaviyo Automation** — custom events, dynamic segmentation, predictive analytics, flow systems
4. **Email Strategy** — list/flow/segmentation audit plus a 90-day roadmap

## Target audience
- E-commerce and DTC brands
- Brands using Klaviyo for email
- Growth-stage businesses wanting email as a reliable revenue channel

## Current positioning & keyword targets
Reflects what's actually live in title tags/content as of 2026-08-21, not aspirational:
- "Klaviyo email marketing agency"
- "Klaviyo email marketing agency for DTC brands"
- "email marketing agency"
- "retention systems" / "email that compounds" (brand-specific phrasing, not a search term)

Forward-looking gaps identified in Phase 3 content research (see `GROWTH_ROADMAP.md`) — not yet targeted by any published page:
- Email copywriting content (the #1 listed service has no dedicated blog post)
- "How to choose a Klaviyo agency" / agency pricing (decision-stage)
- Individual Klaviyo flow deep-dives (welcome, abandoned cart, post-purchase, win-back)
- Deliverability (SPF/DKIM, sender reputation)

## Color Palette
Extracted directly from `tailwind.static.config.js` (source of truth, not guessed):

| Role | Token | Value |
|---|---|---|
| Background — off-black | `surface-primary` | `#0D0D0D` |
| Secondary surface (alt sections) | `surface-secondary` | `#262626` |
| Accent — performance red | `accent-performance` | `#E63946` |
| Text — warm off-white | `on-surface-warm` | `#F9F9F7` |
| Muted / secondary text | `muted-silver` | `#A3A3A3` |

## Typography
From the Google Fonts import in every page `<head>`:
- **Headlines**: Hanken Grotesk (weights 400–900)
- **Labels / technical / mono accents**: JetBrains Mono (weight 500)
- **Body / pull quotes**: Source Serif 4 (regular + italic)

Style: uppercase labels, oversized display headlines, brutalist grid layout, pixel-grid decorative background on hero.

## Testimonials
Real named clients quoted on the homepage (JSON-LD `Review` schema): **Nika**, **Teia**, **Viktor**.

## Assets
Live site images are served from **`/images/`** — not `assets/images/` (that directory exists in the repo but is unreferenced by any live page; likely a pre-rebuild leftover, worth removing if confirmed unused elsewhere):
- `logo.png`, `logo-icon.png` — brand logo
- `hero-banner.jpg` — hero/case-study image
- `og-image.png` — social share image (1200×630)
- `service-email.png`, `service-ads.png`, `service-website.png` — service card images
- `team.jpg` — about/team section
- `testimonial-nika.jpg`, `testimonial-teia.jpg`, `testimonial-viktor.jpg` — testimonial avatars
