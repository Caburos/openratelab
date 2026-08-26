#!/usr/bin/env python3
"""
Consistency checker for the static OpenRateLab site.

Checks every page against the rules documented in CLAUDE.md (sections 3-5):
nav/footer link sets, the hardcoded-copyright-year regression, meta
description length, canonical self-reference, and required JSON-LD types
on articles. Run before committing any change that touches page markup.

Exit code is non-zero if anything fails.
"""

import glob
import re
import sys

HOMEPAGE = "index.html"

SUBPAGE_FOOTER_NAV_HREFS = ["/#services", "/#ledger", "/about/", "/blog/", "/#contact"]

ARTICLE_REQUIRED_TYPES = {
    "Article",
    "BreadcrumbList",
    "FAQPage",
    "Question",
    "Answer",
    "Organization",
    "Person",
    "ImageObject",
}

ARTICLE_DIRS = ("blog/", "case-studies/")
ARTICLE_INDEX_FILES = {"blog/index.html", "case-studies/index.html"}


def read(path):
    with open(path, encoding="utf-8", errors="ignore") as f:
        return f.read()


def find_all_pages():
    pages = ["index.html"]
    pages += sorted(glob.glob("about/*.html"))
    pages += sorted(glob.glob("blog/*.html"))
    pages += sorted(glob.glob("case-studies/*.html"))
    return pages


def expected_canonical(path):
    if path == "index.html":
        return "https://openratelab.com/"
    if path == "about/index.html":
        return "https://openratelab.com/about/"
    if path == "blog/index.html":
        return "https://openratelab.com/blog/"
    if path == "case-studies/index.html":
        return "https://openratelab.com/case-studies/"
    slug = path.rsplit("/", 1)[-1].removesuffix(".html")
    folder = path.split("/", 1)[0]
    return f"https://openratelab.com/{folder}/{slug}"


def check_page(path):
    content = read(path)
    errors = []
    is_homepage = path == HOMEPAGE

    # --- Title / description / canonical / robots presence ---
    title = re.search(r"<title>(.*?)</title>", content, re.S)
    desc = re.search(r'<meta[^>]+name="description"[^>]+content="([^"]*)"', content)
    canonical = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]*)"', content)
    robots = re.search(r'<meta[^>]+name="robots"[^>]+content="([^"]*)"', content)

    if not title or not title.group(1).strip():
        errors.append("missing or empty <title>")
    if not desc or not desc.group(1).strip():
        errors.append("missing meta description")
    else:
        length = len(desc.group(1).strip())
        if not (50 <= length <= 160):
            errors.append(f"meta description length {length} chars (want 50-160)")
    if not robots:
        errors.append("missing meta robots tag")

    if not canonical:
        errors.append("missing canonical link")
    else:
        expected = expected_canonical(path)
        if canonical.group(1).rstrip() != expected:
            errors.append(
                f"canonical is '{canonical.group(1)}', expected '{expected}'"
            )

    # --- Footer: hardcoded year regression ---
    footer_match = re.search(r"<footer.*?</footer>", content, re.S)
    footer = footer_match.group(0) if footer_match else ""
    if footer:
        if re.search(r"&copy;\s*\d{4}\s*OPENRATELAB", footer):
            errors.append("footer copyright year is hardcoded, not <span id=\"year\">")
        elif not re.search(r'&copy;<span id="year">\d{4}</span>', footer):
            errors.append("footer copyright block doesn't match expected pattern")

        # --- Footer nav link set (subpages only) ---
        if not is_homepage:
            missing = [h for h in SUBPAGE_FOOTER_NAV_HREFS if f'href="{h}"' not in footer]
            if missing:
                errors.append(f"footer NAVIGATION missing links: {missing}")
    else:
        errors.append("no <footer> found")

    # --- JSON-LD required types on articles ---
    is_article = path.startswith(ARTICLE_DIRS) and path not in ARTICLE_INDEX_FILES
    if is_article:
        types = set(re.findall(r'"@type"\s*:\s*"([^"]+)"', content))
        missing_types = ARTICLE_REQUIRED_TYPES - types
        if missing_types:
            errors.append(f"JSON-LD missing required @type(s): {sorted(missing_types)}")

    return errors


def main():
    pages = find_all_pages()
    total_errors = 0
    for path in pages:
        errors = check_page(path)
        if errors:
            total_errors += len(errors)
            print(f"FAIL {path}")
            for e in errors:
                print(f"  - {e}")
        else:
            print(f"ok   {path}")

    print()
    print(f"{len(pages)} pages checked, {total_errors} issue(s) found.")
    return 1 if total_errors else 0


if __name__ == "__main__":
    sys.exit(main())
