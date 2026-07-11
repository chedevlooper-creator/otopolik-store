import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { brands, products } from "@/lib/products";
import { Product } from "@/lib/types";
import { buildWhatsAppOrderLink } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Tüm Ürünler",
  description: "Araca özel üretim EVA oto paspası setlerini keşfedin.",
};

const CATEGORIES: { key: Product["category"]; label: string }[] = [
  { key: "eva-3d", label: "3D EVA Paspas" },
  { key: "eva-havuzlu", label: "Havuzlu EVA Paspas" },
  { key: "bagaj", label: "Bagaj Paspası" },
];

const SORTS = [
  { key: "onerilen", label: "Önerilen" },
  { key: "fiyat-artan", label: "Fiyat (Artan)" },
  { key: "fiyat-azalan", label: "Fiyat (Azalan)" },
];

type Params = {
  marka?: string;
  kategori?: string;
  q?: string;
  sirala?: string;
  yil?: string;
};

function buildQuery(params: Params, overrides: Partial<Params>) {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(merged)) {
    if (value) search.set(key, value);
  }
  const qs = search.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const { marka, kategori, q, sirala, yil } = params;

  let filtered = products;
  if (marka) filtered = filtered.filter((p) => p.brand === marka);
  if (kategori) filtered = filtered.filter((p) => p.category === kategori);
  if (q) {
    const needle = q.toLocaleLowerCase("tr-TR");
    filtered = filtered.filter((p) =>
      `${p.brand} ${p.model} ${p.name} ${p.compatibility.yearRange} ${p.compatibility.bodyOrChassis}`.toLocaleLowerCase("tr-TR").includes(needle)
    );
  }
  if (yil) {
    const needle = yil.toLocaleLowerCase("tr-TR");
    filtered = filtered.filter((p) =>
      `${p.compatibility.yearRange} ${p.compatibility.bodyOrChassis}`.toLocaleLowerCase("tr-TR").includes(needle)
    );
  }

  filtered = [...filtered];
  if (sirala === "fiyat-artan") filtered.sort((a, b) => a.price - b.price);
  else if (sirala === "fiyat-azalan") filtered.sort((a, b) => b.price - a.price);

  const activeFilterCount = [marka, kategori, q, yil].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-red">Katalog</span>
        <h1 className="font-heading mt-2 text-3xl font-extrabold text-neutral-900 sm:text-4xl">
          Araca Özel EVA Paspas Setleri
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Modelinizi bulun, size uygun EVA paspas setini inceleyin. Listede
          aracınızı göremiyorsanız WhatsApp üzerinden bize ulaşın, size özel
          üretim yapalım.
        </p>
      </div>

      {/* Arama + sıralama */}
      <form method="GET" action="/urunler" className="mb-6 flex flex-col gap-3 sm:flex-row">
        {marka && <input type="hidden" name="marka" value={marka} />}
        {kategori && <input type="hidden" name="kategori" value={kategori} />}
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
          <input
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Marka veya model arayın (örn. Golf, Egea)..."
            className="w-full rounded-full border border-neutral-300 py-3 pl-11 pr-4 text-sm focus:border-brand-red focus:outline-none"
          />
        </div>
        <input
          type="text"
          name="yil"
          defaultValue={yil ?? ""}
          placeholder="Model yılı / kasa"
          className="rounded-full border border-neutral-300 px-5 py-3 text-sm focus:border-brand-red focus:outline-none"
        />
        <select
          name="sirala"
          defaultValue={sirala ?? "onerilen"}
          className="rounded-full border border-neutral-300 bg-white px-5 py-3 text-sm font-medium focus:border-brand-red focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-full bg-brand-black px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-brand-red"
        >
          Ara
        </button>
      </form>

      {/* Kategori filtreleri */}
      <div className="mb-3 flex flex-wrap gap-2">
        <Link
          href={buildQuery(params, { kategori: undefined })}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
            !kategori
              ? "border-brand-black bg-brand-black text-white"
              : "border-neutral-300 text-neutral-700 hover:border-brand-black"
          }`}
        >
          Tüm Kategoriler
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            href={buildQuery(params, { kategori: cat.key })}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              kategori === cat.key
                ? "border-brand-black bg-brand-black text-white"
                : "border-neutral-300 text-neutral-700 hover:border-brand-black"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Marka filtreleri */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href={buildQuery(params, { marka: undefined })}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
            !marka
              ? "border-brand-red bg-brand-red text-white"
              : "border-neutral-300 text-neutral-700 hover:border-brand-red hover:text-brand-red"
          }`}
        >
          Tüm Markalar
        </Link>
        {brands.map((brand) => (
          <Link
            key={brand}
            href={buildQuery(params, { marka: brand })}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              marka === brand
                ? "border-brand-red bg-brand-red text-white"
                : "border-neutral-300 text-neutral-700 hover:border-brand-red hover:text-brand-red"
            }`}
          >
            {brand}
          </Link>
        ))}
      </div>

      <div className="mb-5 flex items-center justify-between text-sm text-neutral-500">
        <span>
          <strong className="text-neutral-900">{filtered.length}</strong> ürün bulundu
        </span>
        {activeFilterCount > 0 && (
          <Link href="/urunler" className="font-semibold text-brand-red hover:underline">
            Filtreleri Temizle ✕
          </Link>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center">
          <p className="text-4xl">🔍</p>
          <p className="font-heading mt-3 font-bold text-neutral-900">Sonuç bulunamadı</p>
          <p className="mt-1 text-sm text-neutral-600">
            Farklı bir arama deneyin veya aracınız için WhatsApp&apos;tan özel üretim isteyin.
          </p>
          <a
            href={buildWhatsAppOrderLink(`Merhaba, katalogda bulamadığım araç için paspas bilgisi almak istiyorum. Marka/model/yıl: ${[marka, q, yil].filter(Boolean).join(" / ")}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-brand-red px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
          >
            Aracım için bilgi al
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
