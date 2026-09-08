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
