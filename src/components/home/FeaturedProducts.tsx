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
    <section className="home-section relative overflow-hidden border-t border-white/[0.04]">
      <div className="relative mx-auto max-w-7xl px-4">
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-5 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="section-kicker">{content?.eyebrow ?? "Öne çıkan ürünler"}</span>
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
              className="btn-press inline-flex min-h-12 w-fit items-center gap-2 border border-white/15 px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:border-sand hover:text-sand"
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
