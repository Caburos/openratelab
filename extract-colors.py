import re
import sys
from urllib.parse import urljoin, urlparse
from urllib.request import urlopen, Request
from urllib.error import URLError
from collections import defaultdict

BASE_URL = "https://openratelab.com"
HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

def fetch(url):
    try:
        req = Request(url, headers=HEADERS)
        with urlopen(req, timeout=15) as r:
            return r.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  ERROR fetching {url}: {e}", file=sys.stderr)
        return ""

def find_css_urls(html, base):
    pattern = r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']|<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']stylesheet["\']'
    urls = []
    for m in re.finditer(pattern, html, re.IGNORECASE):
        href = m.group(1) or m.group(2)
        if href:
            full = urljoin(base, href)
            if urlparse(full).netloc in (urlparse(base).netloc, ""):
                urls.append(full)
    # Also grab inline style blocks for custom props
    return urls

def extract_colors(css):
    results = {
        "hex": set(),
        "rgb": set(),
        "hsl": set(),
        "custom_props": {},  # --name: value
    }

    # Hex colors
    for m in re.finditer(r'#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b', css):
        results["hex"].add(m.group(0).lower())

    # rgb/rgba
    for m in re.finditer(r'rgba?\([^)]+\)', css):
        results["rgb"].add(m.group(0))

    # hsl/hsla
    for m in re.finditer(r'hsla?\([^)]+\)', css):
        results["hsl"].add(m.group(0))

    # CSS custom properties that look color-related
    color_keywords = re.compile(
        r'--(color|bg|background|text|foreground|primary|secondary|accent|link|button|btn|heading|border|surface|muted|dark|light|brand|highlight|cta)',
        re.IGNORECASE
    )
    for m in re.finditer(r'(--[\w-]+)\s*:\s*([^;}{]+)', css):
        name, val = m.group(1), m.group(2).strip()
        if color_keywords.search(name) or re.search(r'#[0-9a-f]{3,6}|rgb|hsl', val, re.IGNORECASE):
            results["custom_props"][name] = val

    return results

def hex_to_rgb(h):
    h = h.lstrip('#')
    if len(h) == 3:
        h = ''.join(c*2 for c in h)
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def classify_hex(h):
    r, g, b = hex_to_rgb(h)
    brightness = (r * 299 + g * 587 + b * 114) / 1000
    if brightness > 240:
        return "near-white / light bg"
    if brightness < 30:
        return "near-black / dark bg"
    if r > g + 30 and r > b + 30:
        return "reddish"
    if g > r + 20 and g > b + 20:
        return "greenish"
    if b > r + 20 and b > g + 20:
        return "blueish"
    if r > 200 and g > 150 and b < 100:
        return "orange/gold"
    if r > 200 and g > 200 and b < 100:
        return "yellow"
    if brightness > 180:
        return "light"
    if brightness < 80:
        return "dark"
    return "mid-tone"

# ── MAIN ─────────────────────────────────────────────────────────────────────

print("=" * 60)
print("OpenRateLab Color Palette Extractor")
print("=" * 60)

print(f"\n[1] Fetching {BASE_URL} ...")
html = fetch(BASE_URL)
if not html:
    sys.exit("Could not fetch homepage")

css_urls = find_css_urls(html, BASE_URL)
print(f"    Found {len(css_urls)} stylesheet(s)")
for u in css_urls:
    print(f"    • {u}")

# Also check for inline <style> blocks
inline_styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL | re.IGNORECASE)

all_hex = set()
all_rgb = set()
all_hsl = set()
all_props = {}

print(f"\n[2] Fetching and parsing CSS files ...")
for url in css_urls:
    print(f"\n    >> {url.split('/')[-1][:60]}")
    css = fetch(url)
    if not css:
        continue
    res = extract_colors(css)
    all_hex.update(res["hex"])
    all_rgb.update(res["rgb"])
    all_hsl.update(res["hsl"])
    all_props.update(res["custom_props"])
    print(f"       hex: {len(res['hex'])}  rgb: {len(res['rgb'])}  hsl: {len(res['hsl'])}  custom props: {len(res['custom_props'])}")

# Process inline styles too
for block in inline_styles:
    res = extract_colors(block)
    all_hex.update(res["hex"])
    all_rgb.update(res["rgb"])
    all_hsl.update(res["hsl"])
    all_props.update(res["custom_props"])

# ── REPORT ────────────────────────────────────────────────────────────────────

print("\n" + "=" * 60)
print("RESULTS")
print("=" * 60)

print(f"\n── CSS Custom Properties ({len(all_props)}) ──────────────────")
for name, val in sorted(all_props.items()):
    print(f"  {name}: {val}")

print(f"\n── Hex Colors ({len(all_hex)}) ──────────────────────────────")
# Dedupe near-duplicates, sort by brightness
sorted_hex = sorted(all_hex, key=lambda h: sum(hex_to_rgb(h)))
for h in sorted_hex:
    label = classify_hex(h)
    print(f"  {h}  →  {label}")

print(f"\n── RGB/RGBA values ({len(all_rgb)}) ─────────────────────────")
for v in sorted(all_rgb)[:30]:
    print(f"  {v}")

print(f"\n── HSL/HSLA values ({len(all_hsl)}) ─────────────────────────")
for v in sorted(all_hsl)[:30]:
    print(f"  {v}")

# ── SUMMARY: Unique significant colors ───────────────────────────────────────
print("\n" + "=" * 60)
print("PALETTE SUMMARY (significant hex colors, filtered)")
print("=" * 60)

# Filter out pure utility / near-duplicates
skip = {'#ffffff', '#000000', '#fff', '#000'}
significant = [h for h in all_hex if h not in skip and len(h) >= 4]

# Group by approximate hue bucket
buckets = defaultdict(list)
for h in significant:
    buckets[classify_hex(h)].append(h)

for bucket, colors in sorted(buckets.items()):
    print(f"\n  [{bucket}]")
    for c in sorted(colors):
        print(f"    {c}")
