import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ArrowRightIcon, CircleCheckIcon, ClockIcon, PackageIcon } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const containedImageCategories: Product["category"][] = [
    "eva-3d",
    "bagaj-havuzu",
    "bagaj-cantasi",
  ];
  const shouldContainImage = containedImageCategories.includes(product.category);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      data-whatsapp-obstacle
      className="group flex h-full min-w-0 flex-col overflow-hidden border border-border bg-background transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-1 hover:border-brand-red hover:shadow-[6px_6px_0_0_var(--brand-red)]"
    >
      <div className="bg-eva relative aspect-[5/4] overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(211,189,150,0.14),transparent_58%)] opacity-80" />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className={`transition-transform duration-500 ease-out group-hover:scale-[1.04] ${
            shouldContainImage ? "object-contain p-4" : "object-cover"
          }`}
        />
        {product.badge && (
          <span className="spec-value absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-sand shadow-lg shadow-black/25">
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="spec-value absolute right-3 top-3 bg-brand-red px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg shadow-black/25">
            -%{discount}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">
        <span className="spec-value text-[11px] font-medium uppercase tracking-[0.14em] text-muted sm:text-[10px] sm:tracking-[0.16em]">
          {CATEGORY_LABELS[product.category]}
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-10 break-words font-heading text-base font-bold leading-tight text-white group-hover:text-sand sm:min-h-11 sm:text-lg">
          {product.name}
        </h3>
        {product.features[0] && (
          <p className="mt-1.5 hidden text-[11px] leading-relaxed text-muted sm:line-clamp-1">
            {product.features[0]}
          </p>
        )}
        <div className="mt-auto flex min-w-0 flex-col items-start gap-2 border-t border-border pt-3">
          <div className="flex w-full items-end justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="spec-value whitespace-nowrap text-base font-semibold text-foreground sm:text-lg">
                {formatPrice(product.price)}
              </span>
              {product.oldPrice && (
                <span className="spec-value whitespace-nowrap text-[11px] text-muted line-through sm:text-xs">
                  {formatPrice(product.oldPrice)}
                </span>
              )}
            </div>
            <span
              className={`inline-flex shrink-0 items-center gap-1 text-[10px] font-medium uppercase tracking-[0.06em] ${
                product.inStock === false ? "text-amber-400" : "text-emerald-400"
              }`}
            >
              {product.inStock === false ? (
                <ClockIcon className="h-3 w-3" aria-hidden="true" />
              ) : product.inStock ? (
                <CircleCheckIcon className="h-3 w-3" aria-hidden="true" />
              ) : (
                <PackageIcon className="h-3 w-3" aria-hidden="true" />
              )}
              {product.inStock === false ? "Yakında" : product.inStock ? "Stokta" : "Üretim"}
            </span>
          </div>
          <span className="spec-value inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted transition-colors group-hover:text-sand">
            İncele
            <ArrowRightIcon className="h-3 w-3" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
