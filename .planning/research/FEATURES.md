# Feature Research

**Domain:** AI-augmented e-commerce (single-brand premium car-accessory storefront, Turkish market, WhatsApp-checkout, Convex backend)
**Researched:** 2026-07-17
**Confidence:** MEDIUM (cross-checked web sources on established production patterns; no project-specific case studies of single-brand EVA-mat stores exist, so specifics are triangulated from general e-commerce AI patterns)

## Feature Landscape

### Table Stakes (Users Expect These — Once You Ship "AI Chat" At All)

These aren't required to exist at all (OTO POLİK works fine today without any AI). But once you commit to shipping an AI configurator/support surface, these behaviors are the bar users will silently expect — missing them makes the AI feel broken, not "beta."

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Streaming responses (token-by-token) | Any modern AI chat that "types" instantly-in-full feels laggy/fake next to ChatGPT-trained user expectations | LOW | Vercel AI SDK `streamText` + `useChat`/`useObject` gives this for free over a Next.js route handler |
| Grounded answers only (RAG over real site content, not free invention) | Users will ask exact shipping cost, sizing, care instructions — a hallucinated answer here is a trust-breaking and potentially legal/financial liability (wrong price, wrong delivery promise) | MEDIUM | Ground in `cms.ts`/`cms-defaults.ts` FAQ + `site-config.ts`/`site-settings.ts` (shipping, prices) content, not general web knowledge. Do not let the model "guess" a price — always compute via `mat-pricing.ts` |
| Clear scope boundary / on-topic refusal | An assistant that answers general car-repair or unrelated questions looks unprofessional for a premium brand and invites abuse | LOW–MEDIUM | System-prompt hardening + a short deny-list response ("Bu konuda size yardımcı olamıyorum, ancak paspas seçimi/sipariş konusunda...") |
| Escalation to a human/WhatsApp when uncertain | Users expect an "I don't know, let me connect you" path rather than a dead end or a confident wrong answer | LOW | Trivial here — WhatsApp is *already* the checkout channel (`src/lib/whatsapp.ts`), so "escalate" = generate a pre-filled `wa.me` link, no new channel needed |
| Conversation → cart/checkout handoff that actually adds real items | If the assistant recommends a config, it must call into the *real* `MatConfigurator`/cart logic (`useCart().addItem()`, `mat-pricing.ts`), not describe a fictional price | MEDIUM | Must be implemented as a tool-call into existing pricing/cart functions, never a free-text price computed by the LLM itself |
| Visible "AI" disclosure | Turkish consumer-protection norms and general trust expectations mean users should know they're talking to a bot, not a human rep | LOW | Simple UI label ("AI Asistan") — avoid impersonating a human sales rep |
| Mobile-first chat UI matching existing OLED-black/glass design system | The site has a very deliberate premium visual language (`premium-card`, `mac-glass`, Racing Red) — a generic white chatbox widget would look like a third-party plugin bolted on | LOW–MEDIUM | Reuse `surface-glass`/`mac-glass` classes; this is UI work, not AI work |
| Graceful degradation when AI is unavailable/misconfigured | Following the codebase's existing lazy-client + fallback pattern (Convex-first with static fallback) | LOW | If `OPENAI_API_KEY`/model provider env var is unset, hide/disable the AI entry points rather than showing a broken chat — same philosophy as `convex-server.ts` returning `null` |

### Differentiators (Where This Actually Adds Value for a Small Premium Single-Brand Store)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Vehicle matcher with fuzzy-first + LLM-fallback + confidence-based disambiguation | Solves a real, narrow, high-value problem: users type "2019 Passat variant" or "kaptan koltuğu Egea 2016" instead of using dropdowns. This is the single highest-leverage AI feature because it removes friction at the *first* configurator step | MEDIUM | Layer LLM only on top of existing `vehicle-search.ts` token/prefix matcher (already normalizes Turkish chars, already ranks matches) — don't replace it. LLM's job: parse free text into brand+model+year+trim tokens the existing matcher can search on, and handle cases the matcher returns 0 or many ambiguous results for |
| Configurator assistant that pre-fills the real stepper (not a parallel checkout path) | Differentiator vs. generic chatbot-bolted-on-top: the assistant *drives* the existing `MatConfigurator` (vehicle → floor/edge color → extras → price) via tool calls, so the user lands in the same trusted UI they'd use manually, just pre-filled | MEDIUM–HIGH | Requires exposing the configurator's step state as callable tools; guardrail: LLM should never itself state a final price — always defer to `calculateMatPrice` |
| WhatsApp message drafting (support + order) | Reduces the classic "user has to write the WhatsApp message themselves" friction; since checkout literally *is* WhatsApp here, an AI-drafted order summary (vehicle + colors + price + delivery notes) handed to the user to review-and-send is a natural fit unique to this business model | LOW–MEDIUM | Draft-then-user-sends preserves the existing "opens WhatsApp window synchronously" UX pattern in `odeme/` — AI drafts text, human still presses send, so no new liability/automation risk |
| Admin bulk content generation grounded in existing product/vehicle data | For a catalog with many brand+model landing pages (`/arac/[slug]`) and product descriptions, AI-assisted drafting genuinely saves admin time vs. writing dozens of near-identical Turkish descriptions by hand | LOW–MEDIUM | Feed the model structured facts (vehicle brand/model/bodyType from `vehicle-data.ts`, price tier from `mat-pricing.ts`, existing FAQ tone) rather than open-ended prompts, to keep brand voice and factual accuracy consistent |
| Turkish-native tone control tuned to "premium/Apple-Porsche" brand voice | Generic AI content generators default to generic marketing tone; a system prompt encoding the project's specific brand voice (premium, confident, not salesy-cheap) is a real differentiator vs. just pasting into ChatGPT | LOW | This is a prompt-engineering asset (a written style guide/system prompt), not a technical build — cheap to do well, easy to do badly |

### Anti-Features (Commonly Requested, Often Problematic for This Store's Size/Model)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Fully autonomous order placement by the AI (no human review) | "Let the bot just complete the checkout for the user" sounds efficient | This business has **no payment gateway** — every order is a manual WhatsApp negotiation/confirmation. An AI that "places orders" autonomously breaks the entire trust model (a human at OTO POLİK currently confirms every order by reading the WhatsApp message) and risks wrong-price/wrong-vehicle orders going out uncontrolled | AI drafts the WhatsApp message; the customer (not the AI) sends it, exactly as the current manual flow works today |
| General-purpose open-domain chatbot ("ask me anything") | Feels more impressive/flexible in a demo | For a single-brand store with ~one product category (EVA mats), an open-domain assistant invites off-topic abuse, higher token cost, higher hallucination surface, and dilutes brand focus — plus more prompt-injection attack surface | Narrow, tool-gated assistant scoped strictly to vehicle matching, configuration, pricing, and site-content Q&A |
| Real-time inventory/stock-aware AI recommendations | Sounds like standard "smart retail AI" | This catalog is a made-to-order EVA mat business (per-vehicle, per-color config) — there is no meaningful "stock" concept to reason about; building this borrows complexity from a different business model (rack-and-stock retail) that doesn't apply here | None needed — the configurator already handles product/price logic deterministically |
| AI auto-publishing generated content directly to the live CMS | Saves an admin click | AI content generators hallucinate specs/claims; auto-publish to a live product page risks factual errors (wrong compatible vehicle, wrong price claim) reaching customers with zero human check — especially risky for SEO meta/legal-adjacent claims | Draft → admin review/edit → explicit "Publish" action, mirroring the existing `/admin/icerik` (ContentManager) manual-edit pattern |
| Multi-turn "AI sales agent" that can override discounts/pricing | Feels like a powerful upsell tool | Any AI capable of asserting a price outside `mat-pricing.ts`'s single-source-of-truth math immediately creates two sources of truth and a business risk (an AI could quote a lower price than the real config) | AI can *describe* extras/upsells in natural language, but every price shown to the user must be computed via the existing `calculateMatPrice`/site-settings pricing, never generated by the LLM |
| Voice assistant / voice ordering | Trendy, "the future of shopping" | Disproportionate build cost (speech-to-text, Turkish accent handling, telephony) vs. value for a low-volume premium accessory store; no existing infrastructure to hook into | Text chat is sufficient; revisit only if message volume data later justifies it |
| Replacing the existing manual dropdown configurator with chat-only flow | "AI-first" feels modern | The existing spring-physics/glassmorphism stepper configurator (Phase 3, already shipped) is a core piece of the "luxury Apple/Porsche" UX investment — forcing everyone through chat would regress a polished, tested UI for a subset of users who prefer typing | AI assistant is an *optional accelerant/entry point* alongside the existing configurator, not a replacement — "chat to pre-fill" not "chat instead of" |
| Storing/training on raw customer chat transcripts without care | Assumed necessary "to improve the AI" | Turkish KVKK (personal data protection law) exposure for a small store with no dedicated legal/compliance function; unnecessary retention risk for a support chatbot that doesn't need to fine-tune anything | Stateless or short-TTL conversation logging only as needed for debugging; no training pipeline; scope this explicitly in any privacy copy shown near the chat |

## Feature Dependencies

```
AI Configurator Assistant
    └──requires──> Existing MatConfigurator step/state API (vehicle, colors, extras)
    └──requires──> mat-pricing.ts (calculateMatPrice) as the only price source
    └──requires──> useCart().addItem() (real cart write, not simulated)
    └──enhances──> AI Vehicle Matcher (assistant's first step is often "which car?")

AI Vehicle Matcher
    └──requires──> vehicle-search.ts (existing fuzzy/token matcher) as primary matcher
    └──requires──> vehicle-data.ts (brand/model/bodyType catalog) as ground truth
    └──requires──> mat-pricing.ts / getVehiclePrice() for correct price tier on match
    └──enhances──> AI Configurator Assistant (feeds it a resolved vehicle)
    └──enhances──> /arac/[slug] SEO landing pages (could route ambiguous matches there)

AI Content Generator (admin)
    └──requires──> Convex CMS schema (contentSections, faqItems, products, siteSeo)
    └──requires──> Admin auth (admin_session cookie / ADMIN_SECRET) — reuse requireAdminKey()
    └──requires──> Human review/publish step (draft state before live)
    └──conflicts──with──> Auto-publish (see anti-features)

AI Support / Order Helper
    └──requires──> Grounded content sources: cms.ts/cms-defaults.ts (FAQ), site-config.ts/site-settings.ts (shipping/pricing)
    └──requires──> whatsapp.ts (existing wa.me link builder) for message drafting/handoff
    └──enhances──> AI Configurator Assistant (can hand off "let's build your mat" mid-support-chat)
    └──enhances──> AI Vehicle Matcher (support chat may need to resolve a vehicle mid-conversation)
```

### Dependency Notes

- **AI Configurator Assistant requires the existing MatConfigurator's step/state logic:** the assistant should be a *controller* over the same state (vehicle, floor/edge color, extras) that the manual stepper uses, exposed as tool calls — not a separate reimplementation, or the two paths will drift and produce inconsistent prices/previews.
- **AI Configurator Assistant requires `mat-pricing.ts` as the only price source:** this is the most important guardrail dependency in the whole milestone — every AI-quoted price must trace back to `calculateMatPrice`, never be composed by the LLM from training-data guesses about "typical mat prices."
- **AI Vehicle Matcher requires `vehicle-search.ts` as primary matcher, LLM as fallback/parser:** the existing normalized-token search (already handles Turkish diacritics, brand/model/bodyType) is fast, free, deterministic, and already ranks results — the LLM's value-add is narrowly parsing messy free text ("19 model passat," "kaptan pikap 4x4") into the tokens that matcher expects, and handling disambiguation dialogue when multiple/zero results come back. Skipping the existing matcher and routing every query straight to an LLM would be slower, costlier, and less deterministic for the common case (a typo of an exact brand+model).
- **AI Content Generator requires a human review/publish step, conflicts with auto-publish:** the existing `/admin/icerik` pattern is manual-edit-then-save; AI content generation should produce a *draft* state reviewable in the same UI before it becomes the live `ContentSection`/product description, preserving the "admin controls what's live" invariant the CMS already has.
- **AI Support Helper requires grounded content sources, not open knowledge:** shipping thresholds, prices, and care instructions are business facts that live in Convex/static config and change over time (editable at `/admin/ayarlar`) — the assistant must re-fetch these at answer-time (or be re-grounded on every deploy), never bake them into a static system prompt that goes stale.
- **AI Support Helper enhances but doesn't replace WhatsApp checkout:** all "helper" output should culminate in either an informative Turkish answer or a pre-filled WhatsApp handoff — never a competing checkout path, since there is no payment gateway to complete an order any other way.

## MVP Definition

### Launch With (v1.1 — this milestone)

- [ ] AI Vehicle Matcher (free text → resolved brand/model with confidence, disambiguation UI on ties/misses) — highest leverage-to-effort ratio, directly reduces configurator drop-off, builds on existing `vehicle-search.ts`
- [ ] AI Configurator Assistant (Turkish chat that walks vehicle → colors/extras → price → WhatsApp) — the flagship customer-facing feature named in PROJECT.md; must call real pricing/cart functions, not simulate them
- [ ] AI Support/Order Helper scoped to shipping/sizing/care Q&A + WhatsApp message drafting — narrow scope (grounded RAG over existing CMS/FAQ content), reuses existing WhatsApp link-building
- [ ] AI Content Generator (admin) for product descriptions + SEO titles/meta + FAQ copy, draft-only until admin publishes — internal tool, lower risk surface, big time-save for a catalog with many vehicle landing pages

### Add After Validation (v1.x)

- [ ] Conversation analytics (which questions the AI can't answer / where users abandon) — needed to prove the ROI case before investing further, and to find real gaps in the grounded knowledge base
- [ ] Proactive assistant nudges (e.g., "not sure which mat fits? ask the assistant") surfaced contextually on `/arac/[slug]` pages — only once the core assistant's answer quality is proven
- [ ] Multi-language content generation (if OTO POLİK ever serves non-Turkish markets) — explicitly out of scope now since "UI copy, routes, and validation are all in Turkish"

### Future Consideration (v2+)

- [ ] Voice ordering / voice assistant — disproportionate cost for current message volume; revisit only with real usage data
- [ ] AI-personalized product recommendations based on browsing history — requires a tracking/personalization layer this brownfield app doesn't have yet, and the catalog is narrow enough (EVA mats only) that personalization has limited headroom
- [ ] Full autonomous order-taking without human-visible WhatsApp step — blocked on this business adopting a real payment gateway first; today's "no payment gateway, WhatsApp-confirmed" model is a deliberate trust mechanism, not a gap to automate away

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| AI Vehicle Matcher (fuzzy+LLM fallback) | HIGH | MEDIUM | P1 |
| AI Configurator Assistant | HIGH | HIGH | P1 |
| AI Support/Order Helper (grounded Q&A + WhatsApp drafting) | MEDIUM | MEDIUM | P1 |
| AI Content Generator (admin) | MEDIUM | LOW–MEDIUM | P1 |
| Conversation analytics/observability | MEDIUM | LOW | P2 |
| Proactive contextual nudges | LOW–MEDIUM | LOW | P2 |
| Voice ordering | LOW (for this store's size) | HIGH | P3 |
| Personalized recommendations | LOW (narrow catalog) | HIGH | P3 |
| Fully autonomous checkout | N/A — anti-feature | — | Not planned |

**Priority key:**
- P1: Must have for this milestone (v1.1)
- P2: Should have, add once v1.1 usage data exists
- P3: Nice to have, future consideration only

## Competitor Feature Analysis

Direct competitor case studies for "single-brand premium EVA car-mat storefront with AI chat" don't exist publicly; the closest comparable patterns come from general e-commerce AI-assistant deployments and configurator-heavy verticals (made-to-order/customizable products).

| Feature | General e-commerce AI assistants (industry pattern) | Made-to-order/configurator businesses (industry pattern) | Our Approach |
|---------|--------------------------------------------------------|------------------------------------------------------------|--------------|
| Conversation entry point | Persistent floating chat widget, always available | Often embedded *inside* the configurator flow as a "need help?" assist, not a separate general widget | Both: a scoped floating assistant entry point, but its main job is to pre-fill/accelerate the existing stepper, not run a parallel flow |
| Catalog/SKU matching | Full-text/semantic search across large catalogs (thousands of SKUs) | Structured attribute matching (size/fit/variant) since the "catalog" is really a config space | Attribute-based fuzzy+LLM matching against `vehicle-data.ts` (brand/model/bodyType), which is structurally closer to the configurator pattern than to open catalog search |
| Escalation channel | Live chat agent, ticketing system, sometimes phone | Often email or a sales-rep callback for complex custom orders | WhatsApp — already the sole checkout channel, so escalation is "continue in the channel you'd checkout in anyway," a natural fit unique to this store |
| Content generation scope | Bulk SKU description generation across huge catalogs (thousands of items, heavy automation bias) | Smaller, more tightly curated content sets (fewer SKUs/variants, more brand-voice sensitivity) | Closer to the configurator-business pattern: modest number of vehicle landing pages + FAQ, favor quality/review over bulk automation |

## Sources

- [Conversational Commerce in the Age of AI Assistants](https://insiderone.com/conversational-commerce-ai-assistants/)
- [Human handoff for ecommerce chat: A 2025 guide to a seamless experience](https://www.eesel.ai/blog/human-handoff-for-ecommerce-chat)
- [Retail Chatbot: Metrics, Examples & How-To (Botpress)](https://botpress.com/blog/retail-chatbot)
- [Prompt Injection in Ecommerce AI: How to Stop All 6 Types](https://alhena.ai/blog/prompt-injection-ecommerce-ai-chatbot/)
- [LLM Guardrails Explained: Prompt Injection, PII Detection & Content Moderation](https://llmgateway.io/blog/llm-guardrails-explained)
- [LLM Guardrails for Data Leakage, Prompt Injection, and More (Confident AI)](https://www.confident-ai.com/blog/llm-guardrails-the-ultimate-guide-to-safeguard-llm-systems)
- [Fuzzy Matching and Semantic Search](https://ipullrank.com/fuzzy-matching-semantic-search)
- [TimeStampEval: A Simple LLM Eval and a Little Fuzzy Matching Trick](https://arxiv.org/html/2511.11594v1)
- [Product Content Generation Software for eCommerce (Describely)](https://describely.ai/)
- [AI Workflows E-Commerce Brands Can Use to Grow Faster](https://editorialge.com/ai-workflows-e-commerce/)
- [How RAG Chatbots Reduce Average Handle Time by 40% in Enterprises](https://wonderchat.io/blog/chatbot-with-rag)
- [RAG for Customer Support Automation](https://ai.exoticaitsolutions.com/blog/rag-for-customer-support-automation-how-to-deploy-ai/)
- [Best AI Chatbots with Human Handoff and Live Agent Escalation (2026)](https://sitegpt.ai/resources/best-ai-chatbots-human-handoff)
- [AI Chatbot ROI for Small Businesses: Real Numbers from Real Stores](https://thikaa.com/blog/small-business-ai-chatbot-roi?lang=en)
- [Getting Started: Next.js App Router — Vercel AI SDK docs](https://ai-sdk.dev/docs/getting-started/nextjs-app-router)
- Internal codebase review: `src/lib/vehicle-search.ts`, `src/lib/vehicle-data.ts`, `CLAUDE.md`, `.planning/PROJECT.md`

---
*Feature research for: AI-augmented e-commerce (single-brand storefront)*
*Researched: 2026-07-17*
