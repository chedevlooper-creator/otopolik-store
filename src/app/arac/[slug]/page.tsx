// =============================================================
// OTO POLİK — Araç SEO Landing Sayfası
// =============================================================
// /arac/[brand]-[model] rotasıyla her araç modeli için
// benzersiz, SEO-optimized bir landing sayfası üretir.
// =============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  generateVehicleContent,
  getAllVehicleSlugs,
  resolveVehicleSlug,
  type PriceTier,
} from "@/lib/vehicle-seo";
import { siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import { getStoreSettings } from "@/lib/site-settings";
import { getShippingCost } from "@/lib/shipping";
import { getProducts } from "@/lib/catalog";
import { Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";
import TrustStrip from "@/components/TrustStrip";
import {
  ArrowRightIcon,
  CheckIcon,
  ChevronRightIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  TruckIcon,
  SnowflakeIcon,
  DropletIcon,
  ScissorsIcon,
  PlusIcon,
  SparklesIcon,
  RecycleIcon,
  WrenchIcon,
  StarIcon,
  ShoppingCartIcon,
  type LucideIcon,
} from "lucide-react";
import {
  breadcrumbListSchema,
  faqPageSchema,
  renderJsonLd,
} from "@/lib/structured-data";

// ── Static params ──
export async function generateStaticParams() {
  return getAllVehicleSlugs();
}

// ── SEO Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveVehicleSlug(slug);
  if (!resolved) return {};

  const content = generateVehicleContent(resolved.brand, resolved.model);
  const canonicalSlug = resolved.canonicalSlug;
  return {
    title: content.metaTitle,
    description: content.metaDescription,
    alternates: {
      canonical: `${siteConfig.url}/arac/${canonicalSlug}`,
    },
    openGraph: {
      title: content.metaTitle,
      description: content.metaDescription,
      type: "website",
      locale: "tr_TR",
    },
  };
}

// ── Feature icon mapping ──
const FEATURE_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ["cnc", "kesim", "kalıp", "milimetrik"], icon: ScissorsIcon },
  { keywords: ["su", "çamur", "kire"], icon: DropletIcon },
  { keywords: ["kaymaz", "tutunma"], icon: ShieldCheckIcon },
  { keywords: ["4 mevsim", "kış", "yaz"], icon: SnowflakeIcon },
  { keywords: ["koku", "temiz"], icon: SparklesIcon },
  { keywords: ["çevre", "geri dönüş"], icon: RecycleIcon },
  { keywords: ["montaj", "tak", "kolay"], icon: WrenchIcon },
];

function getFeatureIcon(feature: string): LucideIcon {
  const lower = feature.toLocaleLowerCase("tr-TR");
  for (const rule of FEATURE_ICONS) {
    if (rule.keywords.some((kw) => lower.includes(kw))) return rule.icon;
  }
  return CheckIcon;
}

// ── Page component ──
export default async function VehicleLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resolved = resolveVehicleSlug(slug);
  if (!resolved) notFound();
  if (resolved.canonicalSlug !== slug) {
    redirect(`/arac/${resolved.canonicalSlug}`);
  }

  const vehicle = { brand: resolved.brand, model: resolved.model };
  const content = generateVehicleContent(vehicle.brand, vehicle.model);
  const settings = await getStoreSettings();
  const products = await getProducts();
  const shippingCost = getShippingCost(content.price, settings);

  // Find relevant products (EVA paspas sets are most relevant)
  const relevantProducts = products
    .filter((p: Product) => p.category === "eva-3d")
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      {/* Breadcrumb */}
      <nav
        aria-label="Konum"
        className="spec-value mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.14em] text-muted"
      >
        <Link href="/" className="hover:text-white">
          Ana Sayfa
        </Link>
        <ChevronRightIcon className="h-3 w-3 text-white-dim" aria-hidden="true" />
        <Link href="/urunler" className="hover:text-white">
          Ürünler
        </Link>
        <ChevronRightIcon className="h-3 w-3 text-white-dim" aria-hidden="true" />
        <span className="text-foreground">
          {vehicle.brand} {vehicle.model}
        </span>
      </nav>

      {/* Hero Section */}
      <section className="premium-grid relative overflow-hidden rounded-[2rem] border border-white/8 bg-surface/55 p-8 sm:p-12 lg:p-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(227,25,55,0.08),transparent_50%)]" />
        <div className="relative">
          <span className="spec-label">Araca özel üretim</span>
          <h1 className="mt-4 font-heading text-4xl font-bold leading-[0.94] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
            <span className="block">{vehicle.brand}</span>
            <span className="block mt-1 text-white">{vehicle.model}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            {content.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="spec-value text-3xl font-semibold text-white">
                {formatPrice(content.price)}
              </span>
              <span className="text-sm text-muted">başlangıç</span>
            </div>
            <div className="h-6 w-px bg-border" aria-hidden="true" />
            <div className="flex items-center gap-2 text-sm text-muted">
              <TruckIcon className="h-4 w-4 text-white" aria-hidden="true" />
              {shippingCost === 0
                ? "Ücretsiz kargo"
                : `Kargo: ${formatPrice(shippingCost)}`}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/olusturucu?marka=${encodeURIComponent(vehicle.brand)}&model=${encodeURIComponent(vehicle.model)}`}
              className="btn-press btn-red-rich inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-8 text-sm font-bold uppercase tracking-[0.1em] text-white"
            >
              Hemen Tasarla
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(content.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-8 text-sm font-bold text-[#7bf0a7] hover:border-[#25D366]/55 hover:bg-[#25D366]/16"
            >
              <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
              WhatsApp ile Bilgi Al
            </a>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-16">
        <span className="spec-label">Neden OTO POLİK?</span>
        <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
          {vehicle.brand} {vehicle.model} için özel avantajlar
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((feature, index) => {
            const Icon = getFeatureIcon(feature);
            return (
              <div
                key={index}
                className="premium-card flex items-start gap-4 rounded-2xl p-5 transition-all duration-300 hover:border-white/16 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <p className="text-sm leading-relaxed text-foreground/85">
                  {feature}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Fiyat Tablosu */}
      <section className="mt-16">
        <span className="spec-label">Paket seçenekleri</span>
        <h2 className="mt-4 font-heading text-3xl font-bold text-white sm:text-4xl">
          {vehicle.brand} {vehicle.model} Paspas Fiyatları
        </h2>
        <p className="mt-2 max-w-2xl text-muted">
          {vehicle.brand} {vehicle.model} modeliniz için 4 farklı paket seçeneği sunuyoruz.
          Tüm paketler CNC kesim, araca özel üretimdir.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.priceTiers.map((tier: PriceTier) => (
            <div
              key={tier.label}
              className={`relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 ${
                tier.isPopular
                  ? "border-white/40 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_20px_60px_rgba(255,255,255,0.08)]"
                  : "border-border bg-surface/50 hover:border-white/16 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)]"
              }`}
            >
              {tier.isPopular && (
                <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-background">
                  <StarIcon className="h-3 w-3" aria-hidden="true" />
                  En çok tercih edilen
                </span>
              )}
              <h3 className="font-heading text-lg font-bold text-white">
                {tier.label}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {tier.description}
              </p>
              <p className="mt-4">
                <span className="spec-value text-2xl font-semibold text-white">
                  {formatPrice(tier.price)}
                </span>
              </p>
              <a
                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(content.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold uppercase tracking-[0.08em] transition-all ${
                  tier.isPopular
                    ? "btn-red-rich text-white"
                    : "border border-white/12 bg-white/[0.04] text-white hover:border-white/30 hover:bg-white/[0.08]"
                }`}
              >
                <ShoppingCartIcon className="h-3.5 w-3.5" aria-hidden="true" />
                Sipariş Ver
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="mt-16">
        <div className="premium-card rounded-2xl p-8 sm:p-10">
          <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
            {vehicle.brand} {vehicle.model} Paspas Hakkında
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            {content.description}
          </p>
        </div>
      </section>

      {/* Related Products */}
      {relevantProducts.length > 0 && (
        <section className="mt-16">
          <span className="spec-label">İlgili ürünler</span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-white">
            {vehicle.brand} {vehicle.model} için önerilen paspas setleri
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {relevantProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mt-16">
        <span className="spec-label">Sıkça sorulan sorular</span>
        <h2 className="mt-4 font-heading text-3xl font-bold text-white">
          {vehicle.brand} {vehicle.model} Paspas Hakkında Sorular
        </h2>
        <div className="mt-8 space-y-4">
          {content.faqItems.map((faq, index) => (
            <details
              key={index}
              className="group rounded-2xl border border-border bg-surface/50"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-heading text-lg font-bold text-white [&::-webkit-details-marker]:hidden">
                {faq.q}
                <PlusIcon className="h-5 w-5 shrink-0 text-white transition-transform duration-200 group-open:rotate-45" />
              </summary>
              <div className="px-6 pb-6">
                <p className="leading-relaxed text-muted">{faq.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mt-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-red via-[#c5112d] to-[#790b1c] p-8 sm:p-12">
        <div className="relative flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            {vehicle.brand} {vehicle.model} için hemen başlayın
          </h2>
          <p className="mt-4 max-w-xl text-white/80">
            Aracınıza özel paspas setinizi tasarlayın, 1-3 iş günü içinde
            kargoya verelim.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/olusturucu?marka=${encodeURIComponent(vehicle.brand)}&model=${encodeURIComponent(vehicle.model)}`}
              className="btn-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-white px-8 text-sm font-bold text-background shadow-xl shadow-black/20 hover:bg-white"
            >
              Tasarlamaya Başla
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(content.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press inline-flex min-h-13 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-sm hover:border-white/40 hover:bg-white/20"
            >
              <MessageCircleIcon className="h-4 w-4" aria-hidden="true" />
              WhatsApp ile Ulaşın
            </a>
          </div>
        </div>
      </section>

      <div className="mt-16">
        <TrustStrip />
      </div>

      {/* Structured Data */}
      {renderJsonLd(
        breadcrumbListSchema(`${vehicle.brand} ${vehicle.model} Paspas`),
        faqPageSchema(content.faqItems)
      )}
    </div>
  );
}
