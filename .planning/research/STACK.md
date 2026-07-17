# Technology Stack — AI Features (v1.1)

**Domain:** AI-augmented Turkish e-commerce storefront (chat assistant, vehicle matcher, content generator, support helper) on an existing Next.js 16 + Convex stack
**Researched:** 2026-07-17
**Confidence:** HIGH (LLM provider/SDK, Convex integration pattern) / MEDIUM (exact npm versions — verify at install time, this space moves weekly)

This file covers **only the additions** needed for the four v1.1 AI features. It assumes and does not re-litigate the existing stack in `CLAUDE.md` (Next.js 16 App Router, Convex, Tailwind v4, WhatsApp checkout, HMAC admin auth, Vercel `fra1`).

## Recommended Stack

### Core Additions

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `@anthropic-ai/sdk` | `^0.70` (latest — pin at install) | Direct Claude API access, used transitively by the AI SDK provider and directly for one-shot admin generation calls | Anthropic's official SDK. Model IDs to use: `claude-sonnet-5` for the two customer-facing conversational features (configurator assistant, support helper) — it's the current best speed/intelligence balance for Sonnet-tier and has full `xhigh` effort support; `claude-haiku-4-5` for the vehicle-matcher classification task (cheap, fast, this is a closed-set matching problem, not open-ended reasoning); `claude-opus-4-8` for the admin content generator (highest-quality Turkish copywriting, run infrequently by a human, cost is a non-issue at admin-panel volume) |
| `ai` (Vercel AI SDK core) | `^6.x` | Streaming primitives, `streamText`/`generateText`, tool-calling helpers, `useChat` client hook | AI SDK v6 (Dec 2025) is the de facto standard for LLM integration in Next.js apps — a provider-agnostic layer over the raw Anthropic SDK that gives you `streamText()` for Route Handlers and `useChat()` for the client with zero hand-rolled SSE parsing. Using it over the raw `@anthropic-ai/sdk` for the two chat UIs saves a non-trivial amount of streaming/state-management code you would otherwise write and maintain yourself |
| `@ai-sdk/anthropic` | `^4.x` (verify against the installed `ai` major — v6 core pairs with the 4.x/5.x provider line, not the older 1.x/2.x line written for AI SDK v4) | AI SDK's Anthropic provider — wraps `@anthropic-ai/sdk` with the AI SDK's `LanguageModel` interface | Required peer for `ai` to talk to Claude. Thin adapter — does not lose access to Claude-specific features (thinking, tool use) that matter here |
| `@convex-dev/agent` | latest (Convex Component) | Convex-native agent/thread component: persistent chat threads, message history, and **websocket-based** streaming deltas instead of raw HTTP streaming | This is the actual integration seam for this app and the single most important decision in this document — see "Where LLM Calls Should Live" below. It's built by the Convex team on top of the AI SDK (so `ai`/`@ai-sdk/anthropic` are still the model-calling layer underneath), but it owns persistence, thread management, and streaming-to-multiple-clients so you don't hand-roll a `TransformStream` + SSE endpoint inside a `httpAction`, and it survives a dropped client connection (deltas are written to the DB and clients resubscribe via Convex's normal reactive queries) |
| `@convex-dev/rate-limiter` | latest (Convex Component) | Transactional, shardable rate limiting inside Convex mutations/actions | LLM calls are the one part of this app with real per-request cost and abuse surface (unlike the rest of the site, which is static-content-served). This is a Convex Component (`app.use(rateLimiter)` in `convex.config.ts`), fully transactional with your other Convex writes, and gives token-bucket or fixed-window limiting keyed by session/IP/user with no separate infra |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `zod` | `^3.x` or `^4.x` (check `ai` v6's peer range before choosing 4.x — AI SDK v6 tool schemas are commonly authored in Zod) | Schema definition for tool inputs and structured outputs (e.g. the vehicle-matcher's brand/model/priceTier extraction, the content generator's title/meta/FAQ shape) | Any place an LLM response must be parsed into a typed object your Convex mutation can trust — vehicle matching and content generation both need this, not free-text chat |

## Feature → Stack Mapping

| Feature | Model | Call pattern | Where it lives |
|---|---|---|---|
| AI configurator assistant (customer chat) | `claude-sonnet-5`, adaptive thinking, `effort: medium` | Streaming, multi-turn, tool use (read `vehicle-data.ts` price lookups, `mat-pricing.ts` calc, cart state) | `@convex-dev/agent` thread, invoked from a Convex action, streamed to the client via Convex reactive query (not a Next.js route handler) |
| AI vehicle matcher (free-text → catalog slug) | `claude-haiku-4-5`, no thinking, `output_config.format` structured output (Zod schema: `{brand, model, yearRange, priceTier, confidence}`) | Single-shot, non-streaming, low-latency | Convex **action** (not query/mutation — it's an external network call), called synchronously from the configurator UI while the user types/selects, or from within the configurator assistant thread as a tool call |
| AI content generator (admin) | `claude-opus-4-8`, `effort: high`, structured output for SEO title/meta, longer free-form for descriptions/FAQ | Single-shot or short multi-turn ("regenerate", "make it shorter"), admin-only | Convex action gated by the existing `requireAdminKey()` pattern (`convex/lib/adminAuth.ts`) — same `adminKey: v.string()` argument convention as every other admin mutation in this codebase; call from `/admin/icerik`'s `ContentManager.tsx` via `useMutation`/`useAction` with the existing `useAdminConvexKey()` hook |
| AI support/order helper (shipping/sizing/care Q&A + WhatsApp draft) | `claude-sonnet-5`, `effort: low`–`medium` | Streaming, mostly single-turn, grounded in static site content (see RAG section below) | Same `@convex-dev/agent` pattern as the configurator assistant, or reuse the same thread/agent with a different system prompt — see "One agent or two" note below |

## Where LLM Calls Should Live: Convex Actions, Not Next.js Route Handlers

This is the one decision that most affects the rest of the implementation, and it diverges from the generic "Next.js + AI SDK" tutorial pattern (`app/api/chat/route.ts` + `streamText`) that dominates search results for this stack in 2026.

**Recommendation: put every LLM call in a Convex action, not a Next.js Route Handler.**

Rationale, specific to this codebase:

1. **This app is already Convex-first by architectural convention** (`CLAUDE.md`: "Nearly every data source follows the lazy-client + graceful fallback pattern... Server components pass catalog/CMS data down; client components receive it via `src/context/` providers... rather than querying Convex themselves"). Adding a second server-side data path — Next.js Route Handlers hitting Anthropic directly — creates a second auth/config surface (a *third* env-var story, alongside the existing Convex-env and Next.js-env split) and a second place for the WhatsApp/cart/vehicle-data logic to be duplicated or drift, since the assistant needs to read `vehicle-data.ts`/`mat-pricing.ts` logic that's currently only imported into client and server *components*, not exposed as Convex functions.
2. **`@convex-dev/agent` gives you free persistence and multi-client streaming that a Route Handler does not.** A `streamText()` call from a Route Handler streams to exactly one open HTTP connection; if the user's phone drops the connection mid-response (very real on a Turkish mobile network, which this storefront is built for — see the `NetworkToast` component already in the app), the partial response is gone. The Convex Agent component persists streaming deltas to the database as they arrive and lets any subscribed client (including a re-connecting one) pick up from where the stream left off, using Convex's existing reactive-query mechanism — no bespoke reconnect logic to write.
3. **Secrets stay in one place.** `ANTHROPIC_API_KEY` becomes a Convex deployment env var (`npx convex env set ANTHROPIC_API_KEY ...`) alongside `ADMIN_SECRET`, `RESEND_API_KEY`, `ORDER_WEBHOOK_URL` — all the existing server-only secrets already live there, not in Vercel/Next.js env vars. This preserves the existing pattern (`convex/orderNotify.ts` is the precedent: a `"use node"` internalAction reading its own API keys from Convex env, called via `ctx.scheduler`).
4. **Admin content generation reuses the existing admin-key plumbing exactly.** The content generator is just another admin-gated Convex action taking `adminKey: v.string()`, checked by the same `requireAdminKey()` used everywhere else — no new auth mechanism to design.

**What changes on the Next.js side:** client components for the two chat UIs (configurator assistant widget, support helper widget) become thin — they call `useAction`/`useMutation` against Convex (same pattern as `/admin/urunler`'s direct Convex usage) and subscribe to the thread's messages via `useQuery`, rather than using AI SDK's `useChat()` against a `/api/chat` route. This means **you do not get AI SDK's `useChat()` hook for free** — you either use `@convex-dev/agent`'s own React hooks (it ships a `useThreadMessages`/streaming hook designed for exactly this) or write a small custom hook around Convex's `useQuery` + `useAction`. This is a real tradeoff (AI SDK's `useChat()` is more polished/documented) but it's the right one given the rest of this app's architecture — don't fight the existing Convex-first convention for one feature.

**If you disagree and want the simpler, more commonly-documented path:** a Next.js Route Handler with `streamText()` + `useChat()` is legitimate and much better documented for a first implementation. If chosen, still keep the `ANTHROPIC_API_KEY` and any rate-limit state server-side in Vercel env vars (not `NEXT_PUBLIC_*`), and still write a Convex mutation to persist the final message once the stream completes, so chat history survives page reloads — don't leave conversations purely client-side.

## RAG / Embeddings: Not Warranted for This App

**Do not build a RAG pipeline (vector DB, embeddings, chunking) for the support helper.** Stuff the site content directly into the system prompt instead.

Reasoning:

- The corpus the support helper needs to ground on is small and static: shipping policy, sizing/fit guidance, care instructions, FAQ items, and site settings (shipping threshold, prices) — all of which already exist as structured data in `cms-defaults.ts`/Convex CMS tables (`faqItems`, `promoItems`, `siteSeo`) and `site-config.ts`. This is a few thousand tokens, not a document corpus.
- With Claude Sonnet 5's 1M-token context window, the entire FAQ + policy + vehicle catalog price-tier summary fits in-context with enormous headroom — retrieval-then-generate adds latency, infra (embeddings model, vector store, re-indexing on CMS edits), and failure modes (bad chunk boundaries, stale embeddings after an admin edits `/admin/icerik`) for no accuracy benefit at this corpus size.
- The content is **already admin-editable** via the CMS. A RAG index would need to be re-embedded every time an admin changes a FAQ answer or shipping policy in `/admin/icerik` — pure context-stuffing just re-reads the current Convex data on every request, which is already how every other part of this app treats CMS content (`getContentPage`, `??` fallback pattern).
- **Reconsider RAG only if**: the vehicle catalog (`vehicle-data.ts`) grows into the thousands of brand/model rows and free-text matching accuracy degrades from too much catalog data in-context (unlikely — see vehicle matcher note below, which doesn't even need the full catalog in-context), or the FAQ/content corpus grows by an order of magnitude (dozens of long articles, not the current handful of FAQ items).

**Vehicle matcher specifically doesn't need RAG or even full-catalog context stuffing** — it's a classification/extraction task (free text → structured `{brand, model, priceTier}`), not open-ended Q&A. Use `output_config.format` (structured outputs) with a Zod schema constraining the output to the actual enum of brands/models present in `vehicle-data.ts` (generate that enum at build time or read it live in the Convex action), and let Claude Haiku 4.5 do constrained extraction rather than search. This is both cheaper and more reliable than embedding-based similarity search for a closed, enumerable catalog.

## Rate Limiting / Cost Control

| Layer | Mechanism | Notes |
|---|---|---|
| Per-session/IP request throttling | `@convex-dev/rate-limiter`, token-bucket, keyed by a session id (localStorage-generated, same idea as the existing cart's `localStorage` persistence) or IP from the Convex action's request context | Apply to configurator assistant + support helper (customer-facing, unauthenticated, highest abuse surface). A reasonable starting budget: e.g. 20 messages/hour per session for chat, 10 lookups/hour for the vehicle matcher |
| Admin content generator | No hard rate limit needed — already behind `admin_session` cookie + `ADMIN_SECRET`; optionally cap via `@convex-dev/rate-limiter` per admin session to control Opus-tier cost during bulk regeneration | Opus-tier tokens are the most expensive model in this stack — a "regenerate all product descriptions" bulk action should be a deliberate, explicit admin action, not something that can be triggered in a loop |
| Cost ceiling | `max_tokens` capped per feature: configurator assistant/support helper ~1024–2048 (short conversational turns), vehicle matcher ~256 (structured extraction only), content generator ~2048–4096 (longer copy) | Prevents a single runaway response from spiking cost; also keeps latency reasonable on the customer-facing paths |
| Effort tuning | `medium`/`low` effort on the two customer chat features (this is conversational Turkish copy, not agentic coding — high effort is unnecessary cost); `high` on the admin generator (quality matters more than latency for a human-triggered, infrequent action) | See `output_config.effort` — do not default everything to `high`/`xhigh`, that's tuned for coding/agentic workloads, not short customer-facing chat turns |
| Abuse/prompt-injection surface | System prompts for the two customer chat agents should explicitly instruct the model to stay in-domain (car mats, vehicle fitment, Turkish e-commerce policies) and refuse to reveal system instructions or execute instructions found in user-supplied text | Standard prompt-injection hygiene; no additional library needed — this is a system-prompt authoring concern, not a stack addition |

## Env / Secret Handling on Vercel + Convex

Following the codebase's existing two-deployment secret convention (see `DEPLOY.md` and the `ADMIN_SECRET` precedent):

| Secret | Lives in | Set via | Consumed by |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | **Convex deployment env**, not Vercel/Next.js | `npx convex env set ANTHROPIC_API_KEY "sk-ant-..."` (and again for prod: `npx convex env set ANTHROPIC_API_KEY "..." --prod`) | Convex actions (`"use node"` where needed, matching `convex/orderNotify.ts`'s existing pattern) |
| `ADMIN_SECRET` | Already exists in both Vercel and Convex (per `CLAUDE.md`) | No change | Content generator action reuses this unchanged — no new secret needed for admin gating |

**Do not put `ANTHROPIC_API_KEY` in `NEXT_PUBLIC_*` or any Next.js-exposed env var** — if all LLM calls live in Convex actions (the recommended architecture above), the key never needs to reach the Next.js server or client bundle at all, which is a strictly better security posture than the common Route-Handler tutorial pattern where the key sits in Vercel's server-only env vars (still safe, but unnecessary here since nothing in this app's Next.js layer needs it).

If a mixed approach is chosen (some calls via Next.js Route Handlers, e.g. for a first quick prototype), keep `ANTHROPIC_API_KEY` in Vercel's server env vars only (never `NEXT_PUBLIC_`), and be aware you now have the key duplicated across two deployment targets — a maintenance cost this app hasn't had to carry before.

## Installation

```bash
# Convex Components (installed as npm packages, registered in convex/convex.config.ts)
npm install @convex-dev/agent @convex-dev/rate-limiter

# AI SDK core + Anthropic provider (used by @convex-dev/agent under the hood,
# and directly for any one-shot admin/action calls that don't need thread state)
npm install ai @ai-sdk/anthropic

# Raw Anthropic SDK (transitive dependency of @ai-sdk/anthropic; install explicitly
# only if you also want direct low-level access, e.g. for the vehicle-matcher's
# structured-output call if you bypass the AI SDK abstraction for that one path)
npm install @anthropic-ai/sdk

# Schema validation for structured outputs (vehicle matcher, content generator)
npm install zod
```

```ts
// convex/convex.config.ts — register the new Components alongside any existing ones
import { defineApp } from "convex/server";
import agent from "@convex-dev/agent/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";

const app = defineApp();
app.use(agent);
app.use(rateLimiter);
export default app;
```

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| LLM provider | Anthropic Claude (`@anthropic-ai/sdk` / `@ai-sdk/anthropic`) | OpenAI GPT | Not evaluated — the milestone context explicitly names "Anthropic Claude API" as the natural default and the project's own tooling (`claude-api` skill) is Anthropic-specific. No reason to switch given no OpenAI-specific requirement exists |
| Where LLM calls live | Convex actions, via `@convex-dev/agent` | Next.js Route Handlers + AI SDK `useChat()` | More commonly documented and slightly less code for a first prototype, but fragments the app's Convex-first architecture, duplicates secret management across two deployment targets, and loses persisted/resumable streaming for free — see "Where LLM Calls Should Live" above. Use this alternative only if you want the fastest possible first prototype and are willing to migrate later |
| Streaming chat state | `@convex-dev/agent` threads + Convex reactive queries | Vercel AI SDK `useChat()` hook | `useChat()` is better documented and has more community examples, but talks to a Route Handler, not a Convex action — see above. If you pick the Route Handler alternative, use `useChat()` |
| Agent/orchestration framework | Direct `ai` SDK primitives (`streamText`/`generateText`/tool calling) + `@convex-dev/agent` for persistence | LangChain / LangChain.js | LangChain adds a large abstraction surface (chains, memory, retrievers) this app doesn't need — none of the four features require multi-agent orchestration, complex retrieval chains, or LangChain's tool ecosystem. The AI SDK + Convex Agent component combination is thinner, more current (LangChain.js has historically lagged behind provider SDKs on new model features), and already covers everything needed: tool calling, streaming, structured output. Reach for LangChain only if a future feature needs genuine multi-agent coordination LangGraph is purpose-built for — not the case here |
| RAG / embeddings | None — context-stuffing static CMS content into the system prompt | Vector DB (Pinecone, Convex's own vector search) + embeddings pipeline | See "RAG / Embeddings: Not Warranted" section above — corpus is small, static, and already centrally editable; RAG adds infra and staleness risk for no accuracy gain at this scale |
| Vehicle matcher approach | Structured output (`output_config.format` + Zod schema) on Haiku 4.5 | Embedding similarity search against catalog entries | Closed, enumerable catalog (finite brand/model list) — constrained extraction with a schema is more reliable and simpler than similarity search, and doesn't need an embeddings pipeline at all |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| LangChain / LangChain.js | Unnecessary abstraction for four features that are single-agent, tool-light, and don't need chain composition or multi-agent graphs | `ai` SDK + `@convex-dev/agent` |
| A standalone vector database (Pinecone, Weaviate, etc.) | No corpus large enough to need retrieval — see RAG section | Context-stuffing static CMS/catalog data directly into the system prompt |
| Next.js Route Handlers as the primary LLM call site | Fragments the Convex-first architecture this app already follows everywhere else, duplicates secret management, loses free persisted/resumable streaming | Convex actions (`@convex-dev/agent` for chat, plain actions for one-shot generation/matching) |
| `ANTHROPIC_API_KEY` in `NEXT_PUBLIC_*` or any client-exposed env var | Would leak the API key to every browser | Convex deployment env var (server-only) |
| Claude Opus/Sonnet for the vehicle matcher | Overkill and slower/pricier than necessary for a closed-set classification task | `claude-haiku-4-5` with structured outputs |
| Manual retry/reconnect logic for chat streaming | `@convex-dev/agent` already persists deltas and supports resubscription; hand-rolling this in a `TransformStream` inside an `httpAction` (the common Convex-without-the-Agent-component pattern seen in older Convex Stack articles) is strictly more code for a worse result | `@convex-dev/agent`'s built-in streaming |
| Prompt injection countermeasures via a separate moderation library | Unnecessary infra for this app's risk profile (a car-mat storefront, not a high-stakes domain); Claude's own safety classifiers plus a well-scoped system prompt are sufficient | System-prompt scoping + Claude's native `refusal` stop-reason handling |

## Stack Patterns by Variant

**If you want the fastest possible first working prototype (e.g. to validate UX before committing to the Convex Agent integration):**
- Use a Next.js Route Handler + `ai`'s `streamText()` + `useChat()` for the configurator assistant only
- Because it's the best-documented path and gets a working chat UI in front of users fastest — but plan to migrate to the Convex-action architecture before the support helper and content generator are built, so you don't end up with two different LLM-calling patterns in the same app

**If the vehicle matcher needs to run inline as the user types (autocomplete-style), not just on submit:**
- Debounce client-side and call the Convex action only after a pause (e.g. 400ms), and keep `max_tokens` low (~256) with Haiku — this is latency-sensitive in a way the other three features are not
- Because a chat-style UX tolerates a second or two of streaming; an inline autocomplete does not

**If the admin content generator needs to regenerate content for many products at once (bulk operation):**
- Run it as a Convex **action** invoked once per product from a loop in the admin UI (not a single mega-action looping internally), so progress is visible and a single failure doesn't lose all prior work
- Because Convex actions have execution time limits and you want per-product error isolation and visible progress in `/admin/icerik` or `/admin/urunler`, not an opaque all-or-nothing batch job

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `ai@^6.x` | `@ai-sdk/anthropic@^4.x` (verify exact pairing at install — AI SDK major-version pairings between `ai` core and provider packages are strict; an AI SDK v6 core with a v1.x/v2.x Anthropic provider built for AI SDK v4/v5 will not work) | Run `npm install ai@latest @ai-sdk/anthropic@latest` together rather than pinning versions independently, to avoid a mismatched pair |
| `@convex-dev/agent` | `convex@^1.42` (already installed) | Convex Components require a reasonably current Convex core version; the existing `convex@^1.42.1` in `package.json` should be compatible, but run `npx convex dev` after adding the component and watch for a schema/version warning |
| `zod` | `ai@^6.x`'s expected Zod major | AI SDK has changed its Zod version expectations across majors before (v4→v5 required a Zod bump in some provider packages) — install whichever Zod major `ai`'s own `package.json` peerDependencies specifies, don't assume v3 or v4 blindly |

## Sources

- Anthropic `claude-api` skill (bundled, HIGH confidence — official Anthropic documentation, current as of skill cache 2026-06-24): model IDs, current pricing, `output_config.effort`, `output_config.format` structured outputs, adaptive thinking defaults per model tier
- [Vercel AI SDK GitHub](https://github.com/vercel/ai) (MEDIUM confidence, web search) — AI SDK v6 released Dec 2025, unified provider API, 25+ providers
- [@ai-sdk/anthropic on npm](https://www.npmjs.com/package/@ai-sdk/anthropic?activeTab=versions) (MEDIUM confidence, web search, verify exact version pairing at install time)
- [Convex "AI Chat with HTTP Streaming"](https://stack.convex.dev/ai-chat-with-http-streaming) (MEDIUM confidence, WebFetch) — confirms Convex `httpAction`-based streaming pattern predates the Agent component; used here to justify why the Agent component (websocket-delta streaming) is a strict improvement over hand-rolled `TransformStream` streaming
- [Convex Agent component docs](https://docs.convex.dev/agents) and [npm package](https://www.npmjs.com/package/@convex-dev/agent) (MEDIUM confidence, web search) — threads, persistent streaming, websocket deltas, built on the AI SDK
- [Convex Rate Limiter component](https://www.convex.dev/components/rate-limiter) and [GitHub](https://github.com/get-convex/rate-limiter) (MEDIUM confidence, web search) — transactional, shardable, token-bucket/fixed-window rate limiting as a Convex Component
- Existing codebase conventions (`CLAUDE.md`, `convex/lib/adminAuth.ts`, `convex/orderNotify.ts`, `src/lib/admin-convex-key.ts`) (HIGH confidence, direct file read) — admin-key gating pattern, `"use node"` internalAction precedent, Convex-first data flow convention

---
*Stack research for: AI features layered onto existing Next.js + Convex e-commerce storefront (OTO POLİK v1.1)*
*Researched: 2026-07-17*
