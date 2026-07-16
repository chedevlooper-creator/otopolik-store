"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const STORAGE_KEY = "otopolik_cookie_consent";

export type ConsentValue = "accepted" | "essential";

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === "accepted" || raw === "essential") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function setStoredConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
    window.dispatchEvent(new CustomEvent("otopolik:consent", { detail: value }));
  } catch {
    /* ignore */
  }
}

function supportsPopover() {
  return typeof HTMLElement !== "undefined" && "popover" in HTMLElement.prototype;
}

/**
 * Cookie banner — popover="manual" so it stays until the user chooses
 * (no light-dismiss). Falls back to fixed positioning when Popover API
 * is unavailable.
 */
export default function CookieConsent() {
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = popoverRef.current;
    if (!el || getStoredConsent() !== null) return;

    if (supportsPopover() && typeof el.showPopover === "function") {
      el.showPopover();
    } else {
      el.dataset.open = "true";
    }
  }, []);

  function choose(value: ConsentValue) {
    setStoredConsent(value);
    const el = popoverRef.current;
    if (!el) return;
    if (supportsPopover() && typeof el.hidePopover === "function" && el.matches(":popover-open")) {
      el.hidePopover();
    } else {
      delete el.dataset.open;
    }
  }

  return (
    <div
      ref={popoverRef}
      id="cookie-consent"
      popover="manual"
      role="dialog"
      aria-label="Çerez ve gizlilik bildirimi"
      className="cookie-consent-popover border-t border-white/10 bg-[#0a0c12]/96 p-4 shadow-[0_-12px_40px_rgba(0,0,0,.45)] backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="font-heading text-sm font-bold uppercase tracking-wide text-white">
            Çerez ve gizlilik
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            Site deneyimi ve sipariş süreci için gerekli çerezleri kullanırız.
            İsteğe bağlı olarak ziyaret istatistiklerini (Vercel Analytics)
            de açabilirsiniz. Ayrıntılar için{" "}
            <Link
              href="/bilgiler/gizlilik"
              className="font-semibold text-sand underline-offset-2 hover:underline"
            >
              gizlilik politikası
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="btn-press min-h-11 border border-border px-5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
          >
            Yalnızca gerekli
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-press btn-sand-rich min-h-11 px-5 text-xs font-bold uppercase tracking-wider text-background"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
