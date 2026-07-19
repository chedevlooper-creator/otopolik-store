# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

OTO POLİK — a Turkish-language e-commerce storefront for custom car floor mats (paspas). Next.js 16 App Router + React 19, Tailwind v4, Convex cloud backend, and Anthropic AI features via the Vercel AI SDK. The UI copy and code comments are in Turkish; keep new user-facing strings and comments Turkish to match.

## Agent çalışma kuralları (Agent working rules)

Bu depoda çalışan her AI ajanı için bağlayıcıdır. Depo sahibi yeni başlayan bir
yazılımcı — bu kurallar onun her seferinde tek tek talimat vermek zorunda
kalmaması için var.

### İletişim
- **Kullanıcıyla her zaman Türkçe konuş** — istek hangi dilde gelirse gelsin.
  (UI metni/yorum kuralından ayrı; bu, sohbetin kendisiyle ilgili.)
- **Her değişikliği basit dille özetle**: hangi dosyalar değişti, ne yapıldı,
  neden. Jargon kullanman gerekiyorsa bir cümleyle açıkla. Kullanıcının koddan
  öğrenmesine yardım et — sadece "yaptım" deme.
- **Proaktif öneri sun**: dokunduğun alanla ilgili somut, spesifik geliştirme
  önerileri ver (UX, dönüşüm, performans, SEO, kod kalitesi, yeni özellik).
  Genel geçer tavsiye değil; "şu dosyada şunu yapabiliriz" netliğinde.

### Güvenlik ağı (asla atlanmaz)
- **Sormadan commit/push yapma.** `push --force`, `reset --hard`,
  `checkout --`, `clean` gibi geri alınamaz komutlardan önce mutlaka
  `git status` kontrol et ve kullanıcıya sor.
- **Gizli bilgiler koda girmez**: API anahtarı, şifre, secret asla kaynak koda
  yazılmaz, loglanmaz, ekrana basılmaz. `.env.local` git'e girmez.
  `admin123` gibi placeholder şifreler asla gerçek ortama gitmez.
- **Yeni npm paketi eklemeden önce gerekçeyi söyle ve onay al** — çoğu ihtiyaç
  mevcut stack'le (Next 16, React 19, Tailwind v4, Convex, AI SDK) çözülür.

### Doğrulama (her kod değişikliğinden sonra)
- Bitirdim demeden önce: `npm run typecheck` + `npm run lint` +
  `npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"`.
- UI değiştiyse çalışan uygulamada gör: `.claude/skills/run-otopolik-store/`
  driver'ı ile smoke/ekran görüntüsü al. Mobil görünümü de kontrol et —
  trafiğin çoğu mobil.
- Test kırmızıysa veya bir adım atlandıysa bunu açıkça söyle; "çalışıyor
  olmalı" diye geçiştirme.
- `npm run ai:eval:*` gerçek Anthropic API çağrısı yapar (ücretli) — sadece
  kullanıcı isterse çalıştır.

### Projenin bozulmaması gereken değişmezleri
- Ürün kataloğu **statiktir**: `src/lib/products.ts`. Convex'te ürün düzenleme
  arama — Convex yalnızca sipariş/ayar/CMS için.
- Fiyat **yalnızca** `src/lib/mat-pricing.ts`'te değişir; başka yerde fiyat
  sabiti tanımlama.
- **Fallback deseni korunur**: site, Convex URL'si ve AI anahtarı olmadan da
  hatasız açılmalı. Yeni sunucu verisi eklerken aynı "Convex dene → statik
  varsayılana düş" şeklini uygula.
- `server-only` modüllerin içeriği client koduna sızdırılmaz;
  `convex/_generated/` elle düzenlenmez.
- Fiyat/sepet/ödeme mantığına dokunurken önce/sonra değerlerini göster —
  kuruş hatası kabul edilemez.

### Kapsam disiplini
- Küçük, odaklı değişiklikler; istenmeyen refactor yok. Bir seferde bir iş —
  kullanıcı diff'i takip edebilmeli.
- Hata çıktığında belirtiyi değil **kök nedeni** düzelt ve hatayı basit dille
  açıkla (ne oldu, neden oldu, nasıl çözüldü).

## Commands

```bash
npm run dev          # Next dev server on http://localhost:3000
npm run build        # production build
npm run lint         # eslint
npm run typecheck    # tsc --noEmit (no emit; run this to check types)

# Unit tests (vitest + jsdom). Do NOT use `npm test` directly — see gotcha below.
npx vitest run --exclude "tests/**" --exclude "src/lib/ai/evals/**"
npx vitest run src/lib/mat-pricing.test.ts   # a single test file
npx vitest run -t "calculates"               # single test by name

npx playwright test  # e2e (playwright.config reuses/starts a dev server on :3000)

# AI golden-dataset evals — each needs ANTHROPIC_API_KEY, makes real API calls:
npm run ai:eval:vehicle-match   # (also :configurator-chat, :support-chat, :content-generator)
```

- **`npm test` (= `vitest run`) fails**: vitest picks up the Playwright specs under `tests/` and errors "Playwright Test did not expect test.describe()". Always run vitest with the two `--exclude` flags above.
- Both Playwright specs pass. If the configurator step-label copy changes, update the spec to match the UI, not the component.
- To drive the running app (smoke flow, screenshots), use the committed skill at `.claude/skills/run-otopolik-store/` (`node .claude/skills/run-otopolik-store/driver.mjs smoke`). It documents the dev-server, cookie-banner, and vehicle-field gotchas.

## Environment

`.env.local` (git-ignored) drives feature availability. Everything degrades gracefully when a var is absent:
- `NEXT_PUBLIC_CONVEX_URL` — Convex cloud deployment. Absent → orders/settings/CMS fall back to static config.
- `ANTHROPIC_API_KEY` — AI chat/configurator/content. Absent (or a `your-`/`placeholder` value) → AI routes return 503. `AI_FEATURES_ENABLED=false` force-disables.
- `ADMIN_PASSWORD` / `ADMIN_SECRET` — gate the `/admin` area (see auth below).

## Architecture

### Data sources — the key split
The storefront **catalog is static**, not from Convex. `src/lib/catalog.ts` reads products from `src/lib/products.ts` (a hand-maintained TS file); Convex is used only for **orders, site settings, and CMS content**. Don't assume product edits go through Convex — they're code changes to `products.ts`.

Every Convex-backed read (`src/lib/site-settings.ts`, `src/lib/cms.ts`, etc.) follows the same pattern: try Convex via `getConvexClient()`, and on missing config or any error fall back to a static default (`src/lib/site-config.ts`, `src/lib/cms-defaults.ts`). Preserve this fallback shape when adding new server data — the app must render with no backend configured.

**Pricing is single-sourced** in `src/lib/mat-pricing.ts` (`MAT_PRICING` + `calculateMatPrice`). Even when Convex rows carry mat prices, the storefront deliberately ignores them and uses `mat-pricing.ts` (see the comment in `site-settings.ts:mapRow`). Change prices there.

### Convex backend (`convex/`)
Single schema in `convex/schema.ts` with `schemaValidation: true`. Singleton tables (`siteSettings`, `siteSeo`) use a literal `singleton` field + `by_singleton` index. Admin-only mutations take an `adminKey` argument validated by `requireAdminKey` (`convex/lib/adminAuth.ts`); server code passes it via `getAdminConvexKey()`. Generated types/API live in `convex/_generated/` (run `npx convex dev` to regenerate after schema changes). Server components/actions call Convex through `src/lib/convex-server.ts` (lazy `ConvexHttpClient`, returns `null` when unconfigured); client components use the provider in `src/components/ConvexClientProvider`.

### App structure (`src/app/`)
App Router, Turkish routes: `/` home, `/arac/[slug]` product detail, `/olusturucu` mat configurator, `/odeme` checkout, `/destek` support chat, `/admin/*` admin. `src/app/layout.tsx` is the composition root — it server-loads settings + catalog + CMS chrome and wraps everything in nested context providers (`ConvexClientProvider` → `SettingsProvider` → `CmsProvider` → `CatalogProvider`). CMS text supports `{token}` interpolation via `interpolateCmsText`.

### Admin auth
`/admin/*` is protected by `src/proxy.ts` — note Next.js 16 renamed `middleware` to **`proxy`** (same `NextRequest`/`NextResponse` API, `config.matcher`). Sessions are stateless HMAC-SHA256-signed cookies (`{expire}.{hmac}`) in `src/lib/admin-auth.ts`, keyed off `ADMIN_SECRET`/`ADMIN_PASSWORD`. This module is `server-only`.

### AI features (`src/lib/ai/`, `src/app/api/ai/`)
Four features, each pinned to a model in `src/lib/ai/config.ts` (`AI_MODEL_IDS`): vehicle-match (Haiku), configurator-chat & support-chat (Sonnet), content-generator (Opus). All go through the Vercel AI SDK (`ai`, `@ai-sdk/anthropic`); `getLanguageModel(feature)` in `anthropic-client.ts` returns `null` when unconfigured, and every route guards with `isAiConfigured()` → 503. Chat routes stream (`streamText`), enforce per-client rate limits (`rate-limit.ts`) and message/length caps, and expose tools (`configurator-tools.ts`, `support-tools.ts`, `customer-tools.ts`). Grounding helpers (`*-grounding.ts`) constrain answers to catalog/site facts. Quality is measured by golden datasets in `src/lib/ai/evals/*-golden.ts` run by the `*-eval.test.ts` files (the `ai:eval:*` scripts).

## Conventions
- Path alias `@/*` → `src/*` (configured in both `tsconfig.json` and `vitest.config.ts`).
- `import "server-only"` marks modules that must never reach the client bundle (Convex server client, admin auth, catalog, AI clients) — keep that guard when adding server-only code.
- Fonts are `next/font/google` (Syne / Instrument Sans / JetBrains Mono) exposed as CSS vars `--font-heading|body|spec`.
- Next image config only allows `*.convex.cloud` remote hosts; local optimized media lives under `/media` (immutable-cached).
