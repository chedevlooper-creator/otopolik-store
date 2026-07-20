"use client";

import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon, SearchIcon } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (year: string) => void;
  selectedYear: string;
  years: string[];
};

export default function YearSelectorModal({
  isOpen,
  onClose,
  onSelect,
  selectedYear,
  years,
}: Props) {
  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const filteredYears = useMemo(() => {
    const q = search.trim();
    if (!q) return years;
    return years.filter((y) => y.includes(q));
  }, [search, years]);

  const handleSelect = (year: string) => {
    onSelect(year);
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
            className="fixed left-1/2 top-1/2 z-[10000] flex h-[80vh] w-[92vw] max-w-md flex-col rounded-3xl border border-border bg-surface p-6 shadow-2xl backdrop-blur-xl sm:p-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div>
                <h3 className="text-gradient-white text-lg font-extrabold uppercase tracking-wider">
                  Model Yılı Seçin
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Aracınızın üretim yılını listeden seçin.
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
                inputMode="numeric"
                maxLength={4}
                value={search}
                onChange={(e) => setSearch(e.target.value.replace(/\D/g, ""))}
                placeholder="Yıl ara… (Örn: 2022, 2015)"
                className="min-h-12 w-full rounded-xl border border-border bg-black/40 pl-11 pr-4 py-3 text-sm font-medium text-white placeholder-white/30 transition-all focus:border-[var(--brand-red)] focus:shadow-[0_0_15px_rgba(237,27,36,0.2)] focus:outline-none"
              />
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto mt-6 pr-1 scrollbar-thin scrollbar-thumb-white/10">
              {filteredYears.length > 0 ? (
                <div className="grid grid-cols-4 gap-2.5 pb-6">
                  {filteredYears.map((year) => {
                    const isActive = selectedYear === year;
                    return (
                      <button
                        key={year}
                        type="button"
                        onClick={() => handleSelect(year)}
                        className={`flex h-11 items-center justify-center rounded-xl border text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-[var(--brand-red)]/10 border-[var(--brand-red)] text-white shadow-[0_0_10px_rgba(237,27,36,0.15)]"
                            : "bg-white/[0.01] border-white/5 text-white/70 hover:bg-white/[0.04] hover:border-white/10 hover:scale-[1.05]"
                        }`}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <p className="text-sm text-white/40 font-medium">Aradığınız yıl bulunamadı.</p>
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
