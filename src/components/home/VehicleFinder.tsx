"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllBrands, getModelsByBrand } from "@/lib/vehicle-data";
import { ArrowRightIcon, CarFrontIcon, SearchIcon } from "lucide-react";

export default function VehicleFinder() {
  const router = useRouter();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");

  const brandList = useMemo(() => getAllBrands(), []);
  const models = useMemo(() => (brand ? getModelsByBrand(brand) : []), [brand]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const query = new URLSearchParams();
    if (brand) query.set("marka", brand);
    if (model) query.set("model", model);
    if (year) query.set("yil", year);
    router.push(query.size ? `/olusturucu?${query.toString()}` : "/olusturucu");
  }

  const fieldClass =
    "input-rich h-12 w-full rounded-xl border border-white/[0.08] px-4 text-sm font-medium text-white outline-none transition-all duration-300 placeholder:text-white/30 hover:border-white/15 focus:border-sand/50";
  const labelClass =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50";

  return (
    <form onSubmit={handleSubmit} className="surface-glass gradient-border overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-7">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="icon-badge-rich flex h-11 w-11 items-center justify-center rounded-xl text-white">
            <CarFrontIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-xl font-bold text-white sm:text-2xl">Aracını seç, tasarımını başlat</p>
            <p className="mt-0.5 text-xs text-white/50">Doğru kalıbı birkaç saniyede bul.</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50 lg:inline-flex">
          <SearchIcon className="h-3 w-3 text-sand/80" aria-hidden="true" />
          40+ marka · 6000+ model
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1.35fr_.72fr_auto] lg:items-end">
        <div>
          <label htmlFor="finder-brand" className={labelClass}>01 · Marka</label>
          <select
            id="finder-brand"
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel("");
            }}
            className={fieldClass}
          >
            <option value="" className="bg-[#0e1018]">Marka seçin</option>
            {brandList.map((item) => <option key={item} value={item} className="bg-[#0e1018]">{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="finder-model" className={labelClass}>02 · Model / Kasa</label>
          <select
            id="finder-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            <option value="" className="bg-[#0e1018]">{brand ? "Model seçin" : "Önce marka seçin"}</option>
            {models.map((item) => <option key={item.name} value={item.name} className="bg-[#0e1018]">{item.name}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="finder-year" className={labelClass}>03 · Model yılı</label>
          <input
            id="finder-year"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            maxLength={4}
            pattern="[0-9]{4}"
            placeholder="Örn. 2021"
            className={fieldClass}
          />
        </div>
        <button
          type="submit"
          className="btn-press btn-red-rich flex h-12 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white sm:col-span-2 lg:col-span-1 lg:min-w-[168px]"
        >
          Tasarıma geç
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
