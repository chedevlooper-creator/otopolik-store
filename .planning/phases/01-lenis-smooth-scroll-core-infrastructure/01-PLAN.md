# Phase 1 Plan: Lenis Smooth Scroll & Core Infrastructure

## Phase Goal
Implement global Lenis smooth scrolling and update base layouts for animation readiness to establish an "Apple / Porsche" luxury aesthetic.

## Assumptions
- Lenis is already installed but needs to be fortified (modal interactions, GSAP/Framer hooks).
- The user is open to installing `framer-motion` for complex scroll-linked animations.

## Step-by-Step Implementation

1. **Install Framer Motion**:
   - `npm install framer-motion`
   - Install `clsx` and `tailwind-merge` to handle dynamic class merging seamlessly.

2. **Refine SmoothScroll.tsx**:
   - Ensure the Lenis instance properly halts when modally locked (e.g. `data-lenis-prevent`).

3. **Create `FadeIn` & Animation Primitives**:
   - Create `src/components/ui/FadeIn.tsx` using `framer-motion` to wrap page sections so they lazily fade in as the user scrolls down, emphasizing the luxury feel.

4. **Audit Overlays**:
   - Inspect `CartDrawer.tsx` and `SearchModal.tsx` to add `data-lenis-prevent` to scrollable containers within modals to avoid nested scroll jank.

## Verification
- Scroll behaves fluidly with no jitter.
- The dev server (`npm run dev`) builds correctly.
- Opening a modal completely stops the background from scrolling.
