"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import CartItemLine from "@/components/CartItemLine";
import { formatPrice } from "@/lib/format";
import { getRemainingForFreeShipping, getShippingCost } from "@/lib/shipping";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-5xl">🛒</p>
        <h1 className="font-heading mt-4 text-2xl font-extrabold text-neutral-900">
          Sepetiniz boş
        </h1>
        <p className="mt-2 text-neutral-600">
          Aracınıza özel EVA paspas setini keşfetmek için ürünlere göz atın.
        </p>
        <Link
          href="/urunler"
          className="mt-6 inline-flex rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-red-700"
        >
          Ürünleri İncele
        </Link>
      </div>
    );
  }

  const remainingForFreeShipping = getRemainingForFreeShipping(totalPrice);
  const shippingCost = getShippingCost(totalPrice);
  const orderTotal = totalPrice + shippingCost;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
      <h1 className="font-heading text-3xl font-extrabold text-neutral-900">Sepetim</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-neutral-200 border-y border-neutral-200">
          {items.map((item) => (
            <CartItemLine
              key={`${item.slug}-${item.color}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-neutral-200 p-6">
          <h2 className="font-heading text-lg font-bold text-neutral-900">Sipariş Özeti</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-neutral-600">
            <span>Ara Toplam</span>
            <span className="font-semibold text-neutral-900">{formatPrice(totalPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-neutral-600">
            <span>Kargo</span>
            <span className="font-semibold text-neutral-900">
              {shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
            </span>
          </div>
          {remainingForFreeShipping > 0 && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-brand-red">
              Ücretsiz kargo için {formatPrice(remainingForFreeShipping)} kaldı.
            </p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
            <span className="font-heading font-bold text-neutral-900">Toplam</span>
            <span className="font-heading text-xl font-extrabold text-brand-red">
              {formatPrice(orderTotal)}
            </span>
          </div>
          <Link
            href="/odeme"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-brand-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red"
          >
            Sipariş Talebine Geç
          </Link>
          <Link
            href="/urunler"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-neutral-300 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-neutral-700 hover:border-brand-red hover:text-brand-red"
          >
            Alışverişe Devam Et
          </Link>
        </aside>
      </div>
    </div>
  );
}
