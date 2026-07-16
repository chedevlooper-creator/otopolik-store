"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { GALLERY_ITEMS } from "@/lib/gallery-media";
import GalleryLightbox from "@/components/GalleryLightbox";
import { CameraIcon, VideoIcon, Grid3X3Icon } from "lucide-react";

const ITEMS_PER_PAGE = 24;

const FILTER_BTN =
  "inline-flex items-center gap-2 border px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] transition-colors";

export default function GalleryPage() {
  const [filter, setFilter] = useState<"all" | "photo" | "video">("all");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems = useMemo(() => {
    if (filter === "all") return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter((item) => item.type === filter);
  }, [filter]);

  const displayedItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const hasMore = filteredItems.length > visibleCount;

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleFilterChange = (newFilter: "all" | "photo" | "video") => {
    setFilter(newFilter);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <main className="min-h-screen bg-background py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 max-w-2xl">
          <span className="section-kicker">Gerçek uygulamalar</span>
          <h1 className="section-title mt-5 font-heading text-4xl font-bold text-white sm:text-5xl">
            Müşteri fotoğrafları & videoları
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/55 sm:text-base">
            6.000&apos;den fazla araç için ürettiğimiz premium EVA paspasların gerçek araç içi çekimleri.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleFilterChange("all")}
            className={`${FILTER_BTN} ${
              filter === "all"
                ? "border-sand bg-sand text-background"
                : "border-white/12 text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            <Grid3X3Icon className="h-3.5 w-3.5" />
            Tümü ({GALLERY_ITEMS.length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("photo")}
            className={`${FILTER_BTN} ${
              filter === "photo"
                ? "border-sand bg-sand text-background"
                : "border-white/12 text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            <CameraIcon className="h-3.5 w-3.5" />
            Fotoğraflar ({GALLERY_ITEMS.filter((i) => i.type === "photo").length})
          </button>
          <button
            type="button"
            onClick={() => handleFilterChange("video")}
            className={`${FILTER_BTN} ${
              filter === "video"
                ? "border-sand bg-sand text-background"
                : "border-white/12 text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            <VideoIcon className="h-3.5 w-3.5" />
            Videolar ({GALLERY_ITEMS.filter((i) => i.type === "video").length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3">
          {displayedItems.map((item, index) => (
            <button
              key={item.src}
              type="button"
              onClick={() => setLightboxIndex(index)}
              className="group relative overflow-hidden border border-white/[0.06] bg-surface text-left transition-colors hover:border-white/15"
            >
              {item.type === "photo" ? (
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src={item.src}
                    alt="OTO POLİK müşteri uygulaması"
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    loading="lazy"
                    fetchPriority="low"
                  />
                </div>
              ) : (
                <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden bg-black">
                  <video
                    src={item.src}
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="relative z-10 flex h-11 w-11 items-center justify-center border border-white/25 bg-black/50 text-white">
                    <VideoIcon className="h-5 w-5 fill-white" />
                  </span>
                </div>
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sand">
                  Büyütmek için tıklayın
                </span>
              </div>
            </button>
          ))}
        </div>

        {hasMore && (
          <div className="mt-14">
            <button
              type="button"
              onClick={handleShowMore}
              className="btn-press inline-flex min-h-12 items-center justify-center border border-white/15 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.14em] text-white transition hover:border-sand hover:text-sand"
            >
              Daha fazla göster ({filteredItems.length - visibleCount} kalan)
            </button>
          </div>
        )}
      </div>

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
