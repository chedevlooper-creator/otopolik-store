# Project Research Summary

**Project:** Otopolik — v1.2 Sade Lüks Deneyim
**Domain:** Brownfield premium-minimal EVA mat storefront simplification
**Researched:** 2026-07-17
**Confidence:** HIGH

## Executive Summary

OTO POLİK is an established Next.js App Router and Convex storefront whose conversion spine is vehicle configuration, cart, and a WhatsApp-confirmed order. v1.2 should simplify that customer journey without rebuilding its backend or diluting its OLED-black/Racing Red identity. The expert pattern is deletion-first editorial restraint: one dominant CTA, fewer homepage jobs, compressed decisions, quiet trust near purchase, and sparse micro-interactions.

Keep the existing Next.js, React, Tailwind, Convex, CMS fallback, pricing, cart, and WhatsApp contracts. Add no dependencies. Hide customer AI through a dedicated storefront UI flag while retaining AI implementations, admin generation, evals, and the existing server-side AI kill switch. Preserve Lenis cautiously for this milestone rather than making removal a roadmap prerequisite: first remove scroll-linked parallax and decorative stagger, retain reduced-motion safeguards, then remove Lenis only if measured scroll/modal QA proves native scrolling is an improvement.

The largest risks are breaking synchronous WhatsApp popup timing, creating ghost CMS sections or dead navigation, disabling admin AI with a global flag, over-deleting trust/SEO content, and removing mobile purchase affordances. Phase work around stable composition and commerce boundaries, then finish with mobile, accessibility, SEO, admin, and conversion-path verification.

## Key Findings

### Recommended Stack

The stack remains deliberately unchanged. Simplification is achieved by mounting less UI and reducing animation call sites, not by replacing frameworks or adding optimization packages.

**Core technologies:**
- **Next.js 16.2.10 + React 19.2.4:** Retain Server Components and small client islands; delete at composition boundaries.
- **Tailwind CSS v4 + existing `globals.css`:** Preserve OLED black, Racing Red, typography, and scoped `.premium-site` utilities while reducing effect density.
- **Convex 1.42.1:** Keep CMS, catalog, settings, and orders untouched with static fallbacks intact.
- **TypeScript 5:** Keep strict typing, lint, typecheck, and existing Playwright/Vitest verification.
- **Framer Motion 12.42.2:** Retain for purposeful mount/unmount and interaction feedback; prune parallax, stagger theater, and decorative scroll effects.
- **Lenis 1.3.25:** Preserve cautiously in v1.2 with its reduced-motion early return. Reassess removal only after motion pruning and measured native-scroll, drawer, modal, and brand QA.
- **AI SDK packages:** Keep installed because admin AI and preserved code still use them.

**Explicit resolution — Lenis:** STACK recommends removing Lenis from default customer chrome, while ARCHITECTURE and PITFALLS warn that abrupt removal can alter brand feel and break scroll/overflow assumptions. Approved scope emphasizes simplification while preserving premium identity, not dependency churn. Therefore v1.2 should first reduce effects around Lenis, profile the result, and treat uninstalling it as a conditional optimization rather than a required phase deliverable. No new motion library or analyzer dependency should be added.

### Expected Features

**Must have (table stakes):**
- One clear first-viewport action leading to configuration.
- Intact configurator → cart → checkout → WhatsApp flow.
- Core vehicle, floor/edge color, extras, live preview, and `mat-pricing.ts` pricing.
- Lean checkout fields required for fulfillment, with synchronous WhatsApp opening.
- Mobile-reachable price and purchase CTA.
- One concise trust/FAQ surface and accurate SEO/structured data.
- OLED-black/Racing Red identity and reduced-motion support.
- Customer AI absent from header, footer, configurator, and support chrome while code and admin AI remain.

**Should have (differentiators):**
- A strict homepage section budget with one job per section.
- Configurator compressed to at most three decision surfaces, merging color choices and demoting extras without removing them.
- Quiet cart and checkout chrome with trust adjacent to the CTA.
- A reduced navigation spine: Tasarla, Ürünler, Galeri, İletişim, and Sepet.
- Sparse micro-interactions such as button press, step feedback, and cart confirmation.

**Defer (v1.2.x or v2+):**
- Customer AI re-enablement until the manual path is validated.
- Homepage A/B testing until traffic supports it.
- Payment gateway, AR/3D configurator expansion, concierge booking, autoplay media, new animation systems, and new UI kits.

**Explicit resolution — AI flags:** A customer UI flag and the server kill switch solve different problems. `CUSTOMER_AI_UI_ENABLED=false` controls storefront composition and must default off for v1.2 without affecting admin AI. Existing server checks using `AI_FEATURES_ENABLED`, configuration, and rate limiting remain mandatory defense-in-depth. Do not use the global kill switch as the only customer-hide mechanism because it also disables approved admin AI; do not interpret the UI flag as authorization or cost protection.

### Architecture Approach

Make presentation-only changes at existing boundaries. Server pages continue fetching CMS/catalog/settings and mount fewer trees; customer AI mount points read a small server-side storefront flag; commerce handlers and stores remain unchanged. Admin stays outside `.premium-site`, and Convex schema/functions, CMS fallback pairs, pricing logic, cart hydration, AI APIs/libs, and admin auth remain intact.

**Major components:**
1. **Homepage composition (`src/app/page.tsx`):** Inventory section keys, keep CMS rows reversible, mount only sections with distinct jobs.
2. **Customer chrome (`SiteChrome`, Header, Footer):** Reduce navigation, remove customer AI entries and dead anchors, preserve admin bypass and cart provider contracts.
3. **Motion layer (`Hero`, `ScrollReveal`, Framer, Lenis):** Keep a small allowlist of useful feedback, remove scroll-linked spectacle, preserve accessibility fallbacks.
4. **Configurator and pricing:** Compress presentation while preserving provider state, URL prefill, live preview, `calculateMatPrice`, extras, and add-to-cart behavior.
5. **Cart and checkout:** Simplify layout only; retain `useSyncExternalStore` hydration and synchronous `window.open` before asynchronous persistence.
6. **AI boundary:** Customer UI gate off; implementations, API routes, server kill switch/rate limits, evals, and admin AI remain.

### Critical Pitfalls

1. **CMS ghost content or lost copy** — Create a section-key matrix and unmount/unpublish reversibly; do not delete seed or Convex rows during initial simplification.
2. **Conversion gravity shifts to the wrong CTA** — Lock one primary action per viewport and smoke-test home → configurator → cart → checkout after each composition cut.
3. **WhatsApp popup is blocked** — Never place an `await` before the synchronous `window.open` shell in checkout.
4. **Customer AI is visually hidden but operationally confused** — Separate the UI flag from the server kill switch, remove all customer entry points, retain API guards, and smoke-test admin AI.
5. **Motion reduction breaks brand or accessibility** — Use an explicit motion allowlist, retain reduced-motion behavior, and verify no reveal content remains invisible.
6. **Configurator shortening breaks price or mobile completion** — Keep `mat-pricing.ts` as the only source and retain an always-reachable mobile price/CTA.
7. **SEO/trust is over-deleted** — Keep visible FAQ or equivalent proof, maintain JSON-LD parity, and preserve `/arac/[slug]` and product routes.
8. **Customer styling leaks into admin** — Scope work to `.premium-site` and smoke-test admin, cart hydration, consent, drawers, and modals.

## Implications for Roadmap

Based on the combined research, use five deletion-first phases.

### Phase 1: Storefront Boundaries and Content Inventory
**Rationale:** Establish reversible controls before deleting visual trees and prevent CMS/nav/AI drift.
**Delivers:** Homepage section-key matrix; approved keep/unmount list; dedicated customer AI UI flag defaulting off; customer AI entry points removed; `/destek` resolved to a non-AI WhatsApp/contact fallback; surviving nav anchors and FAQ/schema policy documented.
**Addresses:** AI invisibility, nav accuracy, homepage section budget, one primary CTA.
**Avoids:** Ghost CMS content, dead links, admin AI shutdown, and invisible-but-live customer UI imports.

### Phase 2: Homepage and Motion Diet
**Rationale:** Calm the highest-traffic surface after its content and flag boundaries are known, without touching the money path.
**Delivers:** Disciplined hero; fewer distinct homepage sections; reduced glass/glow/stagger/parallax; a small motion allowlist; preserved OLED/red identity and reduced-motion behavior.
**Uses:** Existing CSS utilities, sparse `ScrollReveal`, focused Framer interactions, and cautiously retained Lenis.
**Avoids:** Generic flat appearance, stuck reveal opacity, new dependencies, and abrupt scroll-system regressions.

### Phase 3: Configurator and Product Simplification
**Rationale:** Shorten the main decision path while isolating pricing and cart invariants from layout work.
**Delivers:** At most three configurator decision surfaces; combined floor/edge color selection; optional extras disclosure; live preview; sticky mobile price/CTA; tightened product listing/detail chrome.
**Addresses:** Faster configuration, mobile completion, product clarity.
**Avoids:** Dual price sources, lost extras, broken URL prefill, duplicate configurators, and inaccessible add-to-cart controls.

### Phase 4: Cart, Checkout, and WhatsApp Commit Flow
**Rationale:** Simplify the highest-risk conversion surface only after upstream item configuration is stable.
**Delivers:** Quiet cart and single-page checkout; required fulfillment fields; clear order summary; WhatsApp-native submit; one nearby trust/support path.
**Addresses:** Short checkout and calm commitment-stage UX.
**Avoids:** Await-before-popup regressions, hydration mismatch, promotional distraction, disabled payment theater, and missing fulfillment data.

### Phase 5: Cross-Surface Verification and Conditional Cleanup
**Rationale:** Deletion redistributes attention and can create failures that component-level checks miss.
**Delivers:** Mobile critical-path checks; popup-blocker test; AI UI-off and server-guard checks; admin AI/admin chrome smoke tests; FAQ/schema and vehicle SEO checks; reduced-motion/transparency checks; cart refresh; lint, typecheck, and existing E2E tests; performance/bundle comparison.
**Addresses:** Observable v1.2 outcomes and release confidence.
**Avoids:** Silent conversion, SEO, accessibility, admin, and performance regressions.
**Conditional decision:** After motion pruning, compare Lenis and native scrolling on homepage/configurator with drawers and modals. Unmount and uninstall Lenis only if evidence shows a clear net improvement; otherwise keep it as the sole smooth-scroll layer.

### Phase Ordering Rationale

- Content and feature boundaries come first because every later deletion depends on knowing which CMS keys, links, and AI surfaces remain live.
- Homepage/motion work precedes commerce to establish the visual language without risking checkout.
- Configurator precedes cart/checkout because downstream summaries depend on stable configured items and prices.
- Verification is a dedicated phase because attention shifts, popup blocking, mobile stickiness, SEO parity, and admin isolation are cross-surface behaviors.
- No phase adds dependencies or changes Convex/backend architecture.

### Research Flags

Phases likely needing targeted research during planning:
- **Phase 1:** Decide the exact homepage keep list and `/destek` redirect versus static WhatsApp/contact fallback; validate CMS admin visibility consequences.
- **Phase 3:** Confirm the exact step-compression interaction and mobile sticky behavior through a UI specification.
- **Phase 4:** Research only if considering removal of fields with legal, KVKK, or fulfillment implications.

Phases with standard patterns (skip broad research-phase):
- **Phase 2:** Existing design system, motion utilities, and accessibility patterns are documented; use a focused UI pass.
- **Phase 5:** Existing Playwright, Vitest, lint, typecheck, browser profiling, and Next analyzer provide the needed verification.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions and call sites are verified in the repository; exact performance deltas remain measurable, not speculative. |
| Features | MEDIUM | Luxury commerce patterns agree, but OTO POLİK lacks store-specific A/B and funnel data. |
| Architecture | HIGH | Composition, CMS fallback, cart hydration, WhatsApp, admin, and AI boundaries are grounded in live code. |
| Pitfalls | MEDIUM-HIGH | Project-specific invariants are authoritative; broader CRO effects require post-release observation. |

**Overall confidence:** HIGH for roadmap structure and technical boundaries; MEDIUM for exact visual cuts and conversion impact.

### Gaps to Address

- **Homepage keep list:** Resolve with a section-key matrix and UI review before implementation.
- **Primary CTA hierarchy:** Confirm whether Tasarla is always primary and WhatsApp remains secondary until checkout.
- **`/destek` behavior:** Choose redirect or static non-AI fallback; avoid 404 and chat mount.
- **Lenis outcome:** Settle only through paired brand/performance/interaction QA after decorative motion is removed.
- **Field reduction:** Validate fulfillment and KVKK requirements before deleting checkout inputs.
- **Conversion baseline:** Capture configure starts, checkout starts, and WhatsApp handoffs where analytics permit; avoid claiming uplift from aesthetics alone.

## Sources

### Primary (HIGH confidence)
- `.planning/PROJECT.md` — approved v1.2 scope, preserved commerce/brand contracts, and AI requirements.
- Repository contracts cited by the research: `src/app/page.tsx`, `src/components/SiteChrome.tsx`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/SmoothScroll.tsx`, `src/components/ScrollReveal.tsx`, `src/components/configurator/*`, `src/context/cart-context.tsx`, `src/lib/cart-store.ts`, `src/lib/mat-pricing.ts`, `src/lib/ai/config.ts`, `src/app/api/ai/*`, `src/app/odeme/CheckoutPageClient.tsx`, `src/lib/cms.ts`, and `convex/cmsSeedData.ts`.
- [Next.js package bundling and `experimental-analyze`](https://nextjs.org/docs/app/guides/package-bundling) — built-in bundle analysis.
- [Motion reduce bundle size](https://motion.dev/docs/react-reduce-bundle-size) and [`useReducedMotion`](https://motion.dev/docs/react-use-reduced-motion) — pruning and accessibility guidance.
- [MDN accessibility media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries_for_accessibility) and [`window.open`](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) — reduced motion and popup behavior.

### Secondary (MEDIUM confidence)
- Luxury ecommerce UX/CRO research cited in FEATURES.md — controlled clarity, short navigation, and restraint over visual spectacle.
- Baymard checkout summaries — reduce friction and fields without removing fulfillment requirements.
- Configurator UX patterns cited in FEATURES.md — progressive disclosure, live preview, and always-visible price/CTA.
- Feature-flag guidance cited in ARCHITECTURE.md — server-evaluated render flags and separation of visibility from capability controls.
- Redesign, sticky CTA, FAQ/SEO, and feature-flag sources catalogued in PITFALLS.md — directional validation for project-specific risks.

### Tertiary (LOW confidence)
- Generic industry abandonment averages and store-external sticky CTA uplifts — context only; do not treat as OTO POLİK forecasts.

---
*Research completed: 2026-07-17*
*Ready for roadmap: yes*
