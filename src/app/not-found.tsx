import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sayfa Bulunamadı",
  description: "Aradığınız OTO POLİK sayfası bulunamadı.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="spec-value text-5xl font-semibold text-sand">404</p>
      <h1 className="mt-4 font-heading text-4xl font-bold text-white">
        Sayfa Bulunamadı
      </h1>
      <p className="mt-3 text-muted">
        Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="btn-press bg-brand-red px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/urunler"
          className="btn-press border border-border px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-foreground hover:border-sand hover:text-sand"
        >
          Ürünleri İncele
        </Link>
      </div>
    </div>
  );
}
