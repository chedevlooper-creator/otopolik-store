import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getFeaturedProducts } from "@/lib/catalog";
import { ArrowRightIcon } from "lucide-react";
import type { ContentSection } from "@/lib/cms-defaults";

type Props = {
  content?: ContentSection | null;
};

export default async function FeaturedProducts({ content }: Props) {
  const products = await getFeaturedProducts(3);

  return (
    <section className="home-section relative overflow-hidden">
      <div className="parallax-float pointer-events-none absolute right-[-14rem] top-10 h-[30rem] w-[30rem] rounded-full bg-brand-red/[0.045] blur-[130px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {content?.eyebrow !== undefined && content?.eyebrow !== null ? (
                content.eyebrow && content.eyebrow.toUpperCase() !== "EYEBROW" ? (
                  <span className="section-kicker">{content.eyebrow}</span>
                ) : null
              ) : (
                <span className="section-kicker">Öne çıkan ürünler</span>
              )}
              <h2 className="section-title mt-5 max-w-3xl">
                {content?.title ?? "Aracınıza yakışan koruma"}
              </h2>
              <p className="section-copy mt-4 max-w-2xl">
                {content?.body ??
                  "Araca özel paspas setinden bagaj düzenine kadar, aynı malzeme disipliniyle üretilen üç temel çözüm."}
              </p>
            </div>
            <Link
              href={content?.ctaHref ?? "/urunler"}
              className="btn-press btn-ghost-rich inline-flex min-h-12 w-fit items-center gap-2 rounded-full px-5 text-sm font-semibold text-white"
            >
              {content?.ctaLabel ?? "Tüm ürünleri gör"}
              <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid gap-5 min-[560px]:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ScrollReveal key={product.slug} delay={index * 70} className="h-full">
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
