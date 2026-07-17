# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

OTO POLİK — a Turkish e-commerce storefront (Next.js App Router) selling car-specific EVA floor mats. UI copy, routes, and validation are all in Turkish. Orders are confirmed via WhatsApp, not a payment gateway.

## Commands

```bash
npm install               # required first — node_modules is not always present on this machine
npm run dev               # dev server (localhost:3000)
npm run build             # production build
npm start                 # run production build
npm run lint              # eslint (flat config, eslint-config-next + @convex-dev/eslint-plugin)
npm run typecheck         # tsc --noEmit
npm run gallery:generate  # regenerate src/lib/gallery-media.ts from public/media/galeri/musteri/
npm run gallery:optimize  # optimize gallery images
npx convex dev            # start Convex locally / push schema+functions (run from repo root)
```

There is no test suite configured — do not assume a `test` script exists.

Seeding a fresh Convex deployment (see `DEPLOY.md` for the full deploy guide):

```bash
npx convex env set ADMIN_SECRET "<value>"   # must equal the Vercel/`.env.local` ADMIN_SECRET
npx convex run seed:seedProducts '{"adminKey":"<ADMIN_SECRET>"}'
npx convex run cms:seedCms '{"adminKey":"<ADMIN_SECRET>"}'
```

Windows note: the repo path (`C:\Users\isaha\Yeni klasör (9)\otopolik-store`) contains spaces and a Turkish character — always quote paths in shell commands.

Known lint debt: `react-hooks/set-state-in-effect` errors in `ConsentAnalytics.tsx`, `CookieConsent.tsx`, and `Hero.tsx` pre-date most work — don't treat them as regressions from your change, and don't add new ones (use lazy `useState` initializers instead of set-in-effect).

## Architecture

### Data layer: Convex-first with static fallback

Nearly every data source follows the same **lazy-client + graceful fallback** pattern: `src/lib/convex-server.ts` / `convex-client.ts` return `null`/`false` when `NEXT_PUBLIC_CONVEX_URL` is unset or still the placeholder from `.env.example`, and each calling layer falls back to static defaults instead of throwing. Preserve this in any new Convex-touching code. The fallback pairs:

| Server layer (`src/lib/`) | Reads from Convex | Falls back to |
|---|---|---|
| `catalog.ts` (products for `/urunler`, product detail, featured, sitemap, layout) | `api.products.*` | static array in `products.ts` |
| `cms.ts` (homepage sections, FAQs, promos, testimonials, SEO; re-exported via `cms-home.ts`) | `api.cms.*` | `cms-defaults.ts` seeds |
| `site-settings.ts` (phone, shipping, prices; editable at `/admin/ayarlar`) | `api.siteSettings` | `site-config.ts` env-based config |
| `dashboard-stats.ts` (admin dashboard) | orders/products | zero/mock data |

So: with Convex configured, the storefront is fully database-driven and editable from `/admin`; without it, the site still works entirely from the static files. `products.ts` and `cms-defaults.ts` double as both fallback and Convex seed content (`convex/seed.ts`, `convex/cmsSeedData.ts`).

Server components pass catalog/CMS data down; client components receive it via `src/context/` providers (`catalog-context`, `cms-context`, `settings-context`) rather than querying Convex themselves. The admin product CRUD (`/admin/urunler`) is the exception — it uses `useQuery`/`useMutation` against Convex directly.

**No Supabase.** Despite past commit messages mentioning "Supabase," the backend is Convex. Do not go looking for a Supabase client.

### Admin key plumbing (two paths)

Admin-facing Convex functions take an `adminKey: v.string()` argument checked by `requireAdminKey()` (`convex/lib/adminAuth.ts`) inside the function; the key is `ADMIN_SECRET` (or `ADMIN_PASSWORD` fallback), which must be set to the same value on both the Next.js and Convex deployments.

- **Server side:** `getAdminConvexKey()` in `src/lib/admin-convex-key.ts` supplies the key to server actions.
- **Browser side (admin client pages):** the `useAdminConvexKey()` hook (`src/hooks/useAdminConvexKey.ts`) fetches it from `GET /api/admin/convex-key`, which returns the key only for a valid `admin_session` cookie. Admin pages using `useQuery`/`useMutation` (e.g. `/admin/urunler`, `ImageUploadButton`) pass this key with every call.

Image uploads go through `convex/files.ts` (`generateUploadUrl` / `getUrl`, both admin-key-gated) into Convex storage.

### CMS-lite content model

Homepage (`src/app/page.tsx`) composes itself from `ContentSection` rows keyed by `sectionKey` (`"hero"`, `"step-01"`, `"showcase-gallery-03"`, …) fetched via `getContentPage("home")`. Components take a `content`/`section` prop and fall back to hardcoded Turkish copy with `??` when a section is missing. Content is edited at `/admin/icerik` (`ContentManager.tsx`). Text supports token interpolation (`interpolateCmsText`) for values like `{freeShippingThreshold}`.

### Convex layout

`convex/schema.ts` defines nine tables: `siteSettings` (singleton), `siteSeo`, `contentPages`, `contentSections`, `faqItems`, `promoItems`, `testimonials`, `products`, `orders` (Turkey-specific `whatsapp_pending` status, optional embedded car-mat `configuration` per line item). `convex/_generated/` is codegen — don't hand-edit.

Order creation schedules `internal.orderNotify.notifyAdmin` (`convex/orderNotify.ts`, a `"use node"` internalAction) via `ctx.scheduler.runAfter(0, …)` — it posts to `ORDER_WEBHOOK_URL` (Discord/Slack/Make) and/or emails via Resend (`ORDER_NOTIFY_EMAIL` + `RESEND_API_KEY`), all configured as Convex deployment env vars, and is best-effort.

The `convex/` directory lives **outside** `src/`, so the `@/*` → `./src/*` path alias in `tsconfig.json` cannot reach it. Imports of `convex/_generated/api` from inside `src/` use relative paths (e.g. `../../../convex/_generated/api`), not the alias.

### Admin auth

Next.js 16 renamed `middleware.ts` → `src/proxy.ts` (same `NextRequest`/`NextResponse` API); this repo only has `proxy.ts`. It matches `/admin/:path*`, allows `/admin/login` through, and otherwise verifies the `admin_session` cookie via `verifySessionToken()` in `src/lib/admin-auth.ts`, redirecting to `/admin/login?next=<path>` if invalid.

Auth is a single shared admin password (`ADMIN_PASSWORD` env var, no user accounts/DB). Session cookie is a stateless `{expireTimestamp}.{hmacSignature}` signed with HMAC-SHA256 via WebCrypto, keyed by `ADMIN_SECRET` (preferred) or `ADMIN_PASSWORD` (fallback), 7-day expiry, constant-time comparison. Server actions that mutate admin data re-verify `isAuthenticated()` themselves rather than trusting the proxy alone — follow this pattern for new admin mutations, since Next.js proxy/middleware is only an edge-layer redirect, not a security boundary for the action itself.

Note: `src/app/admin/layout.tsx` has a stale comment referencing `src/middleware.ts` — that file doesn't exist; treat `proxy.ts` as authoritative.

### Cart state

`src/context/cart-context.tsx` wraps a non-React external store (`src/lib/cart-store.ts`) via `useSyncExternalStore`, persisted to `localStorage`, with a separate `isHydrated` flag to avoid SSR/client hydration mismatches. Cart line items are keyed by `(slug, color)` — the same product in a different color is a separate line. Cart is client-only until checkout; it is not synced to Convex until an order is submitted.

### Checkout flow (no payment gateway)

`src/app/odeme/`: collects customer info (Turkish phone-format validation), payment method is `whatsapp` (default) or `kapida` (cash on delivery) — a credit-card option exists in the UI but is disabled ("coming soon"). On submit it opens the WhatsApp window (`window.open` then `location.replace(wa.me link)`) **synchronously during the user interaction**, before the async Convex order write, to avoid popup blockers — then persists to Convex as best-effort (errors are logged, not surfaced), clears the cart, and routes to `/tesekkurler`.

### Product configurator (`/olusturucu`)

`src/components/configurator/MatConfigurator.tsx` orchestrates: vehicle brand/model selection (price lookup via `vehicle-data.ts`'s `getVehiclePrice()`, falling back to `siteConfig.matBasePrice` for "other vehicle"), independent floor/edge color pickers from fixed palettes (`FLOOR_COLORS`/`EDGE_COLORS` hardcoded at the top of that file), optional extras (heel pad, trunk mat) priced from site settings, and a preview image resolved from a hardcoded `floorColor|edgeColor` lookup table (defaults to `Siyah|Kırmızı` if the exact combo has no pre-rendered image). Adds to cart via `useCart().addItem()`. `src/lib/mat-pricing.ts` (`MAT_PRICING`, `calculateMatPrice`) is the single source of truth for base/extras pricing math.

### Vehicle SEO landing pages (`/arac/[slug]`)

`src/app/arac/[slug]/page.tsx` statically generates one landing page per brand+model combination (slugs like `bmw-3-serisi`) from `src/lib/vehicle-seo.ts`, which derives titles, meta, price tiers, FAQ, and reviews from `vehicle-data.ts` + `mat-pricing.ts`. There is no CMS behind these — content is generated in code.

### Gallery (`/galeri`)

`src/lib/gallery-media.ts` is **auto-generated** by `scripts/generate-gallery-data.js` — never edit it by hand. To add customer photos/videos: drop files in `public/media/galeri/musteri/`, then run `npm run gallery:generate` (and optionally `npm run gallery:optimize`).

## Design system

OLED-black glass theme defined entirely in `src/app/globals.css` via CSS variables mapped into Tailwind v4 through `@theme inline`. The customer storefront is wrapped in a `.premium-site` scope (applied in `SiteChrome.tsx`) that carries the "luxury showroom" overrides — **admin is intentionally outside it** and stays plainer. Brand red is Racing Red `#ED1B24` (`--brand-red`, with carbon `#1B1B1B` borders); `--sand #cfcfca` is a *platinum gray* accent.

Hard rules from the client (learned across three rounds of "too yellow" feedback):

1. **Backgrounds are pure OLED black** (`#000000`, surfaces `#0b0b0b`–`#141414`) and all borders/grids/glows are neutral `rgba(255,255,255,…)` tints — nothing warm-tinted, ever.
2. `--sand` is platinum gray, not gold — every `text-sand`/`border-sand` accent renders silver.
3. Muted gold (`#c8b284→#ab9160→#8a7448`, H≈40° S≈30%) survives **only** in the header SEPET pill gradient (`.premium-site .btn-light-rich`) — never reintroduce gold text, gold borders, or gold glows elsewhere, and never saturated yellows like `#d9b86a`/`#efd187` anywhere.
4. **Bal Peteği Doku Yoğunluğu (Honeycomb/EVA Pattern)**: Paspas dokusunu yansıtan desenler (`bg-eva`, `bg-eva-strong` veya `.hex-bg` gibi CSS/SVG gradyanları) her zaman sık ve küçük gözenekli olmalıdır (örneğin CSS'te `background-size` 15px veya daha küçük, gradyanlarda kısa adımlar). Geniş veya kaba hücreler görsel olarak hatalıdır.
5. **Logo Boyutlandırması & Taşma Koruması**: Marka logosu (`/media/otopolik-logo-3d.png`) büyük bir çözünürlüğe (1024x1024) sahiptir. Ortak alanlarda (navbar, footer, vb.) logo kullanılırken her zaman sabit boyutlandırıcı sınıflar (örn. `h-12 w-12` veya `size-[58px]`) kullanılmalı ve `object-cover` ya da `object-contain` uygulanarak logonun kontrolsüzce genişleyip layout'u bozması engellenmelidir.

Typography (via next/font in `layout.tsx`, all latin-ext for Turkish): headings **Syne** (`--font-heading`), body **Instrument Sans** (`--font-body`), spec/price labels **JetBrains Mono** (`--font-spec`) — do not revert to Space Grotesk/Inter.

Reuse the existing utility classes instead of re-inventing inline styles:

- Buttons: `btn-red-rich` (layered Racing Red gradient + inner light + hover sheen sweep; handles `:disabled`), `btn-light-rich` (gold pill inside `.premium-site`), `btn-ghost-rich` (glass outline) — always combined with `btn-press` (press micro-interaction).
- Forms: `input-rich` (deep inset shadow + sand focus ring; deliberately does **not** set border-color so it composes with conditional error borders like checkout's).
- Panels: `surface-glass`, `premium-card` (Racing Red border hint on hover), `proof-card`, `icon-badge-rich` (red gradient icon square), `edge-card` (hard offset shadow mimicking mat binding), `bg-eva`/`bg-eva-strong` (diamond EVA texture), `spec-label`/`spec-value` (monospace technical labels).
- Liquid glass (Mac-style, added in the "liquid glass" pass): `mac-glass`, `mac-glass-nav`, `mac-nav-pill` — backdrop-filter with a solid `@supports` fallback and a `prefers-reduced-transparency: reduce` opaque fallback; preserve both fallbacks in new glass surfaces.
- Glass showcase: `glass-vitrine` (product-image "glass display window" — frame, corner glare, static reflection, hover sheen sweep; deliberately does **not** set `position` so Tailwind's `absolute`/`relative` on the element still wins — unlayered CSS beats Tailwind's layered utilities, which zeroed out image heights when this class set `position: relative`), `glass-pane` (standalone reflection overlay for existing panels like the product gallery). Used in `ProductCard.tsx` and `ProductGallery.tsx`.
- Motion: page-level smooth scrolling is Lenis (`SmoothScroll.tsx`; globals.css has `.lenis*` compatibility rules). Scroll reveals use `.reveal`/`.reveal-visible` (via `ScrollReveal.tsx`); hero animations gate behind a post-hydration `hero-ready` class. **All** animation must be disabled under `prefers-reduced-motion: reduce` — globals.css already handles the existing classes; follow that pattern for new ones.

## Conventions

- Path alias `@/*` → `./src/*` (does not cover `convex/`, see above).
- Deploy target is Vercel, region `fra1` (Frankfurt) — see `DEPLOY.md` for env vars, seeding, and the post-deploy checklist. Cache headers for `/media/*` are set in both `next.config.ts` and `vercel.json` (redundant, keep in sync if changing).
- Product/media assets live under `public/media/`; `products.ts` image paths often reference `/media/scraped/...`, sourced from `paspasburada_db.json` at the repo root.
- Admin UI (`/admin`) intentionally uses sharp corners and simpler styling than the customer-facing site; customer-facing polish classes (`*-rich`, `.premium-site`, `mac-glass*`) are not applied there.
