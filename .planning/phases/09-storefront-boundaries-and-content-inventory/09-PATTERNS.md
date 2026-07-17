# Phase 9: Storefront Boundaries and Content Inventory - Pattern Map

**Mapped:** 2026-07-17
**Files analyzed:** 12
**Analogs found:** 12 / 12

> **Do not edit** the user's uncommitted `src/components/home/Hero.tsx` in this phase. Inventory may reference it; implementation must not touch it.

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/lib/storefront-flags.ts` (new) | utility / config | request-response | `src/lib/ai/config.ts` | exact |
| `src/lib/storefront-flags.test.ts` (new) | test | transform | `src/lib/ai/config.test.ts` | exact |
| `.env.example` | config | — | `.env.example` AI block (lines 25–28) | exact |
| `src/components/Header.tsx` | component | request-response | self (`NAV_LINKS` + `isNavLinkActive`) | exact |
| `src/components/Footer.tsx` | component | request-response | self (`KURUMSAL_LINKS` + WhatsApp CTA) | exact |
| `src/app/destek/page.tsx` | route | request-response | existing fallback branch + `src/app/iletisim/page.tsx` | exact |
| `src/app/olusturucu/page.tsx` | route | request-response | self (`aiEnabled` gate) | exact |
| `src/components/configurator/MatConfigurator.tsx` | component | request-response | self (`aiEnabled` prop → `VehicleSelector`) | role-match |
| `src/components/configurator/VehicleSelector.tsx` | component | request-response | self (`aiEnabled ? VehicleMatchInput`) | role-match |
| Homepage CMS inventory artifact (phase doc) | config / docs | transform | `src/app/page.tsx` + `convex/cmsSeedData.ts` | exact |
| `src/components/SiteChrome.tsx` | component | request-response | self (admin vs `.premium-site`) | role-match |
| `src/lib/ai/config.ts` | utility | request-response | self (leave capability kill switch alone) | exact |

**Likely unmodified (preserve implementations):** `SupportChat.tsx`, `ConfiguratorChat.tsx`, `VehicleMatchInput.tsx`, `src/app/api/ai/**`, `src/app/api/admin/ai/**`, `src/lib/ai/**` (except optional shared helper import), admin `icerik` AI panel.

**Explicitly out of scope / do not modify:** `src/components/home/Hero.tsx` (user WIP), homepage section unmounts (Phase 10), configurator UX diet (Phase 11), cart/checkout (Phase 12).

## Pattern Assignments

### `src/lib/storefront-flags.ts` (utility, request-response)

**Analog:** `src/lib/ai/config.ts`

**Imports / env-read pattern** (lines 21–44):
```typescript
function getAnthropicApiKey(): string | null {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;
  const normalized = apiKey.toLocaleLowerCase("en-US");
  if (
    normalized.includes("your-") ||
    normalized.includes("placeholder") ||
    normalized === "sk-ant-"
  ) {
    return null;
  }
  return apiKey;
}

export function isAiFeaturesEnabled(): boolean {
  const setting = process.env.AI_FEATURES_ENABLED?.trim().toLowerCase();
  return setting !== "false" && setting !== "0";
}

export function isAiConfigured(): boolean {
  return isAiFeaturesEnabled() && getAnthropicApiKey() !== null;
}
```

**Core pattern to copy (invert default):**
- Capability kill switch `AI_FEATURES_ENABLED` **defaults ON** (`!== "false"`).
- Customer UI flag must **default OFF** (`=== "true" || === "1"` only).
- Compose with `isAiConfigured()` so enabling UI still requires keys + capability:
```typescript
import { isAiConfigured } from "@/lib/ai/config";

/** Customer-visible AI chrome. Default OFF for v1.2. */
export function isCustomerAiUiEnabled(): boolean {
  const raw = process.env.CUSTOMER_AI_UI_ENABLED?.trim().toLowerCase();
  if (raw === "true" || raw === "1") return isAiConfigured();
  return false;
}
```
- Prefer a dedicated module (`storefront-flags.ts`) over growing `config.ts`, so admin routes keep importing `isAiConfigured()` unchanged.
- **Server-only env** (no `NEXT_PUBLIC_`): Header/Footer are client components — do not read this flag there; remove Destek from primary nav statically (BOUND-04), and gate server mounts on `/olusturucu` + `/destek`.

**Do not change:** `isAiFeaturesEnabled` / `isAiConfigured` semantics — admin content generator (`admin/icerik/page.tsx` line 84) and API routes depend on them.

---

### `src/lib/storefront-flags.test.ts` (test, transform)

**Analog:** `src/lib/ai/config.test.ts`

**Test harness pattern** (lines 1–43):
```typescript
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
});

it.each(["false", "0"])("honors the %s kill-switch value", (value) => {
  vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
  vi.stubEnv("AI_FEATURES_ENABLED", value);
  expect(isAiFeaturesEnabled()).toBe(false);
});
```

**Cases to mirror for customer UI flag:**
| Env | Expected |
|-----|----------|
| unset / `""` / `"false"` / `"0"` | `isCustomerAiUiEnabled()` → `false` even with valid API key |
| `"true"` / `"1"` + valid key + features on | `true` |
| `"true"` + missing/placeholder key | `false` |
| `"true"` + `AI_FEATURES_ENABLED=false` | `false` |

---

### `.env.example` (config)

**Analog:** existing AI block (lines 25–28):
```
# --- Yapay Zekâ (Opsiyonel, yalnızca sunucu tarafı / server-only) ---
# Bu değerleri NEXT_PUBLIC_ önekiyle tanımlamayın.
ANTHROPIC_API_KEY=
AI_FEATURES_ENABLED=true
```

**Add beside it (agent discretion — recommended name from research):**
```
# Customer-facing AI chrome (header mounts, /destek chat, configurator AI).
# Default off. Does not disable admin AI or /api/ai/* when AI_FEATURES_ENABLED is on.
CUSTOMER_AI_UI_ENABLED=false
```

---

### `src/components/Header.tsx` (component, request-response)

**Analog:** self — `NAV_LINKS` (lines 21–30) + active-path helper (lines 32–36)

**Current primary nav (to replace):**
```typescript
const NAV_LINKS = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/#ozellikler", label: "Özellikler" },  // dead hash — remove
  { href: "/olusturucu", label: "Tasarla" },
  { href: "/galeri", label: "Galeri" },
  { href: "/destek", label: "Destek" },             // AI entry — remove from spine
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];
```

**Target spine (BOUND-04):** Tasarla, Ürünler, Galeri, İletişim — plus Sepet already as chrome button (`openDrawer`, lines 200–213), not a `NAV_LINKS` item. Keep that Sepet pattern; do not add `/sepet` as a nav link unless product wants both.

**Suggested `NAV_LINKS`:**
```typescript
const NAV_LINKS = [
  { href: "/olusturucu", label: "Tasarla" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/galeri", label: "Galeri" },
  { href: "/iletisim", label: "İletişim" },
];
```

**Preserve:** `isNavLinkActive`, mobile dialog a11y, `useStoreSettings` / `useCmsChrome`, search + phone + Sepet CTA, `mac-glass` mobile panel. Desktop + mobile both map the same `NAV_LINKS` (lines 165–181 and 273–289) — change the constant once.

---

### `src/components/Footer.tsx` (component, request-response)

**Analog:** self — link columns + WhatsApp from settings

**AI / dead-hash entry points to remove or relocate:**
```typescript
// KURUMSAL_LINKS — remove AI Destek; drop /#sss hash
{ href: "/destek", label: "AI Destek" },
{ href: "/#sss", label: "S.S.S." },

// URUNLER_LINKS — drop dead hashes
{ href: "/#renkler", label: "Renk Seçenekleri" },
{ href: "/#ozellikler", label: "Özellikler" },
```

**WhatsApp pattern to preserve** (lines 49–52, 142–145):
```typescript
const whatsappHref = buildWhatsAppLink(
  settings.whatsappNumber,
  "Merhaba, aracıma uygun EVA paspas seti hakkında bilgi almak istiyorum."
);
```
Do not hardcode a phone number — keep `useStoreSettings().whatsappNumber`.

**Agent discretion:** Secondary destinations (Hakkımızda, legal `/bilgiler/*`, Galeri) may stay in footer columns; primary spine lives in Header. Prefer keeping legal + WhatsApp contact; drop "AI Destek" label/link when customer UI is off (static omit is fine because flag defaults off and Header is client-only).

---

### `src/app/destek/page.tsx` (route, request-response)

**Analog A (same file):** existing non-AI fallback when `!aiEnabled` (lines 64–121)

**Analog B (contact layout):** `src/app/iletisim/page.tsx` — `getStoreSettings()` + WhatsApp/phone/email channels (lines 25–62)

**Current gate (replace `isAiConfigured` with customer UI flag):**
```typescript
const [aiEnabled, settings] = await Promise.all([
  Promise.resolve(isAiConfigured()),
  getStoreSettings(),
]);
// …
{aiEnabled ? <SupportChat /> : ( /* WhatsApp fallback */ )}
```

**Phase 9 behavior:**
```typescript
import { isCustomerAiUiEnabled } from "@/lib/storefront-flags";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const aiUi = isCustomerAiUiEnabled();
const settings = await getStoreSettings();
const whatsappHref = buildWhatsAppLink(
  settings.whatsappNumber,
  "Merhaba OTO POLİK, kargo, ölçü veya sipariş konusunda destek almak istiyorum."
);

// Default path: always render WhatsApp/contact fallback (no SupportChat import when off).
// Avoid importing SupportChat when flag is off so the client island is not bundled for this route.
```

**Copy/layout:** Reuse `surface-glass mac-glass`, `btn-red-rich`, `btn-ghost-rich`, Turkish copy. Soften AI-centric metadata/title ("AI Destek…") toward contact/destek wording. Prefer **conditional dynamic import or split branches** so `SupportChat` is not statically imported when flag defaults off.

**Keep route:** `/destek` remains valid (no 404). Fallback already documents SSS / kargo / iletişim — drop `/#sss` dead hash from `fallbackLinks` (line 22) → use `/iletisim` or a real FAQ path.

---

### `src/app/olusturucu/page.tsx` (route, request-response)

**Analog:** self (lines 29–52)

**Core mount pattern:**
```typescript
const aiEnabled = isAiConfigured();
// …
{aiEnabled ? <ConfiguratorChat /> : null}
<MatConfigurator aiEnabled={aiEnabled} />
```

**Replace with:**
```typescript
const aiEnabled = isCustomerAiUiEnabled();
```
Same conditional mount. Propagating `false` into `MatConfigurator` already hides `VehicleMatchInput` via `VehicleSelector` — no need to rewrite those components unless prop plumbing changes.

**Do not delete:** `ConfiguratorChat.tsx`, `ConfiguratorAssistantProvider`, API routes.

---

### `MatConfigurator.tsx` / `VehicleSelector.tsx` (component, request-response)

**Analog:** existing prop drill

`MatConfigurator` (lines 29–33, ~296): `aiEnabled?: boolean` defaults `false`, passes to `VehicleSelector`.

`VehicleSelector` (lines 33–45):
```typescript
{aiEnabled ? (
  <VehicleMatchInput onResolved={…} />
) : null}
```

**Phase 9 action:** Prefer **no file edits** if `olusturucu/page.tsx` passes the new flag. Only touch if planner needs default/docs comments. Match quality: role-match (consume flag, don't invent new UI).

---

### Homepage CMS inventory artifact (docs, transform)

**Analogs:** `src/app/page.tsx` (mounted composition) + `convex/cmsSeedData.ts` home seeds (canonical keys) + orphan components under `src/components/home/`

**Mounted today (`page.tsx` lines 36–56):**

| Mount | CMS `sectionKey`(s) | Component |
|-------|---------------------|-----------|
| Hero | `hero`, `hero-secondary-cta` | `Hero` (**do not edit**) |
| Configurator showcase | *(none — hardcoded)* | `HomeConfiguratorShowcase` |
| Featured | `featured` | `FeaturedProducts` |
| FAQ + JSON-LD | `faq`, `faq-sidebar` + `getFaqs()` | `Faq` |

**Chrome (not in `page.tsx`, via layout CMS):** `chrome-header`, `chrome-footer` (`getHomeChromeContent` in `layout.tsx`).

**Seeded on `home` but not mounted in `page.tsx` (inventory for Phase 10 — do not delete):**

| `sectionKey` | Likely historical job |
|--------------|----------------------|
| `steps`, `step-01`…`step-03` | How-it-works steps |
| `showcase`, `showcase-gallery-01`…`04`, `showcase-feature-01`…`04` | Material / gallery showcase |
| `testimonials` | Social proof (also used on product detail via `Testimonials.tsx`) |

**Orphan home components (no imports elsewhere):** `FeatureStrip.tsx`, `LuxuryInterior.tsx`, `PremiumExperience.tsx` — list as unmounted code, not CMS keys.

**Inventory artifact location (discretion):** e.g. `.planning/phases/09-storefront-boundaries-and-content-inventory/09-CONTENT-INVENTORY.md` with columns: `sectionKey | mounted? | consumer | Phase 10 decision | reversible?`. Do **not** delete Convex rows or `CONTENT_SECTIONS_SEED` entries.

**Composition-layer pattern** (from research / `page.tsx`): keep `getContentPage("home")` fetch; later phases change which React trees mount — never delete seeds for reversibility.

---

### `src/components/SiteChrome.tsx` (component, request-response)

**Analog:** self — admin bypass + customer chrome

```typescript
const isAdminRoute = pathname.startsWith("/admin");
if (isAdminRoute) return children;
// else: .premium-site + Header/Footer/WhatsappFloat/…
```

**Phase 9:** No AI islands here today. Preserve admin outside `.premium-site`. Keep `WhatsappFloat` (settings-driven WhatsApp — not AI). No change required unless planner wants a comment; do not remove Lenis/`SmoothScroll` (Phase 13).

---

### `src/lib/ai/config.ts` (utility — leave intact)

**Role:** Global capability + Anthropic readiness. Admin + APIs continue to use `isAiConfigured()` / `isAiFeaturesEnabled()`.

**Anti-pattern:** Setting `AI_FEATURES_ENABLED=false` to hide customer AI also kills admin content generation — forbidden by BOUND-01 / CONTEXT.

## Shared Patterns

### Customer AI hide-without-delete
**Sources:** `olusturucu/page.tsx`, `destek/page.tsx`, `.planning/research/ARCHITECTURE.md` Pattern 2  
**Apply to:** All customer AI mounts  
**Rule:** Gate mounts with `isCustomerAiUiEnabled()`; leave `src/lib/ai/*`, `src/app/api/ai/*`, `src/app/api/admin/ai/*`, chat components, and evals in the repo.

### Server-evaluated env flags
**Source:** `src/lib/ai/config.ts`  
**Apply to:** `storefront-flags.ts`, `.env.example`  
**Rule:** Trim + lowercase compare; no `NEXT_PUBLIC_` for AI secrets/flags that must stay server-only.

### WhatsApp from site settings
**Sources:** `src/lib/whatsapp.ts`, `settings-context.tsx` (re-export), `Footer.tsx`, `destek/page.tsx`, `WhatsappFloat.tsx`  
**Apply to:** `/destek` fallback CTAs  
```typescript
export function buildWhatsAppLink(whatsappNumber: string, message: string) {
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
```
Always use `getStoreSettings()` / `useStoreSettings().whatsappNumber`.

### Nav link lists as single constants
**Sources:** `Header.tsx` `NAV_LINKS`, `Footer.tsx` column arrays  
**Apply to:** Spine + dead-hash cleanup — edit constants, not duplicated JSX.

### CMS composition + ?? copy fallback
**Source:** `src/app/page.tsx`  
**Apply to:** Inventory only in Phase 9; Phase 10 unmounts sections without deleting seeds.

### Admin AI stays on capability flag
**Source:** `src/app/admin/icerik/page.tsx` line 84  
```typescript
aiAvailable={isAiConfigured() && isConvexConfigured()}
```
**Apply to:** Do not switch admin to `isCustomerAiUiEnabled()`.

## Customer AI Mount Map ( BOUND-02 checklist )

| Surface | File | Gate today | Phase 9 gate |
|---------|------|------------|--------------|
| Configurator chat | `olusturucu/page.tsx` → `ConfiguratorChat` | `isAiConfigured()` | `isCustomerAiUiEnabled()` |
| Vehicle free-text | `VehicleSelector` via `aiEnabled` | same | same prop, new source |
| Support chat | `destek/page.tsx` → `SupportChat` | `isAiConfigured()` | flag off → WhatsApp-only UI |
| Header Destek | `Header.tsx` `NAV_LINKS` | always | remove from primary spine |
| Footer AI Destek | `Footer.tsx` `KURUMSAL_LINKS` | always | remove / no AI label |
| Admin content AI | `admin/icerik` | `isAiConfigured()` | **unchanged** |
| APIs | `api/ai/*`, `api/admin/ai/*` | `isAiFeaturesEnabled` + configured | **unchanged** |

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| — | — | — | All Phase 9 targets have in-repo analogs |

*(Closest greenfield piece is `storefront-flags.ts`, but it is a direct inverse of `isAiFeaturesEnabled` — treat as exact analog.)*

## Metadata

**Analog search scope:** `src/lib/ai/`, `src/components/{Header,Footer,SiteChrome,WhatsappFloat}.tsx`, `src/components/{home,configurator,support}/`, `src/app/{page,destek,olusturucu,iletisim,admin/icerik}/`, `src/context/settings-context.tsx`, `src/lib/whatsapp.ts`, `convex/cmsSeedData.ts`, `.env.example`, `.planning/research/ARCHITECTURE.md`  
**Files scanned:** ~40  
**Pattern extraction date:** 2026-07-17  
**Hero.tsx:** referenced for inventory only — **do not modify**
