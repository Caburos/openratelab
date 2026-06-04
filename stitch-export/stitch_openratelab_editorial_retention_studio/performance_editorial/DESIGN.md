---
name: Performance Editorial
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e4bebc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#ab8987'
  outline-variant: '#5b403f'
  surface-tint: '#ffb3b1'
  primary: '#ffb3b1'
  on-primary: '#680011'
  primary-container: '#ff535b'
  on-primary-container: '#5b000e'
  inverse-primary: '#bb152c'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#6fd8cc'
  on-tertiary: '#003733'
  tertiary-container: '#2fa096'
  on-tertiary-container: '#00302c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad8'
  primary-fixed-dim: '#ffb3b1'
  on-primary-fixed: '#410007'
  on-primary-fixed-variant: '#92001c'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#8cf4e8'
  tertiary-fixed-dim: '#6fd8cc'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#00504a'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  surface-primary: '#0D0D0D'
  surface-secondary: '#262626'
  on-surface-warm: '#F9F9F7'
  accent-performance: '#E63946'
  muted-silver: '#A3A3A3'
typography:
  display-xl:
    fontFamily: Hanken Grotesk
    fontSize: 120px
    fontWeight: '800'
    lineHeight: 110px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  body-lg:
    fontFamily: Source Serif 4
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Source Serif 4
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-technical:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-button:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
spacing:
  margin-desktop: 64px
  margin-tablet: 32px
  margin-mobile: 20px
  gutter: 24px
  unit: 8px
---

## Brand & Style
The design system is built for an elite creative studio that merges the authority of a financial publication with the raw energy of high-performance copywriting. The brand personality is confident, analytical, and unapologetically direct. 

The aesthetic follows a **Modern Editorial** movement, heavily influenced by Swiss/International Style. It prioritizes clarity, structural integrity, and dramatic scale. We reject the "softness" of contemporary SaaS design—no gradients, no rounded corners, and no decorative blobs. Instead, the UI relies on sharp edges, aggressive whitespace, and a rigid grid to communicate precision and data-driven results. Motion should be minimal and functional, utilizing swift, linear transitions that mimic the turning of a page or the mechanical snap of a data terminal.

## Colors
The palette is rooted in a high-contrast, dark-mode-first approach. **Off-black (#0D0D0D)** serves as the primary canvas, providing a sophisticated depth that traditional pure blacks lack. **Warm White (#F9F9F7)** is used exclusively for primary typography to ensure maximum legibility without the harshness of pure white.

**Performance Red (#E63946)** is our singular aggressive accent. It must be used sparingly to highlight critical conversion data, calls to action, or key performance metrics. **Graphite (#262626)** and **Muted Silver (#A3A3A3)** provide the structural layers, used for borders, secondary text, and subtle UI divisions. This limited palette ensures that when color is used, it carries maximum intent.

## Typography
Typography is the primary visual driver of this design system. We utilize a high-contrast pairing of a sharp, modern Grotesque for impact and a professional Serif for long-form reading.

- **Headlines:** Use **Hanken Grotesk**. It should be set with tight letter-spacing and aggressive line heights. For "Display" sizes, the type should feel "oversized," often breaking traditional margin constraints to create a sense of scale.
- **Body:** Use **Source Serif 4**. This adds a layer of "Financial Publication" authority. It provides a technical, trustworthy feel to case studies and performance data.
- **Accents:** Use **JetBrains Mono** for technical data, performance percentages, and metadata labels. This reinforces the "Lab" aspect of the brand—precise, measured, and data-driven.

## Layout & Spacing
The layout is governed by a strict 12-column grid with a preference for **asymmetry**. Instead of centering content, align elements to the far left or right of the grid to create dynamic tension and "editorial" white space.

- **Grid:** On desktop, use a 12-column grid with wide 64px outer margins. Content should often span 8 columns, leaving 4 columns of whitespace for captions or secondary data.
- **Rhythm:** Spacing follows a strict 8px base unit. Vertical rhythm is critical; ensure sections are separated by significant "breathing room" (e.g., 160px or 240px) to maintain the premium, boutique feel.
- **Mobile:** Transition to a 4-column grid. Prioritize vertical stacking but maintain the "sharp" edge-to-edge look by keeping gutters minimal (16px).

## Elevation & Depth
Depth is created through **Tonal Layering** and **High-Contrast Outlines** rather than shadows. 

Avoid all ambient shadows. Instead, use a "stacking" logic: the base background is #0D0D0D, and interactive or elevated surfaces (like cards or menus) use #262626. To separate elements, use 1px solid borders in #A3A3A3 (Muted Silver) at low opacity (20-30%). This creates a "blueprint" or "technical drawing" effect that feels engineered rather than decorated.

## Shapes
The shape language is strictly **Sharp (0px)**. Every UI element—including buttons, input fields, cards, and images—must have 90-degree corners. This reinforces the brutalist, editorial aesthetic and suggests a level of precision and "unfiltered" performance. Do not use rounded corners under any circumstances, even for nested elements.

## Components
- **Buttons:** Primary buttons are rectangular with no radius. Use a #F9F9F7 background with #0D0D0D text for maximum contrast. The hover state should invert the colors or switch to the #E63946 Performance Red. Label text is always uppercase Hanken Grotesk.
- **Inputs:** Simple bottom-border only or a full 1px border box in Graphite (#262626). Focus states should snap to the Performance Red color instantly with no easing.
- **Cards:** Cards are defined by 1px Muted Silver borders. They should not have background fills unless they need to be distinguished from the main surface, in which case use #262626.
- **Data Visualizations:** Use JetBrains Mono for all axis labels. Charts should use thin 1px lines and Performance Red for the primary data line/bar.
- **Lists:** Use "Rule Lines" (1px horizontal borders) between list items. Use the mono font for numbering (e.g., 01, 02, 03) to create a structured, ledger-like appearance.
- **Performance Chips:** Small, rectangular tags with a background of #262626 and text in Performance Red. These are used to highlight specific KPIs or results (e.g., "+42% OPEN RATE").