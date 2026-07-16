"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import CartItemLine from "@/components/CartItemLine";
import { formatPrice } from "@/lib/format";
import { getRemainingForFreeShipping, getShippingCost } from "@/lib/shipping";
import { XIcon, ShoppingCartIcon, TruckIcon } from "lucide-react";

function supportsClosedBy() {
  return typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;
}

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, totalPrice } = useCart();
  const settings = useStoreSettings();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.setAttribute("closedby", "any");

    if (isDrawerOpen) {
      if (!dialog.open) dialog.showModal();
      const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }

    if (dialog.open) dialog.close();
  }, [isDrawerOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const syncClosed = () => closeDrawer();
    dialog.addEventListener("close", syncClosed);

    let onBackdropClick: ((event: MouseEvent) => void) | undefined;
    if (!supportsClosedBy()) {
      onBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (inContent) return;
        dialog.close();
      };
      dialog.addEventListener("click", onBackdropClick);
    }

    return () => {
      dialog.removeEventListener("close", syncClosed);
      if (onBackdropClick) dialog.removeEventListener("click", onBackdropClick);
    };
  }, [closeDrawer]);

  const remaining = getRemainingForFreeShipping(totalPrice, settings);
  const shippingCost = getShippingCost(totalPrice, settings);
  const orderTotal = totalPrice + shippingCost;
  const progress = Math.min(100, (totalPrice / settings.freeShippingThreshold) * 100);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Sepet"
      className="cart-drawer-dialog m-0 ml-auto h-full max-h-none w-full max-w-md border-0 bg-transparent p-0"
    >
      <div className="flex h-full max-h-[100dvh] w-full flex-col overflow-hidden border-l border-white/10 bg-surface shadow-2xl shadow-black/60 sm:rounded-l-[1.5rem]">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-heading text-2xl font-bold text-white">
            Sepetim {items.length > 0 && <span className="text-sand">({items.length})</span>}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Sepeti kapat"
            className="flex h-9 w-9 items-center justify-center border border-transparent text-muted hover:border-white/12 hover:bg-white/[0.04] hover:text-sand"
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
              onClick={() => dialogRef.current?.close()}
              className="btn-press btn-sand-rich mt-2 px-6 py-3 text-sm font-bold uppercase tracking-wider text-background"
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
                onClick={() => dialogRef.current?.close()}
                className="btn-press btn-sand-rich mt-4 flex w-full items-center justify-center px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-background"
              >
                Sipariş Talebine Geç
              </Link>
              <Link
                href="/sepet"
                onClick={() => dialogRef.current?.close()}
                className="btn-press mt-2 flex w-full items-center justify-center border border-white/12 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
              >
                Sepete Git
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
