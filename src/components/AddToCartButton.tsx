"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { getShippingCost } from "@/lib/shipping";
import { TruckIcon, Undo2Icon, MinusIcon, PlusIcon } from "lucide-react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem, closeDrawer } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const subtotal = product.price * quantity;
  const shippingCost = getShippingCost(subtotal);

  function buildLine() {
    return {
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: product.price,
      color,
      quantity,
    };
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-semibold text-neutral-200">Renk: {color}</p>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              className={`h-9 w-9 rounded-full border-2 transition-transform ${
                color === c.name ? "border-brand-red scale-110" : "border-neutral-700"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-neutral-200">Adet</p>
        <div className="inline-flex items-center rounded-full border border-neutral-600">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="inline-flex h-10 w-10 items-center justify-center font-semibold text-neutral-400 hover:text-brand-red"
          >
            <MinusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(9, q + 1))}
            className="inline-flex h-10 w-10 items-center justify-center font-semibold text-neutral-400 hover:text-brand-red"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => addItem(buildLine())}
          className="flex-1 rounded-full bg-brand-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-red"
        >
          Sepete Ekle
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(buildLine());
            closeDrawer();
            router.push("/odeme");
          }}
          className="flex-1 rounded-full border border-brand-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:border-brand-red hover:text-brand-red"
        >
          Hemen Al
        </button>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <TruckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {product.dispatchEstimate} içinde kargoda
        </span>
        <span className="inline-flex items-center gap-1">
          <TruckIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {shippingCost === 0 ? "Ücretsiz kargo" : `Kargo: ${formatPrice(siteConfig.shippingFee)}`}
        </span>
        <span className="inline-flex items-center gap-1">
          <Undo2Icon className="h-3.5 w-3.5" aria-hidden="true" />
          İade koşulları için bilgi sayfasını inceleyin
        </span>
      </div>
    </div>
  );
}
