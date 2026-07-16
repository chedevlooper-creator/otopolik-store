"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import CartItemLine from "@/components/CartItemLine";
import { formatPrice } from "@/lib/format";
import { getRemainingForFreeShipping, getShippingCost } from "@/lib/shipping";
import { ShoppingCartIcon } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { useCatalogProducts } from "@/context/catalog-context";
import { useStoreSettings } from "@/context/settings-context";

type CartContent = {
  title: string;
  description: string;
  emptyTitle?: string;
  emptyBody?: string;
  ctaLabel?: string;
};

export default function CartPageClient({ content }: { content: CartContent }) {
  const { items, updateQuantity, removeItem, totalPrice, isHydrated } = useCart();
  const catalog = useCatalogProducts();
  const settings = useStoreSettings();

  if (!isHydrated) {
    return (
      <div
        className="mx-auto max-w-5xl px-4 py-10 sm:py-14"
        role="status"
        aria-live="polite"
        aria-label="Sepet yükleniyor"
      >
        <div className="h-4 w-20 animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="mt-3 h-10 w-40 animate-pulse bg-surface motion-reduce:animate-none" />
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-px bg-border">
            {[0, 1].map((item) => (
              <div key={item} className="flex gap-4 bg-background py-5">
                <div className="h-24 w-24 shrink-0 animate-pulse bg-surface motion-reduce:animate-none" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-5 w-2/3 animate-pulse bg-surface motion-reduce:animate-none" />
                  <div className="h-4 w-1/3 animate-pulse bg-surface motion-reduce:animate-none" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 animate-pulse border border-border bg-surface motion-reduce:animate-none" />
        </div>
        <span className="sr-only">Sepetiniz yükleniyor.</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center border border-border bg-surface">
          <ShoppingCartIcon className="h-10 w-10 text-muted" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-heading text-3xl font-bold text-white">
          {content.emptyTitle ?? "Sepetiniz boş"}
        </h1>
        <p className="mt-2 text-muted">
          {content.emptyBody ??
            "Aracınıza özel EVA paspas setini keşfetmek için ürünlere göz atın."}
        </p>
        <Link
          href="/urunler"
          className="btn-press btn-red-rich mt-6 inline-flex px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white"
        >
          {content.ctaLabel ?? "Ürünleri İncele"}
        </Link>
      </div>
    );
  }

  const remainingForFreeShipping = getRemainingForFreeShipping(totalPrice, settings);
  const shippingCost = getShippingCost(totalPrice, settings);
  const orderTotal = totalPrice + shippingCost;
  const cartSlugs = new Set(items.map((item) => item.slug));
  const featured = catalog.filter((p) => !cartSlugs.has(p.slug)).slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <span className="spec-label">Sepet</span>
      <h1 className="mt-3 font-heading text-4xl font-bold text-white">
        {content.title}
      </h1>
      {content.description ? (
        <p className="mt-2 text-muted">{content.description}</p>
      ) : null}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <CartItemLine
              key={`${item.slug}-${item.color}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>

        <aside className="h-fit border border-border bg-surface p-6">
          <h2 className="font-heading text-xl font-bold text-white">Sipariş Özeti</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>Ara Toplam</span>
            <span className="spec-value font-medium text-white">{formatPrice(totalPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-muted">
            <span>Kargo</span>
            <span className="spec-value font-medium text-white">
              {shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
            </span>
          </div>
          {remainingForFreeShipping > 0 && (
            <p className="mt-3 border border-dashed border-border bg-background px-3 py-2 text-xs text-sand">
              Ücretsiz kargo için <span className="spec-value">{formatPrice(remainingForFreeShipping)}</span> kaldı.
            </p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-heading text-lg font-bold uppercase text-white">Toplam</span>
            <span className="spec-value text-xl font-semibold text-sand">
              {formatPrice(orderTotal)}
            </span>
          </div>
          <Link
            href="/odeme"
            className="btn-press btn-red-rich mt-6 flex w-full items-center justify-center px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-white"
          >
            Sipariş Talebine Geç
          </Link>
          <Link
            href="/urunler"
            className="btn-press mt-3 flex w-full items-center justify-center border border-border px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
          >
            Alışverişe Devam Et
          </Link>
        </aside>
      </div>
      {items.length > 0 && featured.length > 0 && (
        <section className="mt-16">
          <span className="spec-label">Tamamlayıcı ürünler</span>
          <h2 className="mb-6 mt-3 font-heading text-2xl font-bold text-white">
            Bunlara da göz atın
          </h2>
          <div className={`grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 ${
            featured.length === 1
              ? "max-w-md lg:grid-cols-1"
              : featured.length === 2
                ? "max-w-3xl lg:grid-cols-2"
                : featured.length === 3
                  ? "lg:grid-cols-3"
                  : "lg:grid-cols-4"
          }`}>
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
