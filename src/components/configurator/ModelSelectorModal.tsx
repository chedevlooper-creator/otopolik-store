"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, SearchIcon } from "lucide-react";
import { getModelsByBrand } from "@/lib/vehicle-data";
import BrandLogo from "@/components/BrandLogo";
import CarBodySilhouette from "@/components/CarBodySilhouette";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (model: string, bodyType: string) => void;
  selectedModel: string;
  brand: string;
};

export default function ModelSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedModel,
  brand,
}: Props) {
  const [search, setSearch] = useState("");

  const models = useMemo(() => {
    if (!brand) return [];
    return getModelsByBrand(brand);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "-47%", x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, y: "-47%", x: "-50%" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-[51] flex h-[80vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-white/12 bg-[#09090b] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
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
                    BMW serisi veya model ailesini belirtin.
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
                className="min-h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-11 pr-4 py-3 text-sm font-medium text-white placeholder-white/30 transition-all focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.2)] focus:outline-none"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto mt-6 pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {filteredModels.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-6">
                  {filteredModels.map((model) => {
                    const isActive = selectedModel === model.name;
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
                        <CarBodySilhouette
                          bodyType={model.bodyType}
                          className={`h-9 w-20 transition-colors duration-300 ${
                            isActive
                              ? "text-[var(--brand-red)]"
                              : "text-white/40 group-hover:text-white/80"
                          }`}
                        />
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
}
