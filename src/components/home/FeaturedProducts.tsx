import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import { ArrowRightIcon } from "lucide-react";

export default function FeaturedProducts() {
  const products = getFeaturedProducts(4);

  return (
    <section className="border-y border-border bg-surface/35">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:py-18">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-7 bg-brand-red" aria-hidden="true" />
              <span className="spec-value text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red">
                Çok Satan
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold uppercase text-white sm:text-5xl">
              En çok tercih edilenler
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
              Müşterilerimizin en çok tercih ettiği, her marka ve modele özel kalıplanan EVA paspas setleri.
            </p>
          </div>
          <Link
            href="/urunler"
            className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted transition-colors hover:text-sand"
          >
            Tüm Ürünler
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
