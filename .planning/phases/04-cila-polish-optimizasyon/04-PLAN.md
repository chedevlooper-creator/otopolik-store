---
phase: 4
name: "Cila (Polish) & Optimizasyon"
status: ready
granularity: coarse
plans: 1
---

# Phase 4: Cila (Polish) & Optimizasyon — Plan

## Overview

Execute performance optimizations, image placeholders, touch target updates, custom scrollbars, sticky hover fixes, and fallback error states for the premium Otopolik experience.

## Plan 01: Performance & UX Cila

### Tasks

#### Task 1: Shimmer SVG Helper & Image Placeholders
**Files:** `src/lib/image-placeholders.ts` (NEW), update page/component images
**Description:** Create a utility that returns a Base64-encoded SVG data URI representing a animated dark luxury shimmer placeholder (`#0f1012` to `#1e2024` back to `#0f1012`). Update image usages (like in `ProductCard.tsx` and configurator previews) to use `placeholder="blur"` and `blurDataURL={shimmerDataUrl(width, height)}`.
**Must-haves:**
- SVG shimmer gradient has smooth visual pulsing transition
- Outputs valid base64 data URI
- Placeholders match the dark theme

#### Task 2: Critical LCP Image Priorities
**Files:** `src/components/home/Hero.tsx`, `src/components/Header.tsx`, `src/components/Logo.tsx`, `src/components/configurator/MatConfigurator.tsx`
**Description:** Add `priority` flags to LCP-critical images including the main hero paspas image/car render, the site logo, and the initial active paspas preview in the configurator.
**Must-haves:**
- Above-the-fold images load immediately without lazy-load delay
- Priority flags verified in local build (no Next.js warning)

#### Task 3: Responsiveness Image Sizes Audit
**Files:** `src/components/ProductCard.tsx`, `src/components/home/HomeConfiguratorShowcase.tsx`, `src/app/galeri/page.tsx`
**Description:** Audit and update Next.js `<Image>` component `sizes` attributes. Ensure images on grid views don't request full-size desktop files on mobile viewports. For example, product cards should use `sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"`.
**Must-haves:**
- All key images have descriptive `sizes` attribute
- Prevents loading desktop-size assets on mobile viewport widths

#### Task 4: Enforce Mobile Touch Target Minimums
**Files:** `src/components/configurator/ColorPicker.tsx`, `src/components/configurator/ExtrasSelector.tsx`, `src/components/configurator/VehicleSelector.tsx`
**Description:** Enforce a minimum target size of 44x44px for all mobile interactive targets (swatches, checkboxes, dropdown targets) to meet iOS HIG standards. Adjust padding, margin, or layout size without breaking visual aesthetics (e.g., using transparent expansion/invisible padding wrappers if necessary).
**Must-haves:**
- Swatches have minimum tap boundaries of 44px
- Dropdown buttons and checklist labels are easy to tap on small screens

#### Task 5: Elegant Custom Scrollbars
**Files:** `src/app/globals.css`
**Description:** Replace the default browser scrollbars with custom styled dark scrollbars: thin track with background `#0f1012`, rounded thumb with color `rgba(255,255,255,0.12)`, and hover color `rgba(255,255,255,0.22)`.
**Must-haves:**
- Scrollbars look integrated into the luxury styling
- Desktop view scrollbar width ~8px

#### Task 6: Sticky Hover Fix on Touch Devices
**Files:** `src/app/globals.css`
**Description:** Wrap all hover interaction rules (or utility styles) inside the `@media (hover: hover)` media query block to prevent sticky hover states on mobile/tablet touch screens where hover states get stuck until another tap occurs.
**Must-haves:**
- Hover states (glow, scale, borders) only trigger on devices that support cursor hover
- Visual experience stays stable on touch-only devices

#### Task 7: Premium Image Error Fallbacks
**Files:** `src/components/ui/SafeImage.tsx` (NEW), update key components
**Description:** Create a `SafeImage` wrapper around the Next.js `Image` component. If the image source fails to load (`onError`), it fallback renders a stylized premium dark gradient (`from-surface to-background`) with a subtle logo icon or alt description.
**Must-haves:**
- Broken images show premium placeholder instead of browser error icon
- Seamlessly fits the dark styling

#### Task 8: Network Connectivity Indicator
**Files:** `src/components/ui/NetworkToast.tsx` (NEW), `src/app/layout.tsx`
**Description:** Create a network status wrapper that listens to browser `online` and `offline` events. When offline, display a subtle, non-intrusive banner toast at the top of the viewport reading "Bağlantı kesildi. Bazı özellikler kullanılamayabilir." with a slide-in spring animation.
**Must-haves:**
- Animates in smoothly on network loss, dismisses on reconnect
- Non-blocking layout (pointer-events-none for wrapper)

### Verification

```yaml
type: build_and_manual
build_command: "npm run build"
manual_checks:
  - Shimmer data URL generates correctly
  - Priority flags load LCP images early
  - Image sizes attributes match device viewport widths
  - Touch targets are minimum 44px on mobile
  - Dark custom scrollbars display on desktop
  - Sticky hovers are disabled on touch views
  - Failed images display the stylized fallback canvas
  - Offline toast shows up when going offline (dev tools network emulation)
```
