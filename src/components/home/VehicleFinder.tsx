"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { SearchIcon } from "lucide-react";

export default function VehicleFinder() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [slug, setSlug] = useState("");
  const [yearOrChassis, setYearOrChassis] = useState("");

  const brandList = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    []
  );
  const models = useMemo(
    () => products.filter((p) => p.brand === brand),
    [brand]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (slug) {
      router.push(`/urunler/${slug}`);
    } else if (brand) {
      router.push(`/urunler?marka=${encodeURIComponent(brand)}${yearOrChassis ? `&yil=${encodeURIComponent(yearOrChassis)}` : ""}`);
    } else {
      router.push(yearOrChassis ? `/urunler?yil=${encodeURIComponent(yearOrChassis)}` : "/urunler");
    }
  }

  const fieldClass =
    "w-full border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors focus:border-sand focus:outline-none sm:py-3";
  const labelClass =
    "spec-value mb-1.5 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-eva-strong border border-border bg-surface p-5 shadow-2xl shadow-black/50 sm:p-7"
    >
      <div className="mb-5 flex items-center gap-2">
        <span className="h-px w-7 bg-brand-red" aria-hidden="true" />
        <span className="spec-value text-[11px] font-bold uppercase tracking-[0.18em] text-sand">
          Aracını seç, setini bul
        </span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
        <div className="flex-1">
          <label htmlFor="finder-brand" className={labelClass}>Marka</label>
          <select
            id="finder-brand"
            value={brand}
            onChange={(e) => { setBrand(e.target.value); setSlug(""); }}
            className={fieldClass}
          >
            <option value="">Tüm Markalar</option>
            {brandList.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="finder-model" className={labelClass}>Model</label>
          <select
            id="finder-model"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            disabled={!brand}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:text-muted`}
          >
            <option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>
            {models.map((p) => <option key={p.slug} value={p.slug}>{p.model}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label htmlFor="finder-year" className={labelClass}>Yıl / Kasa</label>
          <input
            id="finder-year"
            value={yearOrChassis}
            onChange={(e) => setYearOrChassis(e.target.value)}
            placeholder="Örn. 2020"
            className={fieldClass}
          />
        </div>
        <button
          type="submit"
          className="btn-press flex h-11 items-center justify-center gap-2 bg-brand-red px-8 text-sm font-bold uppercase tracking-wider text-white hover:bg-brand-red-dark sm:h-[46px] sm:shrink-0"
        >
          <SearchIcon className="h-4 w-4" aria-hidden="true" />
          Setini Bul
        </button>
      </div>
    </form>
  );
}
