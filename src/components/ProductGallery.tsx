"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, Maximize2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  images: string[];
  alt: string;
  badge?: string;
  colorImage?: string;
};

const SWIPE_THRESHOLD = 50;
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ProductVariantGalleryContextValue = {
  selectedImage?: string;
  selectImage: (image: string) => void;
};

const ProductVariantGalleryContext =
  createContext<ProductVariantGalleryContextValue | null>(null);

export function ProductVariantGalleryProvider({
  children,
  initialImage,
}: {
  children: ReactNode;
  initialImage: string;
}) {
  const [selectedImage, selectImage] = useState(initialImage);

  return (
    <ProductVariantGalleryContext.Provider value={{ selectedImage, selectImage }}>
      {children}
    </ProductVariantGalleryContext.Provider>
  );
}

export function useProductVariantGallery() {
  return useContext(ProductVariantGalleryContext);
}

function getKeyboardTarget(key: string, current: number, total: number) {
  if (total < 1) return null;
  if (key === "ArrowRight" || key === "ArrowDown") return (current + 1) % total;
  if (key === "ArrowLeft" || key === "ArrowUp") return (current - 1 + total) % total;
  if (key === "Home") return 0;
  if (key === "End") return total - 1;
  return null;
}

export default function ProductGallery(props: Props) {
  const variantGallery = useProductVariantGallery();
  const selectedImage = variantGallery?.selectedImage || props.colorImage;

  return (
    <ProductGalleryView
      key={selectedImage ?? "default-product-gallery"}
      {...props}
      colorImage={selectedImage}
    />
  );
}

function ProductGalleryView({ images, alt, badge, colorImage }: Props) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lbActive, setLbActive] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchDelta, setTouchDelta] = useState(0);
  
  // Loupe Zoom States & Handler
  const [showLoupe, setShowLoupe] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 0, y: 0 });
  const [bgPos, setBgPos] = useState("50% 50%");

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setLoupePos({ x, y });
    setBgPos(`${px}% ${py}%`);
  }

  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightboxThumbnailRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightboxDialogRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const galleryId = useId();
  const panelId = `${galleryId}-panel`;
  const lightboxPanelId = `${galleryId}-lightbox-panel`;

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
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setLbActive(i);
    setLightboxOpen(true);
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const goLb = useCallback(
    (dir: 1 | -1) => setLbActive((p) => (p + dir + total) % total),
    [total]
  );

  function handleThumbnailKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    const next = getKeyboardTarget(event.key, index, total);
    if (next === null) return;
    event.preventDefault();
    goTo(next);
    requestAnimationFrame(() => thumbnailRefs.current[next]?.focus());
  }

  function handleLightboxThumbnailKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number
  ) {
    const next = getKeyboardTarget(event.key, index, total);
    if (next === null) return;
    event.preventDefault();
    event.stopPropagation();
    setLbActive(next);
    requestAnimationFrame(() => lightboxThumbnailRefs.current[next]?.focus());
  }

  // Lightbox keyboard navigation and focus containment
  useEffect(() => {
    if (!lightboxOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => lightboxCloseRef.current?.focus());

    function handler(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goLb(-1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goLb(1);
        return;
      }
      if (event.key !== "Tab" || !lightboxDialogRef.current) return;

      const focusable = Array.from(
        lightboxDialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.tabIndex >= 0
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        lightboxDialogRef.current.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handler);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = previousOverflow;
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [closeLightbox, lightboxOpen, goLb]);

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
        if (lightboxOpen) goLb(-1);
        else goTo(active - 1);
      } else {
        if (lightboxOpen) goLb(1);
        else goTo(active + 1);
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
          className="order-2 flex max-w-full gap-3 overflow-x-auto pb-1 sm:order-1 sm:max-h-[70vh] sm:flex-col sm:overflow-x-hidden sm:overflow-y-auto sm:pb-0 sm:pr-1"
        >
          {gallery.map((src, i) => {
            const isActive = active === i;
            return (
              <button
                key={src + i}
                ref={(node) => {
                  thumbnailRefs.current[i] = node;
                }}
                id={`${galleryId}-tab-${i}`}
                type="button"
                role="tab"
                onClick={() => { goTo(i); }}
                onKeyDown={(event) => handleThumbnailKeyDown(event, i)}
                aria-label={`${alt}, görsel ${i + 1} görüntüle`}
                aria-selected={isActive}
                aria-controls={panelId}
                tabIndex={isActive ? 0 : -1}
                className={`group/thumb relative aspect-square w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:w-20 ${
                  isActive
                    ? "border-white shadow-[3px_3px_0_0_var(--brand-red)]"
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
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${galleryId}-tab-${active}`}
          className="group/gallery bg-eva-strong relative order-1 aspect-[4/3] min-w-0 flex-1 overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface sm:order-2 sm:aspect-square"
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
              onMouseEnter={() => setShowLoupe(true)}
              onMouseLeave={() => setShowLoupe(false)}
              onMouseMove={handleMouseMove}
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
              
              {/* Premium Cursor-Follow Loupe (Desktop) */}
              <AnimatePresence>
                {showLoupe && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    className="pointer-events-none absolute z-20 hidden h-32 w-32 rounded-full border border-white/20 shadow-[0_0_24px_rgba(0,0,0,0.6)] overflow-hidden md:block"
                    style={{
                      left: loupePos.x - 64,
                      top: loupePos.y - 64,
                      backgroundImage: `url(${gallery[active]})`,
                      backgroundPosition: bgPos,
                      backgroundSize: "280% 280%",
                      backgroundRepeat: "no-repeat",
                      backgroundColor: "#080808",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Zoom indicator */}
              <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-white/70 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover/image:opacity-100 sm:bottom-4 sm:left-4">
                <Maximize2Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          </div>

          {/* Cam tabakası — görsel vitrin camının arkasındaymış gibi durur */}
          <div aria-hidden="true" className="glass-pane absolute inset-0 rounded-[1.5rem]" />

          {/* Dragging indicator line */}
          {isDragging && (
            <div
              className="pointer-events-none absolute inset-y-0 w-1 bg-white/40"
              style={{
                left: `calc(50% + ${dragOffset}px)`,
                opacity: Math.min(1, Math.abs(dragOffset) / 100),
              }}
            />
          )}

          {badge && (
            <span className="spec-value absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm">
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
                disabled={active === 0}
                aria-label="Önceki görsel"
                className="absolute left-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/75 text-white opacity-70 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-background/90 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:flex sm:group-hover/gallery:opacity-100"
              >
                <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => goTo(active + 1)}
                disabled={active === total - 1}
                aria-label="Sonraki görsel"
                className="absolute right-2 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-background/75 text-white opacity-70 backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-background/90 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:flex sm:group-hover/gallery:opacity-100"
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
          ref={lightboxDialogRef}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/92 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${galleryId}-lightbox-title`}
          aria-describedby={`${galleryId}-lightbox-counter`}
          tabIndex={-1}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <h2 id={`${galleryId}-lightbox-title`} className="sr-only">
            {alt} büyük görsel görüntüleyici
          </h2>

          {/* Close button */}
          <button
            ref={lightboxCloseRef}
            type="button"
            onClick={closeLightbox}
            aria-label="Büyük görseli kapat"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6 sm:top-6"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Counter */}
          <div
            id={`${galleryId}-lightbox-counter`}
            aria-live="polite"
            aria-atomic="true"
            className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-[0.12em] text-white/80 backdrop-blur-sm sm:top-7"
          >
            {lbActive + 1} / {total}
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={() => goLb(-1)}
            aria-label="Önceki"
            className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex sm:left-5"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => goLb(1)}
            aria-label="Sonraki"
            className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex sm:right-5"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Image */}
          <div
            id={lightboxPanelId}
            role="tabpanel"
            aria-labelledby={`${galleryId}-lightbox-tab-${lbActive}`}
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
          <div className="absolute bottom-0 left-0 right-0 overflow-x-auto pb-4 sm:pb-6">
            <div
              role="tablist"
              aria-label="Büyük ürün görselleri"
              className="mx-auto flex w-max min-w-full justify-center gap-2 px-4"
            >
              {gallery.map((src, i) => {
                const isSelected = lbActive === i;
                return (
                  <button
                    key={`lb-thumb-${i}`}
                    ref={(node) => {
                      lightboxThumbnailRefs.current[i] = node;
                    }}
                    id={`${galleryId}-lightbox-tab-${i}`}
                    type="button"
                    role="tab"
                    onClick={() => setLbActive(i)}
                    onKeyDown={(event) => handleLightboxThumbnailKeyDown(event, i)}
                    aria-label={`Görsel ${i + 1}`}
                    aria-selected={isSelected}
                    aria-controls={lightboxPanelId}
                    tabIndex={isSelected ? 0 : -1}
                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:h-14 sm:w-14 ${
                      isSelected
                        ? "border-white shadow-[0_0_12px_rgba(255,255,255,0.35)]"
                        : "border-white/15 opacity-50 hover:opacity-80"
                    }`}
                  >
                    <Image src={src} alt="" fill sizes="56px" className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
