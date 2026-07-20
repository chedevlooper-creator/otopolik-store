"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, SearchIcon } from "lucide-react";
import { getModelsByBrand } from "@/lib/vehicle-data";
import BrandLogo from "@/components/BrandLogo";
import CarBodySilhouette from "@/components/CarBodySilhouette";
import vehicleImages from "@/lib/vehicle-images.json";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: string, bodyType: string) => void;
  selectedModel: string;
  brand: string;
};

const POPULAR_MODELS_BY_BRAND: Record<string, string[]> = {
  BMW: ["3 Serisi Sedan", "5 Serisi Sedan", "1 Serisi Hatchback", "X5 SUV"],
  Audi: ["A3 Sedan", "A3 Sportback", "A4 Sedan", "A6 Sedan", "Q3 SUV"],
  "Mercedes-Benz": ["C Serisi Sedan", "E Serisi Sedan", "A Serisi Hatchback", "CLA Coupe"],
  Volkswagen: ["Golf Hatchback", "Passat Sedan", "Polo Hatchback", "Tiguan SUV"],
  Renault: ["Clio Hatchback", "Megane Sedan", "Fluence Sedan", "Symbol Sedan"],
  Fiat: ["Egea Sedan", "Egea Cross", "Linea Sedan", "Punto Hatchback"],
  Ford: ["Focus Sedan", "Focus Hatchback", "Fiesta Hatchback", "Puma SUV"],
  Toyota: ["Corolla Sedan", "Yaris Hatchback", "C-HR SUV", "Auris Hatchback"],
  Opel: ["Astra Hatchback", "Corsa Hatchback", "Insignia Sedan", "Mokka SUV"],
  Peugeot: ["3008 SUV", "2008 SUV", "308 Hatchback", "208 Hatchback"],
  Hyundai: ["i20 Hatchback", "i30 Hatchback", "Tucson SUV", "Elantra Sedan"],
  Honda: ["Civic Sedan", "Accord Sedan", "CR-V SUV", "HR-V SUV"],
  Citroen: ["C3 Hatchback", "C4 Hatchback", "C-Elysee Sedan", "C5 Aircross SUV"],
  Dacia: ["Duster SUV", "Sandero Stepway", "Logan Sedan", "Spring Hatchback"],
  Togg: ["T10X SUV", "T10F Liftback"],
  Tesla: ["Model Y SUV", "Model 3 Sedan"],
};

export default function ModelSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedModel,
  brand,
}: Props) {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const models = useMemo(() => {
    if (!brand) return [];
    return getModelsByBrand(brand);
  }, [brand]);

  const popularModels = useMemo(() => {
    if (!brand) return [];
    return POPULAR_MODELS_BY_BRAND[brand] || [];
  }, [brand]);

  const filteredModels = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return models;
    return models.filter((m) => m.name.toLowerCase().includes(q));
  }, [search, models]);

  const handleSelect = (modelName: string, bodyType: string) => {
    onSelect(modelName, bodyType);
    onClose();
    setSearch("");
  };

  const getModelImageUrl = (brandName: string, modelName: string): string | null => {
    const brandData = (vehicleImages.models as Record<string, Record<string, string>>)[brandName];
    if (!brandData) return null;

    // Direct match
    if (brandData[modelName]) return brandData[modelName];

    // Substring / Prefix match
    const keys = Object.keys(brandData).sort((a, b) => b.length - a.length);
    for (const key of keys) {
      if (
        modelName.toLowerCase().startsWith(key.toLowerCase()) ||
        modelName.toLowerCase().includes(key.toLowerCase())
      ) {
        return brandData[key];
      }
    }

    return null;
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "-47%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-47%", x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[10000] flex h-[80vh] w-[92vw] max-w-2xl flex-col rounded-3xl border border-border bg-surface p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            {/* Selected Brand Display at top */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <BrandLogo brand={brand} className="h-7 w-7 text-white/80 shrink-0" />
                <div>
                  <h3 className="text-gradient-white text-base font-extrabold uppercase tracking-wider">
                    {brand} Modelini Seçin
                  </h3>
                  <p className="mt-1 text-xs text-white/50">
                    {brand} serisi veya model ailesini belirtin.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mt-5">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <SearchIcon className="h-4 w-4" />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Model ara... (Örn: 3 Serisi, A3, Golf)"
                className="min-h-12 w-full rounded-xl border border-border bg-black/40 pl-11 pr-4 py-3 text-sm font-medium text-white placeholder-white/30 transition-all focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.2)] focus:outline-none"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto mt-6 pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {!search && popularModels.length > 0 && (
                <div className="mb-6 border-b border-white/5 pb-5">
                  <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] mb-3">
                    Öne Çıkan Modeller
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularModels.map((popModelName) => {
                      const actualModel = models.find(m => m.name.toLowerCase() === popModelName.toLowerCase()) ||
                                          models.find(m => m.name.toLowerCase().startsWith(popModelName.toLowerCase())) ||
                                          models.find(m => m.name.toLowerCase().includes(popModelName.toLowerCase()));

                      const displayName = popModelName.replace(/\s+(Sedan|Hatchback|SUV|Coupe|Cabrio|MPV|Station Wagon|Pickup|Van|Roadster|Liftback|Sportback|Fastback|Crossover|Microcar)$/i, "");

                      if (!actualModel) return null;
                      const isActive = selectedModel === actualModel.name;

                      return (
                        <button
                          key={popModelName}
                          type="button"
                          onClick={() => handleSelect(actualModel.name, actualModel.bodyType)}
                          className={`btn-press px-4 py-2 rounded-full border text-xs font-bold transition-all duration-300 ${
                            isActive
                              ? "bg-[var(--brand-red)]/15 border-[var(--brand-red)] text-white shadow-[0_0_12px_rgba(237,27,36,0.25)]"
                              : "bg-white/[0.02] border-white/5 text-white/75 hover:bg-white/[0.05] hover:border-white/12 hover:scale-[1.03] hover:text-white"
                          }`}
                        >
                          {displayName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Models Title */}
              {!search && (
                <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] mb-3">
                  Tüm Modeller
                </h4>
              )}
              {filteredModels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-6">
                  {filteredModels.map((model) => {
                    const isActive = selectedModel === model.name;
                    const modelImgUrl = getModelImageUrl(brand, model.name);

                    return (
                      <button
                        key={model.name}
                        type="button"
                        onClick={() => handleSelect(model.name, model.bodyType)}
                        className={`group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border text-center transition-all duration-300 ${
                          isActive
                            ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-white shadow-[0_0_15px_rgba(237,27,36,0.15)]"
                            : "bg-white/[0.02] border-white/5 text-white/80 hover:bg-white/[0.05] hover:border-white/15 hover:scale-[1.03]"
                        }`}
                      >
                        {modelImgUrl ? (
                          <div className="h-10 w-24 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={modelImgUrl}
                              alt={`${model.name} silüeti`}
                              className={`h-full w-full object-contain filter transition-all duration-300 ${
                                isActive ? "brightness-125" : "brightness-90 opacity-60 group-hover:opacity-100 group-hover:brightness-100"
                              }`}
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <CarBodySilhouette
                            bodyType={model.bodyType}
                            className={`h-9 w-20 transition-colors duration-300 ${
                              isActive
                                ? "text-[var(--brand-red)]"
                                : "text-white/40 group-hover:text-white/80"
                            }`}
                          />
                        )}
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold tracking-wider">{model.name}</span>
                          <span className="text-[10px] text-white/40 mt-0.5 uppercase tracking-wider">{model.bodyType}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-white/40 font-medium">Aradığınız model bulunamadı.</p>
                  <button
                    type="button"
                    onClick={() => handleSelect(search, "Sedan")}
                    className="mt-4 px-4 py-2 border border-white/10 rounded-xl bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition"
                  >
                    &quot;{search}&quot; Modelini Manuel Ekle →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return mounted ? createPortal(modalContent, document.body) : null;
}
