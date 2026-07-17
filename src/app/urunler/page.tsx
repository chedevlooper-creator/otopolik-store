import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { CATEGORY_LABELS, getProducts } from "@/lib/catalog";
import { getContentPage } from "@/lib/cms";
import { getStoreSettings } from "@/lib/site-settings";
import type { Product } from "@/lib/types";
import { getAllBrands } from "@/lib/vehicle-data";
import {
  normalizeSearchText,
  searchVehicles,
  type VehicleSearchResult,
} from "@/lib/vehicle-search";
import {
  ArrowRightIcon,
  CarFrontIcon,
  SearchIcon,
  XIcon,
} from "lucide-react";

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
};

type CategoryFilter = {
  key: Product["category"];
  label: string;
};

function buildQuery(params: Params, overrides: Partial<Params>) {
  const merged = { ...params, ...overrides };
  const search = new URLSearchParams();

  for (const key of ["marka", "kategori", "q", "sirala"] as const) {
    const value = merged[key]?.trim();
    if (value) search.set(key, value);
  }

  const qs = search.toString();
  return qs ? `/urunler?${qs}` : "/urunler";
}

const FILTER_PILL =
  "rounded-full border px-4 py-2 text-sm font-semibold transition-colors";
const FIELD =
  "min-h-12 w-full rounded-xl border border-white/10 bg-surface px-4 text-sm text-white placeholder:text-muted focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all";

function FilterControls({
  idPrefix,
  params,
  categories,
  vehicleBrands,
}: {
  idPrefix: string;
  params: Params;
  categories: CategoryFilter[];
  vehicleBrands: string[];
}) {
  const { marka, kategori, q, sirala } = params;

  return (
    <div>
      <form
        method="GET"
        action="/urunler"
        role="search"
        aria-label="Araç ve ürün arama"
        className="mb-6 grid gap-3 md:grid-cols-[minmax(0,1.35fr)_minmax(11rem,.75fr)_minmax(10rem,.6fr)_auto] md:items-end"
      >
        {kategori && <input type="hidden" name="kategori" value={kategori} />}

        <label htmlFor={`${idPrefix}-query`} className="block min-w-0">
          <span className="spec-label mb-2 block">Model veya ürün</span>
          <span className="relative block">
            <SearchIcon
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              id={`${idPrefix}-query`}
              type="search"
              name="q"
              defaultValue={q ?? ""}
              placeholder="Golf, Egea, Passat veya bagaj…"
              autoComplete="off"
              className={`${FIELD} pl-11`}
            />
          </span>
        </label>

        <label htmlFor={`${idPrefix}-brand`} className="block min-w-0">
          <span className="spec-label mb-2 block">Araç markası</span>
          <select
            id={`${idPrefix}-brand`}
            name="marka"
            defaultValue={marka ?? ""}
            className={FIELD}
          >
            <option value="">Tüm markalar</option>
            {vehicleBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor={`${idPrefix}-sort`} className="block min-w-0">
          <span className="spec-label mb-2 block">Sıralama</span>
          <select
            id={`${idPrefix}-sort`}
            name="sirala"
            defaultValue={sirala ?? "onerilen"}
            className={`${FIELD} font-medium`}
          >
            {SORTS.map((sort) => (
              <option key={sort.key} value={sort.key}>
                {sort.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="btn-press btn-red-rich inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-7 text-xs font-bold uppercase tracking-wider"
        >
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
          Ara
        </button>
      </form>

      <nav aria-label="Ürün kategorileri" className="flex flex-wrap gap-2">
        <Link
          href={buildQuery(params, { kategori: undefined })}
          aria-current={!kategori ? "page" : undefined}
          className={`${FILTER_PILL} ${
            !kategori
              ? "border-white bg-surface text-white"
              : "border-border text-muted hover:border-white/50 hover:text-white"
          }`}
        >
          Tüm Kategoriler
        </Link>
        {categories.map((category) => (
          <Link
            key={category.key}
            href={buildQuery(params, { kategori: category.key })}
            aria-current={kategori === category.key ? "page" : undefined}
            className={`${FILTER_PILL} ${
              kategori === category.key
                ? "border-white bg-surface text-white"
                : "border-border text-muted hover:border-white/50 hover:text-white"
            }`}
          >
            {category.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function VehicleMatches({
  vehicles,
  queryLabel,
}: {
  vehicles: VehicleSearchResult[];
  queryLabel: string;
}) {
  if (vehicles.length === 0) return null;

  return (
    <section
      aria-labelledby="vehicle-results-title"
      className="mb-8 overflow-hidden rounded-[1.4rem] border border-white/10 bg-surface/50 p-4 sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="spec-label">Araç eşleşmeleri</span>
          <h2
            id="vehicle-results-title"
            className="mt-2 font-heading text-xl font-semibold text-white sm:text-2xl"
          >
            Aracınızı bulduk
          </h2>
        </div>
        <p className="text-sm text-muted">
          &ldquo;{queryLabel}&rdquo; için en yakın eşleşmeler
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <Link
            key={`${vehicle.brand}-${vehicle.model}`}
            href={vehicle.href}
            className="group flex min-h-20 items-center gap-3 rounded-xl border border-white/8 bg-background/45 p-3.5 transition-colors hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
              <CarFrontIcon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="spec-value block text-[11px] font-bold uppercase tracking-[0.12em] text-white/80">
                {vehicle.brand}
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-white">
                {vehicle.displayModel}
              </span>
              <span className="mt-0.5 block text-xs text-muted">
                {vehicle.bodyType} · Araca özel seçenekler
              </span>
            </span>
            <ArrowRightIcon
              className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-white"
              aria-hidden="true"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const rawParams = await searchParams;
  const params: Params = {
    marka: rawParams.marka,
    kategori: rawParams.kategori,
    q: rawParams.q,
    sirala: rawParams.sirala,
  };
  const { marka, kategori, q, sirala } = params;
  const products = await getProducts();
  const vehicleBrands = getAllBrands();
  const settings = await getStoreSettings();
  const { page, sections } = await getContentPage("urunler");
  const kicker = sections.find((section) => section.sectionKey === "kicker");

  const categories: CategoryFilter[] = (
    Object.keys(CATEGORY_LABELS) as Product["category"][]
  )
    .filter((key) => products.some((product) => product.category === key))
    .map((key) => ({ key, label: CATEGORY_LABELS[key] }));

  const query = q?.trim() ?? "";
  const vehicleQuery = [marka, query].filter(Boolean).join(" ");
  const vehicleMatches = vehicleQuery
    ? searchVehicles(vehicleQuery, 9)
    : [];

  let categoryProducts = products;
  if (kategori) {
    categoryProducts = categoryProducts.filter(
      (product) => product.category === kategori
    );
  }

  let filtered = categoryProducts;
  if (query && vehicleMatches.length === 0) {
    const needle = normalizeSearchText(query);
    filtered = filtered.filter((product) =>
      normalizeSearchText(
        `${product.brand} ${product.model} ${product.name} ${CATEGORY_LABELS[product.category]} ${product.description}`
      ).includes(needle)
    );
  }

  filtered = [...filtered];
  if (sirala === "fiyat-artan") {
    filtered.sort((left, right) => left.price - right.price);
  } else if (sirala === "fiyat-azalan") {
    filtered.sort((left, right) => right.price - left.price);
  }

  const activeFilterCount = [marka, kategori, query].filter(Boolean).length;
  const queryLabel = [marka, query].filter(Boolean).join(" ");
  const whatsappHref = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Merhaba, katalogda bulamadığım aracım için ürün bilgisi almak istiyorum. Marka/model: ${queryLabel || "Belirtmek istiyorum"}`
  )}`;
  const hasAnyResult = vehicleMatches.length > 0 || filtered.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
      <div className="mb-8 max-w-3xl">
        <span className="section-kicker">{kicker?.title ?? "Katalog"}</span>
        <h1 className="mt-3 max-w-full break-words font-heading text-3xl font-semibold text-white sm:text-4xl">
          {page?.title ?? "Araca Özel EVA Paspas Setleri"}
        </h1>
        <p className="mt-3 max-w-2xl text-xs leading-relaxed text-white/55">
          {page?.description ??
            "Modelinizi bulun, size uygun EVA paspas setini inceleyin. Listede aracınızı göremiyorsanız WhatsApp üzerinden bize ulaşın, size özel üretim yapalım."}
        </p>
      </div>

      <details
        className="group mb-5 sm:hidden"
        open={activeFilterCount > 0}
      >
        <summary
          role="button"
          aria-controls="mobile-product-filters"
          className="btn-press flex min-h-12 cursor-pointer list-none items-center justify-between rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white [&::-webkit-details-marker]:hidden"
        >
          <span>
            Ara ve filtrele
            {activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
          </span>
          <span
            className="text-muted transition-transform group-open:rotate-180"
            aria-hidden="true"
          >
            ▾
          </span>
        </summary>
        <div
          id="mobile-product-filters"
          className="mt-3 rounded-xl border border-white/10 bg-surface/55 p-4"
        >
          <FilterControls
            idPrefix="mobile"
            params={params}
            categories={categories}
            vehicleBrands={vehicleBrands}
          />
        </div>
      </details>

      <div className="mb-8 hidden sm:block">
        <FilterControls
          idPrefix="desktop"
          params={params}
          categories={categories}
          vehicleBrands={vehicleBrands}
        />
      </div>

      <VehicleMatches vehicles={vehicleMatches} queryLabel={queryLabel} />

      <div className="mb-5 flex items-center justify-between gap-4 text-sm text-muted">
        <span className="spec-value" aria-live="polite">
          <strong className="text-white">{filtered.length}</strong>{" "}
          {vehicleMatches.length > 0 ? "uyumlu ürün" : "ürün"} bulundu
        </span>
        {activeFilterCount > 0 && (
          <Link
            href="/urunler"
            className="inline-flex min-h-11 items-center gap-1 font-semibold text-white/80 hover:text-white hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Filtreleri temizle
            <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      {!hasAnyResult ? (
        <div className="rounded-[1.7rem] border border-dashed border-border px-6 py-16 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface">
            <SearchIcon className="h-8 w-8 text-muted" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-heading text-xl font-bold uppercase text-white">
            Araç veya ürün bulunamadı
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Marka-model yazımını kontrol edin, filtreleri temizleyin veya aracınız
            için üretim uygunluğunu WhatsApp&apos;tan sorun.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/urunler"
              className="btn-press inline-flex min-h-11 items-center rounded-lg border border-white/10 px-5 text-sm font-semibold text-white hover:border-white/40"
            >
              Filtreleri temizle
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-press btn-red-rich inline-flex min-h-11 items-center px-5 text-sm font-bold uppercase tracking-wider text-white"
            >
              Aracım için bilgi al
            </a>
          </div>
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
