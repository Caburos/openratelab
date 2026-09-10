#!/usr/bin/env python3
"""
Standalone LinkedIn automation for the Open Rate Lab company page.

Exists because Claude Code's own Claude-in-Chrome bridge only works in
interactive sessions -- headless/-p invocations (which is how the scheduled
tasks run) get zero browser tools, confirmed by direct testing. This script
sidesteps that entirely: it's a plain Playwright script with its own
persistent browser profile (login cookies survive between runs), callable
directly by the scheduled task with no Claude Code / Chrome-bridge
involvement at all.

USAGE
-----
  # One-time setup: log into LinkedIn in a real, visible browser window.
  # The session is saved into PROFILE_DIR and reused by every later run.
  python linkedin-bot.py --login

  # Post to the Open Rate Lab company page. --text-file's content is
  # posted verbatim (already-finished LinkedIn copy, e.g. linkedin.md).
  python linkedin-bot.py --post --text-file ../drafts/2026-09-10-topic/linkedin.md

  # Read the most recent post's engagement numbers (LinkedIn's own
  # Post performance panel), print as JSON to stdout.
  python linkedin-bot.py --analytics
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

SCRIPTS_DIR   = Path(__file__).parent
PROFILE_DIR   = SCRIPTS_DIR / ".linkedin-browser-profile"
COMPANY_ID    = "144914968"
POSTS_URL     = f"https://www.linkedin.com/company/{COMPANY_ID}/admin/page-posts/published/"


def _launch(headless: bool):
    pw = sync_playwright().start()
    context = pw.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE_DIR),
        headless=headless,
        viewport={"width": 1400, "height": 1000},
    )
    return pw, context


def cmd_login():
    """Open a real, visible browser window for a one-time manual login.
    The persistent profile (cookies, localStorage) is saved to PROFILE_DIR
    automatically on close -- every later --post/--analytics run reuses it
    headlessly, no login needed again unless LinkedIn forces a re-auth."""
    PROFILE_DIR.mkdir(parents=True, exist_ok=True)
    print(f"[login] Opening a visible browser. Profile will persist to {PROFILE_DIR}")
    pw, context = _launch(headless=False)
    page = context.new_page()
    page.goto("https://www.linkedin.com/login")
    print("[login] Log in manually in the opened window (handle any 2FA/checkpoint too).")
    print("[login] Once you're on your LinkedIn feed/home page, come back here and press Enter.")
    input()
    page.goto(POSTS_URL)
    page.wait_for_timeout(3000)
    if "admin" in page.url:
        print("[login] Confirmed: reached the company admin page. Session saved.")
    else:
        print(f"[login] Warning: landed on {page.url}, not the admin page -- "
              f"double check you have admin access to this company page.")
    context.close()
    pw.stop()


def cmd_post(text: str):
    pw, context = _launch(headless=True)
    page = context.new_page()
    page.goto(POSTS_URL)
    page.wait_for_timeout(2000)

    if "/login" in page.url or "authwall" in page.url:
        print("[post] ERROR: not logged in (redirected to login/authwall). "
              "Run --login again -- the saved session may have expired.", file=sys.stderr)
        context.close(); pw.stop()
        sys.exit(1)

    # Open the composer
    page.get_by_text("Start a post", exact=False).first.click()
    page.wait_for_timeout(1500)

    editor = page.locator("div[role='textbox']").first
    editor.click()
    # Type in chunks; a single huge fill() can trip LinkedIn's editor state.
    for chunk in text.split("\n"):
        editor.type(chunk)
        editor.press("Enter")
    page.wait_for_timeout(1000)

    post_button = page.get_by_role("button", name="Post", exact=True)
    post_button.click()
    page.wait_for_timeout(4000)

    # Dismiss the "share to your profile" upsell if it appears
    not_now = page.get_by_role("button", name="Not now", exact=False)
    try:
        if not_now.is_visible(timeout=3000):
            not_now.click()
    except Exception:
        pass

    success = page.get_by_text("Post successful", exact=False)
    ok = False
    try:
        ok = success.is_visible(timeout=5000)
    except Exception:
        pass

    context.close()
    pw.stop()

    if ok:
        print("[post] Post successful.")
    else:
        print("[post] WARNING: could not confirm 'Post successful' message -- "
              "verify manually before assuming this worked.", file=sys.stderr)
        sys.exit(1)


def _parse_int(text: str) -> int | None:
    m = re.search(r"[\d,]+", text)
    return int(m.group(0).replace(",", "")) if m else None


def _parse_pct(text: str) -> float | None:
    m = re.search(r"([\d.]+)\s*%", text)
    return float(m.group(1)) / 100 if m else None


def cmd_analytics() -> dict:
    pw, context = _launch(headless=True)
    page = context.new_page()
    page.goto(POSTS_URL)
    page.wait_for_timeout(2500)

    if "/login" in page.url or "authwall" in page.url:
        print("[analytics] ERROR: not logged in. Run --login again.", file=sys.stderr)
        context.close(); pw.stop()
        sys.exit(1)

    # Expand "Preview results" / "Show all results" on the first (most recent) post
    preview = page.get_by_text("Preview results", exact=False).first
    preview.click()
    page.wait_for_timeout(1500)
    show_all = page.get_by_text("Show all results", exact=False).first
    try:
        if show_all.is_visible(timeout=3000):
            show_all.click()
            page.wait_for_timeout(1500)
    except Exception:
        pass

    body_text = page.locator("body").inner_text()

    result = {
        "impressions": None, "engagement_rate": None, "clicks": None,
        "click_through_rate": None, "reactions": None, "comments": None,
        "reposts": None,
    }

    for label, key, parser in [
        ("Impressions", "impressions", _parse_int),
        ("Engagement rate", "engagement_rate", _parse_pct),
        ("Clicks", "clicks", _parse_int),
        ("Click-through rate", "click_through_rate", _parse_pct),
        ("Reactions", "reactions", _parse_int),
        ("Comments", "comments", _parse_int),
        ("Reposts", "reposts", _parse_int),
    ]:
        # The panel uses two different orderings depending on which sub-section
        # a field is in: "48\n\nImpressions" (value first, e.g. the top
        # discovery/engagement summary) vs "Clicks\n1" (label first, e.g. the
        # detailed breakdown list). Try both -- but the number pattern must
        # require a trailing '%' for percentage fields specifically, or the
        # value-first regex can wrongly grab an adjacent field's plain integer
        # (e.g. "1\nClick-through rate" matching on the previous line's
        # Clicks=1, since '%' was optional -- confirmed bug, not hypothetical).
        num_pat = r"[\d.,]+%" if parser is _parse_pct else r"[\d.,]+"
        m = re.search(rf"({num_pat})\s*\n+\s*{re.escape(label)}\b", body_text)
        if not m:
            m = re.search(rf"{re.escape(label)}\s*\n+\s*({num_pat})", body_text)
        if m:
            result[key] = parser(m.group(1))

    context.close()
    pw.stop()
    return result


def main():
    parser = argparse.ArgumentParser(description="Standalone LinkedIn automation for Open Rate Lab")
    parser.add_argument("--login", action="store_true", help="One-time interactive login (visible browser)")
    parser.add_argument("--post", action="store_true", help="Post to the company page")
    parser.add_argument("--analytics", action="store_true", help="Read the most recent post's engagement, print JSON")
    parser.add_argument("--text-file", help="Path to a .md/.txt file whose content gets posted (required with --post)")
    args = parser.parse_args()

    if args.login:
        cmd_login()
    elif args.post:
        if not args.text_file:
            print("[error] --post requires --text-file", file=sys.stderr)
            sys.exit(1)
        text = Path(args.text_file).read_text(encoding="utf-8").strip()
        cmd_post(text)
    elif args.analytics:
        print(json.dumps(cmd_analytics(), indent=2))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
