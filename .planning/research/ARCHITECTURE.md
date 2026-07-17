# Architecture Research

**Domain:** AI features layered onto an existing Next.js 16 + Convex Turkish e-commerce storefront (OTO POLİK)
**Researched:** 2026-07-17
**Confidence:** HIGH (grounded directly in read code: `CLAUDE.md`, `convex/schema.ts`, `convex/orderNotify.ts`, `convex/lib/adminAuth.ts`, `src/lib/vehicle-data.ts`, `src/hooks/useAdminConvexKey.ts`, `src/app/admin/icerik/ContentManager.tsx`, `src/components/SiteChrome.tsx`) plus current Claude API guidance (`claude-api` skill, cached 2026-06-24).

## Standard Architecture

### System Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                     Customer-facing (.premium-site)                   │
│  ┌──────────────┐  ┌───────────────────┐  ┌────────────────────┐     │
│  │ ChatWidget    │  │ MatConfigurator    │  │ VehicleMatchInput  │     │
│  │ (floating,    │  │ (existing, adds   │  │ (existing free-    │     │
│  │  SiteChrome)  │  │  "Ask AI" bridge) │  │  text search box)  │     │
│  └──────┬───────┘  └─────────┬─────────┘  └──────────┬─────────┘     │
│         │ POST/stream         │ tool-calls the same    │ POST         │
│         ▼                     ▼ matcher function        ▼             │
├──────────────────────────────────────────────────────────────────────┤
│                    Next.js Route Handlers (src/app/api/ai/*)          │
│  ┌────────────────┐ ┌───────────────────┐ ┌────────────────────┐     │
│  │ /api/ai/chat    │ │ /api/ai/vehicle-  │ │ /api/ai/support    │     │
│  │ (SSE stream,    │ │  match (sync,     │ │  (SSE stream,       │     │
│  │  Anthropic SDK) │ │  Anthropic SDK)   │ │  Anthropic SDK)     │     │
│  └────────┬────────┘ └─────────┬─────────┘ └──────────┬──────────┘     │
│           │ tool_use: matchVehicle, getPricing, addToCartIntent       │
├───────────┼────────────────────┼───────────────────────┼──────────────┤
│           ▼                    ▼                       ▼             │
│   vehicle-data.ts (static, in-process — no embeddings needed)         │
│   mat-pricing.ts (calculateMatPrice — same source of truth)           │
├──────────────────────────────────────────────────────────────────────┤
│                          Convex (convex/*.ts)                         │
│  ┌───────────────┐ ┌────────────────┐ ┌────────────────────────┐     │
│  │ chatSessions   │ │ chatMessages    │ │ contentGenerations      │     │
│  │ (new table)    │ │ (new table)     │ │ (new table, admin-only) │     │
│  └───────────────┘ └────────────────┘ └────────────────────────┘     │
│  aiContent.ts ("use node" internalAction — admin content generator,   │
│    mirrors convex/orderNotify.ts pattern: server-side fetch to        │
│    Anthropic, writes result into contentGenerations, admin approves   │
│    → applies into contentSections/products via existing mutations)    │
├──────────────────────────────────────────────────────────────────────┤
│                        Admin (/admin, plain styling)                  │
│  ContentManager.tsx + new "AI Taslak" tab → useAdminConvexKey() →      │
│  Convex mutations gated by requireAdminKey() — same plumbing as       │
│  existing product/CMS CRUD, no new auth mechanism                     │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|---------------|-------------------------|
| Next.js Route Handlers (`src/app/api/ai/*`) | Own every LLM call — hold `ANTHROPIC_API_KEY`, run the Claude SDK, stream SSE back to the client, call `vehicle-data.ts`/`mat-pricing.ts` as in-process tool functions | `app/api/ai/chat/route.ts` using `client.messages.stream(...)`, `export const runtime = "nodejs"` |
| Vehicle matcher tool | Deterministic lookup: free-text vehicle description → `{brand, model, price}` from the static catalog | Plain TS function passed to Claude as a tool (`function calling`), no vector DB |
| Convex `chatSessions`/`chatMessages` tables | Durable transcript for support/configurator chat (optional but recommended for WhatsApp handoff + abuse auditing) | Written by the route handler via `ConvexHttpClient` (server-to-server), not by the browser directly |
| Convex `aiContent.ts` ("use node" internalAction) | Admin content generation — long-running batch call to Claude that must not block a browser request and needs no per-request secret exposure | Scheduled via `ctx.scheduler.runAfter(0, …)`, mirrors `convex/orderNotify.ts` |
| `contentGenerations` Convex table | Draft storage: AI output pending human review before it touches `products`/`contentSections` | `status: "pending" | "approved" | "rejected"`, admin-key-gated mutations |
| `ChatWidget` (new client component) | Floating chat UI in `SiteChrome.tsx`, `.premium-site` scoped, streams tokens, hands off to WhatsApp on "ready to order" | `"use client"`, `fetch(..., {body, signal})` + `ReadableStream` reader, no Vercel AI SDK dependency required |
| `ContentManager.tsx` "AI Taslak" tab | Admin UI to request a generation, poll/subscribe to `contentGenerations`, edit, then Approve → existing `updateSectionAction`/product mutation | Reuses `useAdminConvexKey()` + existing Convex `useMutation` pattern already in `/admin/urunler` |

## Recommended Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── ai/                        # NEW — all LLM calls live here, not in Convex
│   │       ├── chat/route.ts          # configurator assistant, SSE stream
│   │       ├── support/route.ts       # support/order-helper, SSE stream
│   │       ├── vehicle-match/route.ts # sync JSON, no streaming needed (short call)
│   │       └── content/route.ts       # admin content generator kickoff (POST → enqueues Convex action)
│   └── admin/
│       └── icerik/
│           └── AIGeneratorPanel.tsx   # NEW — tab inside ContentManager.tsx
├── components/
│   ├── ai/                            # NEW
│   │   ├── ChatWidget.tsx             # floating widget, mounted in SiteChrome.tsx
│   │   ├── ChatMessageList.tsx
│   │   ├── VehicleMatchInput.tsx      # used inside MatConfigurator.tsx step 1
│   │   └── useChatStream.ts           # fetch+ReadableStream hook, no external chat SDK
│   └── configurator/
│       └── MatConfigurator.tsx        # MODIFIED — mounts VehicleMatchInput, keeps existing manual pickers as fallback
├── lib/
│   ├── ai/                            # NEW
│   │   ├── anthropic-client.ts        # lazy client, same null-if-unset pattern as convex-server.ts
│   │   ├── tools.ts                   # tool defs + handlers: matchVehicle, getMatPrice, summarizeCart
│   │   ├── system-prompts.ts          # Turkish system prompts per assistant (versioned, testable)
│   │   └── grounding.ts               # builds the "site content" context block (FAQ, shipping, sizing) from cms.ts/site-settings.ts
│   └── vehicle-data.ts                # UNCHANGED — becomes the tool's data source, no new index
convex/
├── schema.ts                          # MODIFIED — add chatSessions, chatMessages, contentGenerations
├── aiChat.ts                          # NEW — public mutations to persist transcript (called server-side only)
├── aiContent.ts                       # NEW — "use node" internalAction, same shape as orderNotify.ts
└── lib/
    └── adminAuth.ts                   # UNCHANGED — reused by aiContent.ts mutations
```

### Structure Rationale

- **`src/app/api/ai/`:** All LLM calls are Next.js route handlers, not Convex actions. Convex `"use node"` actions exist for the admin generator (long-running, no streaming UX needed, benefits from Convex's scheduler/retry semantics) but the customer-facing streaming chat stays in Next.js because Vercel's route handlers support token-by-token SSE natively and keep `ANTHROPIC_API_KEY` out of the Convex deployment env entirely — one secret, one place.
- **`src/lib/ai/`:** Mirrors the existing `src/lib/` lazy-client convention (`convex-server.ts`, `convex-client.ts`) — `anthropic-client.ts` returns `null` when `ANTHROPIC_API_KEY` is unset, and every caller degrades gracefully (see Graceful Fallback pattern below).
- **`convex/aiChat.ts` vs `convex/aiContent.ts` split:** `aiChat.ts` holds plain public mutations (`createSession`, `appendMessage`) called *from the route handler* (server-to-server via `ConvexHttpClient`, never from the browser) so transcripts land in the same Convex deployment as orders — useful for correlating a chat session with the order it produced. `aiContent.ts` is the only new `"use node"` action, because only the admin generator needs outbound `fetch` to Anthropic from inside Convex.

## Architectural Patterns

### Pattern 1: LLM calls live in Next.js route handlers, not Convex actions

**What:** All three customer-facing AI features (configurator assistant, vehicle matcher, support helper) call Anthropic directly from `src/app/api/ai/*/route.ts`. Only the admin content generator uses a Convex `"use node"` internalAction.

**When to use:** Default to route handlers whenever the caller is a browser needing a **streamed** response, or when you want to keep the LLM API key out of a second deployment target.

**Trade-offs:**

| Concern | Next.js Route Handler | Convex `"use node"` Action |
|---|---|---|
| Streaming (SSE) to browser | Native — `ReadableStream` response, works with Vercel's edge/node runtime | Convex actions cannot stream partial results to the browser directly (client would need to poll a mutating document instead) — awkward for a chat UI |
| Secrets | `ANTHROPIC_API_KEY` lives in Vercel env only | Would need the key duplicated into Convex deployment env (`npx convex env set`) — one more place to rotate |
| Rate limiting | Standard Next.js middleware / `proxy.ts` matcher, or an in-memory/edge KV limiter per IP | Convex has no built-in per-IP rate limit primitive; would need a Convex table + mutation-side counter, more moving parts for no benefit here |
| Long-running / fire-and-forget work | Route handlers time out on Vercel (10s Hobby / 60s+ Pro, streaming extends this) — fine for chat turns, risky for a multi-minute batch job | `ctx.scheduler.runAfter(0, …)` internalActions run detached from any HTTP request — ideal for "generate descriptions for 40 products overnight" |
| Existing precedent in this repo | None yet, but matches `src/app/odeme/` and other route-handler-style server logic | `convex/orderNotify.ts` is the exact template: `"use node"`, reads env vars, does `fetch()`, best-effort |

**Conclusion:** chat/support/vehicle-match → route handlers (streaming, short-lived, one secret). Admin batch content generation → Convex `"use node"` action (long-running, benefits from Convex's job-like scheduling and the fact the result must land in Convex anyway).

**Example (chat route handler, Node runtime, SSE):**
```typescript
// src/app/api/ai/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient } from "@/lib/ai/anthropic-client";
import { CONFIGURATOR_SYSTEM_PROMPT } from "@/lib/ai/system-prompts";
import { configuratorTools, runConfiguratorTool } from "@/lib/ai/tools";

export const runtime = "nodejs"; // needs Node APIs (fetch to Convex, etc.)

export async function POST(req: Request) {
  const client = getAnthropicClient();
  if (!client) {
    return new Response(JSON.stringify({ error: "ai_unavailable" }), { status: 503 });
  }
  const { messages } = await req.json();

  const stream = client.messages.stream({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: CONFIGURATOR_SYSTEM_PROMPT,
    tools: configuratorTools,
    messages,
  });

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
        }
        // tool_use handling: run runConfiguratorTool(...) then continue the loop —
        // see Tool Runner pattern in claude-api skill for the full agentic loop.
      }
      controller.close();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache" },
  });
}
```

### Pattern 2: Vehicle matcher as a tool-call function over static data, not an embedding index

**What:** `matchVehicle(freeTextInput: string)` is a plain TypeScript function that fuzzy-matches against the already-in-memory `vehicle-data.ts` catalog (currently ~brand → model[] records with `bodyType`, price derived from `mat-pricing.ts` via `getVehiclePrice()`), exposed to Claude as a **tool** (function-calling), not backed by a vector database.

**When to use:** The catalog is small (dozens of brands, low hundreds of models total, all in one static TS file, no runtime growth), fits entirely in a single Claude request as either (a) a tool the model calls with a query string it resolves fuzzy-matching in code, or (b) inlined directly into the system/tool-result context for the model to reason over. Neither needs retrieval infrastructure.

**Trade-offs:**

| Approach | Fit for this catalog | Cost |
|---|---|---|
| **Tool/function-calling over static array** (recommended) | Exact — reuses the same `vehicle-data.ts` + `getVehiclePrice()`/`calculateMatPrice()` that `MatConfigurator.tsx` and `vehicle-seo.ts` already depend on. Zero new infra, zero data drift risk (single source of truth stays `vehicle-data.ts`) | One extra tool-call round trip per turn; negligible for a catalog this size |
| Embedding index (e.g. pgvector, Pinecone, Convex vector search) | Overkill — buys nothing when the whole catalog fits in a few KB of text and simple string similarity (Levenshtein / token overlap) already resolves "2019 Passat variant" → `Volkswagen Passat Station Wagon` reliably | New infra (embedding pipeline, index sync job whenever `vehicle-data.ts` changes), new failure mode, no accuracy gain at this catalog size |

**Recommended implementation:** two-stage — (1) deterministic fuzzy match in plain code (normalize Turkish text, token-overlap or a small library like `fastest-levenshtein` against `brand + model` strings) as the *first* pass, tried before ever calling Claude; (2) if ambiguous/no-match, hand the top-N candidates plus the user's raw text to Claude as a tool result and let it pick/ask a clarifying question in Turkish. This keeps the common case fast and cheap (no LLM call at all for a clean match like "BMW 3 Serisi 2020") and reserves the LLM for genuinely ambiguous free text ("beyaz passat aracım, 2019 sanırım").

```typescript
// src/lib/ai/tools.ts
export const matchVehicleTool = {
  name: "match_vehicle",
  description:
    "Serbest metin araç tanımını (marka, model, yıl, varyant) statik araç kataloğuyla eşleştirir ve fiyatı döner. " +
    "Kullanıcı aracını net şekilde belirtmediğinde veya emin olunamadığında çağır.",
  input_schema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Kullanıcının yazdığı araç tanımı, ör. '2019 passat variant'" },
    },
    required: ["query"],
  },
};

export function runMatchVehicle(query: string) {
  const candidates = fuzzyMatchVehicles(query); // token-overlap over brandData from vehicle-data.ts
  if (candidates.length === 1) {
    return { match: candidates[0], price: getVehiclePrice(candidates[0].brand, candidates[0].model) };
  }
  return { candidates: candidates.slice(0, 5) }; // let Claude ask a clarifying question in Turkish
}
```

This tool is shared: the **configurator assistant** calls it when the user types a vehicle in chat instead of using the dropdowns, and the standalone **VehicleMatchInput** free-text box calls the same `/api/ai/vehicle-match` route (non-streaming, single tool round trip) directly — one implementation, two entry points. Build the matcher first; the configurator assistant depends on it.

### Pattern 3: Admin content generation as a draft-and-approve Convex flow, gated by the existing admin key

**What:** Admin clicks "AI ile oluştur" in `ContentManager.tsx` (new tab) → Next.js server action or `/api/ai/content` route calls Claude with product/section context → result is written to a new `contentGenerations` Convex table with `status: "pending"` via an admin-key-gated mutation → admin reviews/edits inline → "Onayla" calls the **existing** `updateSectionAction`/product-update mutation (unchanged) to publish, and marks the generation `status: "approved"`.

**When to use:** Any admin-facing AI output that writes into `products`/`contentSections`/`faqItems` (SEO meta, descriptions, FAQ copy) — never auto-publish LLM output directly into customer-facing CMS tables.

**Trade-offs:** Adds one extra table and one extra click vs. writing directly, but matches the site's existing "admin reviews everything before it's live" posture (CLAUDE.md: admin CRUD already goes through explicit mutations, no auto-publish anywhere) and gives you an audit trail / undo point for free.

**Example (Convex side, mirrors `adminAuth.ts` usage elsewhere):**
```typescript
// convex/aiContent.ts
"use node";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const generateProductCopy = internalAction({
  args: { generationId: v.id("contentGenerations"), adminKey: v.string() },
  handler: async (ctx, { generationId, adminKey }) => {
    const gen = await ctx.runQuery(internal.aiContentQueries.getById, { id: generationId });
    if (!gen) return null;
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      await ctx.runMutation(internal.aiContentQueries.markFailed, { id: generationId, reason: "no_api_key" });
      return null;
    }
    // fetch() to Anthropic here, same best-effort try/catch shape as orderNotify.ts
    const draft = await callAnthropicForCopy(gen.productSlug, gen.kind, apiKey);
    await ctx.runMutation(internal.aiContentQueries.markReady, { id: generationId, draft });
    return null;
  },
});
```

`requireAdminKey()` from `convex/lib/adminAuth.ts` is reused unchanged on the *public* mutations that create/approve/reject a `contentGenerations` row — the internalAction itself doesn't need it (Convex internal functions aren't browser-reachable), matching how `orderNotify.notifyAdmin` is scheduled internally without re-checking a key.

## Data Flow

### Request Flow — configurator chat turn

```
ChatWidget (browser)
    ↓ fetch POST /api/ai/chat  {messages: [...]}
Next.js route handler (Node runtime)
    ↓ client.messages.stream({tools: [matchVehicleTool, getPriceTool], ...})
Claude API ──tool_use: match_vehicle──→ runMatchVehicle() (in-process, reads vehicle-data.ts)
    ↓ tool_result appended, loop continues
Claude API ──text deltas──→ SSE chunks ──→ ChatWidget renders incrementally
    ↓ (best-effort, fire-and-forget) POST to Convex via ConvexHttpClient
convex/aiChat.ts: appendMessage(sessionId, role, content)  [chatMessages table]
    ↓ when user confirms configuration in chat
ChatWidget calls the SAME useCart().addItem() the manual configurator uses
    → checkout flow (src/app/odeme/) is completely unchanged from here on
```

### State Management

```
Chat transcript (client) ─┬─ ephemeral React state (message list, streaming buffer)
                           └─ mirrored best-effort to Convex chatMessages
                                (server-to-server write only — browser never
                                 gets a direct Convex mutation for this, avoiding
                                 a new admin-key-shaped auth surface for chat)

Cart state ─── UNCHANGED: still src/context/cart-context.tsx / cart-store.ts.
               The AI assistant's only integration point is calling the existing
               useCart().addItem() — it does not get its own cart representation.
```

### Key Data Flows

1. **Configurator assistant → cart:** chat turns never touch Convex `orders` or `products` directly. The assistant's terminal action is calling the existing `addItem()` from `cart-context.tsx`, after which the existing checkout flow (WhatsApp handoff, best-effort Convex order write) takes over completely unmodified. This is the cleanest integration seam in the whole feature set — the AI features are additive to cart population, not a parallel checkout path.
2. **Vehicle matcher → configurator/chat:** a single pure function (`runMatchVehicle`) is the shared dependency of both `VehicleMatchInput` (used inside `MatConfigurator.tsx`) and the chat tool. Build this once; both features consume it.
3. **Admin content generator → CMS:** LLM output never writes to `products`/`contentSections` directly — it lands in `contentGenerations` first, then flows through the *existing* `updateSectionAction`/product-update Convex mutations only after human approval, so no new write path is added to customer-facing content tables.
4. **Support helper → grounding:** `/api/ai/support` builds its context block from `getContentPage("home")`/FAQ data (already fetched via `cms.ts`) and `site-settings.ts` (shipping fee, thresholds, phone) at request time — no separate knowledge base to keep in sync; it reads the same server-side functions the storefront pages already call.

## Scalability Considerations

| Concern | At current scale (single storefront, low-hundreds orders/mo) | If traffic grows 10x | If this becomes multi-tenant |
|---|---|---|---|
| LLM cost | Negligible — gate everything behind lazy-init so cost is zero when `ANTHROPIC_API_KEY` is unset (dev/preview envs) | Cache the vehicle-match fast-path (deterministic, no LLM call) aggressively; only the ambiguous-match and open-ended chat turns hit the API | N/A — out of scope for this milestone |
| Rate limiting | None needed initially, but add a simple per-IP counter (edge KV or in-memory with `proxy.ts`) before public launch to prevent chat abuse driving up API spend | Move to a real rate limiter (Upstash Redis, Vercel KV) keyed by session/IP | — |
| Convex chat tables | `chatSessions`/`chatMessages` grow linearly with usage; no special indexing needed beyond `by_session` | Add a TTL/cleanup job (Convex cron) to prune old anonymous sessions | — |
| Admin content generation | Single admin, occasional batch runs — a Convex `"use node"` action per product is fine | If generating for the full catalog (hundreds of products) becomes routine, batch multiple products into fewer Claude calls (prompt caching on the shared system prompt) rather than one internalAction per product | — |

### Scaling Priorities

1. **First bottleneck:** unbounded chat usage driving Claude API spend before any rate limiting exists. Fix: add basic per-IP/session throttling in the route handler before the customer-facing chat ships to production, not after.
2. **Second bottleneck:** none expected at this project's scale — the vehicle catalog is static and small, Convex read/write volume for chat is trivial next to `orders`/`products` traffic this app already handles.

## Anti-Patterns

### Anti-Pattern 1: Putting `ANTHROPIC_API_KEY` on both Vercel and Convex "just in case"

**What people do:** Set the same secret in both deployment targets so either layer can call Claude.
**Why it's wrong:** Duplicated secrets are a rotation and leakage surface with no benefit here — this project's `"use node"` Convex actions are reserved for the one feature (admin content generation) that genuinely needs server-to-server calls outside an HTTP request lifecycle; everything else runs in Next.js.
**Instead:** `ANTHROPIC_API_KEY` lives in Vercel env for the three customer-facing route handlers. Only set it as a Convex env var (`npx convex env set`) if/when the admin content generator (the one Convex-side caller) is built — and even then, it's a second copy of one key for one well-defined reason, not a default.

### Anti-Pattern 2: Auto-publishing LLM-generated copy straight into `products`/`contentSections`

**What people do:** Wire the "Generate" button directly to the existing `updateSectionAction`/product mutation so AI output goes live immediately.
**Why it's wrong:** Breaks the site's existing admin-review posture (every other CMS edit in this codebase is an explicit, reviewed action) and risks publishing incorrect Turkish copy, wrong pricing claims, or hallucinated compatibility notes straight to the storefront.
**Instead:** Always land generations in `contentGenerations` as `pending` drafts; publishing is a separate, explicit admin action that reuses the existing mutation.

### Anti-Pattern 3: Building a vector database for a few hundred static vehicle records

**What people do:** Reach for embeddings/RAG by default whenever "match free text to catalog" is the task.
**Why it's wrong:** `vehicle-data.ts` is small, static, and already fully in-memory; a vector index adds a sync problem (index goes stale the moment someone edits `vehicle-data.ts` without also re-embedding) for no measurable accuracy gain over simple fuzzy string matching plus an LLM disambiguation fallback.
**Instead:** Tool-call function over the existing array (Pattern 2 above). Revisit only if the catalog moves to Convex and grows by orders of magnitude.

### Anti-Pattern 4: Blocking the checkout flow on the AI assistant

**What people do:** Route "confirm order" through the chat assistant, having it call Convex or trigger the WhatsApp handoff itself.
**Why it's wrong:** `src/app/odeme/` has a specific, already-correct sequence (open WhatsApp window synchronously on user interaction to dodge popup blockers, *then* write to Convex best-effort). Reimplementing or wrapping that inside an LLM tool call risks breaking the popup-blocker workaround (the `window.open` must happen synchronously inside the *original* user click/tap handler) and duplicates checkout logic in two places.
**Instead:** The assistant's job stops at `useCart().addItem()` plus optionally deep-linking to `/odeme`. The existing checkout page owns the WhatsApp handoff unchanged.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Anthropic Claude API | `@anthropic-ai/sdk` in Next.js route handlers (`src/lib/ai/anthropic-client.ts`, lazy singleton returning `null` if `ANTHROPIC_API_KEY` unset — same shape as `convex-server.ts`) | Model: `claude-opus-4-8` for chat/support (quality-sensitive, Turkish generation); consider `claude-haiku-4-5` for the vehicle-match disambiguation fallback only if cost becomes a concern — start with one model (`claude-opus-4-8`) everywhere for simplicity, optimize later |
| Anthropic Claude API (admin) | `@anthropic-ai/sdk` inside `convex/aiContent.ts` `"use node"` internalAction | Needs `ANTHROPIC_API_KEY` set as a Convex deployment env var (separate from/duplicate of the Vercel one) — only required once this feature is built |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `ChatWidget` (client) ↔ `/api/ai/chat` (server) | `fetch` + SSE (`ReadableStream`) | No Convex client SDK on this path — the browser never talks to Convex for chat, avoiding a new client-side auth story |
| Route handler ↔ Convex (chat persistence) | `ConvexHttpClient` (server-to-server, using a plain public mutation, not admin-key-gated — this is app-level telemetry, not admin data) | New file: `convex/aiChat.ts` |
| Route handler ↔ `vehicle-data.ts`/`mat-pricing.ts` | Direct in-process TS import (no network hop) | Reuses `getVehiclePrice()`, `calculateMatPrice()` — the assistant must produce the exact same price the manual configurator would, so it must call the same functions, not reimplement pricing logic in a prompt |
| Chat assistant ↔ Cart | `useCart().addItem()` from `cart-context.tsx`, called client-side once the assistant proposes a final configuration and the user confirms in the UI (not silently on the model's say-so) | Keeps a human-in-the-loop confirmation step before anything enters the cart |
| Admin "AI Taslak" tab ↔ Convex | `useAdminConvexKey()` + `useMutation`/`useQuery` against new `contentGenerations` table, admin-key-gated exactly like `/admin/urunler` | No new auth mechanism — reuses `requireAdminKey()` |
| `/api/ai/content` (kickoff) ↔ `convex/aiContent.ts` | Route handler calls a Convex mutation that schedules the internalAction (`ctx.scheduler.runAfter(0, …)`), mirroring how order creation schedules `orderNotify.notifyAdmin` | Keeps the actual Anthropic call inside Convex so it can retry/complete even if the admin closes the browser tab |

## New Convex Tables

Add to `convex/schema.ts`, following the existing style (indexes, `updatedAt: v.number()`, discriminated `v.union` for status/kind fields):

```typescript
// Chat sessions — one per widget conversation (anonymous or tied to a future order)
chatSessions: defineTable({
  kind: v.union(v.literal("configurator"), v.literal("support")),
  status: v.union(v.literal("active"), v.literal("closed")),
  clientId: v.optional(v.string()), // anonymous localStorage-generated id, not a user account
  orderId: v.optional(v.id("orders")), // linked after checkout, if the session led to an order
  createdAt: v.number(),
  updatedAt: v.number(),
}).index("by_client", ["clientId"]).index("by_status", ["status"]),

// Chat messages — transcript, mirrored best-effort from the route handler
chatMessages: defineTable({
  sessionId: v.id("chatSessions"),
  role: v.union(v.literal("user"), v.literal("assistant"), v.literal("tool")),
  content: v.string(),
  toolName: v.optional(v.string()), // set when role === "tool"
  createdAt: v.number(),
}).index("by_session_created", ["sessionId", "createdAt"]),

// Admin content generation drafts — pending review before publishing
contentGenerations: defineTable({
  kind: v.union(
    v.literal("product_description"),
    v.literal("product_seo"),
    v.literal("faq")
  ),
  targetSlug: v.string(), // product slug or contentSections sectionKey this draft is for
  prompt: v.string(), // what was asked, for audit/regeneration
  draft: v.optional(v.string()), // the generated content (JSON-encoded for multi-field drafts like SEO title+description)
  status: v.union(
    v.literal("pending"),
    v.literal("ready"),
    v.literal("approved"),
    v.literal("rejected"),
    v.literal("failed")
  ),
  failureReason: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_status", ["status"])
  .index("by_target", ["targetSlug"]),
```

`chatSessions`/`chatMessages` are optional for a v1 configurator assistant (the assistant can work statelessly per-request, re-sending the transcript from client state each turn) but recommended before the **support helper** ships, since correlating "what did the AI tell the customer" with a subsequent order/WhatsApp conversation is valuable for a small team fielding real customer questions.

## Should the graceful-fallback pattern extend to "site works without an LLM key"?

**Yes — required, not optional**, and it's a small lift given the existing convention. `src/lib/convex-server.ts`/`convex-client.ts` already establish the exact shape to copy:

```typescript
// src/lib/ai/anthropic-client.ts
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null | undefined;

export function getAnthropicClient(): Anthropic | null {
  if (client !== undefined) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    client = null;
    return null;
  }
  client = new Anthropic({ apiKey });
  return client;
}
```

Every AI surface must degrade rather than break when this returns `null`:

- **Chat widget:** don't render the floating widget at all if `/api/ai/chat` reports `503`/unavailable on first load (or simplest: the route handler returns 503 immediately, `ChatWidget` catches that and either hides itself or shows a static "WhatsApp'tan yazın" fallback pointing at the existing `WhatsappFloat` component).
- **Vehicle matcher:** `VehicleMatchInput` is strictly *additive* to the existing brand/model dropdowns in `MatConfigurator.tsx` — if the AI route is unavailable, the manual pickers (already built, already the primary path) keep working exactly as today. This is the easiest fallback in the whole feature set because the fallback UI already exists and ships today.
- **Support helper:** same widget-hide-or-static-fallback treatment as chat.
- **Admin content generator:** the "AI ile oluştur" button either doesn't render or shows a disabled state with a tooltip when `ANTHROPIC_API_KEY` isn't configured on Convex — admins can still write descriptions/SEO/FAQ by hand through the existing `ContentManager.tsx` fields, unchanged.

This mirrors the Convex fallback pattern's actual purpose in this codebase: the site must be deployable and fully functional (minus the new AI layer) with zero AI configuration, exactly as it's already deployable with zero Convex configuration.

## Build Order

Ordered by dependency, not by feature-list order in the milestone doc:

1. **`src/lib/ai/anthropic-client.ts` + `src/lib/ai/tools.ts` (vehicle matcher tool + fuzzy-match function).** Foundational — nothing else can be tested without it, and it has zero UI surface of its own to design, making it the fastest way to de-risk the "does tool-calling over `vehicle-data.ts` actually resolve real free-text input well" question before building any chat UI on top of it.
2. **`/api/ai/vehicle-match` route handler + `VehicleMatchInput` component, wired into `MatConfigurator.tsx`.** Smallest complete vertical slice: one route, one component, additive to an existing working flow, immediately demoable, and validates the fallback pattern (manual dropdowns keep working if this fails) end-to-end before more AI surfaces depend on the same pattern.
3. **`/api/ai/chat` route handler + `ChatWidget` (configurator assistant), reusing the vehicle-match tool from step 1.** This is where streaming, SSE, and the tool-calling loop get built once and then reused by step 4. Cart handoff (`useCart().addItem()`) is the terminal integration point — no checkout changes needed.
4. **`/api/ai/support` route handler, reusing `ChatWidget`'s streaming plumbing with a different system prompt and grounding context (FAQ/shipping/site-settings).** Cheap once step 3 exists — mostly a new system prompt, a grounding-context builder (`src/lib/ai/grounding.ts`), and possibly the `chatSessions`/`chatMessages` Convex tables if transcript persistence is wanted for this feature specifically (recommended here, optional for step 3).
5. **`contentGenerations` Convex table + `convex/aiContent.ts` + admin "AI Taslak" tab in `ContentManager.tsx`.** Fully independent of steps 1–4 (different auth model, different Convex-vs-Next.js split, different UI surface) — can be built in parallel by a different work stream, or last, since it's admin tooling rather than customer-facing and has the smallest blast radius if delayed.

Steps 1–2 are the correct "phase 1" of a roadmap: they deliver a complete, demoable, low-risk feature (vehicle matcher) that also validates the exact tool-calling and fallback patterns every subsequent AI feature reuses.

## Sources

- Direct codebase reads (HIGH confidence, primary source): `CLAUDE.md`, `.planning/PROJECT.md`, `convex/schema.ts`, `convex/orderNotify.ts`, `convex/lib/adminAuth.ts`, `src/lib/vehicle-data.ts`, `src/lib/mat-pricing.ts`, `src/hooks/useAdminConvexKey.ts`, `src/app/admin/icerik/ContentManager.tsx`, `src/components/SiteChrome.tsx`, `src/app/api/admin/convex-key/route.ts`
- `claude-api` skill (bundled, cached 2026-06-24): model selection (`claude-opus-4-8` default), streaming via `client.messages.stream()`, tool use / Tool Runner patterns, Next.js App Router route handler conventions for streaming SSE responses, Managed Agents vs plain API tradeoffs (Managed Agents explicitly not recommended here — this is simple tool-calling over a small static dataset, not an open-ended agent needing a hosted sandbox)

---
*Architecture research for: AI features on Next.js + Convex e-commerce storefront*
*Researched: 2026-07-17*
