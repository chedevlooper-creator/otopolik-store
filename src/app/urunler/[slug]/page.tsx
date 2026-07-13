import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { CATEGORY_LABELS, getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppOrderLink, siteConfig } from "@/lib/site-config";
import { getShippingCost } from "@/lib/shipping";
import { CheckIcon, PlusIcon, ScissorsIcon, TruckIcon, Undo2Icon } from "lucide-react";
import {
  productSchema,
  breadcrumbListSchema,
  renderJsonLd,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  const images = product.gallery.map((img) => ({
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
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const related = getRelatedProducts(slug, 4);
  const shippingCost = getShippingCost(product.price);
  const compatibilityLink = buildWhatsAppOrderLink(
    `Merhaba, ${product.name} için araç uyumluluğunu teyit etmek istiyorum. Araç yıl/kasa bilgim: `
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-10 sm:py-14">
      <nav className="spec-value mb-6 text-xs uppercase tracking-[0.14em] text-muted">
        <Link href="/" className="hover:text-sand">Ana Sayfa</Link>
        <span className="mx-2 text-sand-dim">/</span>
        <Link href="/urunler" className="hover:text-sand">Ürünler</Link>
        <span className="mx-2 text-sand-dim">/</span>
        <span className="text-foreground">{product.brand} {product.model}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <ProductGallery images={product.gallery} alt={product.name} badge={product.badge} />
        </div>

        <div className="min-w-0">
          <span className="spec-label">{CATEGORY_LABELS[product.category]}</span>
          <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="spec-value text-3xl font-semibold text-sand">
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
              { icon: Undo2Icon, label: "14 gün iade" },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex flex-col items-center gap-1.5 bg-surface px-2 py-3 text-center">
                <Icon className="h-4 w-4 text-sand" aria-hidden="true" />
                <span className="spec-value text-[10px] font-medium uppercase tracking-[0.12em] text-foreground/85">
                  {label}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <AddToCartButton product={product} />
          </div>

          <p className="mt-8 leading-relaxed text-muted">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-foreground/85">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-sand" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-border">
            <details className="group border-b border-dashed border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Araç uyumluluğu
                <PlusIcon className="h-4 w-4 text-sand transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="pb-5">
                <p className="text-sm text-muted">{product.compatibility.yearRange}</p>
                <p className="mt-1 text-sm text-muted">{product.compatibility.bodyOrChassis}</p>
                <a href={compatibilityLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-sand hover:underline">
                  Uyumluluğu WhatsApp&apos;tan teyit et
                </a>
              </div>
            </details>
            <details className="group border-b border-dashed border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Kargo ve teslimat
                <PlusIcon className="h-4 w-4 text-sand transition-transform group-open:rotate-45" aria-hidden="true" />
              </summary>
              <div className="pb-5">
                <p className="text-sm text-muted">Kargoya teslim: {product.dispatchEstimate}</p>
                <p className="mt-1 text-sm text-muted">{shippingCost === 0 ? "Bu ürün için ücretsiz kargo." : `Kargo: ${formatPrice(shippingCost)}; ${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz.`}</p>
              </div>
            </details>
            <details className="group border-b border-dashed border-border" open>
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-base font-bold uppercase text-white [&::-webkit-details-marker]:hidden">
                Bu sette neler var?
                <PlusIcon className="h-4 w-4 text-sand transition-transform group-open:rotate-45" aria-hidden="true" />
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

      {related.length > 0 && (
        <section className="mt-16">
          <span className="spec-label">Benzer ürünler</span>
          <h2 className="mb-6 mt-3 font-heading text-3xl font-bold text-white">
            Bunlar da ilginizi çekebilir
          </h2>
          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}

      {renderJsonLd(
        productSchema(product),
        breadcrumbListSchema(product.name)
      )}
    </div>
  );
}
