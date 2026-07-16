"use client";

import Image from "next/image";
import { useState, useCallback, useEffect, useRef } from "react";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, Maximize2Icon } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  badge?: string;
  colorImage?: string;
};

const SWIPE_THRESHOLD = 50;

export default function ProductGallery({ images, alt, badge, colorImage }: Props) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lbActive, setLbActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  const gallery = colorImage
    ? [colorImage, ...images.filter((image) => image !== colorImage)]
    : images;

  const total = gallery.length;

  // ── Gallery navigation ──
  function goTo(i: number) {
    const next = Math.max(0, Math.min(total - 1, i));
    if (next === active) return;
    setAnimating(true);
    setActive(next);
    window.setTimeout(() => setAnimating(false), 220);
  }

  // ── Lightbox ──
  function openLightbox(i: number) {
    setLbActive(i);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }

  const goLb = useCallback(
    (dir: 1 | -1) => setLbActive((p) => (p + dir + total) % total),
    [total]
  );

  // Lightbox keyboard nav
  useEffect(() => {
    if (!lightboxOpen) return;
    function handler(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goLb(-1);
      if (e.key === "ArrowRight") goLb(1);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, goLb]);

  // ── Touch swipe ──
  function onTouchStart(e: React.TouchEvent) {
    setTouchStart(e.touches[0].clientX);
    setTouchDelta(0);
  }

  function onTouchMove(e: React.TouchEvent) {
    if (touchStart === null) return;
    setTouchDelta(e.touches[0].clientX - touchStart);
  }

  function onTouchEnd() {
    if (touchStart === null) return;
    if (Math.abs(touchDelta) > SWIPE_THRESHOLD) {
      if (touchDelta > 0) {
        lightboxOpen ? goLb(-1) : goTo(active - 1);
      } else {
        lightboxOpen ? goLb(1) : goTo(active + 1);
      }
    }
    setTouchStart(null);
    setTouchDelta(0);
  }

  const isDragging = touchStart !== null;
  const dragOffset = isDragging ? touchDelta : 0;
  const dragOpacity = isDragging
    ? Math.max(0, 1 - Math.abs(touchDelta) / 400)
    : 1;

  return (
    <>
      <div
        ref={galleryRef}
        className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row"
      >
        {/* ── Thumbnail rail ── */}
        <div
          role="tablist"
          aria-label="Ürün görselleri"
          className="order-2 flex max-w-full gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0"
        >
          {gallery.map((src, i) => {
            const isActive = active === i;
            return (
              <button
                key={src + i}
                type="button"
                role="tab"
                onClick={() => { goTo(i); }}
                aria-label={`${alt}, görsel ${i + 1} görüntüle`}
                aria-selected={isActive}
                aria-current={isActive}
                className={`group/thumb relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand sm:w-20 ${
                  isActive
                    ? "border-sand shadow-[3px_3px_0_0_var(--brand-red)]"
                    : "border-border hover:border-muted hover:-translate-y-0.5"
                }`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-contain p-1.5"
                />
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-red"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* ── Main image with touch swipe + lightbox trigger ── */}
        <div
          className="bg-eva-strong relative order-1 aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface sm:order-2 sm:aspect-square"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(211,189,150,0.12),transparent_62%)]" />
          <div
            className={`absolute inset-0 transition-opacity duration-200 ${
              animating ? "opacity-0" : "opacity-100"
            }`}
          >
            <button
              type="button"
              onClick={() => openLightbox(active)}
              aria-label="Görseli büyüt"
              className="group/main group/image absolute inset-0 block cursor-zoom-in"
            >
              <Image
                key={gallery[active]}
                src={gallery[active]}
                alt={alt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                className="object-contain p-4 transition-transform duration-500 group-hover/image:scale-105 sm:p-8"
                priority
              />
              {/* Zoom indicator */}
              <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-white/70 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/image:opacity-100 sm:bottom-4 sm:left-4">
                <Maximize2Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>

          {/* Dragging indicator line */}
          {isDragging && (
            <div
              className="pointer-events-none absolute inset-y-0 w-1 bg-sand/40"
              style={{
                left: `calc(50% + ${dragOffset}px)`,
                opacity: Math.min(1, Math.abs(dragOffset) / 100),
              }}
            />
          )}

          {badge && (
            <span className="spec-value absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-sand backdrop-blur-sm">
              {badge}
            </span>
          )}

          {/* Counter badge */}
          <div className="spec-value absolute bottom-3 right-3 rounded-full bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted backdrop-blur-sm">
            {active + 1} / {total}
          </div>

          {/* Nav arrows (desktop) — only show if >1 image */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(active - 1)}
                aria-label="Önceki görsel"
                className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-background/85 hover:scale-110 group-hover/image:opacity-100 sm:block"
              >
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                aria-label="Sonraki görsel"
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-background/60 p-1.5 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-background/85 hover:scale-110 sm:block"
              >
                <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Swipe hint — mobile only, shows briefly on first visit */}
          {total > 1 && (
            <div
              className="pointer-events-none absolute bottom-14 left-1/2 -translate-x-1/2 rounded-full bg-background/70 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-muted opacity-0 backdrop-blur-sm animate-swipe-hint sm:bottom-16"
              aria-hidden="true"
            >
              Kaydır
            </div>
          )}
        </div>
      </div>

      {/* ── LIGHTBOX OVERLAY ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/92 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Ürün görseli büyük"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Kapat"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 sm:right-6 sm:top-6"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Counter */}
          <div className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.12em] text-white/80 backdrop-blur-sm sm:top-7">
            {lbActive + 1} / {total}
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => goLb(-1)}
            aria-label="Önceki"
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 sm:block sm:left-5"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goLb(1)}
            aria-label="Sonraki"
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:scale-110 sm:block sm:right-5"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Image */}
          <div
            className="relative h-full w-full max-w-5xl p-4 sm:p-10"
            style={{ opacity: dragOpacity }}
          >
            <Image
              key={gallery[lbActive]}
              src={gallery[lbActive]}
              alt={alt}
              fill
              sizes="100vw"
              quality={95}
              className="object-contain transition-transform duration-300"
              priority
            />
          </div>

          {/* Thumbnail strip in lightbox */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 overflow-x-auto px-4 pb-4 sm:pb-6">
            {gallery.map((src, i) => (
              <button
                key={`lb-thumb-${i}`}
                type="button"
                onClick={() => setLbActive(i)}
                aria-label={`Görsel ${i + 1}`}
                className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 sm:h-14 sm:w-14 ${
                  lbActive === i
                    ? "border-sand shadow-[0_0_12px_rgba(225,201,162,0.35)]"
                    : "border-white/15 opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={src} alt="" fill sizes="56px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
