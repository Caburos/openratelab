<#
.SYNOPSIS
  Wrapper for ORL-NightlyPlan. Chains the three /orl-publish --plan sub-steps
  as separate claude.exe processes with different --model flags, since a
  single Claude Code session can't switch models mid-session and Windows
  Scheduled Tasks can only run one program per action.

  Model tiering (explicit cost decision, 2026-09-10): only actual copywriting
  needs Sonnet 5. Everything mechanical (engagement logging, topic selection,
  slot picking, scheduled-task updates) runs on Haiku 4.5.

  Step 1 (Haiku)  -> /orl-publish --plan-research
  Step 2 (Sonnet) -> /orl-write --brief <folder from step 1>
  Step 3 (Haiku)  -> /orl-publish --plan-finalize

  If step 1 doesn't produce a handoff file (current-cycle-folder.txt), that
  means either the idempotency guard no-op'd or planning failed -- either
  way, steps 2 and 3 must not run.
#>

$ErrorActionPreference = "Stop"

$ClaudeExe   = "C:\Users\AI\.local\bin\claude.exe"
$RepoRoot    = "C:\Users\AI\AI-OS\my-brands\openratelab"
$HandoffFile = Join-Path $RepoRoot "socials\timing-intelligence\current-cycle-folder.txt"
$HaikuModel  = "claude-haiku-4-5-20251001"
$SonnetModel = "claude-sonnet-5"

Set-Location $RepoRoot

# Clean up any stale handoff file from a previous failed run before starting,
# so step 1's absence-check below can't be fooled by leftover state.
if (Test-Path $HandoffFile) { Remove-Item $HandoffFile -Force }

Write-Host "[nightly-plan] Step 1/3: --plan-research (Haiku)"
& $ClaudeExe -p "Invoke the orl-publish skill now with argument --plan-research. Do not ask for clarification or confirmation - just run it." --permission-mode bypassPermissions --model $HaikuModel -n "ORL-NightlyPlan-Research"
$step1Exit = $LASTEXITCODE

if ($step1Exit -ne 0 -or -not (Test-Path $HandoffFile)) {
    Write-Host "[nightly-plan] Step 1 produced no handoff file (no-op or plan-failed) -- stopping, not running steps 2/3."
    exit 0
}

$draftFolder = (Get-Content $HandoffFile -Raw).Trim()
Write-Host "[nightly-plan] Step 1 done. Draft folder: $draftFolder"

Write-Host "[nightly-plan] Step 2/3: /orl-write (Sonnet 5)"
& $ClaudeExe -p "/orl-write --brief $draftFolder/brief.md" --permission-mode bypassPermissions --model $SonnetModel -n "ORL-NightlyPlan-Write"
$step2Exit = $LASTEXITCODE

if ($step2Exit -ne 0) {
    Write-Host "[nightly-plan] Step 2 (/orl-write) failed with exit code $step2Exit -- stopping, not running step 3."
    exit $step2Exit
}

Write-Host "[nightly-plan] Step 3/3: --plan-finalize (Haiku)"
& $ClaudeExe -p "Invoke the orl-publish skill now with argument --plan-finalize. Do not ask for clarification or confirmation - just run it." --permission-mode bypassPermissions --model $HaikuModel -n "ORL-NightlyPlan-Finalize"
$step3Exit = $LASTEXITCODE

if ($step3Exit -ne 0) {
    Write-Host "[nightly-plan] Step 3 (--plan-finalize) failed with exit code $step3Exit."
    exit $step3Exit
}

Write-Host "[nightly-plan] Done."
