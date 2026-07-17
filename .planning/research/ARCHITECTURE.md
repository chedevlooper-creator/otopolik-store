# Architecture Research

**Domain:** Brownfield Next.js App Router + Convex storefront simplification (v1.2 Sade Lüks Deneyim)
**Researched:** 2026-07-17
**Confidence:** HIGH for repo contracts (read from live source); MEDIUM for feature-flag integration patterns (cross-checked with current Next.js App Router flag guidance)

## Standard Architecture

### System Overview

v1.2 must change **presentation and composition only**. Data, commerce, and admin boundaries stay intact.

```
┌──────────────────────────────────────────────────────────────────────────┐
│ ROOT LAYOUT (server)                                                      │
│  getStoreSettings / getProducts / getHomeChromeContent / getSiteSeo       │
│  → SettingsProvider + CatalogProvider + CmsProvider + ConvexClientProvider│
│  → SiteChrome                                                             │
└────────────────────────────────┬─────────────────────────────────────────┘
                                 │
          ┌──────────────────────┴──────────────────────┐
          ▼                                             ▼
┌─────────────────────────────┐           ┌─────────────────────────────┐
│ CUSTOMER (.premium-site)    │           │ ADMIN (no SiteChrome wrap)  │
│ Header / main / Footer      │           │ /admin/* plain UI           │
│ CartDrawer · WhatsappFloat  │           │ ContentManager · AI draft   │
│ CookieConsent · SmoothScroll│           │ requireAdminKey plumbing    │
└──────────────┬──────────────┘           └──────────────▲──────────────┘
               │                                         │
               │ compose pages from CMS keys             │ edits live content
               ▼                                         │
┌─────────────────────────────┐           ┌─────────────┴──────────────┐
│ PAGE COMPOSITION (RSC)      │           │ CMS + SETTINGS LAYERS       │
│ page.tsx mounts sections    │◄──────────│ cms.ts → Convex | defaults  │
│ by sectionKey + ?? copy     │           │ site-settings.ts            │
└──────────────┬──────────────┘           │ catalog.ts                  │
               │                          └─────────────┬──────────────┘
               ▼                                        │
┌─────────────────────────────┐                         │
│ CLIENT INTERACTION          │                         ▼
│ cart-context → cart-store   │           ┌─────────────────────────────┐
│ MatConfigurator + pricing   │           │ CONVEX (untouched in v1.2)  │
│ odeme: sync window.open WA  │           │ products · orders · CMS     │
└─────────────────────────────┘           │ siteSettings · files        │
                                          └─────────────────────────────┘

AI (v1.1) — PRESERVE, HIDE FROM CUSTOMER UI
  src/app/api/ai/*  +  SupportChat / ConfiguratorChat / VehicleMatchInput
  + admin ContentGeneratorPanel
  Gate: customer mount points + nav links OFF; implementations + admin ON
```

### Component Responsibilities

| Component | Responsibility | v1.2 Rule |
|-----------|----------------|-----------|
| `src/app/page.tsx` | Homepage composition from `getContentPage("home")` | Primary slim seam — stop mounting sections; do not delete CMS rows |
| `Hero.tsx` / home sections | Visual first viewport + secondary blocks | Reduce motion/density inside components; keep CMS `content` props + `??` fallbacks |
| `SiteChrome.tsx` | Customer chrome vs admin passthrough; `CartProvider` | Keep `isAdminRoute` early return; do not wrap admin in `.premium-site` |
| `cart-context` / `cart-store` | `useSyncExternalStore` + `isHydrated` + localStorage | Do not change hydrate contract or line key `(slug, color)` |
| `CheckoutPageClient` | Sync `window.open` → WA, then best-effort Convex order | Preserve interaction-time popup sequence; UI-only streamlining |
| `MatConfigurator` + `ConfiguratorAssistantProvider` | Vehicle → colors → extras → `calculateMatPrice` → `addItem` | Keep state machine + pricing; hide AI mounts; simplify chrome around steps |
| `cms.ts` / `cms-defaults.ts` | Convex-first with static fallback | Do not break fallback when Convex missing; orphan unused `sectionKey`s OK |
| `Header` / `Footer` | Nav conversion + AI Destek links | Remove/hide customer AI entry points; fix dead hash anchors after section cuts |
| `src/lib/ai/*` + `/api/ai/*` | Customer + admin AI backends | Keep files, routes, evals; stop customer mounts |
| `/admin/*` | CMS/products/settings/AI drafts | Out of visual scope; isolation must remain |

## Recommended Project Structure

No new top-level architecture. Prefer one small flag module over new folders.

```
src/
├── app/
│   ├── page.tsx                 # MODIFY — fewer home mounts
│   ├── olusturucu/page.tsx      # MODIFY — force customer AI off at mount
│   ├── destek/page.tsx          # MODIFY — WhatsApp/manual fallback only (keep SupportChat file)
│   ├── sepet|odeme|urunler/…    # MODIFY — layout/copy density only
│   ├── api/ai/**                # KEEP — do not delete
│   └── admin/**                 # KEEP — AI content generator stays
├── components/
│   ├── SiteChrome.tsx           # KEEP contract; optional float/chrome trim
│   ├── Header.tsx / Footer.tsx  # MODIFY — nav + anchors
│   ├── home/*                   # MODIFY / leave unmounted
│   ├── configurator/*           # MODIFY UI; KEEP assistant provider wiring
│   └── support/SupportChat.tsx  # KEEP file; unmount from storefront
├── context/                     # KEEP — cart/cms/settings/catalog contracts
├── lib/
│   ├── cms.ts / cms-defaults.ts # KEEP fallback pair
│   ├── cart-store.ts            # KEEP
│   ├── mat-pricing.ts           # KEEP single price source
│   ├── ai/**                    # KEEP
│   └── storefront-flags.ts      # NEW (recommended) — customer UI visibility gates
└── convex/                      # DO NOT TOUCH for simplification
```

### Structure Rationale

- **Composition over deletion:** Unmounting in RSC pages is reversible and CMS-safe; deleting seed/Convex rows is not.
- **Flag module next to AI config:** Mirrors existing `isAiConfigured()` graceful-degradation pattern without inventing a third-party flag service.
- **Admin stays outside `.premium-site`:** Simplification CSS must remain under `.premium-site` / customer routes only.

## Architectural Patterns

### Pattern 1: Composition-Layer Slimming (homepage & content pages)

**What:** Keep fetching CMS pages/settings; change which React trees mount.
**When to use:** Removing homepage sections, reducing product-page chrome, shortening cart/checkout layouts.
**Trade-offs:** Unused CMS keys remain editable in `/admin/icerik` (good for re-enable; slightly noisy admin). Deleting seeds would desync Convex vs `cms-defaults.ts`.

**Example:**
```tsx
// src/app/page.tsx — keep fetch + tokens; mount fewer sections
const [{ sections }, { items: faqs }] = await Promise.all([
  getContentPage("home"),
  getFaqs(),
]);
const section = (key: string) =>
  sections.find((s) => s.sectionKey === key) ?? null;

return (
  <>
    <Hero content={{ hero: section("hero"), secondaryCta: section("hero-secondary-cta") }} />
    <HomeConfiguratorShowcase /> {/* primary conversion — keep unless explicitly cut */}
    <FeaturedProducts content={section("featured")} />
    <Faq /* keep for SEO JSON-LD */ … />
    {renderJsonLd(faqPageSchema(faqItems))}
  </>
);
```

### Pattern 2: Hide-Without-Delete for Customer AI UI

**What:** Gate customer mounts and nav links; leave implementations, API routes, admin generator, and evals intact.
**When to use:** v1.2 requirement to hide customer AI while preserving code.
**Trade-offs:** Direct URL `/destek` still exists unless redirected — prefer soft redirect or WhatsApp-only page over 404 (SEO/bookmarks). Do **not** set `AI_FEATURES_ENABLED=false` alone if that also disables admin content generation.

**Recommended gate (compose with existing AI config):**
```ts
// src/lib/storefront-flags.ts (new)
import { isAiConfigured } from "@/lib/ai/config";

/** Customer-visible AI chrome. Default OFF for v1.2 sade lüks. */
export function isCustomerAiUiEnabled(): boolean {
  const raw = process.env.CUSTOMER_AI_UI_ENABLED?.trim().toLowerCase();
  if (raw === "true" || raw === "1") return isAiConfigured();
  return false; // hide even when Anthropic is configured
}
```

```tsx
// src/app/olusturucu/page.tsx
const aiEnabled = isCustomerAiUiEnabled(); // not bare isAiConfigured()
{aiEnabled ? <ConfiguratorChat /> : null}
<MatConfigurator aiEnabled={aiEnabled} />
```

Mount points to gate (do not delete files):

| Surface | File | Action |
|---------|------|--------|
| Configurator chat | `ConfiguratorChat.tsx` via `olusturucu/page.tsx` | Unmount |
| Vehicle free-text AI | `VehicleMatchInput.tsx` via `VehicleSelector` `aiEnabled` | Pass `false` |
| Support page chat | `SupportChat.tsx` via `destek/page.tsx` | Unmount; WhatsApp fallback |
| Nav/footer | `Header.tsx`, `Footer.tsx` | Remove `/destek` / "AI Destek" |
| Admin AI | `ContentGeneratorPanel` + `/api/admin/ai/content` | Leave on `isAiConfigured()` |
| API + libs | `src/app/api/ai/*`, `src/lib/ai/*` | Leave |

### Pattern 3: Preserve Commerce Contracts While Restyling Flows

**What:** Cart and checkout UX can get shorter forms/less chrome, but hydration and WhatsApp popup timing are hard contracts.
**When to use:** Any edit under `/sepet`, `/odeme`, `CartDrawer`, configurator add-to-cart.
**Trade-offs:** Skipping `isHydrated` causes SSR flicker/wrong empty states; moving `window.open` after `await createOrder` reintroduces popup blockers.

**Contracts (do not break):**
```tsx
// Cart — gate UI on hydration
if (!isHydrated) return <Skeleton… />;

// Checkout — open WA synchronously in the submit handler, before awaits
const whatsappWindow = window.open("", "_blank");
if (!whatsappWindow) { /* error */ return; }
whatsappWindow.location.replace(href);
// THEN best-effort Convex createOrder → clearCart → /tesekkurler
```

### Pattern 4: Motion Reduction Inside Existing Design System

**What:** Prefer dialing down Framer scroll/stagger and heavy overlays; keep Lenis + `prefers-reduced-motion` rules in `globals.css`.
**When to use:** Hero, showcase, configurator step transitions, gallery loupe excess.
**Trade-offs:** Removing Lenis entirely changes site feel more than needed; stripping `.premium-site` utilities risks brand regression.

## Data Flow

### Request Flow (unchanged spine)

```
Browser
  → Next.js RSC (catalog/cms/settings via src/lib/*)
      → ConvexHttpClient if configured
      → else cms-defaults / products / site-config
  → Client islands (Hero, MatConfigurator, Cart, Checkout)
      → cart-store (localStorage)
      → on order: WhatsApp (sync) + Convex orders (async best-effort)
```

### State Management

```
cart-store (external)
   ↑ useSyncExternalStore
cart-context (CartProvider in SiteChrome only)
   ↑ useCart()
MatConfigurator / CartDrawer / CartPage / CheckoutPage
```

CMS/settings/catalog remain **server-fetched → provider props**, not browser Convex queries (admin product CRUD is the exception).

### Key Data Flows

1. **Homepage CMS:** `getContentPage("home")` → `section(key)` → component props → hardcoded Turkish `??` if null. Slimming = fewer `section()` consumers.
2. **Configurator → cart:** `ConfiguratorAssistantProvider` state → `buildCartItem()` / `calculateMatPrice` → `addItem` → drawer open. AI tools must stay able to drive the same provider when re-enabled later.
3. **Checkout → WhatsApp + Convex:** Form validate → sync WA window → `createOrder` if Convex ready → clear cart → thank-you. Visual simplification must not reorder these steps.
4. **AI hide:** Customer RSC/client mounts read `isCustomerAiUiEnabled()`; API routes continue to honor `isAiFeaturesEnabled()` + key checks for admin/evals.
5. **Admin isolation:** `SiteChrome` pathname `/admin` → children only (no cart provider, no premium chrome). Storefront CSS/motion work must not leak into admin layouts.

## New vs Modified Areas (v1.2 map)

| Area | Kind | Notes |
|------|------|-------|
| `storefront-flags.ts` (or equivalent) | **New** | Customer AI UI gate separate from admin AI kill switch |
| `app/page.tsx`, home components | **Modified** | Composition + density |
| `Hero.tsx` motion | **Modified** | Reduce scroll-linked / blur stagger; keep CMS props |
| `Header.tsx` / `Footer.tsx` | **Modified** | Nav, AI links, hash targets (`/#ozellikler`, `/#renkler`) |
| `olusturucu/page.tsx`, `VehicleSelector` props | **Modified** | AI mounts off |
| `destek/page.tsx` | **Modified** | Non-AI fallback; optionally `robots` noindex |
| Cart / checkout client UIs | **Modified** | Shorter layout; keep hydrate + popup |
| Product detail / listing chrome | **Modified** | Less gallery chrome / fewer stacked sections |
| `globals.css` motion utilities | **Modified** | Softer effects under `.premium-site` |
| `convex/*`, `cart-store.ts`, `mat-pricing.ts`, `cms.ts` fallback | **Unchanged** | Hard contracts |
| `src/lib/ai/**`, `/api/ai/**`, admin AI panel | **Unchanged files** | Hidden from customer, not removed |
| `proxy.ts` / admin auth | **Unchanged** | Isolation |

## Safe Build Order (by dependency)

Execute in this order so each step preserves contracts and is revertible:

1. **Customer AI surface gate + nav cleanup**  
   Add `isCustomerAiUiEnabled()`; wire `olusturucu`, `VehicleSelector`, `destek`; remove Header/Footer AI links.  
   *Avoids:* Killing admin AI via `AI_FEATURES_ENABLED=false`.  
   *Validates:* Manual configurator + WhatsApp still work; `/api/admin/ai/content` still gated by real AI config.

2. **Homepage composition slim**  
   Edit `page.tsx` mounts only. Leave `CONTENT_SECTIONS_SEED` / Convex rows.  
   *Avoids:* Orphaned admin data loss; broken `getContentPage` fallback.  
   *Validates:* FAQ JSON-LD still present if FAQ section kept; no Convex schema change.

3. **Fix navigation anchors & SEO side-effects**  
   Update `/#ozellikler`, `/#renkler`, footer deep links to surviving section ids; decide `/destek` redirect vs WhatsApp page; confirm `sitemap.ts` (already omits `/destek`) and `robots.ts`.  
   *Avoids:* Soft-404 UX and broken in-page nav after section removal.

4. **Hero + motion dial-down**  
   Simplify `Hero.tsx` / showcase animations; keep `HeroMedia` brand plane; respect `prefers-reduced-motion`.  
   *Avoids:* New set-state-in-effect lint debt; warm/gold color regressions.

5. **Configurator UI streamline**  
   Reduce gallery sidebar / step chrome / preview modes inside `MatConfigurator`; do not fork pricing or cart item builder. Keep `ConfiguratorAssistantProvider` so AI can remount later.  
   *Avoids:* Dual price sources; breaking URL prefill `?marka&model&yil&kasa`.

6. **Product → cart → checkout visual streamline**  
   Shorter pages; preserve `isHydrated` empty-state gating and checkout `window.open` order.  
   *Avoids:* Popup-blocker regressions; hydration mismatch empty cart flashes.

7. **Global polish under `.premium-site` only**  
   Effect density in CSS utilities; never apply luxury overrides to `/admin`.  
   *Avoids:* Admin isolation break.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Current (single brand, WhatsApp orders) | Composition + flags are enough; no new services |
| More CMS editors | Optionally tag sections `storefrontVisible` later — not required for v1.2 |
| Re-enable customer AI | Flip `CUSTOMER_AI_UI_ENABLED`; remount existing components — no rewrite |

### Scaling Priorities

1. **First bottleneck:** Accidental contract breaks (cart hydrate, WA popup, CMS fallback) — mitigate with ordered phases and smoke checks.
2. **Second bottleneck:** Admin CMS noise from unused section keys — mitigate later with visibility metadata, not by deleting seeds in v1.2.

## Anti-Patterns

### Anti-Pattern 1: Delete AI / CMS implementations to “simplify”

**What people do:** Remove `SupportChat`, `ConfiguratorChat`, `api/ai/*`, or CMS seed keys.
**Why it's wrong:** Violates milestone “preserve implementations”; breaks admin AI, evals, and re-enable path; desyncs Convex vs `cms-defaults.ts`.
**Do this instead:** Unmount + flag + leave seeds/files.

### Anti-Pattern 2: Use `AI_FEATURES_ENABLED=false` as the only hide switch

**What people do:** Disable the global AI kill switch to hide customer chat.
**Why it's wrong:** Also disables admin content generation and API status that still depend on `isAiConfigured()`.
**Do this instead:** Separate **customer UI** flag from **AI configured/enabled**.

### Anti-Pattern 3: Refactor cart/checkout data flow while redesigning UI

**What people do:** Move WA open after await; drop `isHydrated` gates; sync cart to Convex early.
**Why it's wrong:** Popup blockers, SSR mismatches, scope creep into backend milestone.
**Do this instead:** CSS/structure-only changes around the existing handlers.

### Anti-Pattern 4: Apply storefront simplification inside `/admin`

**What people do:** Reuse `premium-site` / motion classes in admin for “consistency.”
**Why it's wrong:** Breaks intentional admin isolation (`SiteChrome` bypass).
**Do this instead:** Scope all luxury CSS to customer chrome.

### Anti-Pattern 5: Leave dead hash nav after cutting sections

**What people do:** Remove FeatureStrip/PremiumExperience mounts but keep `/#ozellikler` links.
**Why it's wrong:** Feels broken on a “sade” site.
**Do this instead:** Retarget anchors or remove nav entries in the same PR as composition cuts.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Convex | Server libs via `getConvexClient()` + fallback | No schema/function changes for v1.2 simplification |
| WhatsApp (`wa.me`) | Sync window in checkout; float CTA in chrome | Keep as primary order path |
| Anthropic / AI routes | Existing `/api/ai/*` | Customer UI off; admin may stay on |
| Vercel | Hosting only | Flag via env (`CUSTOMER_AI_UI_ENABLED`) is enough — no LaunchDarkly required |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| RSC pages ↔ CMS libs | async server calls | Slim mounts, not fetch deletion |
| Client islands ↔ cart-store | context + external store | Hydration contract sacred |
| Configurator ↔ pricing | `mat-pricing.ts` only | AI remount must reuse same path |
| Customer ↔ Admin | pathname split in `SiteChrome` | Never share CartProvider with admin |
| Customer AI UI ↔ AI libs | flag at mount sites | Libs remain importable for admin/tests |

## Phase Research Flags

| Phase topic | Needs deeper research? | Why |
|-------------|------------------------|-----|
| Homepage section cut list (which keys stay) | Yes (product/UX) | Architecture says *how* to cut; not *which* marketing blocks survive |
| Exact Hero motion target | Light UI pass | Pattern clear; visual taste TBD in UI-SPEC |
| `/destek` redirect vs soft fallback | Light | SEO impact small (not in sitemap); UX choice |
| Cart/checkout field reduction | Yes if removing legal/vehicle fields | Legal/KVKK + vehicle-required cart items are business rules, not pure UI |
| Convex CMS visibility field | No for v1.2 | Premature; composition gating sufficient |

## Sources

- Repo contracts: `CLAUDE.md`, `.planning/PROJECT.md`, `src/app/page.tsx`, `src/components/SiteChrome.tsx`, `src/context/cart-context.tsx`, `src/app/odeme/CheckoutPageClient.tsx`, `src/app/olusturucu/page.tsx`, `src/lib/ai/config.ts`, `src/lib/cms.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/Header.tsx`, `src/components/Footer.tsx`
- Next.js App Router feature-flag placement (server evaluate for first paint; separate routing vs render flags): [Aurora Scharff — Feature flagging with App Router](https://aurorascharff.no/posts/implementing-feature-flagging-with-nextjs-app-router/), [Rollgate — Feature Flags in Next.js](https://rollgate.io/blog/feature-flags-nextjs) (MEDIUM confidence; pattern confirmation only — this project should use a tiny env flag, not a SaaS flag service)

---
*Architecture research for: OTO POLİK v1.2 Sade Lüks Deneyim — storefront simplification integration*
*Researched: 2026-07-17*
