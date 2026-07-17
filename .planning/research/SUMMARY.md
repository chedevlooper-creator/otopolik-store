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
# Project Research Summary

**Project:** Otopolik — Ultra Luxury Reimagined, milestone v1.1 "AI Destekli Lüks Deneyim"
**Domain:** AI-augmented e-commerce (Turkish premium single-brand storefront, WhatsApp checkout)
**Researched:** 2026-07-17
**Confidence:** HIGH

## Executive Summary

OTO POLİK v1.1 adds four AI features to an existing, shipped Next.js 16 + Convex Turkish e-commerce storefront: an AI configurator assistant, a free-text vehicle matcher, an admin content generator, and a support/order helper. Customer-facing LLM calls (vehicle matcher, configurator assistant, support helper) should live in Next.js route handlers (`src/app/api/ai/*`) for streaming SSE and single-secret-location; the admin content generator mirrors the existing `convex/orderNotify.ts` `"use node"` internalAction pattern. The vehicle matcher is the foundational feature: simplest to build, highest ROI (solves first-step friction), and it validates the tool-calling + graceful-fallback patterns every later feature reuses.

The critical constraint across all features: price- and policy-bearing output must **never** be free-generated by the model — every price flows through code (`calculateMatPrice()`, `getVehiclePrice()`, site-settings reads). Legal precedent (*Moffatt v. Air Canada*, 2024) holds companies liable for chatbot claims. Turkish KVKK adds transcript consent/retention requirements that must influence storage design early, not post-launch.

No RAG/embeddings are needed: the grounding corpus (FAQ, shipping/sizing/care policy) is small and already centrally editable via the Convex CMS — it fits directly in the system prompt. The existing graceful-fallback pattern ("site works without Convex") must extend to "site works without an LLM key": every AI surface degrades to an already-working non-AI path (manual dropdowns, WhatsApp float button, hand-written CMS fields).

## Key Findings

### Recommended Stack

Anthropic Claude via Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) as the streaming/tool-calling abstraction, with `@anthropic-ai/sdk` available for direct calls. No LangChain — unnecessary abstraction for four single-agent, tool-light features. Full details in [STACK.md](STACK.md).

**Core technologies:**
- `ai` (Vercel AI SDK v6) + `@ai-sdk/anthropic`: streaming chat, tool calling, structured outputs — fits Next.js App Router natively; verify exact version pairing at install time
- Model split: `claude-sonnet-5` for conversational features (configurator assistant, support helper); `claude-haiku-4-5` for the vehicle matcher (cheap closed-set classification); `claude-opus-4-8` for the admin content generator (infrequent, quality-sensitive)
- Rate limiting: token-bucket per session/IP on public chat endpoints, per-feature `max_tokens` caps, feature-flag kill switch tied to a daily spend threshold
- Secrets: `ANTHROPIC_API_KEY` in Vercel env for route handlers; add to Convex env only if/when the admin generator internalAction is built

### Expected Features

Full landscape in [FEATURES.md](FEATURES.md).

**Must have (table stakes):**
- Vehicle matcher layered on the existing `vehicle-search.ts` fuzzy/token matcher — LLM only parses messy free text into tokens and disambiguates 0/multi-match cases
- All AI-quoted prices traced to `mat-pricing.ts` / `getVehiclePrice()` — never model-composed
- Draft-review-publish workflow for admin content generation — never auto-publish
- AI-powered disclosure in chat UI; scope-limited support answers grounded in CMS content
- WhatsApp handoff as the escalation channel — "escalate to human" and "complete purchase" collapse into the same existing flow

**Should have (competitive):**
- Configurator assistant that drives the existing stepper via tool calls and hands off to cart (`useCart().addItem()`)
- WhatsApp order-message drafting from chat context

**Defer (v2+):**
- Chat session persistence across visits (optional Convex tables — decide at phase planning)
- Embedding/RAG index — only if the grounding corpus grows an order of magnitude

**Anti-features:** open-domain/general-purpose chatbot; AI auto-completing orders (fights the deliberate WhatsApp-confirmed trust model).

### Architecture Approach

Customer-facing LLM calls in Next.js route handlers (`src/app/api/ai/*`) — streaming SSE, key server-only, no precedent-breaking; admin content generation as a Convex `"use node"` internalAction mirroring `orderNotify.ts`. The vehicle matcher is a tool-call function over the static in-memory `vehicle-data.ts` array (deterministic fuzzy match first, LLM disambiguation fallback). Full detail in [ARCHITECTURE.md](ARCHITECTURE.md).

**Major components:**
1. `/api/ai/vehicle-match` route + match tool — shared dependency for the standalone input and the configurator assistant
2. `/api/ai/chat` streaming route + `ChatWidget` client component inside `.premium-site` — reused by configurator assistant and support helper (different system prompts/tool sets)
3. `contentGenerations` Convex table + admin-key-gated internalAction + admin UI tab in `ContentManager.tsx` — publishing still flows through existing mutations unchanged
4. Grounding context builder — fetches CMS/settings at request time so answers track admin edits

### Critical Pitfalls

Top items from [PITFALLS.md](PITFALLS.md) (9 catalogued):

1. **Hallucinated prices/policies** — every price/shipping claim sourced from code; deterministic eval assertions that quoted prices equal `calculateMatPrice()` output
2. **Untrusted chat input reaching privileged paths** — customer-facing assistants must never share a tool surface with anything that can reach `requireAdminKey()`-gated mutations; structural isolation, not prompt-level patches
3. **Turkish language quality drift** — models sliding into English or machine-Turkish; native-speaker eval set with domain vocabulary (topuk minderi, bagaj havuzu, kenar rengi)
4. **Runaway API cost on an open public widget** — rate limits + per-session token caps + kill switch shipped with the first public endpoint, not retrofitted
5. **Admin generator overwriting human-edited CMS content** — draft-and-approve gate is a v1 requirement; no silent writes to live content
6. **KVKK transcript handling** — data minimization, defined retention (30–180 days), redaction before eval reuse; flag for real legal review
7. **No eval harness** — golden dataset (20–40 cases/feature) stood up alongside the first feature, run before every prompt/model change

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Tool Infrastructure & Vehicle Matcher
**Rationale:** Lowest-risk gate, highest ROI; validates tool-calling architecture and LLM-key fallback for everything after it
**Delivers:** AI client plumbing, vehicle-match tool over `vehicle-data.ts`, `/api/ai/vehicle-match` route, `VehicleMatchInput` wired into `MatConfigurator.tsx`, eval harness with 20–30 golden cases
**Addresses:** free-text vehicle matching (table stakes)
**Avoids:** Pitfalls 1 (grounding), 4 (cost controls from day one), 7 (eval harness not retrofitted)

### Phase 2: Streaming Chat & Configurator Assistant
**Rationale:** Builds on Phase 1 tools; introduces the streaming SSE + chat widget pattern the support helper reuses
**Delivers:** `/api/ai/chat` route, luxury-styled `ChatWidget`, configurator system prompt + stepper tools, cart handoff via `useCart().addItem()`, extended evals (price assertions + Turkish quality)
**Uses:** Vercel AI SDK streaming, `claude-sonnet-5`
**Implements:** chat UI component tree inside `.premium-site`

### Phase 3: Support / Order Helper & Grounding
**Rationale:** Reuses Phase 2 streaming plumbing; narrows scope to read-only grounded Q&A + WhatsApp drafting
**Delivers:** support system prompt + grounding context builder (CMS/settings at request time), WhatsApp message drafting, KVKK-compliant transcript policy

### Phase 4: Admin Content Generator (Draft-Then-Publish)
**Rationale:** Architecturally independent (Convex internalAction); admin-only, lowest customer-facing risk; can run parallel or defer without blocking launch
**Delivers:** `contentGenerations` table with approval gate, generation kickoff, admin UI tab in existing `ContentManager.tsx`

### Phase Ordering Rationale

- Phases 1 → 2 → 3 are dependency-ordered: tools → streaming chat → grounded support
- Phase 4 is structurally independent and can slip without blocking the customer-facing launch
- Eval harness stands up in Phase 1 and extends per phase — never a bolt-on testing phase at the end
- Grounding architecture and tool-surface isolation are decided before any chat UI code is written — retrofitting is expensive

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2:** streaming SSE error recovery on mobile network drops — needs UX specifics and throttled-network testing
- **Phase 3:** KVKK compliance for chat-transcript retention — legal review is a hard gate before shipping

Phases with standard patterns (skip research-phase):
- **Phase 1:** tool-calling over static data — well-documented Anthropic SDK pattern
- **Phase 4:** Convex `"use node"` internalAction — direct in-repo precedent (`orderNotify.ts`)

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Provider/model choices from authoritative Anthropic guidance; npm version pairings (`ai` ↔ `@ai-sdk/anthropic`) flagged for verification at install time |
| Features | MEDIUM-HIGH | General e-commerce AI patterns well-documented; niche (single-brand car-mat store) has no direct precedent — triangulated against this project's constraints |
| Architecture | HIGH | All decisions grounded in direct codebase inspection (`CLAUDE.md`, `orderNotify.ts`, `vehicle-search.ts`, `convex/schema.ts` conventions) |
| Pitfalls | MEDIUM-HIGH | Grounding/cost/brand pitfalls are project-specific; KVKK and Turkish-quality items synthesized from regulatory guidance and general LLM patterns |

**Overall confidence:** HIGH

### Gaps to Address

- **Convex Agent component decision:** STACK.md suggests optional `@convex-dev/agent` (websocket-delta streaming, persistent threads); ARCHITECTURE.md recommends plain route-handler SSE. Phase 2 planning must decide — likely route handlers for v1
- **KVKK legal review:** engineering defaults (retention window, redaction) are not a legal opinion — schedule counsel review early enough to influence transcript-storage design (Phase 3 gate)
- **Eval harness home:** local script vs CI vs Convex cron, auto-block criteria, and how new cases get added — specify in Phase 1 planning
- **Turkish domain vocabulary test set:** build with a native speaker during Phases 1–2
- **Cost budget numbers:** v1.1 AI budget target, per-session token cap, daily spend alert threshold and destination — quantify in Phase 1 planning
- **Mobile stream-recovery UX:** prototype reconnect behavior and test on throttled "Slow 4G" in Phase 2

## Sources

### Primary (HIGH confidence)
- Anthropic Claude API guidance (bundled claude-api skill / official docs) — model IDs, streaming, tool calling
- This codebase: `CLAUDE.md`, `convex/orderNotify.ts`, `convex/schema.ts`, `src/lib/vehicle-data.ts`, `src/lib/vehicle-search.ts`, `src/lib/mat-pricing.ts` — integration precedents and pricing source of truth

### Secondary (MEDIUM confidence)
- Vercel AI SDK v6 documentation — `streamText`/`generateObject`/tool-calling patterns in App Router
- Convex components docs (`@convex-dev/agent`, `@convex-dev/rate-limiter`) — capabilities confirmed, adoption decision deferred
- *Moffatt v. Air Canada* (BC Civil Resolution Tribunal, 2024) — chatbot liability precedent
- kvkk.gov.tr guidance — Turkish personal-data law obligations (engineering reading, not legal opinion)

### Tertiary (LOW confidence)
- Vendor guidance on LLM rate limiting/cost control (TrueFoundry, LiteLLM) and chatbot deflection metrics — patterns consistent, numbers self-reported

---
*Research completed: 2026-07-17*
*Ready for roadmap: yes*
