import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import { ArrowRightIcon } from "lucide-react";

export default function FeaturedProducts() {
  const products = getFeaturedProducts(4);

  return (
    <section className="border-t border-neutral-800 bg-[#141414]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Öne Çıkanlar
            </span>
            <h2 className="mt-2 font-heading text-2xl font-extrabold text-white sm:text-3xl">
              En Çok Tercih Edilen Setler
            </h2>
          </div>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-1 text-sm font-semibold text-neutral-400 transition-colors hover:text-brand-red"
          >
            Tüm Ürünler
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
