"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { useStoreSettings } from "@/context/settings-context";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { getShippingCost } from "@/lib/shipping";
import { TruckIcon, MinusIcon, PlusIcon, CheckIcon, ShoppingCartIcon } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, closeDrawer } = useCart();
  const settings = useStoreSettings();
  const router = useRouter();
  const [color, setColor] = useState(product.colors[0]?.name ?? "Siyah");
  const [quantity, setQuantity] = useState(1);
  const [footerVisible, setFooterVisible] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const subtotal = product.price * quantity;
  const shippingCost = getShippingCost(subtotal, settings);

  const handleAdd = useCallback(() => {
    addItem(buildLine());
    setJustAdded(true);
    setAnimateCart(true);
    window.setTimeout(() => { setAnimateCart(false); }, 500);
    window.setTimeout(() => { setJustAdded(false); }, 2000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addItem, color, quantity]);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  function buildLine() {
    const selected = product.colors.find((c) => c.name === color);
    return {
      slug: product.slug,
      name: product.name,
      image: selected?.image ?? product.image,
      price: product.price,
      color,
      quantity,
    };
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="spec-value mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Renk — <span className="text-sand">{color}</span>
        </p>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              aria-label={`Renk: ${c.name}`}
              aria-pressed={color === c.name}
              className={`h-11 w-11 rounded-full border-2 transition-transform sm:h-9 sm:w-9 ${
                color === c.name ? "scale-110 border-sand" : "border-border hover:border-muted"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="spec-value mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">Adet</p>
        <div className="inline-flex items-center rounded-full border border-border bg-surface">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity === 1}
            aria-label="Adedi azalt"
            className="inline-flex h-11 w-11 items-center justify-center font-semibold text-muted hover:text-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MinusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="spec-value w-8 text-center font-medium" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(9, q + 1))}
            disabled={quantity === 9}
            aria-label="Adedi artır"
            className="inline-flex h-11 w-11 items-center justify-center font-semibold text-muted hover:text-sand disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="hidden gap-3 sm:flex sm:flex-row">
        <button
          type="button"
          onClick={handleAdd}
          className={`btn-press btn-sand-rich flex-1 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-background transition-all duration-200 ${
            justAdded
              ? "!bg-emerald-500 !text-white !hover:bg-emerald-600"
              : ""
          }`}
        >
          <span className={`inline-flex items-center gap-2 ${animateCart ? "animate-cart-pop" : ""}`}>
            {justAdded ? (
              <>
                <CheckIcon className="h-4 w-4 animate-check-spread" aria-hidden="true" />
                Eklendi
              </>
            ) : (
              <>
                <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
                Sepete Ekle
              </>
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(buildLine());
            closeDrawer();
            router.push("/odeme");
          }}
          className="btn-press flex-1 border border-white/12 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-foreground transition-all duration-200 hover:border-sand hover:text-sand"
        >
          Hemen Al
        </button>
      </div>

      <p className="flex items-center gap-1.5 border-t border-dashed border-border pt-4 text-xs text-muted">
        <TruckIcon className="h-3.5 w-3.5 text-sand" aria-hidden="true" />
        {shippingCost === 0
          ? "Bu sipariş için kargo ücretsiz."
          : `Kargo: ${formatPrice(settings.shippingFee)} — ${settings.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz.`}
      </p>

      <div
        role="region"
        aria-label="Hızlı satın alma"
        aria-hidden={footerVisible}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform sm:hidden ${
          footerVisible ? "pointer-events-none translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="spec-value block text-[10px] uppercase tracking-[0.14em] text-muted">
              {quantity} adet · {color}
            </span>
            <strong className="spec-value block whitespace-nowrap text-lg font-semibold text-sand">
              {formatPrice(subtotal)}
            </strong>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            tabIndex={footerVisible ? -1 : undefined}
            className={`btn-press btn-sand-rich min-h-11 flex-1 px-5 py-3 text-sm font-bold uppercase tracking-wider text-background transition-all duration-200 ${
              justAdded
                ? "!bg-emerald-500 !text-white !hover:bg-emerald-600"
                : ""
            }`}
          >
            <span className={`inline-flex items-center gap-2 ${animateCart ? "animate-cart-pop" : ""}`}>
              {justAdded ? (
                <>
                  <CheckIcon className="h-4 w-4 animate-check-spread" aria-hidden="true" />
                  Eklendi
                </>
              ) : (
                <>
                  <ShoppingCartIcon className="h-4 w-4" aria-hidden="true" />
                  Ekle
                </>
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
