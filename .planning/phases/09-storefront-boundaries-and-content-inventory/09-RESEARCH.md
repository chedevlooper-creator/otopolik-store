# Phase 9: Storefront Boundaries and Content Inventory - Research

**Researched:** 2026-07-17
**Domain:** Storefront composition boundaries (customer AI UI gate, nav spine, `/destek` fallback, homepage CMS inventory)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Customer AI implementations, API routes, evals, and admin AI remain in code.
- Customer AI visibility uses a dedicated storefront UI flag; it is not controlled solely by the global AI capability kill switch.
- The customer UI flag defaults off.
- With the flag off, header, footer, configurator, and support chrome expose no AI or AI Destek entry points.
- `/destek` remains a valid route and becomes a static non-AI WhatsApp/contact fallback rather than a 404.
- Primary navigation is limited to Tasarla, Ürünler, Galeri, İletişim, and Sepet, with no dead hash anchors.
- Homepage CMS data and seed rows remain intact; inventory/mount decisions must be reversible.
- Admin remains outside `.premium-site`; Convex fallback architecture, pricing, cart, and checkout contracts are untouched.

### Claude's Discretion
- Exact environment variable name and helper location for the customer UI flag, provided it is server-evaluated, typed, and defaults off.
- Exact contact copy and layout on `/destek`, using existing design utilities and Turkish copy.
- Whether secondary destinations live in the footer or are omitted, provided primary navigation matches the locked spine.
- Format/location of the homepage section-key inventory artifact.

### Deferred Ideas (OUT OF SCOPE)
- Homepage section removal and hero/motion changes belong to Phase 10.
- Configurator/product simplification belongs to Phase 11.
- Cart/checkout changes belong to Phase 12.
- Lenis decision and cross-surface verification belong to Phase 13.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BOUND-01 | Dedicated customer AI UI flag defaults off without disabling admin AI or AI APIs | Add `isCustomerAiUiEnabled()` beside `isAiFeaturesEnabled()`; opt-in env; do not change API route guards |
| BOUND-02 | With flag off, header/footer/configurator/support chrome show no AI/Destek entry points | Exact link + mount sites listed below; gate or remove chrome entries |
| BOUND-03 | `/destek` non-AI WhatsApp/contact fallback (no chat UI) | Rewrite page when flag off; keep route; reuse `buildWhatsAppLink` + settings |
| BOUND-04 | Primary nav = Tasarla, Ürünler, Galeri, İletişim, Sepet; no dead anchors | Slim `NAV_LINKS`; keep Sepet button; drop hash + Destek + Ana Sayfa + Hakkımızda from primary |
</phase_requirements>

## Summary

Phase 9 is a presentation-boundary phase: add a **customer-only UI visibility flag** that defaults off, stop mounting customer AI islands, convert `/destek` into a non-chat WhatsApp/contact page, reduce primary nav to the conversion spine, and document homepage CMS section keys for Phase 10. No new dependencies. Do not delete AI libraries, API routes, evals, admin generator, Convex CMS rows, or seed data.

Today customer AI mounts are gated only by `isAiConfigured()` (`AI_FEATURES_ENABLED` + `ANTHROPIC_API_KEY`). Setting `AI_FEATURES_ENABLED=false` also disables admin content generation on `/admin/icerik`. That is why a separate storefront UI flag is mandatory. [VERIFIED: codebase `src/lib/ai/config.ts`, `src/app/admin/icerik/page.tsx`]

**Primary recommendation:** Add `CUSTOMER_AI_UI_ENABLED` + `isCustomerAiUiEnabled()` (opt-in, default off) in `src/lib/ai/config.ts`; evaluate in server pages/`layout.tsx` and pass a boolean into client chrome; compute `aiEnabled = isCustomerAiUiEnabled() && isAiConfigured()` for configurator/support mounts; leave all `/api/ai/*` and admin AI on `isAiConfigured()` alone.

**Do not edit** the user's uncommitted `src/components/home/Hero.tsx` change. Phase 9 does not need Hero edits.

## Project Constraints (from CLAUDE.md)

- Turkish UI copy, WhatsApp-confirmed orders, Convex-first with static fallback — preserve.
- Customer storefront uses `.premium-site`; admin stays outside it.
- Path alias `@/*` → `./src/*`; `convex/` is outside alias.
- Design system: OLED black, Racing Red `#ED1B24`, platinum `--sand`, Syne / Instrument Sans / JetBrains Mono — reuse `btn-*`, `surface-glass`, `mac-glass*`.
- Do not treat pre-existing `react-hooks/set-state-in-effect` lint in `Hero.tsx` / consent as regressions; do not add new set-in-effect patterns.
- Do not hand-edit generated `gallery-media.ts`.
- Pricing source of truth remains `mat-pricing.ts` (untouched this phase).
- Note: CLAUDE.md says no test suite; repo now has `vitest` (`npm test`) and Playwright (`npm run test:e2e`) — use those for Wave 0 validation. [VERIFIED: codebase `package.json`]

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Customer AI UI flag (`isCustomerAiUiEnabled`) | Frontend Server (SSR) | — | Server-only env read; defaults off; never `NEXT_PUBLIC_` for capability secrets (flag is visibility, still prefer server eval) |
| Gate ConfiguratorChat / VehicleMatchInput | Frontend Server (SSR) | Browser / Client | Server page computes `aiEnabled`; client receives boolean prop |
| Gate SupportChat / `/destek` fallback | Frontend Server (SSR) | — | `src/app/destek/page.tsx` is already async server component |
| Header / Footer Destek links | Frontend Server (SSR) → Client | Browser / Client | Header/Footer are client; pass flag from root `layout.tsx` via context/prop |
| Primary nav spine | Browser / Client | — | `NAV_LINKS` in `Header.tsx` |
| WhatsApp contact on `/destek` | Frontend Server (SSR) | CDN / Static | `getStoreSettings()` + `buildWhatsAppLink` |
| AI API cost/auth kill switch | API / Backend | — | Keep `isAiFeaturesEnabled` / `isAiConfigured` on routes |
| Admin AI content generator | Frontend Server (SSR) + API | — | Continues using `isAiConfigured()` only |
| Homepage CMS inventory | CDN / Static docs | Database / Storage | Document keys; do not delete Convex/seed rows |
| CMS section mounts (Phase 10) | Frontend Server (SSR) | Database / Storage | `page.tsx` composition; rows stay |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.2.10 | App Router server/client composition | Existing storefront [VERIFIED: npm registry / package.json] |
| React | 19.2.x (repo pin) | Client chrome + islands | Existing [VERIFIED: package.json] |
| TypeScript | 5.x | Typed env helper | Existing |
| Vitest | ^4.1.10 | Unit tests for flag helper | Existing pattern in `config.test.ts` [VERIFIED: package.json] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Existing `ai` / `@ai-sdk/*` | as installed | Keep installed; do not mount customer UI | Admin + preserved APIs |
| `lucide-react` | as installed | Icons on `/destek` fallback | Prefer fewer AI/bot icons on fallback |
| Playwright | ^1.61.1 | Optional smoke for nav + `/destek` | Extend only if cheap |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `CUSTOMER_AI_UI_ENABLED` + helper | Set `AI_FEATURES_ENABLED=false` | **Reject** — kills admin AI |
| Server-evaluated flag via layout prop | `NEXT_PUBLIC_CUSTOMER_AI_UI_ENABLED` | Public leak of intent; harder to keep server-only contract |
| Soft-hide Destek with CSS | Conditional mount / omit links | CSS hide still ships chat JS if imported |
| 404 `/destek` | Static WhatsApp fallback | Locked: keep route |

**Installation:** none — no new packages.

```bash
# No install for Phase 9
```

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| — | — | — | — | — | — | No new packages |

**Packages removed due to [SLOP] verdict:** none  
**Packages flagged as suspicious [SUS]:** none for this phase

Legitimacy check was run for ambient deps `next` / `react` only (not being installed). `next` returned `SUS`/`too-new` from the seam despite 42M+ weekly downloads — ignore for this phase; no install planned. [VERIFIED: gsd-tools package-legitimacy]

## Architecture Patterns

### System Architecture Diagram

```text
                    ┌─────────────────────────────────────┐
                    │  Env (server-only)                  │
                    │  CUSTOMER_AI_UI_ENABLED (default off)│
                    │  AI_FEATURES_ENABLED (kill switch)  │
                    │  ANTHROPIC_API_KEY                  │
                    └──────────────┬──────────────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              ▼                    ▼                    ▼
   isCustomerAiUiEnabled()   isAiConfigured()    (unchanged)
              │                    │
              │                    ├── /api/ai/* routes still guarded
              │                    └── /admin/icerik AI still uses this alone
              ▼
   layout.tsx (server) ──► flags context ──► Header/Footer (client)
              │
              ├── /olusturucu: aiUi && configured ?
              │       mount ConfiguratorChat + VehicleMatchInput
              │     else: MatConfigurator only
              │
              └── /destek: aiUi && configured ?
                      mount SupportChat
                    else: WhatsApp/contact static fallback
```

### Recommended Project Structure

```text
src/lib/ai/config.ts              # ADD isCustomerAiUiEnabled()
src/lib/ai/config.test.ts         # EXTEND flag unit tests
.env.example                      # DOCUMENT CUSTOMER_AI_UI_ENABLED=false
src/app/layout.tsx                # READ flag; pass to client chrome
src/context/…                     # OPTIONAL: thin StorefrontFlagsProvider OR extend Cms/Settings
src/components/Header.tsx         # SLIM NAV_LINKS; no Destek when flag off
src/components/Footer.tsx         # Remove "AI Destek" / dead hashes when flag off
src/app/olusturucu/page.tsx       # Gate chat with customer UI flag
src/app/destek/page.tsx           # Non-AI fallback when flag off; avoid unused SupportChat import
src/components/support/SupportChat.tsx          # KEEP (do not delete)
src/components/configurator/ConfiguratorChat.tsx # KEEP
src/components/configurator/VehicleMatchInput.tsx # KEEP
.planning/phases/09-…/09-HOMEPAGE-INVENTORY.md  # NEW artifact for Phase 10
```

### Pattern 1: Opt-in customer UI flag (default off)

**What:** Opposite polarity from `isAiFeaturesEnabled()` (which defaults **on** unless `"false"`/`"0"`).  
**When to use:** All customer AI chrome decisions.  
**Example:**

```typescript
// Source: mirror existing src/lib/ai/config.ts pattern [VERIFIED: codebase]
export function isCustomerAiUiEnabled(): boolean {
  const setting = process.env.CUSTOMER_AI_UI_ENABLED?.trim().toLowerCase();
  return setting === "true" || setting === "1";
}
```

### Pattern 2: Combined mount gate for customer islands

```typescript
// Source: extend src/app/olusturucu/page.tsx [VERIFIED: codebase]
const aiEnabled = isCustomerAiUiEnabled() && isAiConfigured();
// ConfiguratorChat + MatConfigurator aiEnabled={aiEnabled}
```

### Pattern 3: Server → client flag plumbing

Root `layout.tsx` already fetches settings/CMS server-side and wraps `CmsProvider` / `SettingsProvider`. [VERIFIED: codebase `src/app/layout.tsx`]  
**Use:** evaluate `isCustomerAiUiEnabled()` there and pass boolean into client Header/Footer (new field on an existing provider **or** a 10-line `StorefrontFlagsProvider`). Do **not** read non-`NEXT_PUBLIC_` env from `"use client"` Header/Footer.

### Pattern 4: Avoid shipping chat when flag off

On `/destek`, when flag is off, do not statically import `SupportChat` at module top if the planner can avoid it (dynamic `import()` only on the enabled branch, or split presentational fallback into the same file without the chat import). Static `import SupportChat` today always creates a client boundary dependency. [VERIFIED: codebase `src/app/destek/page.tsx`]

### Anti-Patterns to Avoid

- **Using `AI_FEATURES_ENABLED=false` as the hide mechanism:** disables admin AI. [VERIFIED: codebase]
- **`NEXT_PUBLIC_` for the only gate:** unnecessary exposure; Header can receive a prop instead.
- **CSS/`hidden` on chat while still mounting:** still hydrates AI SDK client code.
- **Deleting SupportChat / ConfiguratorChat / API routes:** violates keep-in-code lock.
- **Deleting CMS seed rows or Convex sections:** inventory only; Phase 10 unmounts.
- **Editing `Hero.tsx`:** user has uncommitted work; Phase 10 owns hero.
- **Changing checkout WhatsApp `window.open` timing:** Phase 12 / out of scope.
- **Hardcoding a WhatsApp number:** use `getStoreSettings().whatsappNumber` + `buildWhatsAppLink`. [VERIFIED: codebase]

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Feature-flag SaaS | LaunchDarkly / Flagsmith | Env + typed helper | Overkill for one boolean |
| New WhatsApp URL builder | Custom string concat | `buildWhatsAppLink` in `@/lib/whatsapp` | Already used by `/destek` and Footer |
| New design system for fallback | Custom cards | `surface-glass` / `mac-glass` / `btn-red-rich` | Brand consistency |
| Parallel Destek 404 route | `notFound()` | Static fallback page | Locked keep route |
| Client-side env parsing for flag | `process.env` in Header | Layout-passed boolean | Server-evaluated contract |

**Key insight:** Visibility and capability are different controls; splitting them is the entire phase.

## Common Pitfalls

### Pitfall 1: Global kill switch disables admin AI
**What goes wrong:** Operator sets `AI_FEATURES_ENABLED=false` to hide chat; `/admin/icerik` loses generator.  
**Why:** Admin uses `isAiConfigured()`. [VERIFIED: codebase]  
**How to avoid:** Customer mounts use `isCustomerAiUiEnabled() && isAiConfigured()`; admin/API keep `isAiConfigured()` only.  
**Warning signs:** Admin AI unavailable while customer hide was the intent.

### Pitfall 2: Destek remains in Footer as "AI Destek"
**What goes wrong:** Primary nav cleaned but Footer still advertises AI.  
**Why:** Separate link arrays. [VERIFIED: codebase `Footer.tsx` `KURUMSAL_LINKS`]  
**How to avoid:** Treat Footer AI Destek as an entry point under BOUND-02; omit or relabel when flag off.  
**Warning signs:** Grep still finds `AI Destek` or `/destek` in chrome with AI framing.

### Pitfall 3: Dead hash anchors remain
**What goes wrong:** `/#renkler` has **no** matching `id="renkler"`; `/#ozellikler` and `/#sss` exist today but are not primary-nav destinations under BOUND-04. [VERIFIED: codebase]  
**How to avoid:** Remove hash links from primary nav and from Footer product/corporate lists where they are dead or non-spine.  
**Warning signs:** Footer still lists `/#renkler`.

### Pitfall 4: SupportChat still imported when UI flag off
**What goes wrong:** Fallback page still pulls chat client chunk.  
**How to avoid:** Conditional dynamic import or no import on fallback path.  
**Warning signs:** Network tab loads support chat chunk on `/destek` with flag off.

### Pitfall 5: Accidental CMS / seed deletion
**What goes wrong:** Inventory work deletes Convex rows; Phase 10 cannot remount.  
**How to avoid:** Inventory markdown only; no `cms:seed` destructive ops; no deletes in `cmsSeedData.ts`.  
**Warning signs:** Diffs touching `CONTENT_SECTIONS_SEED` removals.

### Pitfall 6: Touching Hero.tsx
**What goes wrong:** Overwrites user's uncommitted Hero work.  
**How to avoid:** Phase 9 file allowlist excludes `src/components/home/Hero.tsx`.

## Code Examples

### Flag helper + tests

```typescript
// Extend src/lib/ai/config.test.ts [VERIFIED: codebase pattern]
it("defaults customer AI UI off", () => {
  vi.stubEnv("CUSTOMER_AI_UI_ENABLED", "");
  expect(isCustomerAiUiEnabled()).toBe(false);
});

it.each(["true", "1"])("enables customer AI UI for %s", (value) => {
  vi.stubEnv("CUSTOMER_AI_UI_ENABLED", value);
  expect(isCustomerAiUiEnabled()).toBe(true);
});
```

### Exact customer AI entry / mount sites (BOUND-02)

| Site | File | Current behavior | Phase 9 action |
|------|------|------------------|----------------|
| Header Destek | `src/components/Header.tsx` `NAV_LINKS` | `{ href: "/destek", label: "Destek" }` | Remove from primary spine; only restore behind flag if ever re-enabled |
| Footer AI Destek | `src/components/Footer.tsx` `KURUMSAL_LINKS` | `{ href: "/destek", label: "AI Destek" }` | Omit or non-AI label when flag off |
| Configurator chat | `src/app/olusturucu/page.tsx` | `isAiConfigured()` → `<ConfiguratorChat />` | AND with `isCustomerAiUiEnabled()` |
| Vehicle match UI | `MatConfigurator` → `VehicleSelector` → `VehicleMatchInput` | `aiEnabled` prop | Same combined boolean |
| Support chat | `src/app/destek/page.tsx` | `isAiConfigured()` → `<SupportChat />` | Flag off → static fallback always (even if API configured) |

API routes to **leave alone** (capability layer):  
`src/app/api/ai/chat/route.ts`, `support/route.ts`, `vehicle-match/route.ts`, `status/route.ts`, `admin/ai/content/route.ts`. [VERIFIED: codebase]

### Primary nav (BOUND-04)

Current `NAV_LINKS` [VERIFIED: codebase `Header.tsx`]:

- `/` Ana Sayfa — **remove from primary**
- `/urunler` Ürünler — **keep**
- `/#ozellikler` Özellikler — **remove** (hash; not in locked spine)
- `/olusturucu` Tasarla — **keep**
- `/galeri` Galeri — **keep**
- `/destek` Destek — **remove from primary**
- `/hakkimizda` Hakkımızda — **remove from primary** (footer OK)
- `/iletisim` İletişim — **keep**

**Sepet:** already a primary chrome control (drawer button, not `NAV_LINKS`). Treat existing Sepet button as the fifth spine item; optionally add mobile-menu link to `/sepet` if drawer-only feels insufficient — discretion, but do not drop Sepet affordance.

Recommended `NAV_LINKS`:

```typescript
const NAV_LINKS = [
  { href: "/olusturucu", label: "Tasarla" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];
// Sepet remains the existing header button → openDrawer / optional /sepet
```

Footer cleanup (discretion, recommended): drop `/#renkler` (dead), drop `/#ozellikler` from product column or keep only if Phase 10 retains `id="ozellikler"`, remove AI Destek branding when flag off. Keep legal `/bilgiler/*` links.

### `/destek` fallback (BOUND-03)

When `!isCustomerAiUiEnabled()` (or `!isAiConfigured()`):

- Metadata: non-AI title e.g. "Destek ve İletişim" (Turkish)
- No `SupportChat`, no BotIcon-as-AI framing required
- Primary CTA: WhatsApp via `getStoreSettings()` + `buildWhatsAppLink` (existing pattern)
- Secondary: `/iletisim`, `/bilgiler/kargo`, optionally `/#sss` or `/iletisim` only (avoid relying on hash if FAQ later moves)
- Reuse `surface-glass` / `btn-red-rich` / `btn-ghost-rich`

When flag **on** and configured: existing SupportChat path may remain for FUT-05 re-enablement.

### Homepage CMS section-key inventory (BOUND prep / Phase 10)

**Mounted today in `src/app/page.tsx`:** [VERIFIED: codebase]

| sectionKey | Consumer | Job |
|------------|----------|-----|
| `hero` | `Hero` | Brand + primary CTA |
| `hero-secondary-cta` | `Hero` | Secondary CTA |
| *(none)* | `HomeConfiguratorShowcase` | Mini configurator / `#ozellikler` — **hardcoded, not CMS-driven** |
| `featured` | `FeaturedProducts` | Featured products |
| `faq` | `Faq` | FAQ header |
| `faq-sidebar` | `Faq` | FAQ sidebar + WhatsApp |

**Chrome (not in `page.tsx`, via `getCmsChrome` / layout):** `chrome-header`, `chrome-footer`. [VERIFIED: codebase `cms.ts`]

**Present in `CONTENT_SECTIONS_SEED` for `home` but not mounted on homepage:** [VERIFIED: codebase `convex/cmsSeedData.ts`]

| sectionKey | Notes |
|------------|-------|
| `steps`, `step-01`, `step-02`, `step-03` | Seed only / orphan vs current page |
| `showcase`, `showcase-gallery-01`…`04`, `showcase-feature-01`…`04` | Seed only |
| `testimonials` | Used by `Testimonials` on **product detail**, not home `page.tsx` |

**Orphan home components (no imports elsewhere):** `PremiumExperience.tsx`, `FeatureStrip.tsx`, `LuxuryInterior.tsx` — do not delete in Phase 9; inventory for Phase 10. [VERIFIED: codebase grep]

**Artifact recommendation:** write `.planning/phases/09-storefront-boundaries-and-content-inventory/09-HOMEPAGE-INVENTORY.md` during execution with columns: `sectionKey | mounted | component | keep/unmount candidate | notes`. Do not change `page.tsx` mounts in Phase 9 (Phase 10).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hide customer AI via `AI_FEATURES_ENABLED` | Dedicated `CUSTOMER_AI_UI_ENABLED` UI flag | v1.2 Phase 9 | Admin AI stays live |
| Wide primary nav + Destek | Spine: Tasarla / Ürünler / Galeri / İletişim / Sepet | Phase 9 | Clearer conversion path |
| `/destek` = AI chat | `/destek` = WhatsApp/contact when UI flag off | Phase 9 | Support without chat |

**Deprecated/outdated:** Treating AI-off fallback copy that says "AI Asistan çevrimdışı" as the v1.2 default — prefer contact-first framing when UI flag is off by design.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Env name `CUSTOMER_AI_UI_ENABLED` is acceptable (discretion) | Standard Stack | Rename only — low risk |
| A2 | Sepet drawer button satisfies "Sepet" in primary spine without adding `/sepet` to `NAV_LINKS` | BOUND-04 | User may want explicit `/sepet` link in nav/mobile menu |
| A3 | Footer may keep Hakkımızda / bilgiler links as secondary | Discretion | User may want quieter footer |

**If empty verified claims dominate:** A1–A3 are naming/UX discretion only; core architecture is verified.

## Open Questions

1. **Footer link to `/destek` when flag off**
   - What we know: Locked to remove AI entry points; route must remain.
   - What's unclear: Omit Destek from footer entirely vs "Destek" → non-AI page.
   - Recommendation: Keep one non-AI "Destek" or rely on İletişim + WhatsApp float; avoid "AI Destek" label.

2. **Order of `NAV_LINKS`**
   - Recommendation: Tasarla first (conversion), then Ürünler, Galeri, İletişim — matches locked labels; Sepet as button.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vitest / Next | ✓ | v24.18.0 | — |
| npm | scripts | ✓ | 11.16.0 | — |
| Vitest | flag unit tests | ✓ | ^4.1.10 | — |
| Playwright | optional e2e | ✓ | ^1.61.1 | Manual browser smoke |
| Convex | unchanged | n/a | — | Static CMS fallback |
| Anthropic key | AI APIs (unchanged) | env-dependent | — | APIs already degrade |

**Missing dependencies with no fallback:** none  
Step 2.6: no blocking external tools beyond existing Node toolchain.

## Validation Architecture

> `workflow.nyquist_validation` is enabled in `.planning/config.json`.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest ^4.1.10 (+ Playwright for e2e) |
| Config file | vitest config as in repo (existing AI tests) |
| Quick run command | `npx vitest run src/lib/ai/config.test.ts` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| BOUND-01 | Flag defaults off; true/1 enables; does not alter `isAiFeaturesEnabled` | unit | `npx vitest run src/lib/ai/config.test.ts` | ✅ extend existing |
| BOUND-02 | No Destek/AI Destek in Header/Footer when flag off; no chat mounts | unit/source scan or e2e | optional Playwright; grep in plan verify | ❌ Wave 0 optional |
| BOUND-03 | `/destek` renders without SupportChat when flag off | manual + optional e2e | `npm run test:e2e` extension | ❌ Wave 0 |
| BOUND-04 | NAV_LINKS equals spine; no `#` hrefs in primary | unit/source assert or e2e | plan verify step | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npx vitest run src/lib/ai/config.test.ts`
- **Per wave merge:** `npm test` + `npm run typecheck`
- **Phase gate:** lint/typecheck + manual smoke: home nav, `/destek`, `/olusturucu`, `/admin/icerik` AI still available when configured

### Wave 0 Gaps

- [ ] Extend `src/lib/ai/config.test.ts` for `isCustomerAiUiEnabled`
- [ ] Optional: Playwright assert Header has no `/destek` and `/destek` has no chat region when flag unset
- [ ] Document `.env.example` entry for `CUSTOMER_AI_UI_ENABLED=false`
- [ ] Create `09-HOMEPAGE-INVENTORY.md` during execute (not a test)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no (customer flag) | Admin AI still admin-session + adminKey |
| V3 Session Management | no | — |
| V4 Access Control | partial | Do not weaken admin AI gates; UI flag is not authorization |
| V5 Input Validation | yes (unchanged APIs) | Existing route validators |
| V6 Cryptography | no | — |

### Known Threat Patterns for this phase

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Treating UI hide as API auth | Elevation of Privilege | Keep rate limit + `isAiFeaturesEnabled` on `/api/ai/*` |
| Client-tampered `NEXT_PUBLIC` flag | Tampering | Prefer server-evaluated flag passed as prop |
| Accidental admin AI disable | Denial of Service (ops) | Separate flags |
| Leaking support chat when "hidden" | Information Disclosure | Do not mount/import chat when flag off |

## Sources

### Primary (HIGH confidence)
- Codebase: `src/lib/ai/config.ts`, `config.test.ts`, `Header.tsx`, `Footer.tsx`, `destek/page.tsx`, `olusturucu/page.tsx`, `page.tsx`, `layout.tsx`, `cmsSeedData.ts`, `VehicleSelector.tsx`, `SiteChrome.tsx`, `.env.example`, `package.json`
- `.planning/phases/09-…/09-CONTEXT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `research/SUMMARY.md`, `research/STACK.md`
- CLAUDE.md project constraints

### Secondary (MEDIUM confidence)
- Milestone research recommendation to split customer UI flag vs kill switch (`.planning/research/STACK.md`)

### Tertiary (LOW confidence)
- Exact Footer secondary link set (discretion)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages; versions verified in repo
- Architecture: HIGH — exact call sites verified
- Pitfalls: HIGH — grounded in current dual-use of `isAiConfigured`

**Research date:** 2026-07-17  
**Valid until:** 2026-08-16 (30 days; presentation boundary stable)

## File Allowlist / Do-Not-Touch (planner)

**Prefer editing:** `config.ts`, `config.test.ts`, `.env.example`, `layout.tsx` (+ thin flags context), `Header.tsx`, `Footer.tsx`, `olusturucu/page.tsx`, `destek/page.tsx`, inventory markdown under phase dir.

**Do not edit:** `src/components/home/Hero.tsx` (user uncommitted), AI route handlers (unless docs-only), `mat-pricing.ts`, cart/checkout, Convex schema/seed deletions, admin AI routes.
