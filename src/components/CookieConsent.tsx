"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/cart-context";

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

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("otopolik:consent", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("otopolik:consent", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useStoredConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribeToConsent, getStoredConsent, () => null);
}

export default function CookieConsent() {
  const consent = useStoredConsent();
  const pathname = usePathname();
  const { isDrawerOpen } = useCart();
  const hasMobilePurchaseBar = pathname.startsWith("/urunler/");

  function choose(value: ConsentValue) {
    setStoredConsent(value);
  }

  if (consent !== null || isDrawerOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Çerez ve gizlilik bildirimi"
      className={`fixed inset-x-3 z-[70] rounded-2xl border border-white/10 bg-[#0b0b0b]/96 p-4 shadow-[0_24px_80px_rgba(0,0,0,.72)] backdrop-blur-xl sm:right-auto sm:left-5 sm:max-w-xs sm:p-4 ${
        hasMobilePurchaseBar ? "bottom-[6.25rem]" : "bottom-3"
      } sm:bottom-5`}
    >
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-heading text-xs font-bold uppercase tracking-wide text-white">
            Çerez ve gizlilik
          </p>
          <p className="mt-1.5 text-xs leading-5 text-muted">
            Sipariş süreci için gerekli çerezleri kullanırız; isteğe bağlı
            ziyaret istatistiklerini (Vercel Analytics) açabilirsiniz.{" "}
            <Link
              href="/bilgiler/gizlilik"
              className="font-semibold text-white underline-offset-2 hover:underline"
            >
              Gizlilik politikası
            </Link>
            .
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => choose("essential")}
            className="btn-press min-h-10 rounded-lg border border-border px-3 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-white hover:text-white"
          >
            Yalnızca gerekli
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn-press btn-red-rich min-h-10 rounded-lg px-3 text-[11px] font-bold uppercase tracking-wider text-white"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  );
}
