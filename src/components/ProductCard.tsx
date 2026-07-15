import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ArrowUpRightIcon, CheckIcon, Clock3Icon } from "lucide-react";

type ProductCardProps = {
  product: Product;
  featured?: boolean;
};

export default function ProductCard({ product, featured = false }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;
  const shouldContainImage = ["eva-3d", "bagaj-havuzu", "bagaj-cantasi"].includes(product.category);
  // Beyaz fonlu stüdyo çekimleri (JPG) koyu kartta sırıtmasın diye çerçeveli panel içinde gösterilir
  const hasLightImage = product.category === "bagaj-cantasi";
  const showSwatches = ["eva-3d", "eva-havuzlu", "bagaj-havuzu"].includes(product.category);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      data-whatsapp-obstacle
      className={`group premium-card card-lift flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] hover:border-white/18 hover:shadow-[0_30px_76px_rgba(0,0,0,.38)] ${
        featured ? "min-h-[520px]" : "min-h-[360px]"
      }`}
    >
      <div className={`premium-grid relative overflow-hidden border-b border-white/8 bg-[#14161b] ${featured ? "min-h-[330px] flex-1" : "aspect-[5/4]"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(225,201,162,.16),transparent_58%)] opacity-90" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-red/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
        {hasLightImage ? (
          <div
            className={`absolute overflow-hidden rounded-2xl bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.14),0_18px_40px_rgba(0,0,0,.35)] ${
              featured ? "inset-8 sm:inset-12" : "inset-5"
            }`}
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes={featured ? "(min-width: 1024px) 44vw, 100vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"}
              className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.035]"
            />
            {/* Yumuşak stüdyo vinyeti — görsel ile panel arasındaki dikişi gizler */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_38%,transparent_52%,rgba(20,22,27,.12))]" />
          </div>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes={featured ? "(min-width: 1024px) 44vw, 100vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"}
            className={`transition-transform duration-700 ease-out group-hover:scale-[1.035] ${
              shouldContainImage ? `object-contain ${featured ? "p-8 sm:p-12" : "p-5"}` : "object-cover"
            }`}
          />
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
          <div className="flex flex-wrap gap-2">
            {product.badge && (
              <span className="spec-value rounded-full border border-white/10 bg-black/58 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="spec-value rounded-full bg-brand-red px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-lg shadow-brand-red/20">
                %{discount} avantaj
              </span>
            )}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-black/45 text-white backdrop-blur-md transition-colors duration-300 group-hover:bg-white group-hover:text-background">
            <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className={`flex min-w-0 flex-col ${featured ? "p-6 sm:p-7" : "p-4 sm:p-5"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="spec-value text-[9px] font-semibold uppercase tracking-[0.15em] text-sand">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className={`inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.1em] ${product.inStock === false ? "text-amber-400" : "text-emerald-400"}`}>
            {product.inStock === false ? <Clock3Icon className="h-3 w-3" aria-hidden="true" /> : <CheckIcon className="h-3 w-3" aria-hidden="true" />}
            {product.inStock === false ? "Yakında" : "Üretime hazır"}
          </span>
        </div>

        <h3 className={`mt-2 line-clamp-2 font-heading font-bold leading-[1.02] text-white transition-colors group-hover:text-sand ${featured ? "text-3xl sm:text-4xl" : "text-xl"}`}>
          {product.name}
        </h3>
        <p className={`mt-3 line-clamp-2 leading-relaxed text-white/65 ${featured ? "max-w-xl text-sm sm:text-[15px]" : "text-xs"}`}>
          {product.features[0]}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/8 pt-4">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <span className={`spec-value font-semibold text-white ${featured ? "text-2xl" : "text-lg"}`}>{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="spec-value text-xs text-white/48 line-through">{formatPrice(product.oldPrice)}</span>}
            </div>
            <p className="mt-1 text-[10px] text-white/52">KDV dahil fiyat</p>
          </div>
          {showSwatches ? (
            <div className="flex items-center -space-x-1.5" aria-label="Mevcut renk seçenekleri">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color.name}
                  title={color.name}
                  className="h-5 w-5 rounded-full border-2 border-surface shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          ) : (
            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/58 transition-colors group-hover:text-white">Detayları gör</span>
          )}
        </div>
      </div>
    </Link>
  );
}
