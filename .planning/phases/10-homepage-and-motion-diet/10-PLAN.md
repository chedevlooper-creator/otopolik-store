---
phase: 10-homepage-and-motion-diet
status: draft
granularity: coarse
---

# Phase 10: Homepage and Motion Diet — Plan

## Requirements
HOME-01, HOME-02, HOME-03, HOME-04, BRAND-01, TRUST-01, TRUST-02

## Objective
Simplify the homepage into one calm luxury composition: unmount redundant sections, discipline the hero around one primary CTA, remove decorative motion (parallax, dense stagger, glow), and keep a small motion allowlist that respects `prefers-reduced-motion`. Preserve OLED black / Racing Red brand identity, premium typography, and one concise trust/FAQ surface. The user's uncommitted `Hero.tsx` WIP is preserved byte-for-byte.

## Wave 1: Homepage Composition

### Task 1: Unmount redundant sections
**Goal:** Mount only sections with a distinct job on the homepage.

**Changes:**
- `src/app/page.tsx`: Remove `HomeConfiguratorShowcase` and `FeaturedProducts` mounts (keep `Faq` as the concise trust surface). CMS rows remain intact for reversibility.
- `src/app/page.tsx`: Remove unused imports for `HomeConfiguratorShowcase` and `FeaturedProducts`.

**Verification:**
- `npm run typecheck` passes.
- `npx eslint src/app/page.tsx` passes.
- Source assertion: no `HomeConfiguratorShowcase` or `FeaturedProducts` import/mount in `src/app/page.tsx`.

### Task 2: Simplify Hero motion
**Goal:** Remove decorative parallax, dense stagger, and glow from the hero while preserving brand identity.

**Changes:**
- `src/components/home/Hero.tsx`: Remove `useScroll`/`useTransform` parallax (backgroundScale, backgroundOpacity, contentY, contentOpacity). Remove `containerVariants` stagger, `itemVariants` blur entrance, `lineVariants` path animation. Remove `animate-scroll-cue` and bottom ambient red glow. Keep `motion` only for the single line draw or reduce to plain CSS. Preserve the user's uncommitted WIP byte-for-byte — this means the file must not be overwritten; apply surgical edits only.
- `src/components/home/HeroMedia.tsx`: Remove autoplay loop video; keep poster image with optional user-initiated play (no autoplay).

**Verification:**
- `npm run typecheck` passes.
- `npx eslint src/components/home/Hero.tsx src/components/home/HeroMedia.tsx` passes.
- Source assertion: no `useScroll`, `useTransform`, `staggerChildren`, `animate-scroll-cue`, `bg-gradient-to-t from-brand-red` in Hero; no `autoPlay` in HeroMedia.

## Wave 2: Brand and Trust Preservation

### Task 3: Confirm brand tokens and typography
**Goal:** Ensure OLED black, Racing Red, and premium typography remain intact.

**Changes:**
- `src/app/globals.css`: No changes to `--brand-red`, `--background`, `--surface`, `--font-heading`, `--font-body`, `--font-spec`. Confirm `.btn-red-rich`, `.btn-ghost-rich`, `.section-kicker`, `.section-title`, `.section-copy` are preserved.

**Verification:**
- `npm run typecheck` passes.
- Source assertion: CSS variables and utility classes are unchanged.

### Task 4: Keep concise trust/FAQ surface
**Goal:** Ensure the homepage retains a concise trust/FAQ surface with SEO parity.

**Changes:**
- `src/app/page.tsx`: Keep `Faq` mount with `whatsappHref` and `renderJsonLd(faqPageSchema(faqItems))`. No changes needed if already correct.

**Verification:**
- `npm run typecheck` passes.
- Source assertion: `Faq` and `renderJsonLd` are present in `src/app/page.tsx`.

## Verification Commands
- `npm run typecheck`
- `npx eslint src/app/page.tsx src/components/home/Hero.tsx src/components/home/HeroMedia.tsx`
- Source assertions for removed/kept patterns

## Constraints
- Do not modify admin UI, Convex backend, CMS seeds, cart, pricing, or checkout.
- Do not overwrite or stage the user's uncommitted `Hero.tsx` WIP.
- No new dependencies.
