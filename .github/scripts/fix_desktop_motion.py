from pathlib import Path

path = Path('astro-site/src/pages/index.astro')
source = path.read_text()
old = """      const isMobile = window.matchMedia('(max-width: 767px)').matches;\n      const hasViewTimeline = typeof CSS !== 'undefined' && typeof CSS.supports === 'function' && CSS.supports('animation-timeline: view()');\n      if (!isMobile && hasViewTimeline) return;\n\n      document.documentElement.classList.add('orl-motion-fallback');\n"""
new = """      // Use one choreography engine everywhere. Some desktop browsers report\n      // view-timeline support while failing to advance the actual animation,\n      // which left the desktop page effectively static. The JS observer / WAAPI\n      // path is consistent across desktop and mobile, so it is authoritative.\n      document.documentElement.classList.add('orl-motion-fallback');\n"""
if old not in source:
    raise SystemExit('Expected desktop motion gate not found; refusing unsafe patch.')
source = source.replace(old, new, 1)
path.write_text(source)
