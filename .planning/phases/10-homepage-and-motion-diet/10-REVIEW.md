---
phase: 10-homepage-and-motion-diet
reviewed: 2026-07-17T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - src/app/page.tsx
  - src/components/home/Hero.tsx
  - src/components/home/HeroMedia.tsx
findings:
  critical: 0
  warning: 2
  info: 3
  total: 5
status: issues_found
---

# Phase 10: Code Review Report

**Reviewed:** 2026-07-17T00:00:00Z
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Reviewed the homepage motion-diet changes: `Hero.tsx` converted from a client component with framer-motion scroll/parallax/stagger effects to a static server component, `HeroMedia.tsx` had its autoplay-retry `useEffect` (visibility listener, timed retries, pointer/touch/keydown "unlock" listeners) removed in favor of a single user-initiated play/pause toggle, and `page.tsx` unmounted `HomeConfiguratorShowcase` and `FeaturedProducts` from the homepage composition.

The core simplification is sound: no obvious logic bugs, the `primaryHref` guard correctly avoids linking to the now-dead `#arac-sec` in-page anchor that only existed inside the removed `HomeConfiguratorShowcase` section, and removing autoplay is a net positive for `prefers-reduced-motion` compliance and Windows autoplay-block spam. No security issues, no hardcoded secrets, no dangerous sinks.

Findings are mostly quality/cleanup debt from the unmount-not-delete approach: two now-fully-orphaned homepage components remain in the tree, and the play/pause toggle has a couple of unhandled edge cases that could leave the UI state inconsistent (not crash-level, but worth a WARNING each).

## Warnings

### WR-01: Rapid double-click on hero play/pause button can desync `playing` state from actual video state

**File:** `src/components/home/HeroMedia.tsx:16-29`
**Issue:** `togglePlay` branches on `video.paused` synchronously, but `video.play()` returns a promise that resolves asynchronously. If a user double-clicks (or a screen-reader/switch-access user activates twice quickly), the sequence is:
1. Click 1: `video.paused` is `true` → calls `video.play()` (pending), `playing` still `false` in this render.
2. Click 2 (before the promise resolves): `video.paused` is still `true` in the DOM (play hasn't taken effect yet) → `togglePlay` calls `video.play()` again instead of pausing, since the branch re-reads `video.paused` which hasn't flipped yet.

This mostly self-corrects once `onPlay`/`onPause` fire, but on slower devices/network the button label (`Oynat`/`Duraklat`, driven by `playing` state) can briefly show the wrong action, and overlapping `play()` calls can produce an unhandled rejection path that's silently swallowed by `.catch(() => undefined)`, masking real errors (e.g. a genuine decode failure gets treated identically to an expected `AbortError` from interrupted play() calls).
**Fix:** Guard against overlapping calls with a pending-ref, and don't swallow all errors identically:
```tsx
const pendingRef = useRef(false);

const togglePlay = () => {
  const video = videoRef.current;
  if (!video || failed || pendingRef.current) return;
  if (video.paused) {
    pendingRef.current = true;
    video.muted = true;
    void video
      .play()
      .then(() => setPlaying(true))
      .catch((err) => {
        if (err?.name !== "AbortError") setFailed(true);
      })
      .finally(() => {
        pendingRef.current = false;
      });
  } else {
    video.pause();
    setPlaying(false);
  }
};
```

### WR-02: `onError` on `<video>` can fire after a successful play, silently reverting the whole hero to a static poster with no recovery path

**File:** `src/components/home/HeroMedia.tsx:58, 63-72`
**Issue:** Once `failed` is set `true` (e.g. a transient network blip while looping, or the browser dropping a decode mid-playback), the poster `<img>` permanently shows (`failed || !playing` → `opacity-90`) and the play/pause button is removed entirely (`{!failed ? (...) : null}`) with no way for the user to retry. Since the video element itself is never unmounted/remounted, `failed` can never be reset back to `false` — a single `error` event (which browsers can fire for recoverable network stalls, not just fatal codec issues) permanently disables the hero video for the remainder of the page's lifetime.
**Fix:** Either scope `onError` handling to distinguish `video.error.code` (e.g. only latch `failed` for `MEDIA_ERR_SRC_NOT_SUPPORTED`/`MEDIA_ERR_DECODE`), or give the user a way back by keeping the button visible and calling `video.load()` on retry:
```tsx
onError={() => {
  const code = videoRef.current?.error?.code;
  if (code === MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED || code === MediaError.MEDIA_ERR_DECODE) {
    setFailed(true);
  }
}}
```

## Info

### IN-01: `HomeConfiguratorShowcase.tsx` and `FeaturedProducts.tsx` are now fully orphaned components

**File:** `src/app/page.tsx:1-2` (removed imports), `src/components/home/HomeConfiguratorShowcase.tsx`, `src/components/home/FeaturedProducts.tsx`
**Issue:** These two components are no longer imported anywhere in `src/` (confirmed via repo-wide search — no references outside their own files). They still ship in the bundle graph as dead, unreachable modules and carry their own CMS-driven props (`section("featured")`) that are now computed in `page.tsx` for no consumer... actually `section("featured")` is no longer even called in `page.tsx` per the diff, so that specific dead computation was already removed. The components themselves remain as unreferenced source files.
**Fix:** If the homepage sections are permanently retired (not a temporary A/B unmount), delete the two component files in a follow-up cleanup commit rather than leaving them to bit-rot; if they're meant to return later, leave a `// TODO(phase-XX): re-mount pending <reason>` note in `page.tsx` so the intent isn't lost.

### IN-02: `hero-media-video` CSS class has no corresponding stylesheet rule

**File:** `src/components/home/HeroMedia.tsx:59`
**Issue:** The `<video>` element carries a `hero-media-video` class that does not appear anywhere in `src/app/globals.css` or any other stylesheet in the repo — it resolves to a no-op selector. This predates this phase's diff (present before the motion-diet changes too), but since this file was touched in this phase it's a reasonable place to clean it up.
**Fix:** Remove the unused class name, or if it was meant to hook a CSS rule (e.g. for reduced-motion or focus styling), add the intended rule to `globals.css`.

### IN-03: Secondary CTA lost its button-style treatment, now visually a plain text link

**File:** `src/components/home/Hero.tsx:73-78`
**Issue:** Previously the secondary CTA used `btn-ghost-rich` (glass outline button per the design system's documented button set in CLAUDE.md). The new version drops `btn-ghost-rich` entirely, rendering it as unstyled uppercase text with only a hover color change and no visible button chrome/border. This is a design-system deviation, not a functional bug, but worth flagging since CLAUDE.md explicitly documents `btn-ghost-rich` as the canonical "glass outline" secondary-action treatment and this change silently opts out of it for the homepage's most prominent secondary CTA.
**Fix:** Confirm this is an intentional design decision from the phase's UI-SPEC (if one exists) rather than an accidental loss during the motion-diet refactor; if intentional, no action needed — if accidental, restore `btn-ghost-rich btn-press` on the secondary link.

---

_Reviewed: 2026-07-17T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
