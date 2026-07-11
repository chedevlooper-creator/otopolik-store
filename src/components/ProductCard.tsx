import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="card-lift group flex flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xl hover:shadow-black/8"
    >
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* Alt kenara doğru yumuşak karartma — metin geçişini yumuşatır */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/15 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className="rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white shadow-md shadow-brand-red/30">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="rounded-full bg-brand-black px-3 py-1 text-xs font-bold text-white">
              %{discount} indirim
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-3 translate-y-2 rounded-full bg-white/95 px-4 py-1.5 text-xs font-bold text-brand-black opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          İncele →
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-5">
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400">
          {product.brand}
        </span>
        <h3 className="font-heading text-sm font-bold leading-snug text-neutral-900 line-clamp-2 transition-colors group-hover:text-brand-red">
          {product.model} Araca Özel EVA Paspas
        </h3>
        <p className="text-xs text-neutral-500">{product.compatibility.bodyOrChassis}</p>
        <div className="mt-auto flex items-baseline gap-2 pt-2.5">
          <span className="font-heading text-lg font-extrabold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
