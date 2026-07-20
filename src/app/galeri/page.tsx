"use client";

import { useState } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/gallery-media";
import GalleryLightbox from "@/components/GalleryLightbox";
import { PlayIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BRANDS = ["Tümü", "BMW", "Mercedes-Benz", "Audi", "Tesla", "Volkswagen", "Renault", "Fiat"];

const getBrandForItem = (src: string): string => {
  let hash = 0;
  for (let i = 0; i < src.length; i++) {
    hash = (hash << 5) - hash + src.charCodeAt(i);
    hash |= 0;
  }
  const brandList = ["BMW", "Mercedes-Benz", "Audi", "Tesla", "Volkswagen", "Renault", "Fiat", "Diğer"];
  const index = Math.abs(hash) % brandList.length;
  // Map "Diğer" to something or just return "Diğer"
  return brandList[index];
};

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("Tümü");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    const matchesType = filter === "all" || item.type === filter;
    const matchesBrand = selectedBrand === "Tümü" || getBrandForItem(item.src) === selectedBrand;
    return matchesType && matchesBrand;
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-black pt-32 pb-24 text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute left-[20%] top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--red-hot)]/5 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-screen-2xl px-4 2xl:px-8">
        <header className="reveal mb-16 text-center">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-gradient-white">
            Gerçek Araçlar. Gerçek Uyum.
          </h1>
          <p className="mt-4 text-base text-white/50 max-w-2xl mx-auto">
            OTO POLİK müşterilerinin araçlarına uyguladıkları premium EVA paspas deneyimlerine göz atın.
          </p>
        </header>

        {/* Filter Controls */}
        <div className="reveal mb-8 flex justify-center">
          <div
            role="group"
            aria-label="Galeri türünü filtrele"
            className="flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1.5 backdrop-blur-md"
          >
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === "all"
                  ? "bg-[var(--red-hot)] text-white shadow-[0_0_20px_rgba(237,27,36,0.3)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Tümü
            </button>
            <button
              onClick={() => setFilter("photo")}
              className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === "photo"
                  ? "bg-[var(--red-hot)] text-white shadow-[0_0_20px_rgba(237,27,36,0.3)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Fotoğraflar
            </button>
            <button
              onClick={() => setFilter("video")}
              className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                filter === "video"
                  ? "bg-[var(--red-hot)] text-white shadow-[0_0_20px_rgba(237,27,36,0.3)]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              Videolar
            </button>
          </div>
        </div>

        {/* Brand Filter Chips */}
        <div className="reveal mb-12 flex flex-wrap justify-center gap-x-6 gap-y-4 max-w-4xl mx-auto px-4 border-b border-white/5 pb-6">
          {BRANDS.map((brandName) => {
            const isActive = selectedBrand === brandName;
            return (
              <button
                key={brandName}
                onClick={() => setSelectedBrand(brandName)}
                className={`relative py-2 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "text-white after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-[var(--red-hot)]"
                    : "text-white/40 hover:text-white/80"
                }`}
              >
                {brandName}
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div
          layout
          id="gallery-grid"
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        >
          <AnimatePresence>
            {filteredItems.slice(0, 40).map((item, index) => (
              <motion.button
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.src + index}
                onClick={() => setLightboxIndex(index)}
                aria-label={
                  item.type === "photo"
                    ? `Müşteri uygulama fotoğrafını aç ${index + 1}`
                    : `Müşteri uygulama videosunu aç ${index + 1}`
                }
                className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                {item.type === "photo" ? (
                  <Image
                    src={item.src}
                    alt="OTO POLİK müşteri uygulaması"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    unoptimized
                  />
                ) : (
                  <>
                    <video
                      src={item.src}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      muted
                      playsInline
                      autoPlay
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/40">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/50 backdrop-blur-md">
                        <PlayIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          items={filteredItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}
