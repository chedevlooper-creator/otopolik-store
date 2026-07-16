"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/gallery-media";
import GalleryLightbox from "@/components/GalleryLightbox";
import { CameraIcon, VideoIcon, Grid3X3Icon } from "lucide-react";

const ITEMS_PER_PAGE = 24;

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Filter items based on selected tab
  const filteredItems = useMemo(() => {
    if (filter === "all") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.type === filter);
  }, [filter]);

  // Items to display in the current grid (paginated)
  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = filteredItems.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleFilterChange = (newFilter: "all" | "photo" | "video") => {
    setFilter(newFilter);
    setVisibleCount(ITEMS_PER_PAGE); // Reset pagination
  };

  return (
    <main className="min-h-screen bg-background py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="section-kicker text-sand text-xs font-semibold uppercase tracking-[0.2em]">
            Gerçek Uygulamalar
          </span>
          <h1 className="section-title mt-4 font-heading text-4xl font-extrabold text-white sm:text-5xl">
            Müşteri Fotoğrafları & Videoları
          </h1>
          <p className="section-copy mx-auto mt-4 max-w-2xl text-base text-white/60">
            6.000&apos;den fazla araç için ürettiğimiz premium EVA paspasların gerçek araç içi çekimleri. Kaliteyi ve uyumu kendi gözlerinizle görün.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-white/10 bg-surface/50 p-1 backdrop-blur-sm">
            <button
              onClick={() => handleFilterChange("all")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                filter === "all"
                  ? "bg-white text-background shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Grid3X3Icon className="h-3.5 w-3.5" />
              Tümü ({GALLERY_ITEMS.length})
            </button>
            <button
              onClick={() => handleFilterChange("photo")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                filter === "photo"
                  ? "bg-white text-background shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <CameraIcon className="h-3.5 w-3.5" />
              Fotoğraflar ({GALLERY_ITEMS.filter((i) => i.type === "photo").length})
            </button>
            <button
              onClick={() => handleFilterChange("video")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                filter === "video"
                  ? "bg-white text-background shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <VideoIcon className="h-3.5 w-3.5" />
              Videolar ({GALLERY_ITEMS.filter((i) => i.type === "video").length})
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
          {displayedItems.map((item, index) => {
            return (
              <div
                key={item.src}
                onClick={() => setLightboxIndex(index)}
                className="group relative cursor-pointer overflow-hidden rounded-xl border border-white/5 bg-surface transition-all duration-300 hover:border-white/10 hover:shadow-lg"
              >
                {item.type === "photo" ? (
                  <div className="aspect-[4/5] relative w-full overflow-hidden">
                    <Image
                      src={item.src}
                      alt="Oto Polik Müşteri Çekimi"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/5] relative w-full overflow-hidden bg-black flex items-center justify-center">
                    <video
                      src={item.src}
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-white/45">
                      <VideoIcon className="h-5 w-5 fill-white" />
                    </span>
                  </div>
                )}
                {/* Hover overlay detail */}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sand">
                    Büyütmek için tıklayın
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-16 text-center">
            <button
              onClick={handleShowMore}
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/10 bg-surface px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/5 hover:border-white/20 active:scale-95 animate-fade-in"
            >
              Daha Fazla Göster ({filteredItems.length - visibleCount} kalan)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <GalleryLightbox
          items={filteredItems}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </main>
  );
}
