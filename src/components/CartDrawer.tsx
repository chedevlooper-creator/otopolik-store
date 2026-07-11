"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/cart-context";
import CartItemLine from "@/components/CartItemLine";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { getRemainingForFreeShipping, getShippingCost } from "@/lib/shipping";

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, totalPrice } = useCart();

  useEffect(() => {
    if (!isDrawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen, closeDrawer]);

  const remaining = getRemainingForFreeShipping(totalPrice);
  const shippingCost = getShippingCost(totalPrice);
  const orderTotal = totalPrice + shippingCost;
  const progress = Math.min(100, (totalPrice / siteConfig.freeShippingThreshold) * 100);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-[visibility] ${
        isDrawerOpen ? "visible" : "invisible delay-300"
      }`}
      aria-hidden={!isDrawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Sepet"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 className="font-heading text-lg font-extrabold text-neutral-900">
            Sepetim {items.length > 0 && <span className="text-brand-red">({items.length})</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Sepeti kapat"
            className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 hover:text-brand-red"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-4xl">🛒</p>
            <p className="font-heading font-bold text-neutral-900">Sepetiniz boş</p>
            <p className="text-sm text-neutral-500">
              Aracınıza özel EVA paspas setini keşfedin.
            </p>
            <Link
              href="/urunler"
              onClick={closeDrawer}
              className="mt-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700"
            >
              Ürünleri İncele
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-neutral-100 px-5 py-3">
              {remaining > 0 ? (
                <p className="text-xs text-neutral-600">
                  Ücretsiz kargoya <strong className="text-brand-red">{formatPrice(remaining)}</strong> kaldı
                </p>
              ) : (
                <p className="text-xs font-semibold text-green-600">🎉 Ücretsiz kargo kazandınız!</p>
              )}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-brand-red transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5">
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

            <div className="border-t border-neutral-200 px-5 py-4">
              <div className="mb-2 flex items-center justify-between text-sm text-neutral-600">
                <span>Kargo</span><span>{shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-heading font-bold text-neutral-900">Toplam</span>
                <span className="font-heading text-xl font-extrabold text-brand-red">
                  {formatPrice(orderTotal)}
                </span>
              </div>
              <Link
                href="/odeme"
                onClick={closeDrawer}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-brand-red px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700"
              >
                Sipariş Talebine Geç
              </Link>
              <Link
                href="/sepet"
                onClick={closeDrawer}
                className="mt-2 flex w-full items-center justify-center rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold uppercase tracking-wide text-neutral-700 hover:border-brand-red hover:text-brand-red"
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
