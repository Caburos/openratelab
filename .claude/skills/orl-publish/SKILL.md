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

## Model tiering — only the actual writing needs Sonnet 5

Per explicit cost decision: nothing in this pipeline needs the top-tier
model, and even the writing step only needs Sonnet 5, not higher. Every
mechanical step (file reads/writes, analytics logging, duplicate-checking,
slot selection, scheduled-task updates) runs on **Haiku 4.5**
(`claude-haiku-4-5-20251001`) — cheap, and none of this needs deep
reasoning. Only `/orl-write`'s actual copy generation runs on **Sonnet 5**
(`claude-sonnet-5`). `/orl-strategy`'s topic selection is judgment, not
prose generation, and runs on Haiku too, per the same decision.

This is why `--plan` is invoked as **three separate `claude.exe` processes
with different `--model` flags**, chained by a wrapper script
(`socials/scripts/nightly-plan.ps1`), not one process doing everything —
the CLI's `--model` flag applies to the whole session, so tiering by step
requires splitting into separate sessions with a file-based handoff
between them (the same handoff `/orl-strategy` → `/orl-write` already uses
via `brief.md`, just now also crossing a process boundary).

## Two operations

### `/orl-publish --plan`

Run once nightly (~23:30), via `nightly-plan.ps1` — **not** invoked as a
single `claude.exe` call. The wrapper runs, in order:

1. `claude.exe -p "/orl-publish --plan-research" --model claude-haiku-4-5-20251001 ...`
2. `claude.exe -p "/orl-write --brief <folder from step 1>" --model claude-sonnet-5 ...`
3. `claude.exe -p "/orl-publish --plan-finalize" --model claude-haiku-4-5-20251001 ...`

If step 1 signals failure (see "Idempotency guard" and "If any step
fails" below), the wrapper must **not** run steps 2 or 3 — same
all-or-nothing principle as before, just now enforced across process
boundaries instead of within one.

#### `--plan-research` (sub-step, Haiku)

**Idempotency guard — check this before anything else:** read
`socials/timing-intelligence/ready-to-publish.json`. If it exists with
`status: "pending"` — regardless of what `date` it names — stop here,
print nothing further needed, exit in a way the wrapper recognizes as
"no-op, don't continue to steps 2/3." `status: "pending"` means a post is
still queued to fire (normally today, but `--fire` can be delayed if the
machine was off), and planning a new day now would overwrite that file
and lose the queued post before it ever went out. Only proceed past this
check once the file doesn't exist, or its `status` is `"fired"` (that
day's post is confirmed out, safe to plan the next one) or
`"plan-failed"` (nothing to protect). This also naturally covers the case
where a manual/dry-run planning pass already happened earlier the same
day — the scheduled run sees `pending` and no-ops instead of redoing it.

1. **`/orl-timing --log-previous`** — reads today's post's real engagement
   (it's had most of a day to accumulate by now), logs it, marks its slot
   as tried.
2. **`/orl-strategy`** — picks tomorrow's topic using today's discovery
   report (freshest available at this checkpoint) and all the usual
   duplicate/cannibalization checks. If a case-study brief is queued
   instead (the user handed one over during the day), that takes priority
   over daily-mode trend picking — check for a pending case-study request
   first. Writes `brief.md` into the new draft folder as usual.
3. Write the chosen folder path to
   `socials/timing-intelligence/current-cycle-folder.txt` (just the path,
   nothing else) — this is how the wrapper script tells step 2 (the
   Sonnet `/orl-write` call) which folder to work in, without needing to
   parse conversational output.

If `/orl-strategy` can't clear the duplicate-topic check or any input is
missing (discovery report absent, etc.), do **not** write
`current-cycle-folder.txt` — log the failure to `socials/content-log.md`
(status `plan-failed`, with the reason) and stop. The wrapper checks
whether `current-cycle-folder.txt` was actually written before proceeding
to the write step.

#### `--plan-finalize` (sub-step, Haiku)

Runs after `/orl-write` (step 2) has completed. Reads
`current-cycle-folder.txt` for the folder path, then:

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
6. **Set the exact fire time.** No polling — update the existing `ORL-Fire`
   scheduled task's trigger to fire once, precisely at tomorrow's decided
   slot:
   ```powershell
   Set-ScheduledTask -TaskName "ORL-Fire" -Trigger (New-ScheduledTaskTrigger -Once -At "2026-09-08T09:30:00")
   ```
   This **updates** an existing task rather than creating a new one each
   night — deliberately, since registering fresh scheduled-task
   infrastructure is the kind of action that can get blocked by a safety
   classifier when done autonomously (this happened once already, on the
   Uros Builds equivalent). Updating one field of an already-approved task
   is a narrower action. If this step itself ever gets blocked, that's a
   real failure — treat it the same as any other failed step in this list
   (log it, don't silently continue as if `--fire` will still happen on its
   own, because it won't).
7. Delete `current-cycle-folder.txt` (cycle complete, no reason to leave a
   stale handoff file around for the next run to trip over).

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
   (replacing the `{BLOG_URL}` placeholder), then run:
   ```bash
   python socials/scripts/linkedin-bot.py --post --text-file socials/drafts/{folder}/linkedin.md
   ```
   This is a standalone script with its own persistent, already-logged-in
   Chrome session — **not** Claude Code's own browser tools, which don't
   work in headless/scheduled sessions at all (confirmed: the claude-in-
   chrome MCP server never connects in `-p` mode, regardless of device
   selection — don't try routing this through `select_browser`/`navigate`/
   `computer`, they won't exist in this context). If the script exits
   non-zero, that's a real failure — check its stderr; an auth/login error
   means the saved session expired and needs the user to re-run
   `python socials/scripts/linkedin-bot.py --login` themselves (never do
   this step yourself, it requires their own credentials).
5. **Log the outcome**: append the new entry to
   `socials/linkedin-performance.json` (date, weekday, `scheduled_slot`
   from the plan, `actual_post_time`, blog URL, `analytics_checked_at:
   null` — tomorrow night's `--log-previous` will fill that in), update
   `socials/content-log.md` status to `published`, and set
   `ready-to-publish.json`'s `status` to `"fired"`.

## Scheduling this (retired: API-key based Windows Scheduled Tasks, 2026-09-14)

**As of 2026-09-14, per explicit user decision, this pipeline runs entirely
inside an interactive Claude Code session, billed as normal subscription
usage — never against `ANTHROPIC_API_KEY`.** `ORL-NightlyPlan` and
`ORL-Fire` (described below, kept for historical/rollback reference) are
**disabled**. Reason: the API key kept running out (twice in under a week),
and `claude.exe -p` returns exit code 0 even when it fails on a credit
check before doing any real work — so the scheduled tasks looked like they
succeeded while silently doing nothing, which is how the pipeline went
quiet for two days (2026-09-13/14) without anyone noticing until the user
asked why.

**Current mechanism: `CronCreate`.** A recurring cron job fires nightly
inside a live Claude Code session and runs `--plan` directly (Skill tool —
this works fine for ORL since its skills live in this project), then
schedules a one-shot `CronCreate` job for the exact decided slot that runs
`--fire`. Same "precise trigger, not polling" design as before, just
re-implemented with session-native scheduling instead of
`Set-ScheduledTask`. Real constraints of this approach, worth knowing:

- **The session has to stay open.** `CronCreate` jobs are session-only —
  gone, silently, if the Claude Code window closes. No equivalent of
  `StartWhenAvailable`/`WakeToRun` here.
- **Recurring jobs auto-expire after 7 days.** Needs manual renewal — a
  one-shot reminder cron is set up near each batch's expiry to prompt the
  user to ask for a recreation.
- `linkedin-bot.py` is untouched by any of this — it's local Playwright
  automation with no Anthropic API involvement either way, safe to keep
  using exactly as before from inside a cron-fired prompt.

If this pipeline ever needs to go back to OS-level scheduling (e.g. moving
off session-based execution for some other reason), the Windows Scheduled
Task version below is the one to re-enable — but note it requires an
`ANTHROPIC_API_KEY`, which is exactly what this change was made to avoid.

### Historical: two Windows Scheduled Tasks, no polling

- **`ORL-NightlyPlan`** — fixed daily trigger, 23:30. Its action is **not**
  a direct `claude.exe` call — it runs
  `socials/scripts/nightly-plan.ps1`, the wrapper that chains the three
  `--plan` sub-steps (research → write → finalize) across three separate
  `claude.exe` processes with the model-tiered `--model` flags described
  above.
- **`ORL-Fire`** — a single task whose **trigger gets replaced every night**
  by `--plan-finalize`'s step 6, to fire exactly once at that night's
  decided slot. It is not a recurring trigger and nothing checks it in
  between — it sits idle until the one moment it's set to fire, then runs
  `--fire` once. Its action calls `claude.exe` directly (no wrapper needed,
  it's a single step) with `--model claude-haiku-4-5-20251001` — `--fire`
  does no creative writing, just mechanical publish/post/log steps, so it
  doesn't need Sonnet either.

This deliberately avoids the polling-every-15-minutes approach: `--plan`
already knows the exact slot at planning time, so there's no reason for
anything to guess or check repeatedly. The only thing `--plan` needs
elevated-enough access for is *updating* `ORL-Fire`'s trigger (via
`Set-ScheduledTask`, not creating new tasks) — see step 6 above for why
that distinction matters.

Both tasks run with `StartWhenAvailable` and `WakeToRun` enabled, so a
machine that's off or asleep at trigger time catches up once it's back,
rather than silently missing the cycle.

Neither task's invocation includes `--chrome` — it's meaningless here.
Claude Code's own browser integration doesn't work in headless/`-p`
sessions at all (confirmed by direct testing, not assumed), so all browser
access for this pipeline goes through `socials/scripts/linkedin-bot.py`
instead (see `/orl-timing` and step 4 of `--fire` above), which has its
own independent, persistent, already-logged-in Chrome session via
Playwright — nothing to do with Claude Code's browser tools.

**Don't pass a bare `/skill-name --arg` string as the `-p` prompt when the
model is Haiku 4.5 — confirmed unreliable, caused two real silent
failures (`ORL-Fire` exiting 0 having done nothing, on 2026-09-11 and
again 2026-09-12).** Haiku doesn't consistently recognize a slash-command
string as a skill invocation in headless `-p` mode — it can instead reply
conversationally ("Did you mean to invoke `/orl-publish`? What would you
like to do?") and exit cleanly with nothing done, which looks identical to
success from Task Scheduler's point of view (`LastTaskResult: 0`). Sonnet
5 has never shown this problem. The fix, applied to every Haiku `-p` call
in this pipeline (`ORL-Fire`'s own action, and `--plan-research`/
`--plan-finalize` inside `nightly-plan.ps1`): phrase the prompt as an
explicit instruction to invoke the skill, not a bare slash command —
e.g. `"Invoke the orl-publish skill now with argument --fire. Do not ask
for clarification or confirmation - just run it."` If a future symptom
looks like this again (scheduled task shows success, nothing actually
happened, no error logged anywhere) check this first before assuming
auth/credit issues — those were the first two (real, since-fixed) causes
of the same symptom, but this is a third, distinct cause with an
identical signature.

## Case studies stay separate

`/orl-strategy --case-study` remains user-triggered whenever real client
data comes in — it doesn't wait for the nightly cycle. When one is pending,
`--plan` should draft and schedule it instead of pulling a new trend topic
for that day (case studies and trend posts share the same daily slot, they
don't stack).
