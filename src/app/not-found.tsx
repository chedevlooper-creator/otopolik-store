import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-5xl">🧭</p>
      <h1 className="font-heading mt-4 text-3xl font-extrabold text-neutral-900">
        Sayfa Bulunamadı
      </h1>
      <p className="mt-2 text-neutral-600">
        Aradığınız sayfa kaldırılmış veya hiç var olmamış olabilir.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-black px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red"
        >
          Ana Sayfaya Dön
        </Link>
        <Link
          href="/urunler"
          className="rounded-full border border-neutral-300 px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-neutral-700 hover:border-brand-red hover:text-brand-red"
        >
          Ürünleri İncele
        </Link>
      </div>
    </div>
  );
}
