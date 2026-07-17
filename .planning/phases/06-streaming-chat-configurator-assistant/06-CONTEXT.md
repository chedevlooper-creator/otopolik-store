# Phase 6: Streaming Chat & Configurator Assistant - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning
**Mode:** Auto-generated (yolo autonomous — research-grounded, discuss auto-optimized)

<domain>
## Phase Boundary

Ship the flagship customer-facing feature: a premium Turkish **streaming** AI chat assistant that walks the user through the full configuration (vehicle → floor/edge colors → extras → price → WhatsApp handoff), drives the REAL `MatConfigurator` stepper via tool calls, and adds a correctly priced item to the REAL cart.

Requirements in scope: CFGAI-01…05.

Depends on Phase 5 (AI client layer, guardrails, rate limiting, kill switch, vehicle-match tool — all reused here).

Out of scope: support/order helper Q&A grounding (Phase 7), admin content generator (Phase 8).
</domain>

<decisions>
## Implementation Decisions

### From research (authoritative — SUMMARY.md, ARCHITECTURE.md, FEATURES.md, PITFALLS.md)
- **Streaming transport:** Vercel AI SDK `streamText` over a Next.js route handler `src/app/api/ai/chat` (SSE). Reuse the Phase 5 server-only AI client + guardrails. Use `claude-sonnet-5` (conversational) per research model split.
- **Drive the real stepper, not a parallel flow (CFGAI-02):** expose the existing `MatConfigurator` step state (vehicle, floor color, edge color, extras) as callable tools; the assistant advances the SAME UI the user would use manually. Reuse the Phase 5 vehicle-match tool for the "which car?" step.
- **Price + cart guardrails (CFGAI-03, AIINF-03 carryover):** the assistant NEVER states a self-composed price — final price always via `calculateMatPrice` (`src/lib/mat-pricing.ts`); add-to-cart goes through the real `useCart().addItem()`.
- **Tool-surface isolation (AIINF-05 carryover):** chat tools operate only over configurator/cart/vehicle data — never any `requireAdminKey()`-gated mutation.
- **UI (CFGAI-04):** mobile-first chat widget inside `.premium-site` reusing `surface-glass`/`mac-glass`, Racing Red accents, Syne/Instrument Sans typography, Turkish copy. Respect `prefers-reduced-motion`. Must not look like a bolted-on third-party white chatbox.
- **AI disclosure (CFGAI-05):** clearly labeled "AI Asistan"; never impersonates a human rep.
- **Graceful fallback (AIINF-02 carryover):** if the provider key is unset/kill-switch off, the chat entry point hides/disables; the manual stepper is untouched.
- **WhatsApp handoff:** culminate in the existing `wa.me` flow (`src/lib/whatsapp.ts`) — draft-then-user-sends, matching `odeme/` synchronous-open UX.

### Claude's Discretion
Widget placement (floating vs embedded in `/olusturucu`), exact tool schema, conversation state shape, streaming error/reconnect UX on mobile — planner/executor discretion, guided by success criteria + research + CLAUDE.md.
</decisions>

<code_context>
## Existing Code Insights

- Phase 5 deliverables: `src/app/api/ai/*` route handlers, lazy AI client, rate limiter, kill switch, customer price tools, `runVehicleMatch` — all reused.
- `src/components/configurator/MatConfigurator.tsx` — the stepper the assistant must drive (FLOOR_COLORS/EDGE_COLORS palettes, extras, preview lookup).
- `src/lib/mat-pricing.ts` — `calculateMatPrice` (only price source).
- `src/context/cart-context.tsx` / `src/lib/cart-store.ts` — `useCart().addItem()` (cart keyed by slug+color).
- `src/lib/whatsapp.ts` — `wa.me` link builder for handoff.
- Design system: `globals.css` `.premium-site` scope, `surface-glass`, `mac-glass`, `premium-card`, `btn-red-rich`, `btn-press`.

Further codebase context gathered during plan-phase research.
</code_context>

<specifics>
## Specific Ideas

- Reuse Phase 5 plumbing aggressively — this phase is mostly the chat route + tool wiring + premium chat UI, not new infra.
- Streaming SSE error recovery on mobile network drops is a research-flagged risk — plan for a graceful reconnect/retry UX.
</specifics>

<deferred>
## Deferred Ideas

- Support/order Q&A grounding over CMS content — Phase 7 (the chat route pattern here is reused there with a different system prompt/tool set).
- Chat session persistence across visits — v1.x (decide later).
</deferred>
