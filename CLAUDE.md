# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OTO POLİK — a Turkish e-commerce storefront (Next.js App Router) selling car-specific EVA floor mats. UI copy, routes, and validation are all in Turkish. Orders are confirmed via WhatsApp, not a payment gateway.

## Commands

```bash
npm run dev      # dev server (localhost:3000)
npm run build    # production build
npm start        # run production build
npm run lint     # eslint (flat config, eslint-config-next)
npx convex dev    # start Convex locally / push schema+functions (run from repo root)
```

There is no test suite configured — do not assume a `test` script exists.

## Architecture

### Two data layers that are NOT connected

This is the most important thing to understand before touching product data:

- **Public storefront** (`/`, `/urunler`, `/urunler/[slug]`, sitemap, featured products) reads exclusively from the **static, hardcoded array** in `src/lib/products.ts`. It never queries Convex.
- **Admin product CRUD** (`/admin/urunler`) reads/writes **Convex** directly (`useQuery`/`useMutation` against `api.products.*`). The page itself displays a fallback banner explaining that these are separate data sources.

Editing a product via the admin panel does **not** change what customers see on `/urunler`. To change what's live, edit `src/lib/products.ts` directly. Convex product data is effectively unused by the storefront today.

Everything else Convex-backed (site settings, orders, dashboard stats) follows a **lazy-client + graceful fallback** pattern: `src/lib/convex-server.ts` / `convex-client.ts` return `null`/`false` when `NEXT_PUBLIC_CONVEX_URL` is unset or still the placeholder value from `.env.example`, and calling code falls back to static defaults (`site-config.ts`) or mock/zero data rather than throwing. Preserve this pattern in new Convex-touching code.

**No Supabase.** Despite past commit messages mentioning "Supabase," the backend is Convex. Do not go looking for a Supabase client.

### Config: `site-config.ts` vs `site-settings.ts`

- `src/lib/site-config.ts` — static config object built from env vars with hardcoded Turkish-market fallbacks (phone, WhatsApp number, shipping thresholds, configurator base prices). Also exports `buildWhatsAppOrderLink(message)`.
- `src/lib/site-settings.ts` — Convex-backed settings (`getSiteSettings`/`saveSiteSettings`, editable at `/admin/ayarlar`), falls back to `site-config.ts` defaults when Convex isn't configured.

### Convex layout

`convex/schema.ts` defines three tables: `siteSettings` (singleton), `products`, `orders` (with a Turkey-specific `whatsapp_pending` status and an optional embedded car-mat `configuration` object per line item). `convex/_generated/` is codegen — don't hand-edit.

The `convex/` directory lives **outside** `src/`, so the `@/*` → `./src/*` path alias in `tsconfig.json` cannot reach it. Imports of `convex/_generated/api` from inside `src/app/...` use relative paths (e.g. `../../../convex/_generated/api`), not the alias.

### Admin auth

Next.js 16 renamed `middleware.ts` → `src/proxy.ts` (same `NextRequest`/`NextResponse` API); this repo only has `proxy.ts`. It matches `/admin/:path*`, allows `/admin/login` through, and otherwise verifies the `admin_session` cookie via `verifySessionToken()` in `src/lib/admin-auth.ts`, redirecting to `/admin/login?next=<path>` if invalid.

Auth is a single shared admin password (`ADMIN_PASSWORD` env var, no user accounts/DB). Session cookie is a stateless `{expireTimestamp}.{hmacSignature}` signed with HMAC-SHA256 via WebCrypto, keyed by `ADMIN_SECRET` (preferred) or `ADMIN_PASSWORD` (fallback), 7-day expiry, constant-time comparison. Server actions that mutate admin data (e.g. `admin/ayarlar/actions.ts`'s `updateSettings`) re-verify `isAuthenticated()` themselves rather than trusting the proxy alone — follow this pattern for new admin mutations, since Next.js proxy/middleware is only an edge-layer redirect, not a security boundary for the action itself.

Note: `src/app/admin/layout.tsx` has a stale comment referencing `src/middleware.ts` — that file doesn't exist; treat `proxy.ts` as authoritative.

### Cart state

`src/context/cart-context.tsx` wraps a non-React external store (`src/lib/cart-store.ts`) via `useSyncExternalStore`, persisted to `localStorage`, with a separate `isHydrated` flag to avoid SSR/client hydration mismatches. Cart line items are keyed by `(slug, color)` — the same product in a different color is a separate line. Cart is client-only until checkout; it is not synced to Convex until an order is submitted.

### Checkout flow (no payment gateway)

`src/app/odeme/page.tsx`: collects customer info (Turkish phone-format validation), payment method is `whatsapp` (default) or `kapida` (cash on delivery) — a credit-card option exists in the UI but is disabled ("coming soon"). On submit it opens the WhatsApp deep link (`wa.me/<number>?text=<order summary>`) **synchronously**, before the async Convex order write, to avoid popup blockers — then persists to Convex as best-effort (errors are logged, not surfaced), clears the cart, and routes to `/tesekkurler`.

### Product configurator (`/olusturucu`)

`src/components/configurator/MatConfigurator.tsx` orchestrates: vehicle brand/model selection (price lookup via `vehicle-data.ts`'s `getVehiclePrice()`, falling back to `siteConfig.matBasePrice` for "other vehicle"), independent floor/edge color pickers from fixed palettes, optional extras (heel pad, trunk mat) priced from `site-config.ts`, and a preview image resolved from a hardcoded `floorColor|edgeColor` lookup table (defaults to `Siyah|Kırmızı` if the exact combo has no pre-rendered image). Adds to cart via `useCart().addItem()`.

## Conventions

- Path alias `@/*` → `./src/*` (does not cover `convex/`, see above).
- Deploy target is Vercel, region `fra1` (Frankfurt). Cache headers for `/media/*` and `/_next/static/*` are set in both `next.config.ts` and `vercel.json` (redundant, keep in sync if changing).
- Product/media assets live under `public/media/`; `products.ts` image paths often reference `/media/scraped/...`, sourced from `paspasburada_db.json` at the repo root.
