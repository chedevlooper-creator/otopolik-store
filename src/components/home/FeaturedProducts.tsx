import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { getFeaturedProducts } from "@/lib/products";

export default function FeaturedProducts() {
  const products = getFeaturedProducts(4);

  return (
    <section className="bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-16">
        <ScrollReveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                Öne Çıkan Ürünler
              </span>
              <h2 className="font-heading mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
                En Çok Tercih Edilen Setler
              </h2>
            </div>
            <Link href="/urunler" className="text-sm font-bold text-brand-red hover:underline">
              Tüm Ürünleri Gör →
            </Link>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <ScrollReveal key={product.slug} delay={i * 80}>
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
