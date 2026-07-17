# Requirements: Otopolik v1.1 — AI Destekli Lüks Deneyim

**Milestone:** v1.1
**Defined:** 2026-07-17
**Source:** PROJECT.md milestone goals + `.planning/research/` (SUMMARY, FEATURES, ARCHITECTURE, PITFALLS)

Layer AI capabilities over the shipped luxury storefront — customer-facing assistants for vehicle matching, configuration, and support, plus an admin content generator — without touching the core Convex commerce backbone. Every price/policy claim traces back to code (`mat-pricing.ts`, `getVehiclePrice()`, site-settings), never model-composed.

## v1.1 Requirements

### AI Infrastructure & Guardrails (AIINF)

- [x] **AIINF-01**: The system provides a server-side AI client layer (Next.js route handlers under `src/app/api/ai/*`) that keeps the provider API key server-only and never exposes it to the browser.
- [x] **AIINF-02**: When the AI provider key is unset or misconfigured, every AI entry point degrades gracefully to the existing non-AI path (manual dropdowns, WhatsApp button, hand-written CMS) instead of showing a broken UI — mirroring the Convex-first + static-fallback pattern.
- [x] **AIINF-03**: All customer-facing AI prices and shipping/policy claims are sourced from code (`calculateMatPrice`, `getVehiclePrice`, site-settings) via tool calls — the model never free-generates a price or delivery promise.
- [x] **AIINF-04**: Public AI endpoints enforce cost controls — per-session/IP rate limiting, per-feature `max_tokens` caps, and a feature-flag kill switch.
- [x] **AIINF-05**: Customer-facing assistants are structurally isolated from any admin-key-gated (`requireAdminKey()`) mutation — untrusted chat input can never reach a privileged tool surface.
- [x] **AIINF-06**: An evaluation harness (golden dataset per feature, incl. price-equality assertions and Turkish-language quality checks) runs before every prompt/model change.

### AI Vehicle Matcher (VMATCH)

- [x] **VMATCH-01**: A user can type free-text vehicle info in Turkish (e.g. "2019 Passat variant", "19 model kaptan Egea") and get a resolved brand/model from `vehicle-data.ts` with the correct price tier.
- [x] **VMATCH-02**: Matching runs deterministic fuzzy/token search (`vehicle-search.ts`) first and only falls back to the LLM to parse messy text or disambiguate 0-/multi-match cases.
- [x] **VMATCH-03**: On ambiguous or no-match results, the user is shown a disambiguation prompt (candidate vehicles) rather than a wrong silent guess.
- [x] **VMATCH-04**: A resolved vehicle from the matcher pre-fills the existing `MatConfigurator` vehicle step.

### AI Configurator Assistant (CFGAI)

- [ ] **CFGAI-01**: A Turkish streaming chat assistant walks the user through vehicle selection → floor/edge colors → extras → price → WhatsApp handoff.
- [ ] **CFGAI-02**: The assistant drives the existing `MatConfigurator` stepper state via tool calls (does not run a parallel/fictional checkout).
- [ ] **CFGAI-03**: The assistant adds the configured item to the real cart via `useCart().addItem()` with a price computed by `calculateMatPrice`.
- [ ] **CFGAI-04**: The chat UI matches the OLED-black/glass premium design system (`surface-glass`/`mac-glass`, Racing Red) and is mobile-first.
- [ ] **CFGAI-05**: The assistant is clearly labeled as an AI ("AI Asistan") and never impersonates a human rep.

### AI Support / Order Helper (SUPAI)

- [ ] **SUPAI-01**: A user can ask shipping, sizing, and care questions and receive answers grounded only in current CMS/site-settings content (re-fetched at answer time, not baked into a stale prompt).
- [ ] **SUPAI-02**: The assistant refuses off-topic / open-domain questions with a scoped Turkish redirect back to mat selection/orders.
- [ ] **SUPAI-03**: When uncertain, the assistant escalates by generating a pre-filled `wa.me` WhatsApp handoff link (reusing `whatsapp.ts`).
- [ ] **SUPAI-04**: The assistant can draft a WhatsApp order/summary message (vehicle + colors + price + notes) for the user to review and send — the user, not the AI, presses send.
- [ ] **SUPAI-05**: Chat transcript handling follows KVKK data-minimization (short-TTL/stateless logging, no training pipeline).

### AI Content Generator — Admin (CNTGEN)

- [ ] **CNTGEN-01**: An admin can generate Turkish product descriptions, SEO titles/meta, and FAQ copy grounded in structured product/vehicle facts.
- [ ] **CNTGEN-02**: Generated content is saved as a draft and requires an explicit admin publish action before going live — never auto-published to the CMS.
- [ ] **CNTGEN-03**: The generator is exposed inside the existing admin content UI (`ContentManager.tsx` / `/admin/icerik`) and is admin-key-gated.
- [ ] **CNTGEN-04**: Generated copy follows the project's premium ("Apple/Porsche") Turkish brand voice via a written system-prompt style guide.

## Future Requirements (v1.x — after validation)

- [ ] Conversation analytics: which questions the AI can't answer / where users abandon.
- [ ] Proactive contextual assistant nudges on `/arac/[slug]` pages.
- [ ] Multi-language content generation (only if non-Turkish markets are served).

## Out of Scope

- **Fully autonomous order placement by the AI** — breaks the deliberate WhatsApp-confirmed, no-payment-gateway trust model. AI drafts; the customer sends.
- **General-purpose open-domain chatbot** — invites off-topic abuse, cost, and prompt-injection surface for a single-category store.
- **Real-time inventory/stock-aware recommendations** — made-to-order EVA business has no meaningful stock concept.
- **AI auto-publishing to the live CMS** — hallucination risk on factual/SEO/legal-adjacent claims; human review required.
- **AI that can assert prices outside `mat-pricing.ts`** — would create two sources of truth.
- **Voice assistant / voice ordering** — disproportionate build cost for current volume.
- **Replacing the manual configurator with a chat-only flow** — regresses the shipped luxury stepper UX.
- **Backend/Convex architecture changes** — v1.1 is additive over the existing commerce backbone.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AIINF-01 | Phase 5 | Complete |
| AIINF-02 | Phase 5 | Complete |
| AIINF-03 | Phase 5 | Complete |
| AIINF-04 | Phase 5 | Complete |
| AIINF-05 | Phase 5 | Complete |
| AIINF-06 | Phase 5 | Complete |
| VMATCH-01 | Phase 5 | Complete |
| VMATCH-02 | Phase 5 | Complete |
| VMATCH-03 | Phase 5 | Complete |
| VMATCH-04 | Phase 5 | Complete |
| CFGAI-01 | Phase 6 | Pending |
| CFGAI-02 | Phase 6 | Pending |
| CFGAI-03 | Phase 6 | Pending |
| CFGAI-04 | Phase 6 | Pending |
| CFGAI-05 | Phase 6 | Pending |
| SUPAI-01 | Phase 7 | Pending |
| SUPAI-02 | Phase 7 | Pending |
| SUPAI-03 | Phase 7 | Pending |
| SUPAI-04 | Phase 7 | Pending |
| SUPAI-05 | Phase 7 | Pending |
| CNTGEN-01 | Phase 8 | Pending |
| CNTGEN-02 | Phase 8 | Pending |
| CNTGEN-03 | Phase 8 | Pending |
| CNTGEN-04 | Phase 8 | Pending |
