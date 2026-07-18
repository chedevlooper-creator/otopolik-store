"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getAllBrands, getModelsByBrand } from "@/lib/vehicle-data";

export default function HeroVehicleSelector() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const brands = useMemo(() => getAllBrands(), []);
  
  const models = useMemo(() => {
    if (!selectedBrand) return [];
    return getModelsByBrand(selectedBrand);
  }, [selectedBrand]);

  const years = useMemo(() => {
    const currentYear = 2026;
    const startYear = 1990;
    return Array.from({ length: currentYear - startYear + 1 }, (_, idx) =>
      String(currentYear - idx)
    );
  }, []);

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

    const query = new URLSearchParams();
    query.set("marka", selectedBrand);
    if (selectedModel) query.set("model", selectedModel);
    if (selectedYear) query.set("yil", selectedYear);

    router.push(`/olusturucu?${query.toString()}`);
  };

  const isButtonEnabled = !!selectedBrand;

  const selectClass =
    "min-h-12 w-full rounded-xl border border-white/10 bg-black/60 text-white backdrop-blur-md px-4 py-3 text-sm font-medium transition-all focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.3)] focus:outline-none appearance-none cursor-pointer";

  return (
    <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-white/5 bg-black/40 p-6 backdrop-blur-md shadow-2xl">
      <div className="mb-4 text-center">
        <h2 className="text-sm font-semibold tracking-[0.15em] text-white/80 uppercase">
          Hızlı Seçim Sihirbazı
        </h2>
        <p className="mt-1 text-xs text-white/50">
          Aracınızı seçerek uyumlu paspas modellerini ve renk kombinasyonlarını anında keşfedin
        </p>
      </div>

      <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-4 items-end">
        {/* Brand Select */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Marka
          </label>
          <div className="relative">
            <select
              value={selectedBrand}
              onChange={(e) => handleBrandChange(e.target.value)}
              className={selectClass}
            >
              <option value="" className="bg-black">Marka Seçin</option>
              {brands.map((brand) => (
                <option key={brand} value={brand} className="bg-black text-white">
                  {brand}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              ▼
            </div>
          </div>
        </div>

        {/* Model Select */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Model
          </label>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="" className="bg-black">
                {selectedBrand ? "Model Seçin" : "Önce Marka Seçin"}
              </option>
              {models.map((model) => (
                <option key={model.name} value={model.name} className="bg-black text-white">
                  {model.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              ▼
            </div>
          </div>
        </div>

        {/* Year Select */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-white/60 uppercase tracking-wider mb-1.5">
            Yıl
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedBrand}
              className={`${selectClass} disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              <option value="" className="bg-black">Yıl Seçin</option>
              {years.map((year) => (
                <option key={year} value={year} className="bg-black text-white">
                  {year}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
              ▼
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={!isButtonEnabled}
            className="btn-press btn-red-rich flex h-12 w-full items-center justify-center rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Paspasını Tasarla →
          </button>
        </div>
      </form>
    </div>
  );
}
