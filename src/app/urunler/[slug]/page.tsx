import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { buildWhatsAppOrderLink, siteConfig } from "@/lib/site-config";
import { getShippingCost } from "@/lib/shipping";
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
    title: `${product.name} | OTO POLİK`,
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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <nav className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="hover:text-brand-red">Ana Sayfa</Link>
        <span className="mx-2">/</span>
        <Link href="/urunler" className="hover:text-brand-red">Ürünler</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-800">{product.brand} {product.model}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.gallery} alt={product.name} badge={product.badge} />

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-red">{product.brand}</span>
          <h1 className="font-heading mt-2 text-2xl font-extrabold text-neutral-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-heading text-3xl font-extrabold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>

          <p className="mt-5 leading-relaxed text-neutral-600">{product.description}</p>

          <ul className="mt-5 space-y-2">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-neutral-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-50 text-brand-red text-xs">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <section className="rounded-2xl bg-neutral-50 p-4">
              <h2 className="font-heading text-sm font-bold text-neutral-900">Araç uyumluluğu</h2>
              <p className="mt-2 text-sm text-neutral-600">{product.compatibility.yearRange}</p>
              <p className="mt-1 text-sm text-neutral-600">{product.compatibility.bodyOrChassis}</p>
              <a href={compatibilityLink} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-bold text-brand-red hover:underline">
                Uyumluluğu WhatsApp&apos;tan teyit et
              </a>
            </section>
            <section className="rounded-2xl bg-neutral-50 p-4">
              <h2 className="font-heading text-sm font-bold text-neutral-900">Kargo ve teslimat</h2>
              <p className="mt-2 text-sm text-neutral-600">Kargoya teslim: {product.dispatchEstimate}</p>
              <p className="mt-1 text-sm text-neutral-600">{shippingCost === 0 ? "Bu ürün için ücretsiz kargo." : `Kargo: ${formatPrice(shippingCost)}; ${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri ücretsiz.`}</p>
            </section>
          </div>

          <section className="mt-4 rounded-2xl border border-neutral-200 p-5">
            <h2 className="font-heading text-base font-bold text-neutral-900">Bu sette neler var?</h2>
            <ul className="mt-3 space-y-1.5 text-sm text-neutral-600">
              {product.setContents.map((item) => <li key={item}>• {item}</li>)}
            </ul>
            <p className="mt-3 text-xs text-neutral-500">Opsiyonlar: {product.optionalExtras.join(" · ")}</p>
          </section>

          <div className="mt-8 border-t border-neutral-200 pt-6">
            <AddToCartButton product={product} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-heading mb-6 text-2xl font-extrabold text-neutral-900">
            Benzer Ürünler
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
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
