import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import {
  CATEGORY_LABELS,
  getBrands,
  getProducts,
} from "@/lib/catalog";
import { Product } from "@/lib/types";
import { getStoreSettings } from "@/lib/site-settings";
import { getContentPage } from "@/lib/cms";
import { SearchIcon, XIcon } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContentPage("urunler");
  return {
    title: page?.metaTitle ?? "Tüm Ürünler",
    description: page?.metaDescription,
  };
}

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

const FILTER_PILL =
  "border px-3.5 py-2 text-[11px] font-bold uppercase tracking-[0.1em] transition-colors";
const FIELD =
  "border border-white/10 bg-surface text-sm text-white placeholder:text-muted focus:border-sand focus:outline-none";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const params = await searchParams;
  const { marka, kategori, q, sirala, yil } = params;
  const products = await getProducts();
  const brands = await getBrands();
  const settings = await getStoreSettings();
  const { page, sections } = await getContentPage("urunler");
  const kicker = sections.find((s) => s.sectionKey === "kicker");

  const CATEGORIES: { key: Product["category"]; label: string }[] = (
    Object.keys(CATEGORY_LABELS) as Product["category"][]
  )
    .filter((key) => products.some((product) => product.category === key))
    .map((key) => ({ key, label: CATEGORY_LABELS[key] }));

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
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Merhaba, katalogda bulamadığım araç için paspas bilgisi almak istiyorum. Marka/model/yıl: ${[marka, q, yil].filter(Boolean).join(" / ")}`)}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <div className="mb-10 max-w-3xl border border-white/10 bg-[#0a0c12] p-6 sm:p-9">
        <span className="section-kicker">{kicker?.title ?? "Katalog"}</span>
        <h1 className="mt-5 max-w-full break-words font-heading text-3xl font-bold tracking-[-0.03em] text-white sm:text-5xl">
          {page?.title ?? "Araca özel EVA paspas setleri"}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/55">
          {page?.description ??
            "Modelinizi bulun, size uygun EVA paspas setini inceleyin. Listede aracınızı göremiyorsanız WhatsApp üzerinden bize ulaşın, size özel üretim yapalım."}
        </p>
      </div>

      <input
        type="checkbox"
        id="filtre-toggle"
        defaultChecked={activeFilterCount > 0}
        className="peer sr-only"
      />
      <label
        htmlFor="filtre-toggle"
        className="btn-press mb-4 flex cursor-pointer items-center justify-between rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm font-semibold text-white sm:hidden"
      >
        <span>
          Filtrele{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
        </span>
        <span className="text-muted transition-transform peer-checked:rotate-180" aria-hidden="true">▾</span>
      </label>

      <div className="mb-8 hidden peer-checked:block sm:block">
        <form method="GET" action="/urunler" className="mb-6 flex flex-col gap-3 sm:flex-row">
          {marka && <input type="hidden" name="marka" value={marka} />}
          {kategori && <input type="hidden" name="kategori" value={kategori} />}
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Marka veya model arayın (örn. Golf, Egea)..."
              className={`${FIELD} w-full py-3 pl-11 pr-4`}
            />
          </div>
          <input
            type="text"
            name="yil"
            defaultValue={yil ?? ""}
            placeholder="Model yılı / kasa"
            className={`${FIELD} px-5 py-3`}
          />
          <select
            name="sirala"
            defaultValue={sirala ?? "onerilen"}
            className={`${FIELD} px-5 py-3 font-medium`}
          >
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="btn-press btn-sand-rich px-7 py-3 text-sm font-bold uppercase tracking-wider text-background"
          >
            Ara
          </button>
        </form>

        <div className="mb-3 flex flex-wrap gap-2">
          <Link
            href={buildQuery(params, { kategori: undefined })}
            className={`${FILTER_PILL} ${!kategori
                ? "border-sand bg-sand text-background"
                : "border-white/12 text-white/55 hover:border-sand hover:text-sand"
            }`}
          >
            Tüm Kategoriler
          </Link>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={buildQuery(params, { kategori: cat.key })}
              className={`${FILTER_PILL} ${kategori === cat.key
                  ? "border-sand bg-sand text-background"
                  : "border-white/12 text-white/55 hover:border-sand hover:text-sand"
              }`}
            >
              {cat.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={buildQuery(params, { marka: undefined })}
            className={`${FILTER_PILL} ${!marka
                ? "border-sand bg-sand text-background"
                : "border-white/12 text-white/55 hover:border-sand hover:text-white"
            }`}
          >
            Tüm Markalar
          </Link>
          {brands.map((brand) => (
            <Link
              key={brand}
              href={buildQuery(params, { marka: brand })}
              className={`${FILTER_PILL} ${marka === brand
                  ? "border-sand bg-sand text-background"
                  : "border-white/12 text-white/55 hover:border-sand hover:text-white"
              }`}
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between text-sm text-muted">
        <span className="spec-value">
          <strong className="text-sand">{filtered.length}</strong> ürün bulundu
        </span>
        {activeFilterCount > 0 && (
          <Link href="/urunler" className="inline-flex items-center gap-1 font-semibold text-sand hover:underline">
            Filtreleri Temizle
            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-white/15 px-6 py-16 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center border border-white/12 bg-[#0a0c12]">
            <SearchIcon className="h-7 w-7 text-muted" aria-hidden="true" />
          </span>
          <p className="mt-4 font-heading text-xl font-bold text-white">Sonuç bulunamadı</p>
          <p className="mt-1 text-sm text-muted">
            Farklı bir arama deneyin veya aracınız için WhatsApp&apos;tan özel üretim isteyin.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-press btn-sand-rich mt-5 inline-flex px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-background"
          >
            Aracım için bilgi al
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
