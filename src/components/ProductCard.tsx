import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ArrowRightIcon } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="card-lift group flex flex-col overflow-hidden rounded-2xl border border-neutral-700 bg-[#141414] hover:border-neutral-600 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-black/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-brand-red px-2.5 py-1 text-[11px] font-bold text-white">
            -%{discount}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
          {product.brand}
        </span>
        <h3 className="font-heading text-sm font-bold leading-snug text-white line-clamp-2 group-hover:text-brand-red">
          {product.model} EVA Paspas Seti
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-heading text-lg font-extrabold text-white">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
