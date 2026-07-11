"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import CartItemLine from "@/components/CartItemLine";
import { formatPrice } from "@/lib/format";
import { getRemainingForFreeShipping, getShippingCost } from "@/lib/shipping";
import { ShoppingCartIcon } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-neutral-800">
          <ShoppingCartIcon className="h-10 w-10 text-neutral-400" aria-hidden="true" />
        </span>
        <h1 className="font-heading mt-4 text-2xl font-extrabold text-white">
          Sepetiniz boş
        </h1>
        <p className="mt-2 text-neutral-400">
          Aracınıza özel EVA paspas setini keşfetmek için ürünlere göz atın.
        </p>
        <Link
          href="/urunler"
          className="mt-6 inline-flex rounded-full bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red-dark"
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
      <h1 className="font-heading text-3xl font-extrabold text-white">Sepetim</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-neutral-200 border-y border-neutral-700">
          {items.map((item) => (
            <CartItemLine
              key={`${item.slug}-${item.color}`}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-neutral-700 p-6">
          <h2 className="font-heading text-lg font-bold text-white">Sipariş Özeti</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-neutral-400">
            <span>Ara Toplam</span>
            <span className="font-semibold text-white">{formatPrice(totalPrice)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-neutral-400">
            <span>Kargo</span>
            <span className="font-semibold text-white">
              {shippingCost === 0 ? "Ücretsiz" : formatPrice(shippingCost)}
            </span>
          </div>
          {remainingForFreeShipping > 0 && (
            <p className="mt-3 rounded-lg bg-neutral-800 px-3 py-2 text-xs text-brand-red">
              Ücretsiz kargo için {formatPrice(remainingForFreeShipping)} kaldı.
            </p>
          )}
          <div className="mt-4 flex items-center justify-between border-t border-neutral-700 pt-4">
            <span className="font-heading font-bold text-white">Toplam</span>
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
            className="mt-3 flex w-full items-center justify-center rounded-full border border-neutral-600 px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-neutral-300 hover:border-brand-red hover:text-brand-red"
          >
            Alışverişe Devam Et
          </Link>
        </aside>
      </div>
    </div>
  );
}
