---
phase: 3
name: "Configurator & Gallery Lüks Etkileşimler"
status: ready
granularity: coarse
plans: 1
---

# Phase 3: Configurator & Gallery Lüks Etkileşimler — Plan

## Overview

Upgrade the configurator form, product gallery, and micro-animation systems to Apple/Porsche luxury standards using Framer Motion spring physics, cursor-follow loupe zoom, and premium interaction feedback.

## Plan 01: Luxury Configurator & Gallery Interactions

### Tasks

#### Task 1: Configurator Step Transition Animations
**Files:** `src/components/configurator/MatConfigurator.tsx`
**Description:** Add Framer Motion `AnimatePresence` with spring-based slide transitions between configurator steps. Wrap each step section (VehicleSelector, ColorPicker floor, ColorPicker edge, ExtrasSelector) in a `motion.div` with `initial={{ opacity: 0, x: 20 }}`, `animate={{ opacity: 1, x: 0 }}`, `exit={{ opacity: 0, x: -20 }}` and spring transition. Add `layoutId` for smooth step indicator animation.
**Must-haves:**
- Steps transition with spring physics (stiffness: 300, damping: 25)
- No content jump or layout shift during transitions
- Current step auto-scrolls into view on mobile

#### Task 2: Enhanced Color Swatch Interaction
**Files:** `src/components/configurator/ColorPicker.tsx`
**Description:** Enhance the existing Framer Motion color swatches with glow pulse on selection and a ring-expand animation. Add `whileHover={{ scale: 1.15, boxShadow: "0 0 20px rgba(255,255,255,0.3)" }}` and improve the active checkmark animation with a bounce-in spring. Add a subtle `backdrop-blur` glow behind the active swatch.
**Must-haves:**
- Selected swatch has visible glow ring animation
- Hover state shows scale + shadow preview
- Transition between active swatches uses `layoutId` smoothly

#### Task 3: Preview Image Crossfade Zoom
**Files:** `src/components/configurator/MatConfigurator.tsx`
**Description:** Replace the instant image swap with a Framer Motion crossfade + subtle zoom. When floor/edge color changes, the new preview image fades in at `scale: 0.97` and animates to `scale: 1.0` while the old image fades out. Use `AnimatePresence mode="wait"` with `key={previewKey}`.
**Must-haves:**
- Crossfade duration ~400ms with spring easing
- No flash of empty state during transition
- Badge overlay ("Dijital renk önizlemesi") stays stable during transition

#### Task 4: Glassmorphism Step Progress Bar
**Files:** `src/components/configurator/MatConfigurator.tsx`
**Description:** Replace the current flat step pills with a premium glassmorphism progress bar. Use a horizontal bar with `backdrop-blur-xl`, gradient fill (`from-white/20 to-white/5`), and animated width based on `currentStep`. Each step marker becomes a circle with scale-up animation on completion. Add a subtle shine sweep animation across the completed portion.
**Must-haves:**
- Fill bar animates smoothly between steps (Framer Motion `layout` animation)
- Completed steps show scale-up ✓ with spring bounce
- Glass effect visible on dark backgrounds

#### Task 5: Gallery Pinch-to-Zoom & Cursor Loupe
**Files:** `src/components/ProductGallery.tsx`, `src/components/GalleryLightbox.tsx`
**Description:** Add pinch-to-zoom on mobile (using touch event deltas for scale transform) and cursor-follow loupe on desktop. Desktop: on hover, show a zoomed circular lens (2x magnification) that follows the cursor via `transform: translate()`. Mobile: track two-finger pinch distance and apply `transform: scale()` with bounds clamping. Use `requestAnimationFrame` for smooth updates.
**Must-haves:**
- Desktop: circular loupe (150px diameter) follows cursor smoothly
- Mobile: pinch gesture zooms up to 3x, resets on release
- Zoom interactions don't interfere with swipe navigation
- Double-tap to toggle zoom on/off (mobile)

#### Task 6: Spring Physics Lightbox Transitions
**Files:** `src/components/GalleryLightbox.tsx`
**Description:** Replace the current instant slide transitions with Framer Motion spring-physics horizontal slides. Add `AnimatePresence` with `custom` direction prop. Each slide enters from the swipe direction with spring momentum. Add velocity tracking from touch events to control spring initial velocity.
**Must-haves:**
- Spring slide transitions with velocity passthrough from touch gestures
- Direction-aware enter/exit (left swipe → slide left, right → slide right)
- Smooth keyboard arrow transitions (no abrupt jumps)

#### Task 7: Animated Price Counter
**Files:** `src/components/configurator/ConfigSummary.tsx`, `src/hooks/useAnimatedNumber.ts` (NEW)
**Description:** Create a `useAnimatedNumber` hook that smoothly interpolates between numeric values using spring physics. Apply to the price display in ConfigSummary so price changes (when toggling extras) smoothly roll to the new value. Use `useSpring` from Framer Motion with `stiffness: 100, damping: 20`.
**Must-haves:**
- Price rolls smoothly between values (not instant jump)
- Formatted as TL currency throughout animation
- New `useAnimatedNumber` hook is reusable

#### Task 8: Add-to-Cart Success Animation
**Files:** `src/components/configurator/ConfigSummary.tsx`
**Description:** After adding to cart, show a success flash animation: button scales down slightly (0.95), background flashes green briefly, then a floating "Eklendi ✓" badge animates up and fades out above the button. Use Framer Motion `AnimatePresence` for the badge lifecycle.
**Must-haves:**
- Button press feedback: scale 0.95 → 1.0 spring
- Floating "Eklendi ✓" badge animates opacity 0→1→0 with translateY
- Animation completes in ~1.2s, non-blocking

#### Task 9: Staggered Section Reveals
**Files:** `src/components/ui/StaggeredReveal.tsx` (NEW), update existing sections
**Description:** Create a reusable `StaggeredReveal` component that wraps children with Intersection Observer-triggered stagger animations. Each child fades up with 80ms delay between siblings. Apply to configurator sections, gallery grids, and key homepage sections. Build on top of existing `ScrollReveal.tsx` patterns.
**Must-haves:**
- Children animate with 80ms stagger delay
- Only triggers once (no re-animation on scroll back)
- Respects `prefers-reduced-motion` media query
- Works with both flex and grid layouts

#### Task 10: Button Interaction Polish
**Files:** `src/app/globals.css` or Tailwind config
**Description:** Enhance the global `btn-press` class with richer interaction states. Add `scale(0.97)` on active, gradient shift on hover (subtle lightening), and a micro `box-shadow` transition. Update `btn-red-rich` with a pulsing glow on hover for the primary CTA buttons.
**Must-haves:**
- `btn-press` scale transition feels responsive (< 100ms)
- `btn-red-rich` hover glow is subtle, not distracting
- All interactive buttons have visible focus-visible states
- Works across all existing button instances

### Verification

```yaml
type: build_and_manual
build_command: "npm run build"
manual_checks:
  - Configurator steps animate between sections with spring physics
  - Color swatches show glow and scale feedback
  - Preview image transitions crossfade without flicker
  - Progress bar fills smoothly with glassmorphism effect
  - Gallery images show loupe on desktop hover
  - Gallery pinch-to-zoom works on mobile
  - Lightbox slides use spring transitions
  - Price counter animates between values
  - Add-to-cart shows success animation
  - Section reveals stagger correctly
  - Buttons feel responsive and premium
  - prefers-reduced-motion disables animations
```
