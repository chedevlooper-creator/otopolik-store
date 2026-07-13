"use client";

import Image from "next/image";
import { CartItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { XIcon, MinusIcon, PlusIcon } from "lucide-react";

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
  const buttonClass = compact
    ? "h-11 w-11 text-sm"
    : "h-11 w-11 text-lg";

  return (
    <li className={compact ? "flex gap-3 py-4" : "flex gap-4 py-5"}>
      <div
        className={`relative ${compact ? "h-20 w-20" : "h-24 w-24"} shrink-0 overflow-hidden border border-border bg-surface-hover`}
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
            className={`${compact ? "line-clamp-2 text-sm font-semibold" : "font-heading text-lg font-bold"} text-white`}
          >
            {item.name}
          </p>
          <p className={`${compact ? "text-xs" : "text-sm"} text-muted`}>
            Renk: {item.color}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="inline-flex items-center border border-border">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.slug, item.color, item.quantity - 1)}
              aria-label={`${item.name} adedini azalt`}
              className={`${buttonClass} inline-flex items-center justify-center font-semibold text-muted hover:text-sand`}
            >
              <MinusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <span className={`spec-value ${compact ? "w-6 text-sm" : "w-8"} text-center font-medium`}>
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.slug, item.color, item.quantity + 1)}
              aria-label={`${item.name} adedini artır`}
              className={`${buttonClass} inline-flex items-center justify-center font-semibold text-muted hover:text-sand`}
            >
              <PlusIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
          <span className={`spec-value ${compact ? "text-sm" : ""} font-semibold text-white`}>
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.slug, item.color)}
        aria-label="Ürünü kaldır"
        className="flex h-11 w-11 shrink-0 items-center justify-center self-start text-muted hover:text-brand-red"
      >
        <XIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </li>
  );
}
