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
    "h-12 w-full rounded-xl border border-white/12 bg-[#090b0f]/88 px-4 text-sm font-medium text-white outline-none transition-[border-color,background-color,box-shadow] placeholder:text-white/38 hover:border-white/20 focus:border-sand/65 focus:bg-black/95 focus:shadow-[0_0_0_3px_rgba(225,201,162,.08)]";
  const labelClass =
    "mb-2 block text-[10px] font-bold uppercase tracking-[0.15em] text-white/62";

  return (
    <form onSubmit={handleSubmit} className="surface-glass overflow-hidden rounded-[1.5rem] p-4 sm:p-5 lg:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-red text-white shadow-lg shadow-brand-red/20">
            <CarFrontIcon className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-heading text-xl font-bold text-white sm:text-2xl">Aracını seç, tasarımını başlat</p>
            <p className="mt-0.5 text-xs text-white/62">Doğru kalıbı birkaç saniyede bul.</p>
          </div>
        </div>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/58 lg:inline-flex">
          <SearchIcon className="h-3 w-3 text-sand" aria-hidden="true" />
          40+ marka · 6000+ model
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1.35fr_.72fr_auto] lg:items-end">
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
            <option value="">Marka seçin</option>
            {brandList.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="finder-model" className={labelClass}>02 · Model / Kasa</label>
          <select
            id="finder-model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!brand}
            className={`${fieldClass} disabled:cursor-not-allowed disabled:opacity-45`}
          >
            <option value="">{brand ? "Model seçin" : "Önce marka seçin"}</option>
            {models.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}
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
          className="btn-press flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-red px-6 text-sm font-bold text-white shadow-[0_14px_36px_rgba(227,25,55,.24)] hover:bg-[#f02142] sm:col-span-2 lg:col-span-1 lg:min-w-[168px]"
        >
          Tasarıma geç
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
