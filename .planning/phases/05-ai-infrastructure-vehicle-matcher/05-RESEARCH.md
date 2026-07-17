# Phase 5 Research Notes (planner-synthesized)

Synthesized from `.planning/research/{SUMMARY,STACK,ARCHITECTURE,PITFALLS}.md` plus npm registry check on 2026-07-17. Authoritative placement override: **CONTEXT + ARCHITECTURE + ROADMAP lock Next.js `src/app/api/ai/*` route handlers** (not Convex actions) for customer AI in this phase — STACK.md's Convex-Agent recommendation applies to later chat phases only if re-decided.

## Package Legitimacy Audit

| Package | Registry | Weekly Downloads (approx) | Maintainer Signal | Status | Notes |
|---------|----------|---------------------------|-------------------|--------|-------|
| `ai` | npmjs.com/package/ai | ~16M | Vercel / AI SDK | [VERIFIED] | Core AI SDK; install `@latest` with provider together |
| `@ai-sdk/anthropic` | npmjs.com/package/@ai-sdk/anthropic | ~8M | Vercel AI SDK | [VERIFIED] | Anthropic provider adapter; pair with current `ai` major at install |
| `zod` | npmjs.com/package/zod | high / ubiquitous | colinhacks | [VERIFIED] | Tool/schema validation; satisfy `ai` peer range (`^3.25.76 \|\| ^4.1.8`) |

**Install rule:** `npm install ai@latest @ai-sdk/anthropic@latest zod` in one command; record resolved versions in SUMMARY. Do not invent pins. Do not install LangChain, `@convex-dev/agent`, or `@convex-dev/rate-limiter` in Phase 5 (deferred / out of scope for this route-handler architecture).

## Rate limiting (discretion)

In-process sliding-window / token-bucket keyed by IP (and optional session header), living in `src/lib/ai/rate-limit.ts`. Accept serverless multi-instance softness for v1; document that Upstash/KV can replace later. Ship with first public endpoint.

## Eval harness home (discretion)

Vitest + golden dataset under `src/lib/ai/evals/`; npm script `ai:eval:vehicle-match`. Deterministic matcher cases always run; live LLM cases skip when `ANTHROPIC_API_KEY` unset.
