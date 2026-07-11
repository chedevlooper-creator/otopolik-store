"use client";

import Image from "next/image";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

type Props = {
  item: CartItem;
  onUpdateQuantity: (slug: string, color: string, quantity: number) => void;
  onRemove: (slug: string, color: string) => void;
  /** Kompakt mod (CartDrawer): daha küçük görsel, daha küçük butonlar */
  compact?: boolean;
};

export default function CartItemLine({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}: Props) {
  const imageSize = compact ? 80 : 96;
  const buttonClass = compact
    ? "h-7 w-7 text-sm"
    : "h-9 w-9 text-lg";

  return (
    <li className={`flex gap-${compact ? "3 py-4" : "4 py-5"}`}>
      <div
        className={`relative ${compact ? "h-20 w-20" : "h-24 w-24"} shrink-0 overflow-hidden rounded-xl bg-neutral-100`}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes={compact ? "80px" : "96px"}
          className="object-cover"
        />
      </div>

      <div className={`flex flex-1 flex-col ${compact ? "" : "justify-between"}`}>
        <div>
          <p
            className={`${compact ? "line-clamp-2 text-sm font-semibold" : "font-heading font-semibold"} text-neutral-900`}
          >
            {item.name}
          </p>
          <p className={`${compact ? "text-xs" : "text-sm"} text-neutral-500`}>
            Renk: {item.color}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className={`inline-flex items-center rounded-full border ${compact ? "border-neutral-200" : "border-neutral-300"}`}>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.slug, item.color, item.quantity - 1)}
              className={`${buttonClass} font-semibold text-neutral-600 hover:text-brand-red`}
            >
              −
            </button>
            <span className={`${compact ? "w-6 text-sm" : "w-8"} text-center font-semibold`}>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.slug, item.color, item.quantity + 1)}
              className={`${buttonClass} font-semibold text-neutral-600 hover:text-brand-red`}
            >
              +
            </button>
          </div>
          <span className={`${compact ? "text-sm" : "font-heading"} font-bold text-neutral-900`}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.slug, item.color)}
        aria-label="Ürünü kaldır"
        className={`self-start ${compact ? "text-sm text-neutral-300" : "text-neutral-400"} hover:text-brand-red`}
      >
        ✕
      </button>
    </li>
  );
}
