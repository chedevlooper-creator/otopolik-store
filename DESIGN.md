---
name: OTO POLİK Premium HUD
colors:
  primary: "#ED1B24" # Racing Red
  background: "#09090b" # Deep HUD black
  surface: "#121214" # Glassmorphic cards surface
  border: "#ffffff1a" # White transparent borders
  text: "#ffffff" # Absolute white text
  muted: "#a1a1aa" # Gray text
rounded:
  sm: 6px
  md: 12px
  lg: 24px
  xl: 32px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: 24px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
---

# OTO POLİK Premium HUD Design System

## Overview
A high-end, premium OLED HUD (Head-Up Display) styled interface designed to match luxury custom automotive products. 

Key design pillars:
1. **OLED Dark Aesthetic:** Dominant pure black background with deep charcoal surface layers to look premium and save battery.
2. **Racing Red Accent:** Strong crimson red accent color used sparingly only for interactive indicators and main CTA buttons.
3. **Glassmorphism:** Subtle borders and backdrop blurs to simulate high-tech dashboard instrumentation.
4. **Clean Typography:** Bold letter-spaced monospaced indicators combined with high-contrast sans-serif body text.

## Colors
- **Racing Red (#ED1B24):** Accent color, signifies premium performance and primary actions.
- **Deep Black (#09090b):** Main backdrop, provides extreme contrast.
- **Surface Gray (#121214):** Tonal card layers with fine borders.
- **Muted Zinc (#a1a1aa):** For technical stats and description tags.

## Do's and Don'ts
- **Do** center all modals relative to the viewport using React Portals to prevent parent CSS distortions.
- **Do** use vector SVG or official scraped assets for brand logos to prevent low-res raster scaling.
- **Don't** mix purple or soft pastel tones into the dashboard layout.
- **Don't** use standard native dropdowns when a custom grid of visual cards provides a better experience.
