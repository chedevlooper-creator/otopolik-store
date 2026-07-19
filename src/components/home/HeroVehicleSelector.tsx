"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import BrandSelectorModal from "@/components/configurator/BrandSelectorModal";
import ModelSelectorModal from "@/components/configurator/ModelSelectorModal";

export default function HeroVehicleSelector() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

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
    "min-h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] text-white hover:bg-white/[0.06] hover:border-white/15 focus:bg-black/90 focus:border-[var(--brand-red)] focus:shadow-[0_0_20px_rgba(237,27,36,0.25)] focus:outline-none appearance-none cursor-pointer transition-all duration-300";

  return (
    <div className="mx-auto mt-12 max-w-4xl rounded-2xl border border-white/12 bg-[#09090b]/80 p-7 backdrop-blur-xl shadow-2xl premium-card transition-all duration-300 hover:border-white/20">
      <div className="mb-6 text-center">
        <h2 className="text-gradient-white text-base font-extrabold tracking-[0.2em] uppercase">
          Hızlı Seçim Sihirbazı
        </h2>
        <p className="mt-2 text-xs text-white/50 tracking-wide">
          Aracınızı seçerek uyumlu paspas modellerini ve renk kombinasyonlarını anında keşfedin
        </p>
      </div>

      <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-4 items-end">
        {/* Brand Select */}
        <div className="relative group">
          <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-[0.2em] mb-2">
            Marka
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsBrandOpen(true)}
              className={`${selectClass} flex items-center justify-between text-left`}
            >
              {selectedBrand ? (
                <span className="flex items-center gap-2.5">
                  <BrandLogo brand={selectedBrand} className="h-5 w-5 text-white/70" />
                  <span>{selectedBrand}</span>
                </span>
              ) : (
                <span className="text-white/40">Marka Seçin</span>
              )}
              <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
            </button>
            <BrandSelectorModal
              isOpen={isBrandOpen}
              onClose={() => setIsBrandOpen(false)}
              onSelect={handleBrandChange}
              selectedBrand={selectedBrand}
            />
          </div>
        </div>

        {/* Model Select */}
        <div className="relative group">
          <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-[0.2em] mb-2">
            Model
          </label>
          <div className="relative">
            <button
              type="button"
              disabled={!selectedBrand}
              onClick={() => setIsModelOpen(true)}
              className={`${selectClass} flex items-center justify-between text-left disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              {selectedModel ? (
                <span className="flex items-center gap-2.5">
                  <BrandLogo brand={selectedBrand} className="h-5 w-5 text-white/70" />
                  <span>{selectedModel}</span>
                </span>
              ) : (
                <span className="text-white/40">
                  {selectedBrand ? "Model Seçin" : "Önce Marka Seçin"}
                </span>
              )}
              <ChevronDown className="h-4 w-4 text-white/40 shrink-0" />
            </button>
            <ModelSelectorModal
              isOpen={isModelOpen}
              onClose={() => setIsModelOpen(false)}
              onSelect={(model) => setSelectedModel(model)}
              selectedModel={selectedModel}
              brand={selectedBrand}
            />
          </div>
        </div>

        {/* Year Select */}
        <div className="relative group">
          <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-[0.2em] mb-2">
            Yıl
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={!selectedBrand}
              className={`${selectClass} disabled:opacity-20 disabled:cursor-not-allowed`}
            >
              <option value="" className="bg-black text-white/60">Yıl Seçin</option>
              {years.map((year) => (
                <option key={year} value={year} className="bg-black text-white">
                  {year}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronDown className="h-4 w-4 text-white/40 transition-transform duration-300 group-focus-within:rotate-180" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={!isButtonEnabled}
            className={`btn-press flex h-12 w-full items-center justify-center rounded-xl text-xs font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
              isButtonEnabled
                ? "bg-[var(--brand-red)] text-white shadow-[0_0_20px_rgba(237,27,36,0.45)] hover:bg-[var(--brand-red)]/90 hover:shadow-[0_0_28px_rgba(237,27,36,0.6)] cursor-pointer"
                : "bg-white/5 border border-white/5 text-white/30 cursor-not-allowed"
            }`}
          >
            Paspasını Tasarla →
          </button>
        </div>
      </form>
    </div>
  );
}

