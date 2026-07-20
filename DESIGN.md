---
name: Stealth Precision
description: Visual language for OTO POLİK Luxury Showroom storefront.
colors:
  background: "#000000"
  foreground: "#f2f2f0"
  primary: "#ED1B24" # Racing Red
  secondary: "#A40D15"
  accent-red: "#FF2E36" # Parlak kırmızı
  surface: "#0B0B0B"
  surface-hover: "#141414"
  border: "#1B1B1B" # Carbon Black
  muted: "#a1a1aa"
  sand: "#cfcfca"
typography:
  headline-display: { fontFamily: Syne, fontSize: 48px, fontWeight: 800, lineHeight: 1.1, letterSpacing: -0.03em }
  headline-lg: { fontFamily: Syne, fontSize: 32px, fontWeight: 700, lineHeight: 1.2, letterSpacing: -0.025em }
  headline-md: { fontFamily: Syne, fontSize: 24px, fontWeight: 700, lineHeight: 1.3, letterSpacing: -0.02em }
  body-lg: { fontFamily: Instrument Sans, fontSize: 18px, fontWeight: 500, lineHeight: 1.6 }
  body-md: { fontFamily: Instrument Sans, fontSize: 15px, fontWeight: 400, lineHeight: 1.5 }
  body-sm: { fontFamily: Instrument Sans, fontSize: 13px, fontWeight: 400, lineHeight: 1.4 }
  mono-spec: { fontFamily: JetBrains Mono, fontSize: 12px, fontWeight: 500, letterSpacing: 0.1em }
rounded:
  card: 12px
  button: 9999px
  input: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px
components:
  card-premium:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.card}"
    border: "1px solid {colors.border}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
  input-text:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.input}"
    border: "1px solid {colors.border}"
---

# OTO POLİK Design System

## Overview
OTO POLİK represents a high-end luxury vehicle accessory showroom. The design aesthetic is **Stealth Precision**: dark, performance-oriented carbon blacks, highlighted with sharp, glowing **Racing Red** accents and pure high-resolution typography.

The site is built with a dark mode by default, targeting auto enthusiasts and luxury vehicle owners who demand perfect fitment, premium textures, and clean interfaces.

## Colors
- **Background (#000000):** Deepest absolute black to maximize contrast and premium feeling.
- **Surface (#0B0B0B) & Surface Hover (#141414):** Carbon-like surface shades for containers and bento boxes.
- **Primary (#ED1B24) & Accent Red (#FF2E36):** High-energy racing red accents for CTAs, active states, and highlights.
- **Border (#1B1B1B):** Subtle structural separators to keep elements clean and defined without adding clutter.
- **Sand (#cfcfca) / Foreground (#f2f2f0):** Soft ivory/silver tones for high readability and premium contrast (never plain white).

## Typography
- **Headings (Syne):** Syne is used for all main display headings (`h1`, `h2`, `h3`, `h4`). It is a wide, powerful geometric typeface that reinforces high-end performance.
- **Body (Instrument Sans):** Clean, premium, neutral body font that offers exceptional readability on small and large screens alike.
- **Mono (JetBrains Mono):** Used for technical specs, pricing badges, and labels.

## Elevation & Depth
Flat dark design with micro-borders (`1px border-white/[0.04]`) and subtle glowing red drop shadows (`shadow-[0_0_25px_rgba(237,27,36,0.15)]`) instead of standard blurry gray shadows.

## Do's and Don'ts
- **Do** keep spacing tight and layouts alignment precise.
- **Don't** use standard SaaS gradients, fintech blues, or generic templates.
- **Do** align color accents to Racing Red or subtle Sand tones.
- **Don't** allow components to use misaligned font families (ensure Syne is correctly applied to headings).
- **Do** design panels and modals to feel like automotive instruments or high-tech HUD systems.
