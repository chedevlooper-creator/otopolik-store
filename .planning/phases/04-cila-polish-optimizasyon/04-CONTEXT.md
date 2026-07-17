# Phase 4: Cila (Polish) & Optimizasyon - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning

<domain>
## Phase Boundary

Optimize image loading, apply rigorous cross-device audits, and finalize the "Ölen Kalite" UX polish. This covers adding dark shimmer image placeholders, tuning image loading priority, auditing responsiveness sizes, enforcing iOS HIG-compliant touch targets (min 44x44px), styling custom elegant dark scrollbars, disabling sticky hover effects on touch devices, and adding network/image error fallbacks.

</domain>

<decisions>
## Implementation Decisions

### Image Optimization & Placeholders
- CSS-based SVG data URL representing a dark luxury shimmer placeholder is used for image placeholders.
- Add `priority` flags to LCP-critical images: Hero background/car, logo, and initial configurator images.
- Audit and add missing `sizes` attribute values across the codebase to ensure mobile-friendly image size downloads.

### UX & Performance Polish
- Ensure all configurator buttons, color swatches, and links have touch target dimensions of at least 44x44px.
- Implement elegant, custom slim dark scrollbars (`::-webkit-scrollbar` with a subtle white/10 thumb) to replace default browser scrollbars.
- Exclude hover effects on mobile/touch screens using the `@media (hover: hover)` media query to avoid sticky hover states.

### Error States & Fallbacks
- Render a premium dark gradient fallback with a central logo icon for broken/failed image loads.
- Display a subtle top bar toast/notification when connectivity drops ("Bağlantı kesildi").

### Agent's Discretion
- Shimmer anim speed and SVG markup structure.
- Selector targets for mobile hover exclusion styling.
- Placement and duration of network loss notification.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/Logo.tsx` — current brand logo component.
- `src/components/configurator/ColorPicker.tsx` — custom button grid.
- `src/components/home/Hero.tsx` — above-the-fold hero image.
- `src/app/globals.css` — global stylesheet for inject scrollbars and media queries.

### Established Patterns
- Next.js `<Image>` component used for image rendering.
- Tailwind CSS v4 colors and utility tags.
- Dark theme styling with high contrast borders (`border-white/10`, `bg-surface`, etc.).

</code_context>

<specifics>
## Specific Ideas

No custom specifications — standard visual polish following Apple/Porsche product showcases.

</specifics>

<deferred>
## Deferred Ideas

None.

</deferred>
