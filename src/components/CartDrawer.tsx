"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import CartItemLine from "@/components/CartItemLine";
import { formatPrice } from "@/lib/format";
import { getRemainingForFreeShipping, getShippingCost } from "@/lib/shipping";
import { XIcon, ShoppingCartIcon, TruckIcon } from "lucide-react";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, totalPrice } = useCart();
  const settings = useStoreSettings();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab" && drawerRef.current) {
        const focusable = Array.from(
          drawerRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [isDrawerOpen, closeDrawer]);

  const remaining = getRemainingForFreeShipping(totalPrice, settings);
  const shippingCost = getShippingCost(totalPrice, settings);
  const orderTotal = totalPrice + shippingCost;
  const progress = Math.min(100, (totalPrice / settings.freeShippingThreshold) * 100);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] ${
        isDrawerOpen ? "visible" : "invisible delay-300"
      }`}
      aria-hidden={!isDrawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        ref={drawerRef}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col overflow-hidden border-l border-white/10 bg-surface shadow-2xl shadow-black/60 transition-transform duration-300 sm:rounded-l-[1.5rem] ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Sepet"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-2xl font-bold text-white">
            Sepetim {items.length > 0 && <span className="text-sand">({items.length})</span>}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label="Sepeti kapat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-white/[0.06] hover:text-sand"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center border border-border bg-background">
              <ShoppingCartIcon className="h-8 w-8 text-muted" aria-hidden="true" />
            </span>
            <p className="font-heading text-xl font-bold uppercase text-white">Sepetiniz boş</p>
            <p className="text-sm text-muted">
              Aracınıza özel EVA paspas setini keşfedin.
            </p>
            <Link
              href="/urunler"
              onClick={closeDrawer}
              className="btn-press red-glow mt-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white hover:bg-brand-red-dark"
            >
              Ürünleri İncele
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-dashed border-border px-5 py-3">
              {remaining > 0 ? (
                <div>
                  <p className="text-xs text-muted">
                    Ücretsiz kargoya{" "}
                    <strong className="spec-value text-sand">{formatPrice(remaining)}</strong>{" "}
                    kaldı
                  </p>
                  <div className="mt-2.5 h-1.5 overflow-hidden bg-background">
                    <div
                      className="h-full bg-brand-red transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366]">
                    <TruckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    Ücretsiz kargo kazandınız!
                  </p>
                  <div className="mt-2.5 h-1.5 overflow-hidden bg-background">
                    <div className="h-full w-full bg-[#25D366] transition-all duration-500" />
                  </div>
                </div>
              )}
            </div>

            <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
              {items.map((item) => (
                <CartItemLine
                  key={`${item.slug}-${item.color}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  compact
                />
              ))}
            </ul>

            <div className="border-t border-border px-5 py-4">
              <div className="mb-2 flex items-center justify-between text-sm text-muted">
                <span>Kargo</span>
                <span className="spec-value">{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-heading text-lg font-bold uppercase text-white">Toplam</span>
                <span className="spec-value text-xl font-semibold text-sand">
                  {formatPrice(orderTotal)}
                </span>
              </div>
              <Link
                href="/odeme"
                onClick={closeDrawer}
                className="btn-press red-glow mt-4 flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-red-dark"
              >
                Sipariş Talebine Geç
              </Link>
              <Link
                href="/sepet"
                onClick={closeDrawer}
                className="btn-press mt-2 flex w-full items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-foreground hover:border-white/24 hover:bg-white/[0.04]"
              >
                Sepete Git
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
