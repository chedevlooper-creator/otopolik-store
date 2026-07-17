# Phase 3: Configurator & Gallery Lüks Etkileşimler - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Upgrade the configurator form interactions, product gallery zoom effects, and global micro-animations to Apple/Porsche luxury standards. This phase covers the MatConfigurator step transitions, ColorPicker feedback, ProductGallery/GalleryLightbox zoom and slide behavior, and cross-cutting animation patterns (buttons, section reveals, price counters, add-to-cart confirmation).

</domain>

<decisions>
## Implementation Decisions

### Configurator Form Interactions
- Step transitions use spring-based slide with fade (Framer Motion, matching existing spring usage in ColorPicker)
- Color swatch selection gets enlarge glow pulse + haptic-style scale (extends current `whileHover` / `whileTap`)
- Preview image swaps use crossfade with subtle zoom-in (0.97→1.0) — Apple product page style
- Step progress bar upgraded to animated fill bar with glassmorphism (gradient fill + `backdrop-blur`)

### Product Gallery & Lightbox Zoom Effects
- Gallery images get pinch-to-zoom (mobile) + cursor-follow loupe (desktop) — Apple product gallery style
- Lightbox slides use horizontal spring-physics with velocity/momentum via Framer Motion
- Thumbnail strip upgraded with horizontal drag scroll, snap scrolling, and animated active indicator underline
- Image loading uses skeleton shimmer + progressive blur-up (LQIP → full resolution)

### Micro-Animations & Premium Polish
- Buttons get scale press (0.97) + gradient shift on hover — extends existing `btn-press` class
- Section reveals use staggered fade-up with 80ms delay between children (builds on FadeIn.tsx/ScrollReveal.tsx)
- Price/total displays use counting number animation with spring easing (smooth roll to new value)
- Add-to-cart shows success flash + floating "Added ✓" badge animation (scale-up → scale-down spring)

### Agent's Discretion
- Exact spring stiffness/damping values tuned during implementation
- Pinch-to-zoom gesture library choice (native touch events vs. use-gesture)
- LQIP placeholder generation approach

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/configurator/ColorPicker.tsx` — already uses Framer Motion `motion.button` with `whileHover`, `whileTap`, `layoutId` animations
- `src/components/ui/FadeIn.tsx` — existing fade-in animation wrapper
- `src/components/ScrollReveal.tsx` — existing scroll-triggered reveal component
- `src/components/GalleryLightbox.tsx` — full lightbox with swipe, keyboard nav, video support
- `src/components/ProductGallery.tsx` — complete product gallery with fullscreen, swipe, variant context
- `src/components/configurator/ConfigSummary.tsx` — sticky summary bar with price display
- `src/components/configurator/ExtrasSelector.tsx` — toggle cards with gradient backgrounds

### Established Patterns
- Framer Motion is the primary animation library (spring physics, layout animations)
- Tailwind CSS v4 for styling with custom design tokens (bg-surface, text-muted, border-border, etc.)
- Dark luxury theme: black/charcoal backgrounds, white text, red accents
- `btn-press` and `btn-red-rich` CSS classes for button interactions
- `spec-value` CSS class for monospaced/spec typography
- Touch gesture handling via native touch events (touchStart/Move/End refs)

### Integration Points
- MatConfigurator.tsx is the main configurator page component — all sub-components mount here
- GalleryLightbox is shared between configurator sidebar gallery and standalone gallery page
- SmoothScroll.tsx wraps the entire app with Lenis
- Image optimization via Next.js `<Image>` component throughout

</code_context>

<specifics>
## Specific Ideas

No specific requirements — user accepted all recommended approaches. Apple product page style interactions are the guiding reference for all animation decisions.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>
