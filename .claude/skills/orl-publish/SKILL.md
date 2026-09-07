# /orl-publish — OpenRateLab Nightly Planning + Publish Orchestrator

Ties `/orl-strategy`, `/orl-write`, `/orl-timing`, and the live-site publish
steps (from `new-page`) into one unattended daily cycle. This is the piece
that actually deploys to production and posts publicly with **no approval
gate** — that's the explicit, agreed design once this is running on a
schedule, not a default to take lightly if invoking by hand.

## Why planning happens the night before, not at 9am

`/orl-timing` explores all 48 half-hour slots across the full 24 hours,
which means many chosen slots land *before* a 9am draft could exist. So the
whole cycle — check yesterday's result, pick tomorrow's topic, write it,
decide tomorrow's slot — runs once, late the night before
(target: ~23:30), so tomorrow's post is fully ready regardless of how early
its slot turns out to be. Nothing gets drafted same-day-as-posting anymore.

## Two operations

### `/orl-publish --plan`

Run once nightly (~23:30).

**Idempotency guard — check this before anything else:** read
`socials/timing-intelligence/ready-to-publish.json`. If it exists with
`status: "pending"` — regardless of what `date` it names — stop here, do
nothing else, this is a no-op. `status: "pending"` means a post is still
queued to fire (normally today, but `--fire` can be delayed if the machine
was off), and planning a new day now would overwrite that file and lose
the queued post before it ever went out. Only proceed past this check once
the file doesn't exist, or its `status` is `"fired"` (that day's post is
confirmed out, safe to plan the next one) or `"plan-failed"` (nothing to
protect). This also naturally covers the case where a manual/dry-run
planning pass already happened earlier the same day — the scheduled run
sees `pending` and no-ops instead of redoing it.

Order matters — each step feeds the next:

1. **`/orl-timing --log-previous`** — reads today's post's real engagement
   (it's had most of a day to accumulate by now), logs it, marks its slot
   as tried.
2. **`/orl-strategy`** — picks tomorrow's topic using today's discovery
   report (freshest available at this checkpoint) and all the usual
   duplicate/cannibalization checks. If a case-study brief is queued
   instead (the user handed one over during the day), that takes priority
   over daily-mode trend picking — check for a pending case-study request
   first.
3. **`/orl-write`** — drafts tomorrow's `blog.md` + `linkedin.md` from that
   brief.
4. **`/orl-timing --next-slot`** — decides tomorrow's posting hour.
5. Write `socials/timing-intelligence/ready-to-publish.json`:
   ```json
   {
     "date": "2026-09-08",
     "slot": "09:30",
     "draft_folder": "socials/drafts/2026-09-08-topic-slug",
     "status": "pending"
   }
   ```

If any step fails (missing discovery report, `/orl-strategy` can't clear
the duplicate-topic check, etc.), do **not** write a partial
`ready-to-publish.json` — leave the previous day's file in place (or
absent) and log the failure clearly (`socials/content-log.md` status
`plan-failed`, with the reason). A missed day is far better than a bad
autonomous post.

### `/orl-publish --fire`

Triggered at the scheduled slot time (an external scheduler reads
`ready-to-publish.json`'s `slot` for today and fires this at that time —
see "Scheduling this" below).

1. Read `socials/timing-intelligence/ready-to-publish.json`. If its `date`
   isn't today, or `status` isn't `pending`, stop — nothing to fire (this
   guards against a stale file or a double-trigger).
2. **Publish the blog post**, following `new-page`'s steps exactly: place
   the `.mdx` file (already written by `/orl-write`, just needs schema
   fields double-checked — `datePublished`/`dateModified` should be set to
   *today*, not whatever date `/orl-write` guessed the night before),
   `npx astro build` to validate, spot-check `dist/sitemap.xml` and
   `dist/llms.txt` picked it up, then commit and push. This triggers the
   Netlify deploy.
3. **Wait for the deploy**, polling the live URL (same approach used
   manually this session: `curl -s -L -o /dev/null -w "%{http_code}"`,
   follow redirects, retry with backoff) until it returns 200. If it
   doesn't go live within a reasonable window (~10 minutes), stop and log
   the failure rather than posting a dead link to LinkedIn — a missed
   LinkedIn post is recoverable, a public post with a broken link looks
   bad and isn't easily undone.
4. **Post to LinkedIn**: fill the real blog URL into `linkedin.md`
   (replacing the `{BLOG_URL}` placeholder), post it via browser to the
   Open Rate Lab company page exactly as done manually this session
   (Create → Start a post → type content → Post). If the link-preview
   fetch fails/shows "cannot display preview," proceed anyway — the link
   still works, LinkedIn's crawler cache is not a reason to hold the post.
5. **Log the outcome**: append the new entry to
   `socials/linkedin-performance.json` (date, weekday, `scheduled_slot`
   from the plan, `actual_post_time`, blog URL, `analytics_checked_at:
   null` — tomorrow night's `--log-previous` will fill that in), update
   `socials/content-log.md` status to `published`, and set
   `ready-to-publish.json`'s `status` to `"fired"`.

## Scheduling this

This skill doesn't schedule itself — something has to actually invoke
`--plan` nightly and `--fire` at the variable, daily-changing slot time.
Two triggers are needed:
- A fixed nightly trigger for `--plan` (~23:30, same time every day).
- A trigger for `--fire` at whatever `ready-to-publish.json`'s `slot` says
  for today — since that hour changes daily, this needs either a
  short-interval check (e.g. every 15-30 min, fire if current time has
  reached today's planned slot and status is still `pending`) or a
  fresh one-time schedule set immediately after `--plan` writes the file.

**Not wired up yet.** Setting up the actual recurring triggers (this
project's task-scheduling tooling) is the last step before this runs fully
unattended — flag that explicitly and get a clear go-ahead before doing it,
same reasoning as everything else in this pipeline that acts autonomously
in production.

## Case studies stay separate

`/orl-strategy --case-study` remains user-triggered whenever real client
data comes in — it doesn't wait for the nightly cycle. When one is pending,
`--plan` should draft and schedule it instead of pulling a new trend topic
for that day (case studies and trend posts share the same daily slot, they
don't stack).
