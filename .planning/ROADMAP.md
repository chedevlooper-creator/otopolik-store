# Roadmap: Otopolik - Ultra Luxury Reimagined

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (Shipped 2026-07-17) — [archive](milestones/1.0-ROADMAP.md)
- ✅ **v1.1 AI Destekli Lüks Deneyim** — Phases 5-8 (Shipped 2026-07-17) — [archive](milestones/1.1-ROADMAP.md)
- 🚧 **v1.2 Sade Lüks Deneyim** — Phases 9-13 (In progress)

## Overview

v1.2 simplifies the customer storefront into a calm luxury path: establish reversible content/AI/nav boundaries, diet the homepage and motion, compress configurator and product chrome, quiet cart/checkout while preserving WhatsApp commit timing, then verify the full conversion spine. Brand (OLED black / Racing Red), WhatsApp ordering, configurator core, and Convex backend stay intact; customer AI is hidden via a dedicated UI flag; no new dependencies.

## Phases

- [x] **Phase 9: Storefront Boundaries and Content Inventory** - Customer AI UI flag, nav spine, `/destek` fallback, homepage section matrix
- [x] **Phase 10: Homepage and Motion Diet** - Fewer homepage jobs, disciplined hero, motion allowlist, brand + trust surfaces
- [ ] **Phase 11: Configurator and Product Simplification** - ≤3 decision surfaces, mobile CTA, lean product chrome, single price source
- [ ] **Phase 12: Cart, Checkout, and WhatsApp Commit Flow** - Calm cart/checkout, sync WhatsApp open, no credit-card theater
- [ ] **Phase 13: Cross-Surface Verification and Conditional Cleanup** - Critical-path QA, a11y, admin AI smoke, lint/typecheck, Lenis decision

## Phase Details

### Phase 9: Storefront Boundaries and Content Inventory

**Goal**: Storefront composition boundaries are locked so later deletion cannot resurrect customer AI, dead nav, or ghost CMS mounts
**Depends on**: Nothing (first phase of v1.2; builds on shipped v1.1)
**Requirements**: BOUND-01, BOUND-02, BOUND-03, BOUND-04
**Success Criteria** (what must be TRUE):

  1. Customer AI UI is controlled by a dedicated storefront flag that defaults off without turning off admin AI or AI API routes
  2. With the flag off, header, footer, configurator, and support chrome show no AI/Destek entry points
  3. Visiting `/destek` shows a non-AI WhatsApp/contact fallback with no chat UI
  4. Primary customer navigation is limited to essential destinations (Tasarla, Ürünler, Galeri, İletişim, Sepet) with no dead anchors

**Plans**: 2/2 plans executed
Plans:

- [x] 09-01-PLAN.md — Customer AI UI flag + homepage CMS inventory artifact
- [x] 09-02-PLAN.md — Nav spine, Footer cleanup, /destek WhatsApp fallback, configurator AI gate

**UI hint**: yes

### Phase 10: Homepage and Motion Diet

**Goal**: The homepage reads as one calm luxury composition with purposeful motion and intact brand/trust signals
**Depends on**: Phase 9
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, BRAND-01, TRUST-01, TRUST-02
**Success Criteria** (what must be TRUE):

  1. Homepage mounts only sections with a distinct job; duplicate/redundant marketing sections are unmounted while CMS rows remain for reversibility
  2. First viewport communicates brand, one headline, one short supporting line, and one primary CTA to configure
  3. Decorative parallax, dense stagger, and glow spectacle are gone or heavily reduced; retained motion is a small allowlist that respects `prefers-reduced-motion`
  4. Customer surfaces still show OLED black, Racing Red, and existing premium typography
  5. At least one concise trust/FAQ or shipping/proof surface remains near the purchase path, consistent with structured data/SEO where applicable

**Plans**: 1/1 plan executed
Plans:

- [x] 10-PLAN.md — Homepage composition, hero motion diet, brand and trust preservation
**UI hint**: yes

### Phase 11: Configurator and Product Simplification

**Goal**: Customers complete mat configuration and understand products with fewer decisions and reachable purchase actions
**Depends on**: Phase 10
**Requirements**: CONF-01, CONF-02, CONF-03, PROD-01, PROD-02
**Success Criteria** (what must be TRUE):

  1. Core mat configuration completes in at most three decision surfaces (vehicle, colors, optional extras)
  2. Floor and edge colors share one surface with live preview; extras stay available via progressive disclosure
  3. On mobile configurator, price and add-to-cart stay reachable without hunting
  4. Product listing and detail chrome are simpler while fit, material, and purchase path remain clear
  5. Configured price still comes only from `mat-pricing.ts` / vehicle price helpers

**Plans**: TBD
**UI hint**: yes

### Phase 12: Cart, Checkout, and WhatsApp Commit Flow

**Goal**: Cart and checkout feel calm and short while WhatsApp-native order commit remains reliable
**Depends on**: Phase 11
**Requirements**: CART-01, CHECK-01, CHECK-02, CHECK-03
**Success Criteria** (what must be TRUE):

  1. Cart page is calm purchase chrome (summary + actions) without promotional or AI distractions
  2. Checkout is a single calm page with required fulfillment fields and a clear order summary
  3. WhatsApp submit still opens synchronously during the user gesture before any async persistence
  4. Checkout stays WhatsApp-native; disabled credit-card UI is not reactivated

**Plans**: TBD
**UI hint**: yes

### Phase 13: Cross-Surface Verification and Conditional Cleanup

**Goal**: Simplified storefront ships with verified conversion, accessibility, admin isolation, and an evidence-based Lenis decision
**Depends on**: Phase 12
**Requirements**: VERIFY-01, VERIFY-02, VERIFY-03, VERIFY-04, VERIFY-05
**Success Criteria** (what must be TRUE):

  1. Critical path home → configurator → cart → checkout → WhatsApp handoff works on desktop and mobile
  2. Reduced-motion and key accessibility checks pass on simplified surfaces
  3. Customer AI remains hidden while admin pages and admin AI still work
  4. Lint, typecheck, and existing automated checks pass after simplification
  5. Performance/bundle comparison is captured; Lenis is removed only if measured native scroll is clearly better

**Plans**: TBD

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1-4 | v1.0 | 4/4 | Complete | 2026-07-17 |
| 5-8 | v1.1 | 12/12 | Complete | 2026-07-17 |
| 9. Storefront Boundaries and Content Inventory | v1.2 | 2/2 | Complete | 2026-07-17 |
| 10. Homepage and Motion Diet | v1.2 | 1/1 | Complete | 2026-07-17 |
| 11. Configurator and Product Simplification | v1.2 | 0/? | Not started | - |
| 12. Cart, Checkout, and WhatsApp Commit Flow | v1.2 | 0/? | Not started | - |
| 13. Cross-Surface Verification and Conditional Cleanup | v1.2 | 0/? | Not started | - |

## Coverage Map

| Requirement | Phase |
|-------------|-------|
| BOUND-01 | 9 |
| BOUND-02 | 9 |
| BOUND-03 | 9 |
| BOUND-04 | 9 |
| HOME-01 | 10 |
| HOME-02 | 10 |
| HOME-03 | 10 |
| HOME-04 | 10 |
| BRAND-01 | 10 |
| TRUST-01 | 10 |
| TRUST-02 | 10 |
| CONF-01 | 11 |
| CONF-02 | 11 |
| CONF-03 | 11 |
| PROD-01 | 11 |
| PROD-02 | 11 |
| CART-01 | 12 |
| CHECK-01 | 12 |
| CHECK-02 | 12 |
| CHECK-03 | 12 |
| VERIFY-01 | 13 |
| VERIFY-02 | 13 |
| VERIFY-03 | 13 |
| VERIFY-04 | 13 |
| VERIFY-05 | 13 |

**Coverage:** 25/25 v1.2 requirements mapped ✓

---
*Roadmap created: 2026-07-17 — milestone v1.2 Sade Lüks Deneyim*
