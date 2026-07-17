# Requirements: Otopolik — v1.2 Sade Lüks Deneyim

**Defined:** 2026-07-17
**Core Value:** Eşi benzeri olmayan, "Apple / Porsche" kalitesinde premium bir EVA oto paspas e-ticaret deneyimi sunmak.

## v1.2 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Boundaries & AI Visibility

- [x] **BOUND-01**: Storefront has a dedicated customer AI UI flag that defaults off without disabling admin AI or AI APIs
- [x] **BOUND-02**: With the customer AI UI flag off, header, footer, configurator, and support chrome show no AI/Destek entry points
- [x] **BOUND-03**: Visiting `/destek` lands on a non-AI WhatsApp/contact fallback (no chat UI)
- [x] **BOUND-04**: Primary customer navigation is reduced to essential destinations (Tasarla, Ürünler, Galeri, İletişim, Sepet) with no dead anchors

### Homepage & Motion

- [x] **HOME-01**: Homepage mounts only sections with a distinct job; duplicate or redundant marketing sections are unmounted (CMS rows retained for reversibility)
- [x] **HOME-02**: First viewport communicates brand, one headline, one short supporting line, and one primary CTA to configure
- [x] **HOME-03**: Decorative parallax, dense stagger, and glow spectacle are removed or heavily reduced
- [x] **HOME-04**: Retained motion is limited to a small allowlist of purposeful micro-interactions and respects `prefers-reduced-motion`

### Configurator & Products

- [ ] **CONF-01**: Core mat configuration completes in at most three decision surfaces (vehicle, colors, optional extras)
- [ ] **CONF-02**: Floor and edge color selection share one surface with live preview; extras remain available via progressive disclosure
- [ ] **CONF-03**: On mobile configurator, price and add-to-cart CTA stay reachable without hunting
- [ ] **PROD-01**: Product listing and product detail chrome are simplified while fit, material, and purchase path remain clear
- [ ] **PROD-02**: Configured price continues to come only from `mat-pricing.ts` / vehicle price helpers (no duplicate price sources)

### Cart & Checkout

- [ ] **CART-01**: Cart page is calm purchase chrome (summary + actions) without promotional or AI distractions
- [ ] **CHECK-01**: Checkout is a single calm page with required fulfillment fields and clear order summary
- [ ] **CHECK-02**: WhatsApp submit still opens synchronously during the user gesture before any async persistence
- [ ] **CHECK-03**: Checkout retains WhatsApp-native ordering; disabled credit-card UI is not reactivated

### Brand & Trust

- [x] **BRAND-01**: Customer storefront retains OLED black surfaces, Racing Red accent, and existing premium typography
- [x] **TRUST-01**: At least one concise trust/FAQ or shipping/proof surface remains near the purchase path
- [x] **TRUST-02**: Visible FAQ/proof content stays consistent with structured data / SEO where applicable

### Verification

- [ ] **VERIFY-01**: Critical path home → configurator → cart → checkout → WhatsApp handoff works on desktop and mobile
- [ ] **VERIFY-02**: Reduced-motion and key accessibility checks pass on simplified surfaces
- [ ] **VERIFY-03**: Customer AI remains hidden while admin pages and admin AI still work
- [ ] **VERIFY-04**: Lint, typecheck, and existing automated checks pass after simplification
- [ ] **VERIFY-05**: Performance/bundle comparison is captured; Lenis removal is decided only if measured native scroll is better

## Future Requirements

Deferred beyond v1.2. Tracked but not in this roadmap.

### Analytics & Growth

- **FUT-01**: Conversation analytics after AI re-enablement
- **FUT-02**: Proactive nudges on `/arac/[slug]`
- **FUT-03**: Homepage A/B testing once traffic supports it

### Commerce & AI

- **FUT-04**: Real payment gateway (credit card)
- **FUT-05**: Customer AI UI re-enablement after the simplified manual path is validated
- **FUT-06**: Multi-language content generation

## Out of Scope

Explicitly excluded for v1.2 to prevent scope creep.

| Feature | Reason |
|---------|--------|
| New animation libraries / 3D / Lottie kits | Adds spectacle opposite to deletion-first goal |
| Re-adding removed homepage story blocks | Restores clutter; fix hierarchy instead |
| Parallel deep mini-configurator + full configurator | Two mental models; one configure spine only |
| Resurfacing customer AI chat/match UI | Explicitly hidden this milestone |
| Empty minimalism (strip all trust/FAQ copy) | Raises hesitation on made-to-order |
| Multi-step checkout wizard / account gate | Fights WhatsApp-native guest checkout |
| Enabling disabled credit-card payment UI | Distrustful theater until real gateway ships |
| Convex/backend architecture rewrite | Presentation-only milestone |
| Removing WhatsApp confirmation model | Core commerce trust contract |
| Changing `mat-pricing.ts` source of truth | Price drift risk |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| BOUND-01 | Phase 9 | Complete |
| BOUND-02 | Phase 9 | Complete |
| BOUND-03 | Phase 9 | Complete |
| BOUND-04 | Phase 9 | Complete |
| HOME-01 | Phase 10 | Complete |
| HOME-02 | Phase 10 | Complete |
| HOME-03 | Phase 10 | Complete |
| HOME-04 | Phase 10 | Complete |
| BRAND-01 | Phase 10 | Complete |
| TRUST-01 | Phase 10 | Complete |
| TRUST-02 | Phase 10 | Complete |
| CONF-01 | Phase 11 | Pending |
| CONF-02 | Phase 11 | Pending |
| CONF-03 | Phase 11 | Pending |
| PROD-01 | Phase 11 | Pending |
| PROD-02 | Phase 11 | Pending |
| CART-01 | Phase 12 | Pending |
| CHECK-01 | Phase 12 | Pending |
| CHECK-02 | Phase 12 | Pending |
| CHECK-03 | Phase 12 | Pending |
| VERIFY-01 | Phase 13 | Pending |
| VERIFY-02 | Phase 13 | Pending |
| VERIFY-03 | Phase 13 | Pending |
| VERIFY-04 | Phase 13 | Pending |
| VERIFY-05 | Phase 13 | Pending |

**Coverage:**

- v1.2 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-17*
*Last updated: 2026-07-17 — roadmap traceability (Phases 9–13)*
