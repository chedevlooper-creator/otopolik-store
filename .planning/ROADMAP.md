# Roadmap: Otopolik - Ultra Luxury Reimagined

## Milestones

- ✅ **v1.0 MVP** — Phases 1-4 (Shipped 2026-07-17)
- 🚧 **v1.1 AI Destekli Lüks Deneyim** — Phases 5-8 (In progress)

## Phases

<details open>
<summary>✅ v1.0 MVP (Phases 1-4) — SHIPPED 2026-07-17</summary>

- [x] **Phase 1: Lenis Smooth Scroll & Core Infrastructure** — Completed 2026-07-17
  - *Goal:* Implement global Lenis smooth scrolling and update base layouts for animation readiness.
- [x] **Phase 2: Hero & 3D Integration** — Completed 2026-07-17
  - *Goal:* Integrate high-res 3D animations and advanced entry (hero) scroll-linked aesthetics.
- [x] **Phase 3: Configurator & Gallery Lüks Etkileşimler** — Completed 2026-07-17
  - *Goal:* Upgrade configurator form interactions, product gallery zoom effects, and micro-animations to Apple standards.
- [x] **Phase 4: Cila (Polish) & Optimizasyon** — Completed 2026-07-17
  - *Goal:* Perform rigorous cross-device audits, optimize image loading, and finalize the "Ölen Kalite" UX polish.

</details>

<details open>
<summary>🚧 v1.1 AI Destekli Lüks Deneyim (Phases 5-8)</summary>

- [x] **Phase 5: AI Infrastructure & Vehicle Matcher** — Server-side AI client, guardrails, eval harness, and free-text vehicle matching into the configurator (completed 2026-07-17)
- [x] **Phase 6: Streaming Chat & Configurator Assistant** — Luxury Turkish streaming chat that drives the real MatConfigurator stepper through to cart (completed 2026-07-17)
- [ ] **Phase 7: Support / Order Helper & Grounding** — Automated implementation complete; live provider UX verification pending
- [ ] **Phase 8: Admin Content Generator** — Draft-then-publish Turkish product/SEO/FAQ generation inside admin CMS

</details>

## Phase Details

### Phase 5: AI Infrastructure & Vehicle Matcher

**Goal**: Customers can type messy Turkish vehicle text and land on the correct brand/model/price tier, while every AI surface shares a safe server-only client, cost controls, and an eval harness
**Depends on**: Nothing (first v1.1 phase; v1.0 shipped)
**Requirements**: AIINF-01, AIINF-02, AIINF-03, AIINF-04, AIINF-05, AIINF-06, VMATCH-01, VMATCH-02, VMATCH-03, VMATCH-04
**Success Criteria** (what must be TRUE):

  1. User can type free-text Turkish vehicle info (e.g. "2019 Passat variant") and see a resolved brand/model with the correct price tier from `vehicle-data.ts`
  2. On ambiguous or no-match input, user sees a disambiguation list of candidates — never a silent wrong guess
  3. Accepting a match pre-fills the existing MatConfigurator vehicle step
  4. With `ANTHROPIC_API_KEY` unset, every AI entry point falls back to the non-AI path (manual dropdowns) without a broken UI; the API key never appears in browser bundles
  5. Public AI endpoints enforce rate limits / token caps / kill switch, and a golden eval set (incl. price-equality + Turkish checks) runs before prompt/model changes

**Plans:** 4/3 plans complete
Plans:

- [x] 05-01-PLAN.md — Shared AI client, cost controls, customer-only price tools
- [x] 05-02-PLAN.md — Deterministic-first vehicle match pipeline + `/api/ai/*` routes
- [x] 05-03-PLAN.md — VehicleMatchInput UI, MatConfigurator prefill, golden eval harness

**UI hint**: yes

### Phase 6: Streaming Chat & Configurator Assistant

**Goal**: Customers can complete a full mat configuration via a premium Turkish streaming AI chat that drives the real stepper and adds a correctly priced item to the real cart
**Depends on**: Phase 5
**Requirements**: CFGAI-01, CFGAI-02, CFGAI-03, CFGAI-04, CFGAI-05
**Success Criteria** (what must be TRUE):

  1. User can chat in Turkish through vehicle → colors → extras → price → WhatsApp handoff in a streaming conversation
  2. Chat actions visibly advance the existing MatConfigurator stepper (no parallel/fictional checkout)
  3. User can add the configured mat to the real cart with a price that equals `calculateMatPrice` output
  4. Chat UI matches the OLED-black/glass premium system on mobile and desktop, and is clearly labeled "AI Asistan" (never impersonates a human)

**Plans:** 4/3 plans complete

Plans:

- [x] 06-01-PLAN.md — Streaming `/api/ai/chat` + configurator tools (reuse Phase 5 client/rate-limit/prices)
- [x] 06-02-PLAN.md — Premium ConfiguratorChat drives real MatConfigurator + cart + WhatsApp
- [x] 06-03-PLAN.md — Price-equality golden evals + stream reconnect polish + human verify

**UI hint**: yes

### Phase 7: Support / Order Helper & Grounding

**Goal**: Customers can get shipping/sizing/care answers grounded in live site content and draft a WhatsApp order message without the AI placing the order
**Depends on**: Phase 6
**Requirements**: SUPAI-01, SUPAI-02, SUPAI-03, SUPAI-04, SUPAI-05
**Success Criteria** (what must be TRUE):

  1. User asking shipping, sizing, or care questions receives answers that match current CMS/site-settings content (not stale baked prompts)
  2. Off-topic questions get a scoped Turkish redirect back to mats/orders — no open-domain answers
  3. When uncertain, user gets a pre-filled `wa.me` WhatsApp handoff link; when ready, user can review an AI-drafted order summary and send it themselves
  4. Chat transcripts follow KVKK data-minimization (short TTL / no training pipeline)

**Plans:** 2/3 plans complete; Plan 03 at human verification checkpoint
Plans:

- [x] 07-01-PLAN.md — Live CMS reads + support grounding tools + streaming `/api/ai/support`
- [x] 07-02-PLAN.md — Premium `/destek` SupportChat + user-send WhatsApp drafts
- [ ] 07-03-PLAN.md — Golden evals pass; human provider-on verification pending

**UI hint**: yes

### Phase 8: Admin Content Generator

**Goal**: Admins can generate premium Turkish product/SEO/FAQ copy as drafts and publish only after explicit review
**Depends on**: Phase 5 (independent of customer chat; can slip without blocking launch)
**Requirements**: CNTGEN-01, CNTGEN-02, CNTGEN-03, CNTGEN-04
**Success Criteria** (what must be TRUE):

  1. Authenticated admin can generate Turkish product descriptions, SEO titles/meta, and FAQ copy grounded in product/vehicle facts
  2. Generated content lands as a draft and never goes live until the admin explicitly publishes
  3. Generator lives inside the existing `/admin/icerik` ContentManager UI and is admin-key-gated
  4. Generated copy follows the written premium ("Apple/Porsche") Turkish brand voice style guide

**Plans**: TBD
**UI hint**: yes

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|---|---|---|---|---|
| 1 | v1.0 | 1/1 | Complete | 2026-07-17 |
| 2 | v1.0 | 1/1 | Complete | 2026-07-17 |
| 3 | v1.0 | 1/1 | Complete | 2026-07-17 |
| 4 | v1.0 | 1/1 | Complete | 2026-07-17 |
| 5 | v1.1 | 4/3 | Complete    | 2026-07-17 |
| 6 | v1.1 | 4/3 | Complete    | 2026-07-17 |
| 7 | v1.1 | 2/3 | Human verification | - |
| 8 | v1.1 | 0/? | Not started | - |

## Coverage

| Requirement | Phase |
|-------------|-------|
| AIINF-01 | Phase 5 |
| AIINF-02 | Phase 5 |
| AIINF-03 | Phase 5 |
| AIINF-04 | Phase 5 |
| AIINF-05 | Phase 5 |
| AIINF-06 | Phase 5 |
| VMATCH-01 | Phase 5 |
| VMATCH-02 | Phase 5 |
| VMATCH-03 | Phase 5 |
| VMATCH-04 | Phase 5 |
| CFGAI-01 | Phase 6 |
| CFGAI-02 | Phase 6 |
| CFGAI-03 | Phase 6 |
| CFGAI-04 | Phase 6 |
| CFGAI-05 | Phase 6 |
| SUPAI-01 | Phase 7 |
| SUPAI-02 | Phase 7 |
| SUPAI-03 | Phase 7 |
| SUPAI-04 | Phase 7 |
| SUPAI-05 | Phase 7 |
| CNTGEN-01 | Phase 8 |
| CNTGEN-02 | Phase 8 |
| CNTGEN-03 | Phase 8 |
| CNTGEN-04 | Phase 8 |

**Coverage:** 24/24 v1.1 requirements mapped ✓
