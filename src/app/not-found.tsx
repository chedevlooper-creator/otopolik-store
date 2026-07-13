import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedProducts } from "@/lib/products";
import { ArrowRightIcon, HomeIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız OTO POLİK sayfası bulunamadı.",
};

export default function NotFound() {
  const featured = getFeaturedProducts(4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-heading text-[12rem] font-extrabold leading-none text-sand/15" aria-hidden="true">
          404
        </p>
        <h1 className="-mt-8 font-heading text-4xl font-bold text-white sm:text-5xl">
          Sayfa Bulunamadı
        </h1>
        <p className="mt-3 text-muted">
          Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir.
          <br />
          Ana sayfaya dönüp ürünlerimize göz atabilirsiniz.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="btn-press inline-flex items-center gap-2 bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
          >
            <HomeIcon className="h-4 w-4" aria-hidden="true" />
            Ana Sayfaya Dön
          </Link>
          <Link
            href="/urunler"
            className="btn-press inline-flex items-center gap-2 border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
          >
            Ürünleri İncele
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {featured.length > 0 && (
        <section className="mt-20">
          <div className="text-center">
            <span className="spec-label">Popüler ürünler</span>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
