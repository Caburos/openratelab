# /orl-strategy — OpenRateLab Content Strategy Generator

Picks what OpenRateLab writes about next: one blog post + one LinkedIn post,
derived from real trending discussion (not invented), or one case study when
the user hands over real client performance data. Output is a `brief.md`
that `/orl-write` turns into actual copy. This skill never writes final copy
itself — it decides the angle and hands off.

Phase 1 (current): manually triggered, once a day when the user runs it.
Not yet on a schedule.

## Invocation

```
/orl-strategy                                    → daily mode (blog + LinkedIn, trend-sourced)
/orl-strategy --date 2026-09-06                   → daily mode, force a specific discovery report date
/orl-strategy --case-study --brief "..."          → case study mode
/orl-strategy --case-study --brief-file path.txt  → case study mode, brief from file
```

**Attachments:** if the user pastes/uploads screenshots or files alongside a
`--case-study` invocation, read them as part of the brief (performance
screenshots, revenue figures, client-approved quotes).

## Step 0: Preflight

First, regenerate the SEO registry so it reflects what's actually live right
now (cheap, no API calls, takes under a second):

```bash
python socials/scripts/build-seo-registry.py
```

Then check these exist. If any REQUIRED file is missing, stop and tell the
user exactly what's missing and why it's needed — do not proceed with
guesses.

| File | Path | Required for |
|---|---|---|
| Brand guide | `brand-guide.md` (repo root) | both modes |
| Content log | `socials/content-log.md` | both modes |
| SEO registry | `socials/seo-registry.json` | both modes (just regenerated above) |
| Daily discovery report | `C:\Users\AI\AI-OS\my-brands\socials\topic_discovery\reports\*.md` | daily mode only |

The discovery report folder belongs to a separate, live system (Uros Builds'
topic scanner). **Read-only. Never write to or modify anything under
`my-brands/socials/topic_discovery/`.**

## Step 1: Determine Mode

`--case-study` present → Case Study Mode (Step 3).
Otherwise → Daily Mode (Step 2).

## No Duplicate Topics — Non-Negotiable

This applies to **every** brief this skill writes, daily or case study. Not
a soft preference: **never finalize a topic/keyword/narrative that
substantially duplicates something already published or already queued.**
"Substantially duplicates" means the same core question or the same client
result angle, not merely the same broad category (two posts can both be
about Klaviyo flows and still be genuinely distinct topics).

When a duplicate is found, there are exactly two acceptable resolutions:
1. **Sharpen it** into a genuinely distinct angle or long-tail variant that
   earns its own page (different question, different sub-topic, different
   specific take) — not a reworded rehash.
2. **Drop it** and move to the next-best candidate.

Silently proceeding with a near-duplicate is not an option, even if it's the
top-scoring candidate. Check every candidate against this before it's
written into a brief, not just the first one considered.

## Step 2: Daily Mode

### 2a. Load the discovery report

Find the newest file in `my-brands/socials/topic_discovery/reports/` matching
`YYYY-MM-DD.md` (or the exact date if `--date` was given; if that date's file
doesn't exist, say so and stop rather than silently substituting a different
date). Read both the `.md` and, if present, the `.json` of the same date —
the JSON carries the raw evidence list (titles, links, subreddit, age,
scores) more cleanly than the markdown.

### 2b. Re-score for OpenRateLab, not Uros Builds

Read `brand-guide.md` (repo root) first if you haven't this session —
**Services**, **Target audience**, and **Positioning** sections define what
"relevant" actually means below, so scoring without it is scoring blind.

The report's own `POST` / `COMMENT_ONLY` / `IGNORE` verdicts and its
"Positioning Anchors" were computed for Uros Builds (workflow automation,
migrations, internal AI tooling). Ignore those verdicts. Look at the raw
evidence across every bucket — the "Email Revenue Systems" bucket will
usually be the most directly relevant, but check the others too (a
`r/smallbusiness` or Hacker News item can still be a genuine email-marketing
angle) — and re-judge relevance against OpenRateLab's actual scope:

- Klaviyo, ActiveCampaign, MailPoet, Postscript, or any email/SMS marketing
  platform
- email flows, campaigns, segmentation, deliverability, list hygiene
- retention/lifecycle marketing for e-commerce and DTC brands
- broader email marketing debates, tool comparisons, "how do I improve my
  open rate" style questions — anything a potential client would search for
  or discuss

Score each candidate topic on:
- **Relevance to OpenRateLab's actual services** (0–5) — copywriting, full
  Klaviyo builds, automation, strategy audits
- **Coverage value** (0–5) — does writing about this widen the net of search
  terms/questions OpenRateLab is discoverable for? (breadth is a stated goal
  — cover as much of the email-marketing space as possible, not just
  OpenRateLab's own work)
- **Freshness** (0–3) — from the evidence's `age_days`

### 2c. Check for topic/keyword overlap — three sources, in order

Apply the **No Duplicate Topics** rule above using these three sources, in
order:

1. **`socials/seo-registry.json`** — every already-published blog post's
   title/description/category.
2. **`socials/content-log.md`** — topics already `briefed`/`drafted` in the
   last 14 days (queued but not yet live in the registry).
3. **Search Console (live, via browser)** — for the candidate's likely
   target keyword, check
   `https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain:openratelab.com`
   filtered to that query/similar queries. If openratelab.com already ranks
   decently for it, that's a signal either to go deeper on a sub-angle
   (avoid competing with your own page) or that the topic is confirmed
   valuable — use judgment, don't just avoid every keyword with existing
   impressions. This step is a real-data check, not a hard gate — if Search
   Console is slow/unavailable, note that and proceed on registry + log
   alone rather than blocking the whole run on it.

### 2d. Pick one topic and write the brief

Create `socials/drafts/{YYYY-MM-DD}-{topic-slug}/brief.md`:

```markdown
# Brief — {YYYY-MM-DD} — {topic-slug}

**Mode:** blog-trend
**Topic:** {one-line topic}
**Angle:** {the specific take/angle, one sentence}
**Target keyword:** {primary search term this should rank/be found for}

## Why this topic
{2-3 sentences grounded in the actual evidence — cite the specific
thread(s)/source(s) that surfaced it, with links}

## Outline
- {section 1}
- {section 2}
- {section 3}
- ...(3-6 sections total)

## LinkedIn angle
{the curiosity-gap hook this topic supports for the short-form post}

## Suggested internal links
{2-3 candidates from socials/seo-registry.json that are topically relevant —
`/orl-write` will make the final call on which actually fit, but flag them
here so it isn't re-deriving this from scratch}
- {existing post/case study title} — {url}

## Source evidence
- [{title}]({url}) — r/{subreddit or "Hacker News"}, {age}
- ...
```

### 2e. Log it

Append a row to `socials/content-log.md`:
`| {date} | blog-trend | {topic} | {angle} | {keyword} | {folder} | briefed |`

### 2f. Report back

Print the brief. Ask: "Proceed to `/orl-write` on this, or want a different
angle from the report?"

## Step 3: Case Study Mode

### 3a. Extract what was given

From `--brief` / `--brief-file` / attachments, extract: client (name or
description — see 3b), the concrete numbers, the before/after or timeframe,
what OpenRateLab specifically did, and any direct quote provided.

**Never invent a number, client name, or claim that wasn't given.** If
critical data is missing (e.g. no actual metric, or a vague "did well"),
stop and ask for the specific figures rather than guessing or rounding.

### 3b. Composite/anonymized — always, no exceptions

Clients are under NDA. **Every case study is anonymized: no brand name, no
identifying detail that could reveal who the client is.** This is not a
per-case decision — never ask, never offer to name a client, never include a
brand name even if the user's brief happens to mention one (strip it and use
an industry-label description instead, e.g. "an activewear brand" not the
brand's actual name). `isComposite: true` always. This matches the
established convention on every existing case study — check
`astro-site/src/content.config.ts` and any
`astro-site/src/content/case-studies/*.mdx` file for the exact shape.

The **numbers themselves stay real** (per the user's explicit instruction —
this is what distinguishes a case study from a blog post). Anonymize the
identity, not the results.

### 3c. Check for duplication against existing case studies

Apply the **No Duplicate Topics** rule above: check `socials/seo-registry.json`'s
`case_studies` list for existing entries with the same `industryLabel` or a
very similar `primaryMetric` story (e.g. two "40%+ open rate" case studies
back to back reads as repetitive even if the underlying clients differ).
There's no way around reusing metric types sometimes since the real numbers
are what they are — the fix is a distinct narrative angle (what specifically
was broken, what specifically was done), not picking a different client.

### 3d. Write the brief

Create `socials/drafts/{YYYY-MM-DD}-{client-or-topic-slug}-case-study/brief.md`:

```markdown
# Brief — {YYYY-MM-DD} — {slug} (case study)

**Mode:** case-study
**Composite:** yes (always — NDA)
**Client:** {industry-label only, e.g. "activewear brand" — never a real name}
**Primary metric:** {value + label, e.g. "43% revenue lift"}

## What happened
{the real narrative: starting problem, what OpenRateLab did, outcome}

## Numbers provided
- {metric}: {value}
- ...

## Assets provided
{note any screenshots/images the user attached — these need to be placed
manually when the piece is built into the site; this skill does not
generate or edit images}

## Quote
{direct quote if given, else "none provided"}

## Channels
Blog (full case study) + LinkedIn (short teaser linking to it). No Reddit —
case studies read as ads there.
```

### 3e. Log it

Append to `socials/content-log.md`:
`| {date} | case-study | {industry-label} | {narrative angle, one line} | {primary metric, e.g. "43% revenue lift"} | {folder} | briefed |`

### 3f. Report back

Print the brief. Ask the user to confirm the numbers are accurate before
`/orl-write` turns this into copy — this is the one place where a factual
error would be worst (it's a specific, checkable claim).
