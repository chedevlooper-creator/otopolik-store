"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";

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

  const inputClass =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3 text-sm font-medium transition-colors focus:border-brand-red focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-red/15";

  return (
    <section className="relative z-10 mx-auto -mt-14 max-w-5xl px-4 sm:-mt-16">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-neutral-200/80 bg-white/95 p-5 shadow-2xl shadow-black/15 backdrop-blur-md sm:p-7"
      >
        <p className="mb-4 flex items-center gap-2 font-heading text-sm font-bold text-neutral-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-base">🚗</span>
          Aracınıza özel paspası 10 saniyede bulun
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex-1">
            <label htmlFor="vf-brand" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
              1. Marka Seçin
            </label>
            <select
              id="vf-brand"
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setSlug("");
              }}
              className={inputClass}
            >
              <option value="">Tüm Markalar</option>
              {brandList.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="vf-model" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
              2. Model Seçin
            </label>
            <select
              id="vf-model"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={!brand}
              className={`${inputClass} disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400`}
            >
              <option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>
              {models.map((p) => (
                <option key={p.slug} value={p.slug}>{p.model}</option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label htmlFor="vf-year" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">
              3. Yıl / Kasa (opsiyonel)
            </label>
            <input
              id="vf-year"
              value={yearOrChassis}
              onChange={(e) => setYearOrChassis(e.target.value)}
              placeholder="Örn. 2020 veya F30"
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="btn-press rounded-xl bg-brand-red px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand-red/30 hover:bg-brand-red-dark hover:shadow-xl hover:shadow-brand-red/40 sm:shrink-0"
          >
            Paspasını Bul
          </button>
        </div>
      </form>
    </section>
  );
}
