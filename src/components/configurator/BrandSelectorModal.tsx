"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, SearchIcon } from "lucide-react";
import { getAllBrands } from "@/lib/vehicle-data";
import { OTHER_VEHICLE_BRAND } from "@/lib/vehicle-compatibility";
import BrandLogo from "@/components/BrandLogo";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (brand: string) => void;
  selectedBrand: string;
};

const POPULAR_BRANDS = [
  "BMW",
  "Audi",
  "Mercedes-Benz",
  "Volkswagen",
  "Renault",
  "Fiat",
  "Ford",
  "Toyota",
  "Opel",
  "Peugeot",
  "Hyundai",
  "Honda",
  "Togg",
  "Tesla",
  "Citroen",
  "Dacia",
];

export default function BrandSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedBrand,
}: Props) {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);
  const allBrands = useMemo(() => getAllBrands(), []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allBrands;
    return allBrands.filter((b) => b.toLowerCase().includes(q));
  }, [search, allBrands]);

  const handleSelect = (brand: string) => {
    onSelect(brand);
    onClose();
    setSearch("");
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
            className="fixed left-1/2 top-1/2 z-[10000] flex h-[85vh] w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-3xl border border-white/12 bg-[#09090b] p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-gradient-white text-lg font-extrabold uppercase tracking-wider">
                  Araç Markası Seçin
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Uyumlu kalıplarımızı listelemek için araç markanızı seçin.
                </p>
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
                placeholder="Marka ara... (Örn: BMW, Togg, Audi)"
                className="min-h-12 w-full rounded-xl border border-white/8 bg-white/[0.03] pl-11 pr-4 py-3 text-sm font-medium text-white placeholder-white/30 transition-all focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.2)] focus:outline-none"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto mt-6 pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {!search ? (
                <>
                  {/* Popular Brands Title */}
                  <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] mb-3">
                    Popüler Markalar
                  </h4>
                  {/* Popular Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                    {POPULAR_BRANDS.map((brand) => {
                      const isActive = selectedBrand === brand;
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => handleSelect(brand)}
                          className={`group flex flex-col items-center justify-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 ${
                            isActive
                              ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-white shadow-[0_0_15px_rgba(237,27,36,0.15)]"
                              : "bg-white/[0.02] border-white/5 text-white/80 hover:bg-white/[0.05] hover:border-white/15 hover:scale-[1.03]"
                          }`}
                        >
                          <BrandLogo
                            brand={brand}
                            className={`h-7 w-7 transition-colors duration-300 ${
                              isActive
                                ? "text-[var(--brand-red)]"
                                : "text-white/60 group-hover:text-white"
                            }`}
                          />
                          <span className="text-[11px] font-bold tracking-wider">{brand}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}

              {/* All Brands Section */}
              <h4 className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-[0.2em] mb-3">
                {search ? "Arama Sonuçları" : "Tüm Markalar"}
              </h4>

              {filteredBrands.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-6">
                  {filteredBrands.map((brand) => {
                    const isActive = selectedBrand === brand;
                    return (
                      <button
                        key={brand}
                        type="button"
                        onClick={() => handleSelect(brand)}
                        className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                          isActive
                            ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-white"
                            : "bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/[0.04] hover:border-white/10"
                        }`}
                      >
                        <BrandLogo brand={brand} className="h-5 w-5 text-white/50 shrink-0" />
                        <span className="text-xs font-semibold tracking-wide truncate">{brand}</span>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => handleSelect(OTHER_VEHICLE_BRAND)}
                    className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-white/20 bg-transparent text-white/60 hover:border-white/40 hover:text-white transition-all text-left"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[9px] font-bold">?</span>
                    <span className="text-xs font-semibold tracking-wide">Diğer / Listede yok</span>
                  </button>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-white/40 font-medium">Aradığınız marka bulunamadı.</p>
                  <button
                    type="button"
                    onClick={() => handleSelect(OTHER_VEHICLE_BRAND)}
                    className="mt-4 px-4 py-2 border border-white/10 rounded-xl bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition"
                  >
                    Diğer / Manuel Giriş Yap →
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
