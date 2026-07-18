# Project knowledge

OTO POLİK — a Turkish e-commerce storefront for custom car floor mats
(paspas). Next.js 16 (App Router, Turbopack) + Convex cloud backend +
Anthropic AI features. Most user-facing strings, the admin area, and API
error codes are in Turkish.

> For deep, agent-facing detail see **`AGENTS.md`** and the
> **`.claude/skills/run-otopolik-store/SKILL.md`** skill — they are
> authoritative on running the app and known test gotchas.

## Quickstart
- Setup: `npm install` (no build step for dev — Turbopack compiles routes lazily)
- Dev: `npm run dev` → http://localhost:3000
- Test (unit): `npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"`
- E2E: `npx playwright test` (reuses a running dev server on :3000, or starts one)
- Lint: `npm run lint` — Typecheck: `npm run typecheck` (`tsc --noEmit`) — Build: `npm run build`

Recommended pre-commit gate:
`npm run lint && npm run typecheck && npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"`

## Architecture
Key directories:
- `src/app/` — Next.js App Router. Routes: `/` (home), `/olusturucu` (mat
  configurator), `/arac/[slug]` (vehicle pages), `/odeme` (checkout),
  `/destek` (support chat), `/tesekkurler`, `/admin/*`. Root layout
  (`src/app/layout.tsx`) is an async server component that pre-fetches
  settings/SEO/products and wires providers:
  `ConvexClientProvider → SettingsProvider → CmsProvider → CatalogProvider`.
- `src/app/api/` — Route handlers: `api/ai/{chat,support,vehicle-match,status}`
  (customer AI) and `api/admin/{ai,convex-key}` (admin).
- `src/components/` — UI (home showroom sections, configurator, admin shell,
  cart, support/configurator chat, shared `ui/`).
- `src/context/` — client React contexts (cart, catalog, cms, settings).
- `src/lib/` — domain logic: `cart-store.ts`, `mat-pricing.ts`, `mat-colors.ts`,
  `catalog.ts`, `products.ts`, `vehicle-*` (search/compat/seo/data),
  `convex-client.ts`/`convex-server.ts`, and `lib/ai/*` (prompts, tools,
  config, rate-limit, and golden `evals/`).
- `convex/` — Convex backend. `schema.ts` is the single-file schema (Convex
  CLI auto-migrates on `npx convex dev`/`deploy` — no separate migration
  step). Also `products.ts`, `orders.ts`, `cms.ts`, `siteSettings.ts`,
  `contentGenerations.ts`. `convex/_generated/` is codegen — never hand-edit.
- `src/proxy.ts` — Next.js 16 middleware replacement; protects `/admin/:path*`.

Data flow:
- Catalog/product/CMS/order data comes from Convex cloud via
  `NEXT_PUBLIC_CONVEX_URL` (no local Convex process).
- **Cart is client-only**: `src/lib/cart-store.ts` is a hand-rolled
  `useSyncExternalStore` store persisted to `localStorage` (`otopolik-cart`);
  server snapshot is always `[]`. No cart state in Convex.
- **Graceful degradation**: `convex-client.ts`/`convex-server.ts` return
  null / `isConvexConfigured() === false` when the URL is missing or a
  placeholder, and the site renders with fallbacks. `lib/ai/config.ts` guards
  AI similarly (feature flags + placeholder-key detection). Never assume
  Convex/AI calls succeed.

## Environment (`.env.local`, git-ignored)
- `NEXT_PUBLIC_CONVEX_URL` — Convex deployment URL (else fallback data).
- `ANTHROPIC_API_KEY` + `AI_FEATURES_ENABLED=true` — gate `api/ai/*`.
  `CUSTOMER_AI_UI_ENABLED` toggles only the customer AI surface.
- `ADMIN_PASSWORD` (and preferably `ADMIN_SECRET`) — `/admin` login + HMAC
  cookie; must match across Vercel and Convex env. Never deploy `admin123`.

## Conventions
- Path alias `@/*` → `./src/*` (tsconfig + vitest alias).
- Server-only modules use `import "server-only"` (`admin-auth.ts`,
  `convex-server.ts`) — keep secrets out of client bundles.
- `next.config.ts` whitelists `*.convex.cloud` image hosts, sets
  `dangerouslyAllowSVG: true` with a strict CSP, and immutably caches `/media/`.
- Deploy region `fra1` (Vercel + `vercel.json`).

## Gotchas
- **`npm test` (plain `vitest run`) fails** — vitest picks up the Playwright
  specs in `tests/` ("did not expect test.describe()"). Always use the
  exclude flags shown in Quickstart. The `ai:eval:*` npm scripts share this
  bug; run the eval files directly (e.g.
  `npx vitest run src/lib/ai/evals/vehicle-match-eval.test.ts`).
- `tests/configurator.spec.ts` has a **known stale failure** (asserts old
  step label "Aracınız" vs current "Araç") — not an app bug.
- `npm run dev` refuses a second instance for the same dir (Next 16 detects
  the running PID) and grabs port 3001 first — curl `:3000` and reuse it.
- Cookie-consent banner ("ÇEREZ VE GİZLİLİK") intercepts first-visit clicks;
  dismiss via `button:has-text("KABUL ET")` in Playwright scripts.
- Most products require vehicle fields (`#product-vehicle-{brand,model,year,body}`)
  before "Sepete Ekle" works; same pattern with `configurator-vehicle-*` on `/olusturucu`.
- Windows/Git Bash mangles `/route` args (MSYS path rewrite) — quote route
  literals or run from PowerShell.
- AI rate limiter (`src/lib/ai/rate-limit.ts`) is process-local (10 req/min/IP) —
  a soft limit only on multi-instance Vercel.

## Gallery pipeline
`npm run gallery:optimize` / `gallery:generate` (`scripts/*.js`) — run when
`public/` gallery assets change.
