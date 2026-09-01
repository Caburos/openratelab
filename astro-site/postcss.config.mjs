// Empty on purpose: Tailwind v4's @tailwindcss/vite plugin handles CSS
// processing directly and does not need classic PostCSS config. This file
// exists solely to stop Vite's upward directory search from picking up the
// parent openratelab repo's postcss.config.js (which targets the legacy
// client/ scaffold's Tailwind v3 setup) and causing a version conflict.
export default {};
