import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { shimmer } from "@/lib/image-placeholders";
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
  const isPlaceholderImage = product.image.endsWith("gorsel-yakinda.svg");
  const shouldContainImage =
    isPlaceholderImage || ["eva-3d", "bagaj-havuzu", "bagaj-cantasi"].includes(product.category);
  // Beyaz fonlu stüdyo çekimleri (JPG) koyu kartta sırıtmasın diye çerçeveli panel içinde gösterilir
  const hasLightImage = product.category === "bagaj-cantasi";
  const showSwatches = ["eva-3d", "eva-havuzlu", "bagaj-havuzu"].includes(product.category);

  return (
    <Link
      href={`/urunler/${product.slug}`}
      data-whatsapp-obstacle
      className={`group premium-card gradient-border card-lift flex h-full min-w-0 flex-col overflow-hidden rounded-2xl ${
        featured ? "min-h-[520px]" : "min-h-[360px]"
      }`}
    >
      <div className={`premium-grid relative overflow-hidden border-b border-transparent bg-transparent ${featured ? "min-h-[330px] flex-1" : "aspect-[5/4]"}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,.05),transparent_55%)] opacity-80" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/[0.03] blur-[60px] transition-opacity duration-600 group-hover:opacity-100" aria-hidden="true" />
        {/* Cam vitrin — ürün cam bir pencerenin arkasında sergilenir */}
        <div className={`glass-vitrine absolute overflow-hidden rounded-2xl ${featured ? "inset-6 sm:inset-9" : "inset-4"}`}>
          {hasLightImage ? (
            <div className="absolute inset-3 overflow-hidden rounded-xl bg-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.1)] sm:inset-4">
              <SafeImage
                src={product.image}
                alt={product.name}
                fill
                sizes={featured ? "(min-width: 1024px) 44vw, 100vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"}
                placeholder="blur"
                blurDataURL={shimmer(300, 300)}
                className="object-contain p-3 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Yumuşak stüdyo vinyeti */}
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_38%,transparent_52%,rgba(12,14,22,.12))]" />
            </div>
          ) : (
            <>
              <SafeImage
                src={product.image}
                alt={product.name}
                fill
                sizes={featured ? "(min-width: 1024px) 44vw, 100vw" : "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"}
                placeholder="blur"
                blurDataURL={shimmer(300, 300)}
                className={`transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                  shouldContainImage ? `object-contain ${featured ? "p-6 sm:p-10" : "p-4"}` : "object-cover"
                }`}
              />
              {/* Açık stüdyo fonlu ürün fotoğrafları koyu kartta "kutu" gibi durmasın diye kenar vinyeti ile temaya harmanlanır */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.55))]"
              />
            </>
          )}
        </div>

        <div className="absolute inset-x-3 top-3 z-10 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
          <div className="flex flex-wrap gap-2">
            {product.badge && (
              <span className="spec-value rounded-full border border-white/8 bg-black/50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md">
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="spec-value rounded-full bg-brand-red px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-[0_0_12px_rgba(237,27,36,0.5)]">
                %{discount} avantaj
              </span>
            )}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/8 bg-black/40 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-background group-hover:shadow-lg">
            <ArrowUpRightIcon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className={`flex min-w-0 flex-col ${featured ? "p-6 sm:p-7" : "p-5 sm:p-6"}`}>
        <div className="flex items-center justify-between gap-3">
          <span className="spec-value text-[11px] font-bold uppercase tracking-[0.12em] text-white/60">
            {CATEGORY_LABELS[product.category]}
          </span>
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.08em] ${product.inStock === false ? "text-brand-red" : "text-white/80"}`}>
            {product.inStock === false ? <Clock3Icon className="h-3 w-3" aria-hidden="true" /> : <CheckIcon className="h-3 w-3 text-white" aria-hidden="true" />}
            {product.inStock === false ? "Yakında" : "Üretime hazır"}
          </span>
        </div>

        <h3 className={`mt-3 line-clamp-2 font-heading font-bold leading-[1.05] text-white transition-all duration-300 group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] ${featured ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`}>
          {product.name}
        </h3>
        <p className={`mt-3 line-clamp-2 leading-relaxed text-white/50 ${featured ? "max-w-xl text-sm" : "text-xs"}`}>
          {product.features[0]}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/[0.05] pt-5">
          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className={`spec-value font-mono font-bold text-white ${featured ? "text-3xl" : "text-xl"}`}>{formatPrice(product.price)}</span>
              {product.oldPrice && <span className="spec-value font-mono text-xs text-white/35 line-through">{formatPrice(product.oldPrice)}</span>}
            </div>
            <p className="mt-1 text-xs text-white/65">KDV dahil fiyat</p>
          </div>
          {showSwatches ? (
            <div className="flex items-center gap-2" aria-label={`${product.colors.length} renk seçeneği`}>
              <div className="flex items-center -space-x-1.5">
                {product.colors.slice(0, 3).map((color) => (
                  <span
                    key={color.name}
                    title={color.name}
                    className="h-5 w-5 rounded-full border-2 border-surface shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65">
                {product.colors.length} renk
              </span>
            </div>
          ) : (
            <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-white/65 transition-colors group-hover:text-white">Detayları gör</span>
          )}
        </div>
      </div>
    </Link>
  );
}
