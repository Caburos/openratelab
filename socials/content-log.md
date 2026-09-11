# OpenRateLab Content Log

Append-only. One row per content cycle. Updated by `/orl-strategy` (adds row,
status `briefed`) and `/orl-write` (flips status to `drafted`). You update
status to `exported` / `published` / `skipped` by hand for now (phase 1 is
manual).

Purpose: lets `/orl-strategy` avoid repeating a topic/angle/keyword that ran
recently or that already exists in `socials/seo-registry.json`.

| Date | Mode | Topic | Angle | Target keyword | Folder | Status |
|------|------|-------|-------|-----------------|--------|--------|
| 2026-09-07 | blog-trend | Open rate high, click rate low | Diagnose as promise/payoff mismatch, not deliverability | high open rate low click rate email marketing | 2026-09-07-open-rate-high-click-rate-low | published (blog: https://openratelab.com/blog/high-open-rate-low-click-rate/, LinkedIn: posted 2026-09-07, see socials/linkedin-performance.json for exact time) |
| 2026-09-08 | blog-trend | Open rate data accuracy / iOS MPP | Measurement accuracy, not campaign diagnosis (distinct from 09-07's post) | can you trust open rate data email tracking | 2026-09-08-open-rate-data-accuracy | published manually (blog: https://openratelab.com/blog/open-rate-data-accuracy/) -- automation's --fire failed (claude.exe OAuth expired), published by hand instead |
| 2026-09-09 | n/a | n/a | n/a | n/a | n/a | plan-failed -- /orl-publish --plan step 1 (/orl-timing --log-previous) requires checking the 2026-09-08 LinkedIn post's real engagement via browser (Page posts -> Preview results), but no browser/computer-use tool is available in this session (ToolSearch confirmed no Chrome/browser automation tool connected). Stopped before /orl-strategy per the "no partial ready-to-publish.json" rule -- previous file's status left as "fired" (unchanged). RESOLVED 2026-09-10: root cause was Claude Code's browser bridge never connecting in headless/-p sessions at all (confirmed, not just this session -- device-selection isn't the fix). Replaced with a standalone Playwright script (socials/scripts/linkedin-bot.py) that works headlessly independent of Claude Code. No post went out for 09-09 -- real gap, not recoverable retroactively. |
| 2026-09-11 | blog-trend | Klaviyo limitations agencies work around | Platform-limit workarounds, not a complaint listicle | klaviyo limitations | 2026-09-11-klaviyo-limitations-workarounds | published (blog: https://openratelab.com/blog/klaviyo-limitations-workarounds, LinkedIn posted 2026-09-11 ~22:02, see socials/linkedin-performance.json -- fired manually, ~21.5h after the 00:30 slot, once the OAuth/credit auth bug blocking ORL-Fire was fixed) |
| 2026-09-11 | case-study | Zero to 50.62% email attribution in one month | Real client dashboard data, cold-start to majority-of-revenue | klaviyo case study email attribution | 2026-09-11-zero-to-fifty-case-study | published -- LinkedIn only, links to already-published case study at /case-studies/dtc-brand-zero-to-fifty-percent/, no blog.md needed. Posted via linkedin-bot.py --post 2026-09-11; the script's own "Post successful" check missed the toast (exit 1 warning) but confirmed live on https://www.linkedin.com/company/144914968/admin/page-posts/published/ immediately after, timestamped "now" with the full matching text. |
