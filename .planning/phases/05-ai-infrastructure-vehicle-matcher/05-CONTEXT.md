# Phase 5: AI Infrastructure & Vehicle Matcher - Context

**Gathered:** 2026-07-17
**Status:** Ready for planning
**Mode:** Auto-generated (yolo autonomous — research-grounded, discuss auto-optimized)

<domain>
## Phase Boundary

Stand up the shared, server-side AI client layer and cost/safety guardrails, then ship the first customer-facing AI feature: a free-text Turkish vehicle matcher that resolves messy input to a `vehicle-data.ts` brand/model with the correct price tier and pre-fills the existing `MatConfigurator` vehicle step.

Requirements in scope: AIINF-01…06, VMATCH-01…04.

Out of scope for this phase: streaming chat UI, configurator assistant, support helper, admin content generator (later phases 6–8).
</domain>

<decisions>
## Implementation Decisions

### From research (authoritative — SUMMARY.md, ARCHITECTURE.md, PITFALLS.md)
- **D-01 Placement:** Customer-facing LLM calls live in Next.js route handlers under `src/app/api/ai/*` (server-only key, SSE-capable). Do NOT put the provider key in the browser or call the LLM client-side.
- **D-02 Vehicle match strategy:** deterministic fuzzy/token match via existing `src/lib/vehicle-search.ts` FIRST; the LLM is only a fallback to parse messy free text into brand/model/year/trim tokens and to disambiguate 0-/multi-match results. Never replace the existing matcher.
- **D-03 Ground truth:** `vehicle-data.ts` for brand/model/bodyType; `mat-pricing.ts` `getVehiclePrice()` / `calculateMatPrice` for price tier. The model NEVER free-generates a price (AIINF-03).
- **D-04 Provider/SDK:** Vercel AI SDK (`ai` + provider adapter) as the streaming/tool-calling abstraction; use the cheap fast model for the closed-set matcher classification. Verify exact npm version pairing at install time.
- **D-05 Graceful fallback (AIINF-02):** mirror the Convex-first + static-fallback pattern — if the provider key is unset/placeholder, the AI match entry point hides/disables and the user falls back to the existing manual vehicle dropdowns. Nothing breaks.
- **D-06 Cost controls (AIINF-04):** per-session/IP rate limiting, per-feature `max_tokens` caps, and a feature-flag kill switch shipped WITH the first public endpoint, not retrofitted.
- **D-07 Tool-surface isolation (AIINF-05):** the vehicle-match tool operates only over the static in-memory `vehicle-data.ts` array — it shares no tool surface with any `requireAdminKey()`-gated mutation.
- **D-08 Eval harness (AIINF-06):** a golden dataset (20–30 Turkish free-text vehicle cases) with price-equality assertions and Turkish-quality checks, runnable before any prompt/model change. Harness home: vitest + `npm run ai:eval:vehicle-match` (planner discretion).

### Claude's Discretion
Remaining implementation choices (file names, exact rate-limit numbers, eval harness location, disambiguation UI shape) are at the planner's/executor's discretion, guided by the ROADMAP success criteria, research docs, and codebase conventions (CLAUDE.md).
</decisions>

<code_context>
## Existing Code Insights

- `src/lib/vehicle-search.ts` — existing normalized token/prefix matcher (handles Turkish diacritics, ranks matches). Primary matcher.
- `src/lib/vehicle-data.ts` — brand/model/bodyType catalog + `getVehiclePrice()`. Ground truth.
- `src/lib/mat-pricing.ts` — `MAT_PRICING`, `calculateMatPrice` — single source of truth for price math.
- `src/components/configurator/MatConfigurator.tsx` — the vehicle step to pre-fill on a resolved match.
- `src/lib/convex-server.ts` / `convex-client.ts` — the lazy-client + graceful-fallback precedent to mirror for the AI key.
- `convex/orderNotify.ts` — `"use node"` internalAction precedent (relevant later for admin generator, not this phase).

Further codebase context to be gathered during plan-phase research.
</code_context>

<specifics>
## Specific Ideas

- The vehicle matcher is the foundational feature — it validates the tool-calling + graceful-fallback + eval patterns every later phase reuses. Build the shared AI plumbing here, minimal but reusable.
- Env var: server-only provider API key (e.g. `ANTHROPIC_API_KEY` or chosen provider) in Vercel/`.env.local`, never `NEXT_PUBLIC_*`.
</specifics>

<deferred>
## Deferred Ideas

- Streaming chat widget, configurator assistant, support helper, admin content generator — later phases.
- Conversation analytics — v1.x (post-validation).
</deferred>
