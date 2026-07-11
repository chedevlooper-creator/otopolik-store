"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { SearchIcon, CarIcon } from "lucide-react";

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
    "w-full rounded-xl border border-neutral-700 bg-[#141414] px-4 py-3 text-sm font-medium transition-colors focus:border-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900/10";

  return (
    <section className="bg-[#141414]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-neutral-700 bg-neutral-900 p-5 sm:p-6"
        >
          <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#141414]">
              <CarIcon className="h-4 w-4 text-neutral-300" />
            </span>
            Aracınıza özel paspası bulun
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-400">Marka</label>
              <select
                value={brand}
                onChange={(e) => { setBrand(e.target.value); setSlug(""); }}
                className={inputClass}
              >
                <option value="">Tüm Markalar</option>
                {brandList.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-400">Model</label>
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                disabled={!brand}
                className={`${inputClass} disabled:cursor-not-allowed disabled:text-neutral-400`}
              >
                <option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>
                {models.map((p) => <option key={p.slug} value={p.slug}>{p.model}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-neutral-400">Yıl / Kasa</label>
              <input
                value={yearOrChassis}
                onChange={(e) => setYearOrChassis(e.target.value)}
                placeholder="Örn. 2020"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              className="flex h-[46px] items-center justify-center gap-2 rounded-xl bg-neutral-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-brand-red sm:shrink-0"
            >
              <SearchIcon className="h-4 w-4" />
              Bul
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
