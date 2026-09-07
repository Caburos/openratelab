#!/usr/bin/env python3
"""
Regenerate socials/seo-registry.json from the live site content.

No API calls, no auth — pure local file scan. Source of truth is the actual
.mdx files under astro-site/src/content/, so the registry can't drift from
what's really published: run this every time before picking a topic or
writing internal links, it's instant.

USAGE
-----
  python build-seo-registry.py
"""

import json
import re
import sys
from pathlib import Path

REPO_ROOT   = Path(__file__).resolve().parents[2]   # .../openratelab
CONTENT_DIR = REPO_ROOT / "astro-site" / "src" / "content"
OUT_FILE    = Path(__file__).resolve().parent.parent / "seo-registry.json"

# Evergreen internal targets that aren't content-collection entries.
EVERGREEN_LINKS = {
    "contact": "/#contact",
    "services": "/#services",
    "about": "/about/",
    "case_studies_index": None,  # no listing page exists — link directly to individual case studies
}


def _scalar_field(fm_text: str, key: str) -> str | None:
    m = re.search(rf'^{key}:\s*"?(.*?)"?\s*$', fm_text, re.MULTILINE)
    return m.group(1).strip() if m else None


def _nested_field(fm_text: str, parent: str, key: str) -> str | None:
    """Grab a field nested one level under `parent:` (e.g. primaryMetric.value)."""
    m = re.search(
        rf'^{parent}:\s*\n(?:^\s+\S.*\n?)+', fm_text, re.MULTILINE
    )
    if not m:
        return None
    block = m.group(0)
    m2 = re.search(rf'^\s+{key}:\s*"?(.*?)"?\s*$', block, re.MULTILINE)
    return m2.group(1).strip() if m2 else None


def _read_frontmatter(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) == 3:
            return parts[1]
    return ""


def scan_blog_posts() -> list[dict]:
    out = []
    blog_dir = CONTENT_DIR / "blog"
    if not blog_dir.exists():
        return out
    for path in sorted(blog_dir.glob("*.mdx")):
        fm = _read_frontmatter(path)
        slug = path.stem
        out.append({
            "slug": slug,
            "url": f"/blog/{slug}",
            "title": _scalar_field(fm, "title"),
            "description": _scalar_field(fm, "description"),
            "category": _scalar_field(fm, "category"),
            "excerpt": _scalar_field(fm, "excerpt"),
            "datePublished": _scalar_field(fm, "datePublished"),
        })
    return out


def scan_case_studies() -> list[dict]:
    out = []
    cs_dir = CONTENT_DIR / "case-studies"
    if not cs_dir.exists():
        return out
    for path in sorted(cs_dir.glob("*.mdx")):
        fm = _read_frontmatter(path)
        slug = path.stem
        out.append({
            "slug": slug,
            "url": f"/case-studies/{slug}",
            "title": _scalar_field(fm, "title"),
            "description": _scalar_field(fm, "description"),
            "industryLabel": _scalar_field(fm, "industryLabel"),
            "datePublished": _scalar_field(fm, "datePublished"),
            "primaryMetric": {
                "value": _nested_field(fm, "primaryMetric", "value"),
                "label": _nested_field(fm, "primaryMetric", "label"),
            },
        })
    return out


def main():
    import datetime
    registry = {
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "blog_posts": scan_blog_posts(),
        "case_studies": scan_case_studies(),
        "evergreen_links": EVERGREEN_LINKS,
    }
    OUT_FILE.write_text(json.dumps(registry, indent=2), encoding="utf-8")
    print(f"[seo-registry] {len(registry['blog_posts'])} blog posts, "
          f"{len(registry['case_studies'])} case studies -> {OUT_FILE}")


if __name__ == "__main__":
    main()
