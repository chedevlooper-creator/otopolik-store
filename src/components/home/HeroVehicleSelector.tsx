"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "@/components/BrandLogo";
import BrandSelectorModal from "@/components/configurator/BrandSelectorModal";
import ModelSelectorModal from "@/components/configurator/ModelSelectorModal";
import CarBodySilhouette from "@/components/CarBodySilhouette";
import { getModelsByBrand } from "@/lib/vehicle-data";
import vehicleImages from "@/lib/vehicle-images.json";

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

  const selectedModelObj = useMemo(() => {
    if (!selectedBrand || !selectedModel) return null;
    const models = getModelsByBrand(selectedBrand);
    return models.find((m) => m.name === selectedModel) || null;
  }, [selectedBrand, selectedModel]);

  const modelImgUrl = useMemo(() => {
    if (!selectedBrand || !selectedModel) return null;
    const brandData = (vehicleImages.models as Record<string, Record<string, string>>)[selectedBrand];
    if (!brandData) return null;

    // Direct match
    if (brandData[selectedModel]) return brandData[selectedModel];

    // Substring / Prefix match
    const keys = Object.keys(brandData).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (
        selectedModel.toLowerCase().startsWith(key.toLowerCase()) ||
        selectedModel.toLowerCase().includes(key.toLowerCase())
      ) {
        return brandData[key];
      }
    }
    return null;
  }, [selectedBrand, selectedModel]);

  const isButtonEnabled = !!selectedBrand;

  const selectClass =
    "min-h-12 w-full rounded-xl border border-border bg-black/40 text-white hover:bg-black/60 hover:border-white/10 focus:bg-black/90 focus:border-[var(--brand-red)] focus:shadow-[0_0_20px_rgba(237,27,36,0.25)] focus:outline-none appearance-none cursor-pointer transition-all duration-300";

  return (
    <div className="mx-auto mt-12 max-w-5xl rounded-3xl border border-border bg-surface/85 p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-500 hover:border-white/10 grid gap-8 lg:grid-cols-12 text-left">
      {/* Left side: Selector Form */}
      <div className="lg:col-span-8 flex flex-col justify-between">
        <div>
          <div className="mb-6">
            <h2 className="text-gradient-white text-base font-extrabold tracking-[0.2em] uppercase">
              Hızlı Seçim Sihirbazı
            </h2>
            <p className="mt-2 text-xs text-white/50 tracking-wide">
              Aracınızı seçerek uyumlu paspas modellerini ve renk kombinasyonlarını anında keşfedin
            </p>
          </div>

          <form onSubmit={handleSearch} className="grid gap-4 sm:grid-cols-3 items-end">
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
                      <span>{selectedModel.replace(/\s+(Sedan|Hatchback|SUV|Coupe|Cabrio|MPV|Station Wagon|Pickup|Van|Roadster|Liftback|Sportback|Fastback|Crossover|Microcar)$/i, "")}</span>
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
          </form>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="submit"
            onClick={handleSearch}
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
      </div>

      {/* Right side: Premium HUD Hologram */}
      <div className="lg:col-span-4 flex flex-col justify-between h-full min-h-[280px] rounded-2xl border border-white/8 bg-black/40 p-6 relative overflow-hidden">
        {/* HUD Scanner Grid Background */}
        <div 
          className="absolute inset-0 z-0 opacity-[0.15] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]"
        />

        {/* Ambient background glow */}
        <div 
          className={`absolute -inset-10 z-0 bg-[radial-gradient(circle_at_center,var(--brand-red)_0%,transparent_60%)] opacity-0 blur-[40px] transition-all duration-700 ${
            selectedModel ? "opacity-10" : "opacity-0"
          }`}
        />

        {/* HUD UI Header */}
        <div className="relative z-10 flex items-center justify-between text-[9px] font-mono text-white/40 tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${selectedModel ? "bg-[var(--brand-red)] animate-pulse" : "bg-white/30"}`} />
            <span>{selectedModel ? "TARAMA TAMAMLANDI" : "BEKLEMEDE"}</span>
          </div>
          <span>SYS.VER.1.2</span>
        </div>

        {/* Center: Vehicle Silhouette / Scanner Graphic */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-6 min-h-[140px]">
          {/* Scanning Line */}
          {selectedModel && (
            <motion.div 
              animate={{ y: [-10, 110, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-red)] to-transparent z-20 shadow-[0_0_8px_var(--brand-red)] opacity-80"
            />
          )}

          <AnimatePresence mode="wait">
            {selectedModelObj ? (
              <motion.div
                key={selectedModel}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center w-full"
              >
                {modelImgUrl ? (
                  <div className="h-16 w-36 flex items-center justify-center relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={modelImgUrl}
                      alt={`${selectedModel} silüeti`}
                      className="h-full w-full object-contain filter invert brightness-125 drop-shadow-[0_0_12px_rgba(237,27,36,0.35)]"
                    />
                  </div>
                ) : (
                  <CarBodySilhouette
                    bodyType={selectedModelObj.bodyType}
                    className="h-14 w-32 text-[var(--brand-red)] filter drop-shadow-[0_0_12px_rgba(237,27,36,0.4)]"
                  />
                )}
                
                {/* Visual glow ring below the car */}
                <div className="h-1 w-28 rounded-[50%] bg-[var(--brand-red)]/20 filter blur-[3px] mt-4 animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center"
              >
                {/* Generic wireframe silhouette */}
                <CarBodySilhouette
                  bodyType="Sedan"
                  className="h-14 w-32 text-white/20"
                />
                <span className="text-[10px] font-mono text-white/30 mt-4 tracking-widest uppercase animate-pulse">
                  ARAÇ BEKLENİYOR
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HUD Data Overlay Panel */}
        <div className="relative z-10 border-t border-white/5 pt-3 text-left">
          <div className="font-mono text-[9px] text-white/50 leading-relaxed space-y-0.5">
            {selectedModelObj ? (
              <>
                <div className="flex justify-between">
                  <span>MARKA:</span>
                  <span className="text-white font-bold">{selectedBrand}</span>
                </div>
                <div className="flex justify-between">
                  <span>MODEL:</span>
                  <span className="text-white font-bold">{selectedModelObj.name.replace(/\s+(Sedan|Hatchback|SUV|Coupe|Cabrio|MPV|Station Wagon|Pickup|Van|Roadster|Liftback|Sportback|Fastback|Crossover|Microcar)$/i, "")}</span>
                </div>
                <div className="flex justify-between">
                  <span>GÖVDE:</span>
                  <span className="text-[var(--brand-red)] font-bold">{selectedModelObj.bodyType.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span>YIL:</span>
                  <span className="text-white font-bold">{selectedYear || "BELİRTİLMEDİ"}</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1 mt-1 text-[8px] text-white/30">
                  <span>UYUMLULUK:</span>
                  <span className="text-emerald-400 font-bold">%100 HASSAS UYUM</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>SİSTEM:</span>
                  <span className="text-white">ÇEVRİMİÇİ</span>
                </div>
                <div className="flex justify-between">
                  <span>VERİTABANI:</span>
                  <span className="text-white">6000+ MODEL</span>
                </div>
                <div className="flex justify-between">
                  <span>ÖLÇÜM:</span>
                  <span className="text-white">3D LAZER TARAMA</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-1 mt-1 text-[8px] text-white/30">
                  <span>DURUM:</span>
                  <span className="text-white/40 animate-pulse">ARAÇ VERİSİ BEKLENİYOR...</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


