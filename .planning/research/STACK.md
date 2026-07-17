# Stack Research

**Domain:** Brownfield storefront simplification (v1.2 Sade Lüks Deneyim) — Next.js App Router e-commerce UI density/motion reduction
**Researched:** 2026-07-17
**Confidence:** HIGH (keep/remove decisions grounded in `package.json` + live call sites + official Motion/Next/MDN docs); MEDIUM (exact before/after bundle deltas until measured with `experimental-analyze`)

> **Scope:** Additions, removals, techniques, and verification tooling for **frontend simplification only**. Do not re-litigate Next.js / Convex / Tailwind / WhatsApp checkout — those stay. Prior v1.1 AI STACK content is superseded here for dependency decisions; AI packages remain installed but customer UI is gated off.

## Recommended Stack

### Core Technologies (unchanged — do not replace)

| Technology | Version (locked in repo) | Purpose | Why Recommended |
|------------|--------------------------|---------|-----------------|
| Next.js App Router | `16.2.10` | Storefront + admin + API routes | Already production path; App Router + Server Components are the right place to delete sections without new frameworks |
| React / React DOM | `19.2.4` | UI | Keep; no React rewrite |
| Tailwind CSS | `^4` (`@tailwindcss/postcss`) | Design tokens + utility polish | Brand system lives in `globals.css` `@theme` — simplification is **fewer classes/sections**, not a new CSS framework |
| Convex | `^1.42.1` | Catalog/CMS/orders | Out of scope for v1.2 architecture changes; CMS section keys still drive homepage composition |
| TypeScript | `^5` | Types | Keep `npm run typecheck` as a gate |

### Motion & Scroll — what to keep, cut, or demote

| Technology | Version | Decision for v1.2 | Why |
|------------|---------|-------------------|-----|
| **CSS transitions + existing utilities** (`btn-press`, `.reveal` / `.reveal-visible` / `.reveal-sda`, `prefers-reduced-motion` blocks in `globals.css`) | n/a (in-repo) | **Primary motion stack** | Zero JS cost; already wired for reduced-motion and reduced-transparency; matches “few, intentional micro-interactions” |
| **`ScrollReveal`** (`src/components/ScrollReveal.tsx`) | n/a | **Keep for sparse section entrances** | Uses native `animation-timeline: view()` when supported + IntersectionObserver fallback; already short-circuits on `prefers-reduced-motion: reduce` |
| **`framer-motion`** | `^12.42.2` (resolved `12.42.2`) | **Keep dependency; shrink call surface** | Needed for mount/unmount UX (`AnimatePresence`: cart, toasts, lightbox, preview swaps). **Remove or replace** scroll-linked / decorative usage (`useScroll` / `useTransform` in `Hero.tsx`, heavy stagger in configurator/home showcase) with CSS or static layout |
| **`lenis`** | `^1.3.25` (resolved `1.3.25`) | **Remove from default customer chrome** (uninstall after `SmoothScroll` unmount) | Continuous `requestAnimationFrame` loop in `SmoothScroll.tsx` fights “sade” and adds perpetual main-thread work; library is small (~4kb) but **runtime cost ≠ bundle size**. Site already no-ops Lenis under reduced-motion — native scroll is the simplification default |
| **`MotionConfig` / `useReducedMotion` / `LazyMotion`** | same `framer-motion` package | **Optional techniques — no new package** | Official Motion docs: `useReducedMotion` for JS animations; `LazyMotion` + `m` only if many `motion.*` nodes remain after pruning. Prefer **deleting unused motion** over LazyMotion migration mid-milestone |

### AI packages (keep installed; hide customer UI)

| Package | Version | Decision | Why |
|---------|---------|----------|-----|
| `ai`, `@ai-sdk/anthropic`, `@ai-sdk/react` | as in `package.json` | **Keep in codebase** | Milestone requires customer AI UIs hidden, not deleted; admin content generator still uses the same stack |
| Existing gate: `isAiConfigured()` / `AI_FEATURES_ENABLED` in `src/lib/ai/config.ts` | n/a | **Insufficient alone if admin AI must stay on** | Today `AI_FEATURES_ENABLED=false` disables **customer and admin** AI (`/admin/icerik` uses `isAiConfigured()`). Prefer a **customer-only UI gate** (e.g. `CUSTOMER_AI_UI_ENABLED=false` or `isCustomerAiUiEnabled()`) that skips mounting `ConfiguratorChat`, `VehicleMatchInput`, `SupportChat` while leaving API + admin paths intact |

### Supporting Libraries (no change required)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` + `tailwind-merge` | existing | Conditional class composition | Continue for simplified components |
| `lucide-react` | existing | Icons | Prefer fewer icons over a new icon set |
| `zod` | existing | Validation / AI schemas | Unrelated to UI simplification |
| `@vercel/analytics` | existing | Analytics | Unchanged |

### Development / Verification Tools (prefer zero new deps)

| Tool | Purpose | Notes |
|------|---------|-------|
| **`npx next experimental-analyze`** | Client/server bundle graph (Turbopack) | Built into Next.js **≥16.1** (repo is `16.2.10`). Use `--output` → `.next/diagnostics/analyze` for before/after diffs. **Do not add `@next/bundle-analyzer` unless analyzing a Webpack-only path** |
| **Chrome DevTools Performance + Performance insights** | Main-thread / scroll jank after Lenis removal and motion cuts | Profile homepage + `/olusturucu` + checkout with CPU 4× throttle |
| **Chrome Lighthouse** (Performance + Accessibility) | CWV sanity + reduced-motion spot checks | No npm package |
| **React DevTools Profiler** | Unnecessary re-renders after pruning Framer trees | Browser extension; no dependency |
| **`npm run lint` / `npm run typecheck`** | Regressions | Existing gates |
| **Playwright** (`@playwright/test`, `npm run test:e2e`) | Flow regression after shortening cart/checkout/configurator | Already present (`tests/configurator.spec.ts`, `tests/gallery.spec.ts`); extend for “AI UI not visible” and critical path length |
| **Vitest** | Unit tests for new UI feature flags | Extend `src/lib/ai/config.test.ts` pattern — do not add another test runner |
| **`prefers-reduced-motion` emulation** | A11y contract | DevTools Rendering → Emulate CSS media feature, or Playwright `emulateMedia({ reducedMotion: 'reduce' })` |

## Installation

```bash
# Default for v1.2: install nothing new.

# After SmoothScroll is removed from SiteChrome and no imports remain:
npm uninstall lenis

# Only if LazyMotion migration is chosen AND many motion.* remain after pruning
# (same package — no install): refactor imports from "framer-motion" to LazyMotion + m
# per https://motion.dev/docs/react-reduce-bundle-size

# Optional verification script (package.json) — uses built-in Next CLI, no new dep:
# "analyze": "next experimental-analyze"
# "analyze:out": "next experimental-analyze --output"
```

**Env (customer AI hide — keep code):**

```bash
# Preferred (admin AI can stay on): implement customer-only gate reading e.g.
# CUSTOMER_AI_UI_ENABLED=false

# Nuclear (hides admin AI too — only if acceptable):
# AI_FEATURES_ENABLED=false
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Native scroll (remove Lenis) | Keep Lenis with softer `lerp` | Only if brand review insists smooth scroll is non-negotiable *after* seeing native scroll on OLED black UI |
| CSS + sparse `ScrollReveal` | GSAP / ScrollTrigger / locomotive-scroll | Never for this milestone — more complexity than the problem |
| Prune `framer-motion` usage | Replace with `motion` package rename / full rewrite | Skip; `framer-motion` v12 already is Motion for React — renaming is churn without simplification ROI |
| `next experimental-analyze` | `@next/bundle-analyzer` | Only if you must analyze a Webpack build path; Turbopack analyzer is first-line for this Next version |
| Customer UI env gate | Delete AI components from tree | Violates “keep in code”; use conditional mount instead |
| CSS `transition` for hover/press | Framer for every button | Framer for exit animations / shared layout only |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **New animation libraries** (GSAP, Lottie, Rive, Three.js, `@react-three/*`) | Opposite of simplification; large bundles and new a11y surface | Existing CSS utilities + pruned Framer |
| **New UI kits** (shadcn bulk import, MUI, Chakra) | Fights OLED/Racing Red design system in `globals.css` | Edit existing components |
| **`@next/bundle-analyzer` by default** | Extra dep; Next 16.2 already ships `experimental-analyze` | `npx next experimental-analyze` |
| **Feature-flag SaaS** (LaunchDarkly, Flagsmith, etc.) | Overkill for hiding AI widgets | Env + `isCustomerAiUiEnabled()` |
| **`AI_FEATURES_ENABLED=false` as the only hide mechanism** | Also kills admin content generator | Split customer UI flag from global kill switch |
| **Adding `LazyMotion` before deleting dead motion** | Migrating 14+ files while still running parallax/stagger wastes the milestone | Delete first; LazyMotion only if bundle still shows Framer as a top client chunk |
| **`allowNestedScroll` on Lenis** (if Lenis temporarily kept) | Official Lenis docs: DOM walk every scroll → perf risk | Prefer removal; if kept, use `data-lenis-prevent` / `prevent` callback |
| **Global `* { animation: none !important }`** | MDN: `prefers-reduced-motion: reduce` means minimize non-essential motion, not necessarily nuke essential feedback | Existing scoped `@media (prefers-reduced-motion: reduce)` patterns in `globals.css` |
| **New state managers / CSS-in-JS** | Out of scope | Current React state + cart store |

## Stack Patterns by Variant

**If the goal is maximum calm + fewer main-thread tasks (default v1.2):**
- Unmount `SmoothScroll` from `SiteChrome.tsx`; uninstall `lenis` when unused
- Strip Hero `useScroll` / `useTransform` parallax; keep static hero composition
- Prefer `.reveal` / `ScrollReveal` over Framer stagger for product grids
- Gate customer AI mounts; leave `src/app/api/ai/*` and admin generator in place
- Because: simplification ROI is **runtime + cognitive load**, not new packages

**If brand review requires keeping “silky scroll”:**
- Keep `lenis` but leave reduced-motion early-return; do not add nested-scroll auto-detect
- Still remove Framer scroll-linked effects (Lenis + scroll-driven Framer compounds jank)
- Because: Lenis alone is cheaper than Lenis + parallax trees

**If after pruning, Framer is still a top client module in `experimental-analyze`:**
- Introduce root `LazyMotion` with `domAnimation` (not `domMax` unless layout animations remain)
- Switch remaining components to `m` + `strict`
- Because: official Motion guidance for ~34kb → ~4.6kb initial path — only worth it if call sites remain

**If admin AI must stay visible while customer AI is hidden:**
- Add `isCustomerAiUiEnabled()` separate from `isAiFeaturesEnabled()` / `isAiConfigured()`
- Mount gates: `olusturucu/page.tsx` (`ConfiguratorChat`, `aiEnabled` → `VehicleMatchInput`), `destek/page.tsx` (`SupportChat`)
- Because: single kill switch is too coarse for this milestone

## Implementation Techniques (no new dependencies)

1. **Section deletion over CSS hide** — remove unused homepage/CMS-driven sections from `src/app/page.tsx` composition; soft-hide via CSS still ships DOM/JS.
2. **Server Components stay default** — keep interactive islands small; avoid wrapping whole pages in `"use client"` for leftover motion.
3. **`next/dynamic` only for rare heavy islands** — after prune; not a substitute for deleting dead UI.
4. **GPU cost:** reduce stacked `backdrop-filter` / `mac-glass` on long pages; preserve `prefers-reduced-transparency` fallbacks already in `globals.css`.
5. **Configurator / cart / checkout shortening** — step consolidation and copy reduction in existing React trees; no new form library.
6. **A11y contract:** any remaining Framer animation must respect reduced motion (`useReducedMotion` or skip animate props); CSS already handles utility classes.

## Integration Points

| Seam | File(s) | Change |
|------|---------|--------|
| Smooth scroll | `src/components/SiteChrome.tsx`, `src/components/SmoothScroll.tsx`, `globals.css` `.lenis*` | Remove mount; delete or dead-code component; prune Lenis CSS if unused |
| Hero motion | `src/components/home/Hero.tsx` | Drop `useScroll`/`useTransform`; simplify to CSS/`motion` entrance only or static |
| Scroll reveal | `FeaturedProducts` + `ScrollReveal` | Keep sparse; avoid per-card Framer |
| Configurator motion | `MatConfigurator`, `StaggeredReveal`, `ColorPicker`, `FlatMatPreview`, `ConfigSummary` | Keep exit/selection feedback; remove stagger theater |
| Cart / toast | `CartDrawer`, `NetworkToast` | Keep `AnimatePresence` if useful; shorten flow UX in components, not new libs |
| Customer AI hide | `olusturucu/page.tsx`, `VehicleSelector.tsx`, `destek/page.tsx`, `src/lib/ai/config.ts` | Conditional mount via customer UI flag |
| Verification | `package.json` scripts, Playwright `tests/*` | Optional `analyze` script; e2e asserts AI chrome absent + happy path |

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@16.2.10` | `experimental-analyze` | Available since Next **16.1.0**; no extra install |
| `framer-motion@12.x` | `react@19.2.x` | Current pairing in repo; LazyMotion APIs documented under motion.dev for this generation |
| `lenis@1.3.x` | React 19 via `useEffect` wrapper | Removal has no React version coupling |
| `ai` / `@ai-sdk/*` | Existing route handlers | Unchanged by UI hide; do not downgrade for this milestone |

## Verification Checklist (milestone gate)

1. Baseline: `npx next experimental-analyze --output` → archive `.next/diagnostics/analyze`
2. After Lenis + motion prune: re-run analyze; confirm `lenis` gone from client graph; Framer smaller or isolated to interactive routes
3. Chrome Performance: homepage scroll — no perpetual Lenis RAF; no long tasks from stagger
4. Emulate `prefers-reduced-motion: reduce` — no parallax/entrance theater; essential UI still usable (MDN guidance)
5. Emulate `prefers-reduced-transparency: reduce` — glass surfaces fall back opaque (existing CSS)
6. Playwright: configurator → cart → checkout WhatsApp path still works; customer AI widgets not in DOM when flag off
7. `npm run lint` && `npm run typecheck`

## Sources

- [Next.js Package Bundling / `experimental-analyze`](https://nextjs.org/docs/app/guides/package-bundling) — Turbopack analyzer, `--output` — confidence MEDIUM (websearch verified)
- [Next.js 16.1 blog — Bundle Analyzer](https://nextjs.org/blog/next-16-1) — shipped experimental analyzer — confidence MEDIUM
- [Motion: Reduce bundle size / LazyMotion](https://motion.dev/docs/react-reduce-bundle-size) — official — confidence HIGH (primary docs)
- [Motion: `useReducedMotion`](https://motion.dev/docs/react-use-reduced-motion) — official — confidence HIGH
- [MDN: Using media queries for accessibility (`prefers-reduced-motion`)](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries_for_accessibility) — confidence HIGH
- [Lenis README / npm](https://www.npmjs.com/package/lenis) — `destroy()`, nested-scroll perf warning — confidence MEDIUM
- Repo evidence: `package.json`, `SiteChrome.tsx`, `SmoothScroll.tsx`, `ScrollReveal.tsx`, `src/lib/ai/config.ts`, Framer import sites under `src/components/**` — confidence HIGH

---
*Stack research for: Otopolik v1.2 Sade Lüks Deneyim (storefront simplification)*
*Researched: 2026-07-17*
