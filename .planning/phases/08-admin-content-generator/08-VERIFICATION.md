---
phase: 08-admin-content-generator
verified: 2026-07-17
verdict: HUMAN_NEEDED
status: human_needed
---

# Phase 8 Verification: Admin Content Generator

**Automated verdict: PASS. Human verdict: required.** Draft isolation, exact catalog grounding, style constraints, authentication, rate limiting, dual admin-key plumbing, type safety, and production compilation are verified. Live model tone and the visible generate-review-publish workflow require an admin session and provider key.

## Automated Evidence
- `npm test -- src/lib/ai`: PASS, 13 files and 95 tests.
- `npm run ai:eval:content-generator`: PASS, 5 tests with no provider key.
- `npm run ai:eval:vehicle-match`: PASS, 27 tests.
- `npm run ai:eval:configurator-chat`: PASS, 12 tests.
- `npm run ai:eval:support-chat`: PASS, 9 tests.
- `npm run typecheck`: PASS.
- Focused ESLint on every Phase 8 source/test file: PASS.
- Full repository lint: known pre-existing 571 errors and 155 warnings; no Phase 8 path appears.
- `npm run build`: PASS.
- Unauthenticated route smoke: `http://localhost:3000/admin/icerik` returns 307 to `/admin/login?next=%2Fadmin%2Ficerik`.
- Convex codegen: PASS; development functions/schema synchronized.

## Requirement Evidence
- **CNTGEN-01:** Known-product tests and evals assert exact catalog price/features; unknown slugs return `product_not_found` with no fake price.
- **CNTGEN-02:** Source scan forbids live CMS/product writes in `content-generate.ts` and the generation route. Only the separate publish action contains live writes.
- **CNTGEN-03:** Route/action use `getAdminConvexKey`; panel uses `useAdminConvexKey`; every draft API calls `requireAdminKey`.
- **CNTGEN-04:** Reusable style guide and every kind-specific prompt require premium, restrained Turkish output and ban spam-marketplace language.
- **AIINF-02:** The tab is shown only when AI and Convex are configured; all existing manual ContentManager tabs remain unchanged.

## Manual UX Checklist

Prerequisites:
1. Set server-only `ANTHROPIC_API_KEY`.
2. Set `AI_FEATURES_ENABLED=true`.
3. Ensure `NEXT_PUBLIC_CONVEX_URL` is configured and `ADMIN_SECRET` matches Convex.
4. Open **http://localhost:3000/admin/login** and sign in first.

Test URL after login: **http://localhost:3000/admin/icerik**

1. Confirm an **AI Taslak** tab appears inside İçerik Yönetimi.
2. Choose a known product and **Ürün açıklaması**, then click **AI ile taslak oluştur**. Confirm a reviewable draft appears and the live product description remains unchanged.
3. Confirm the draft is fluent Turkish with restrained premium tone—no “şok fiyat”, “hemen al”, emoji, fake urgency, or unsupported superlatives.
4. Compare name, price context, features, contents, and compatibility claims with the selected product. Confirm no unrelated specification or price is invented.
5. Edit the draft if desired. Click **İncelenen taslağı yayımla** and confirm the live product description changes only now; generating another draft must not publish.
6. Repeat with **Ürün SEO başlığı ve meta**. Confirm JSON is reviewable, then publish and verify the selected product's meta title/description update.
7. Repeat with **Sık sorulan soru**. Confirm question/answer JSON is reviewable, then publish and verify the FAQ appears only after publish.
8. Confirm recent-draft badges distinguish **İncelemeye hazır**, **Yayımlandı**, and failures; publish remains disabled for empty or non-ready drafts.
9. Sign out or remove the admin session and request `/admin/icerik`; confirm redirect to `/admin/login`.
10. Disable AI (`AI_FEATURES_ENABLED=false`) or unset the provider key. Reload: AI Taslak is hidden, while SEO, Ana Sayfa, Sayfalar, Yasal, SSS, Promo, and Yorumlar editors remain usable.
11. Disable Convex or use an unset placeholder URL. Confirm the generator is unavailable and manual fallback CMS content still renders/edits according to existing behavior.
12. Check desktop and mobile widths. Confirm sharp, plain admin styling, readable fields, no horizontal overflow, and no `*-rich`, `mac-glass*`, or `.premium-site` treatment.

## Awaiting
Return **“approved”** if all twelve checks pass, or list failed check numbers and observed behavior. Do not run the milestone transition before approval.
