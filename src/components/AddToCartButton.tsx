"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { getShippingCost } from "@/lib/shipping";

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
        <p className="mb-2 text-sm font-semibold text-neutral-800">Renk: {color}</p>
        <div className="flex gap-2">
          {product.colors.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              aria-label={c.name}
              className={`h-9 w-9 rounded-full border-2 transition-transform ${
                color === c.name ? "border-brand-red scale-110" : "border-neutral-200"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-neutral-800">Adet</p>
        <div className="inline-flex items-center rounded-full border border-neutral-300">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="h-10 w-10 text-lg font-semibold text-neutral-600 hover:text-brand-red"
          >
            −
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(9, q + 1))}
            className="h-10 w-10 text-lg font-semibold text-neutral-600 hover:text-brand-red"
          >
            +
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
          className="flex-1 rounded-full border border-brand-black px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-neutral-900 transition-colors hover:border-brand-red hover:text-brand-red"
        >
          Hemen Al
        </button>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
        <span>🚚 {product.dispatchEstimate} içinde kargoda</span>
        <span>{shippingCost === 0 ? "🚚 Ücretsiz kargo" : `🚚 Kargo: ${formatPrice(siteConfig.shippingFee)}`}</span>
        <span>↩️ İade koşulları için bilgi sayfasını inceleyin</span>
      </div>
    </div>
  );
}
