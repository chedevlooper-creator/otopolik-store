import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery, {
  ProductVariantGalleryProvider,
} from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import {
  CATEGORY_LABELS,
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import { getStoreSettings } from "@/lib/site-settings";
import { getShippingCost } from "@/lib/shipping";
import { CheckIcon, PlusIcon, ScissorsIcon, TruckIcon, Undo2Icon, CalendarIcon, ShieldCheckIcon, DropletIcon, WrenchIcon, SnowflakeIcon, SparklesIcon, RulerIcon, LockIcon, RecycleIcon, WindIcon, ChevronRightIcon, type LucideIcon } from "lucide-react";
import TrustStrip from "@/components/TrustStrip";

const FEATURE_ICON_RULES: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["su", "çamur", "kire", "su geçirmez"], icon: DropletIcon },
  { keywords: ["kesim", "kalıp", "milimetrik", "ölçü", "boyut"], icon: ScissorsIcon },
  { keywords: ["4 mevsim", "kış", "yaz", "sıcak", "soğuk", "kar"], icon: SnowflakeIcon },
  { keywords: ["koku", "temiz", "hijyen", "anti-bakteriyel"], icon: SparklesIcon },
  { keywords: ["kaymaz", "tutunma", "tutucu", "anti-slip"], icon: LockIcon },
  { keywords: ["esnek", "dayanıklı", "sağlam"], icon: ShieldCheckIcon },
  { keywords: ["çevre", "geri dönüş", "recyclable"], icon: RecycleIcon },
  { keywords: ["hava", "ventilasyon", "nefes"], icon: WindIcon },
  { keywords: ["araç", "model", "uyum"], icon: RulerIcon },
  { keywords: ["montaj", "tak", "kolay"], icon: WrenchIcon },
];

function pickFeatureIcon(feature: string): LucideIcon {
  const lower = feature.toLocaleLowerCase("tr-TR");
  for (const rule of FEATURE_ICON_RULES) {
    if (rule.keywords.some((kw) => lower.includes(kw))) return rule.icon;
  }
  return CheckIcon;
}
import {
  productSchema,
  breadcrumbListSchema,
  renderJsonLd,
} from "@/lib/structured-data";

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const images = product.gallery.slice(0, 6).map((img) => ({
    url: img,
    width: 1200,
    height: 1200,
  }));
  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `${siteConfig.url}/urunler/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | OTO POLİK`,
      description: product.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | OTO POLİK`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug, 4);
  const settings = await getStoreSettings();
  const displayGallery = product.gallery.slice(0, 12);
  const shippingCost = getShippingCost(product.price, settings);
  const compatibilityLink = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Merhaba, ${product.name} için araç uyumluluğunu teyit etmek istiyorum. Araç yıl/kasa bilgim: `
  )}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:py-14">
      <nav aria-label="Konum" className="spec-value mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted">
        <Link href="/" className="hover:text-white">Ana Sayfa</Link>
        <ChevronRightIcon className="h-3 w-3 text-white-dim" aria-hidden="true" />
        <Link href="/urunler" className="hover:text-white">Ürünler</Link>
        <ChevronRightIcon className="h-3 w-3 text-white-dim" aria-hidden="true" />
        <Link
          href={`/urunler?kategori=${encodeURIComponent(product.category)}`}
          className="hover:text-white"
        >
          {CATEGORY_LABELS[product.category]}
        </Link>
        <ChevronRightIcon className="h-3 w-3 text-white-dim" aria-hidden="true" />
        <span className="text-foreground">{product.brand} {product.model}</span>
      </nav>

      <ProductVariantGalleryProvider
        key={product.slug}
        initialImage={product.colors[0]?.image || product.image}
      >
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={displayGallery} alt={product.name} badge={product.badge} />
        </div>

        <div className="min-w-0">
          <span className="section-kicker">{CATEGORY_LABELS[product.category]}</span>
          <h1 className="mt-4 font-heading text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="spec-value text-3xl font-semibold text-white">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="spec-value text-lg text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <ul className="mt-5 grid grid-cols-3 gap-px border border-border bg-border">
            {[
              { icon: ScissorsIcon, label: "Araca özel kesim" },
              { icon: TruckIcon, label: `${product.dispatchEstimate} içinde kargoda` },
              { icon: Undo2Icon, label: "Ürüne göre iade koşulu" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-1.5 bg-surface px-2 py-3 text-center">
                <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                <span className="spec-value text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/85">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          {/* Görünür bilgi kartları: uyumluluk + kargo */}
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-white" aria-hidden="true" />
                <span className="spec-value text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Araç Uyumluluğu
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {product.compatibility.yearRange}
              </p>
              <p className="mt-0.5 text-xs text-muted">{product.compatibility.bodyOrChassis}</p>
              <a
                href={compatibilityLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[11px] font-bold text-white hover:underline"
              >
                WhatsApp&apos;tan teyit et →
              </a>
            </div>
            <div className="border border-border bg-surface p-4">
              <div className="flex items-center gap-2">
                <TruckIcon className="h-4 w-4 text-white" aria-hidden="true" />
                <span className="spec-value text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                  Kargo
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {shippingCost === 0 ? "Ücretsiz kargo" : `${formatPrice(shippingCost)}`}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Kargoya teslim: {product.dispatchEstimate}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {settings.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz
              </p>
            </div>
          </div>

          {/* Güven rozeti — WhatsApp MVP */}
          <div className="mt-4 flex items-center gap-2 border border-dashed border-border bg-surface/50 px-3 py-2">
            <ShieldCheckIcon className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span className="text-xs text-foreground/80">
              WhatsApp sipariş onayı · Kapıda ödeme seçeneği · Kişisel veriler yalnızca sipariş için
            </span>
          </div>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          <p className="mt-8 leading-relaxed text-muted">{product.description}</p>


          <div className="mt-8 border-t border-border">
            <details className="group border-b border-dashed border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Özellikler
                <PlusIcon className="h-4 w-4 text-white transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="pb-5">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Ürün özellikleri">
                  {product.features.map((feature) => {
                    const Icon = pickFeatureIcon(feature);
                    return (
                      <li
                        key={feature}
                        className="flex items-start gap-3 border border-border bg-surface/50 p-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border bg-background text-white">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="text-sm leading-relaxed text-foreground/85">{feature}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </details>
            <details className="group border-b border-dashed border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Araç uyumluluğu
                <PlusIcon className="h-4 w-4 text-white transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="pb-5">
                <p className="text-sm text-muted">{product.compatibility.yearRange}</p>
                <p className="mt-1 text-sm text-muted">{product.compatibility.bodyOrChassis}</p>
                <a href={compatibilityLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-white hover:underline">
                  Uyumluluğu WhatsApp&apos;tan teyit et
                </a>
              </div>
            </details>
            <details className="group border-b border-dashed border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Kargo ve teslimat
                <PlusIcon className="h-4 w-4 text-white transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="pb-5">
                <p className="text-sm text-muted">Kargoya teslim: {product.dispatchEstimate}</p>
                <p className="mt-1 text-sm text-muted">{shippingCost === 0 ? "Bu ürün için ücretsiz kargo." : `Kargo: ${formatPrice(shippingCost)}; ${settings.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz.`}</p>
              </div>
            </details>
            <details className="group border-b border-dashed border-border" open>
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Bu sette neler var?
                <PlusIcon className="h-4 w-4 text-white transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="pb-5">
                <ul className="space-y-1.5 text-sm text-muted">
                  {product.setContents.map((item) => <li key={item}>• {item}</li>)}
                </ul>
                {product.optionalExtras.length > 0 && (
                  <p className="spec-value mt-3 text-xs text-muted">Opsiyonlar: {product.optionalExtras.join(" · ")}</p>
                )}
              </div>
            </details>
          </div>
        </div>
      </div>
      </ProductVariantGalleryProvider>

      {related.length > 0 && (
        <section className="mt-16">
          <span className="section-kicker">Benzer ürünler</span>
          <h2 className="mb-6 mt-3 font-heading text-3xl font-bold text-white">
            Bunlar da ilginizi çekebilir
          </h2>
          <div className={`grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 ${
            related.length === 1
              ? "max-w-md lg:grid-cols-1"
              : related.length === 2
                ? "max-w-3xl lg:grid-cols-2"
                : related.length === 3
                  ? "lg:grid-cols-3"
                  : "lg:grid-cols-4"
          }`}>
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}

      <TrustStrip />

      {renderJsonLd(
        productSchema(product),
        breadcrumbListSchema(product.name)
      )}
    </div>
  );
}
