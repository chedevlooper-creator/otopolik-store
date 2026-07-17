# Phase 2 Plan: Hero & 3D Integration

## Phase Goal
Enhance the homepage Hero section with a luxury "Porsche/Apple-like" feel, introducing scroll-linked scaling, mouse-parallax 3D car effects, and custom text entrances using Framer Motion.

## Assumptions
- Uses `/media/car-icon-3d.png` as the primary floating 3D asset in the Hero section.
- Framer Motion is fully functional and set up in Phase 1.

## Step-by-Step Implementation

1. **Refactor Hero.tsx**:
   - Wrap Hero components in Framer Motion wrappers.
   - Implement `useScroll` and `useTransform` hooks to bind video background scale and opacity to scroll coordinates.
   - Add a floating 3D car card on the right layout column (desktop) or overlay (mobile) that shifts with mouse hover coordinates.
   - Implement staggered entrances for "OTOPOLİK" brand text, the laser SVG line, headers, and CTA buttons.

2. **Refine HeroMedia.tsx**:
   - Allow external container transforms by forwarding refs or accepting styling classes.
   - Introduce a subtle glowing red ambient backlighting around the media canvas.

3. **CSS Cleanups**:
   - Clean up legacy, unused CSS animations from `globals.css` that might clash with Framer Motion.

## Verification
- Staggered entrances animate fluidly on page load.
- Mouse movement triggers 3D tilts on the car showcase card.
- Scrolling down causes the Hero background to scale down and fade gracefully.
- Next.js production build completes with no issues.
