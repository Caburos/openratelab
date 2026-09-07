# /orl-timing — LinkedIn Posting-Time Intelligence

Decides when (what half-hour slot) to publish tomorrow's LinkedIn post, and
logs how each past post actually performed so that decision keeps
improving. This is the "brain" for posting time, separate from what gets
posted (`/orl-strategy` + `/orl-write`) and separate from the act of
publishing itself.

No official LinkedIn Analytics API access exists yet (same gap as
posting), so this reads real numbers via browser, off the Page's own
Analytics — same mechanism used to set the page up originally.

## Data files

- `socials/timing-intelligence/state.json` — the 48 half-hour slots
  (`00:00`-`23:30`), which have been tried, current phase
  (`exploration`/`exploit`), the baseline engagement-rate benchmark, and a
  geographic note.
- `socials/linkedin-performance.json` — one entry per post: scheduled slot,
  actual post time, and (once checked) impressions/reactions/comments/
  shares/engagement rate.

## Two operations

### `/orl-timing --log-previous`

Run once daily, a little before midnight, **before** deciding tomorrow's
slot — this is the "check what happened today" half of the daily cycle.

1. Find the most recent entry in `socials/linkedin-performance.json` with
   `analytics_checked_at: null`.
2. Via browser, open that post (Page posts → Published, or the post's own
   analytics view) and read: impressions, reactions, comments, shares. If
   LinkedIn also shows a views count for this post type, capture that too.
3. Compute `engagement_rate = (reactions + comments + shares) / impressions`
   (guard against division by zero — if impressions is 0 or missing, leave
   engagement_rate null and note why).
4. Write these values into that post's entry, set
   `analytics_checked_at` to now.
5. If that post had a `scheduled_slot` (i.e. it came from this system, not
   an ad hoc post), mark that slot as tried in `state.json`'s
   `tried_slots` array: `{slot, date, weekday, engagement_rate,
   impressions}`. Ad hoc/manual posts (`scheduled_slot: null`) inform
   nothing about slot performance — don't let them count as a trial.
6. **One check only.** This isn't a revisit-over-time system — a single
   reading taken at roughly the same relative delay each time (this is why
   it always runs at the same near-midnight checkpoint) is what makes
   different days' readings comparable to each other. Don't check the same
   post twice.

### `/orl-timing --next-slot`

Run right after `--log-previous` in the same daily cycle — decides
tomorrow's posting hour.

**While `state.json.phase == "exploration"`:** pick the least-recently-tried
slot from `all_slots` (i.e. any slot not yet in `tried_slots`, in list
order — order doesn't matter during pure exploration, just coverage).
Once every slot has exactly one trial, flip `phase` to `"exploit"` in
`state.json` and note the date this happened.

**While `state.json.phase == "exploit"`:** rank tried slots by
`engagement_rate`. Pick from the top 3-5 performers most of the time
(roughly 80% of days). The other ~20% of days, re-test: either a slot
that hasn't been retried in a while (data goes stale — audience and
LinkedIn's own algorithm both drift), or, once there's enough repeated data
per weekday, the top slot **for that specific weekday** if it differs from
the global top slot. This is the closest approximation to A/B testing
LinkedIn's organic posting allows — there's no native split-test for
organic company posts (that only exists for Sponsored content), so this
sequential explore/exploit approach is the real substitute, not a
workaround to something better.

**Geographic input (once relevant):** if the page has enough followers for
`Analytics → Visitors` or `Analytics → Followers` location breakdown to
show a clear dominant region, treat that region's business hours as a soft
prior favoring slots within them during the exploit phase's top-3-5
selection — not a hard filter, since B2B LinkedIn engagement isn't purely
regional. Check this roughly monthly, not every run; it's not going to
change day to day. At 0 followers there's nothing to check yet.

Write the decision to `socials/timing-intelligence/next-post-time.json`:
```json
{"date": "2026-09-08", "weekday": "Tuesday", "slot": "09:30", "phase": "exploration"}
```

## What this skill does NOT do

- Doesn't write the post content (`/orl-strategy` + `/orl-write`).
- Doesn't actually publish anything (no orchestrator skill exists yet that
  reads `next-post-time.json` and fires the blog deploy + LinkedIn post at
  that time — that's the next piece to build, and needs its own explicit
  go-ahead before it runs unattended, since it's a real production deploy
  and a real public post with no human check once it's live).
- Doesn't do continuous/repeated analytics polling — one reading per post,
  by design (see `--log-previous` above).

## Known open item

Timestamps for `actual_post_time` should come from LinkedIn's own displayed
post time where possible (hover/permalink), not just local system clock —
this session's first log entry used system clock because LinkedIn's UI
only showed a relative "now" at the moment of posting. Prefer the
authoritative source when it's available.
