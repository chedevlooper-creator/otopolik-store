---
name: run-otopolik-store
description: Build, run, and drive otopolik-store (Next.js + Convex storefront). Use when asked to start the dev server, run the app, take a screenshot of a page, exercise the shop flow (add to cart, configurator), or run its tests.
---

Turkish e-commerce storefront for custom car floor mats (Next.js 16 App Router
+ Convex cloud backend + Anthropic AI features). Drive it by starting the dev
server on `http://localhost:3000` and running the Playwright driver at
`.claude/skills/run-otopolik-store/driver.mjs`.

All paths are relative to the repo root. Verified on Windows 11 / Node 24.

## Prerequisites

- Node (v24 works), npm. No OS packages needed.
- Playwright chromium — already present at `%LOCALAPPDATA%\ms-playwright\`.
  If missing: `npx playwright install chromium`.
- `.env.local` at repo root (git-ignored, already present on this machine).
  The app needs `NEXT_PUBLIC_CONVEX_URL` (Convex cloud — no local Convex
  process required; product data loads from the cloud deployment).
  Optional: `ANTHROPIC_API_KEY` (AI chat/configurator features),
  `ADMIN_PASSWORD`/`ADMIN_SECRET` (the `/admin` area).

## Setup

```bash
npm install
```

No build step needed for dev — Turbopack compiles routes lazily on first hit.

## Run (agent path)

**Check for an already-running server first** — `next dev` refuses to start a
second instance for the same directory (see Gotchas):

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/   # 200 → reuse it
```

If not running, start it in the background (Bash tool `run_in_background`),
then wait for `✓ Ready` / a 200 from the URL above:

```bash
npm run dev   # → "✓ Ready" on http://localhost:3000 in a few seconds
```

Then drive the app with the committed driver (uses the repo's own
`@playwright/test`, headless):

```bash
node .claude/skills/run-otopolik-store/driver.mjs smoke          # full shop flow
node .claude/skills/run-otopolik-store/driver.mjs ss / /urunler /galeri   # screenshot routes
node .claude/skills/run-otopolik-store/driver.mjs dom /sepet "main"       # dump selector text
```

| command | what it does |
|---|---|
| `smoke` | home → `/urunler` → first product → fills vehicle fields → "Sepete Ekle" → verifies `/sepet` shows the priced line item. Prints `SMOKE PASS` / `SMOKE FAIL`. |
| `ss <routes…>` | screenshot each route (1440×900) |
| `dom <route> [selector]` | print `innerText` of a selector for inspection |

Screenshots → `.claude/skills/run-otopolik-store/shots/*.png` (git-ignored;
on failure a `FAIL.png` is written). Override the target with
`BASE_URL=http://localhost:3001` if the server landed on another port.

Key routes: `/` home, `/urunler` products, `/urunler/<slug>` detail,
`/olusturucu` mat configurator, `/galeri` gallery, `/sepet` cart,
`/odeme` checkout, `/destek` support chat, `/admin` admin (needs
`ADMIN_PASSWORD`).

## Run (human path)

```bash
npm run dev   # → http://localhost:3000, Ctrl-C to stop
```

## Test

```bash
# Unit tests (11 files / 57 tests pass, ~1s):
npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"

# E2E (needs no separate server start — playwright.config reuses a running
# dev server on :3000, or starts one itself):
npx playwright test
```

- Plain `npm test` (= `vitest run`) **fails**: vitest picks up the Playwright
  specs in `tests/` and errors with "Playwright Test did not expect
  test.describe() to be called here". Use the exclude flags above.
- `npx playwright test`: `tests/gallery.spec.ts` passes;
  `tests/configurator.spec.ts` has a **known stale failure** — it expects the
  step label "Aracınız" but the UI now renders "Araç" (copy changed, test not
  updated). Not an app breakage.
- AI evals (`npm run ai:eval:*`) need `ANTHROPIC_API_KEY`; not part of the
  smoke path.

## Gotchas

- **`npm run dev` exits with "Another next dev server is already running"** —
  Next.js 16 detects a running instance for the same dir (prints its PID) and
  refuses to start; it also grabs port 3001 first, so a naive "wait for port"
  check deadlocks. Curl `:3000` first and reuse the live server.
- **Cookie-consent banner intercepts clicks** — a "ÇEREZ VE GİZLİLİK" overlay
  sits bottom-left on first visit and can swallow clicks on lower-page
  elements. The driver dismisses it (`button:has-text("KABUL ET")`) right
  after first load; do the same in any ad-hoc Playwright script.
- **Most products require vehicle details before add-to-cart** — "Sepete
  Ekle" silently no-ops (focuses the brand field) until
  `#product-vehicle-brand`, `#product-vehicle-model` (enabled only after
  brand), `#product-vehicle-year`, `#product-vehicle-body` are filled. Same
  pattern with `configurator-vehicle-*` ids on `/olusturucu`.
- **Hydration lag** — dev-mode routes compile lazily; clicking right after
  `domcontentloaded` hits unhydrated React. The driver waits ~1.5s after each
  goto (the repo's own e2e specs wait 2s).
- **Git Bash mangles route args** — MSYS rewrites `/urunler` to
  `C:/Program Files/Git/urunler` before node sees it. The driver strips this
  prefix back off, so `ss / /urunler` works from both Git Bash and
  PowerShell; keep that in mind for any ad-hoc script taking `/route` args.

## Troubleshooting

- **`⚠ Port 3000 is in use … using available port 3001` then exit code 1**:
  another dev server for this repo is already up on 3000. Reuse it, or
  `taskkill /PID <pid> /F` (the error prints the PID) if you must restart.
- **Driver: `GET /… -> 500` or blank shots with Convex errors in console**:
  `NEXT_PUBLIC_CONVEX_URL` missing/wrong in `.env.local` — the storefront
  reads all product data from Convex cloud.
