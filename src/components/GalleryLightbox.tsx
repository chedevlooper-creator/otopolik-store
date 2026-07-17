"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlayIcon,
  PauseIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";
import { GalleryItem } from "@/lib/gallery-media";

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function GalleryLightbox({
  items,
  initialIndex,
  onClose,
}: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentItem = items[currentIndex] ?? items[0];
  const [direction, setDirection] = useState(0); // -1 = left, 1 = right
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setIsZoomed(false);
  }, [currentIndex]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handlePrev = useCallback(() => {
    if (items.length < 2) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setIsPlaying(false);
  }, [items.length]);

  const handleNext = useCallback(() => {
    if (items.length < 2) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setIsPlaying(false);
  }, [items.length]);

  useEffect(() => {
    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlePrev();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter(
        (element) =>
          element.getAttribute("aria-hidden") !== "true" &&
          element.tabIndex >= 0
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus();
    };
  }, [handleNext, handlePrev]);

  const handleTouchStart = (event: React.TouchEvent) => {
    const startX = event.targetTouches[0].clientX;
    touchStartX.current = startX;
    touchEndX.current = startX;
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    touchEndX.current = event.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) handleNext();
    else if (distance < -minSwipeDistance) handlePrev();
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setIsPlaying(false));
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (currentItem?.type !== "video" || !video) return;

    video.load();
    void video.play().catch(() => setIsPlaying(false));
  }, [currentIndex, currentItem?.type]);

  if (!currentItem) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gallery-lightbox-title"
      aria-describedby="gallery-lightbox-help"
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-lg transition-opacity duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h2 id="gallery-lightbox-title" className="sr-only">
        Müşteri uygulaması medya görüntüleyici
      </h2>

      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4 text-white">
        <span
          className="text-sm font-medium tracking-wide text-white/70"
          aria-live="polite"
          aria-atomic="true"
        >
          {currentIndex + 1} / {items.length}
        </span>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => onCloseRef.current()}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label="Galeri görüntüleyiciyi kapat"
        >
          <XIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex h-[70vh] w-full max-w-4xl items-center justify-center">
        <button
          type="button"
          onClick={handlePrev}
          disabled={items.length < 2}
          className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 sm:left-2 sm:h-12 sm:w-12 lg:-left-16"
          aria-label="Önceki medya"
        >
          <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={items.length < 2}
          className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-30 sm:right-2 sm:h-12 sm:w-12 lg:-right-16"
          aria-label="Sonraki medya"
        >
          <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
        </button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full w-full"
          >
        {currentItem.type === "photo" ? (
          <div className="relative h-full w-full overflow-hidden">
            <motion.div
              animate={{ scale: isZoomed ? 2 : 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              drag={isZoomed}
              dragConstraints={{ left: -250, right: 250, top: -250, bottom: 250 }}
              dragElastic={0.15}
              onClick={() => setIsZoomed((prev) => !prev)}
              className={`relative h-full w-full transition-shadow duration-300 ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            >
              <Image
                src={currentItem.src}
                alt="Müşteri aracındaki OTO POLİK paspas uygulaması"
                fill
                sizes="100vw"
                priority
                className="pointer-events-none object-contain px-11 py-2 drop-shadow-2xl sm:px-16"
              />
            </motion.div>
          </div>
        ) : (
          <div
            role="group"
            aria-label="Müşteri uygulama videosu"
            className="relative max-h-full max-w-full overflow-hidden rounded-lg bg-black shadow-2xl"
          >
            <video
              ref={videoRef}
              src={currentItem.src}
              loop
              muted={isMuted}
              playsInline
              autoPlay
              tabIndex={-1}
              className="max-h-[70vh] max-w-full object-contain"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/75 p-1.5 text-white backdrop-blur">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Videoyu durdur" : "Videoyu oynat"}
                className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isPlaying ? (
                  <PauseIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PlayIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              <span className="h-6 w-px bg-white/20" aria-hidden="true" />
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? "Videonun sesini aç" : "Videonun sesini kapat"}
                className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {isMuted ? (
                  <VolumeXIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Volume2Icon className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div
        id="gallery-lightbox-help"
        className="flex flex-col items-center gap-2 pb-4 text-center text-white/50"
      >
        <p className="text-xs sm:hidden">Görseller arasında geçiş için kaydırın veya okları kullanın</p>
        <p className="hidden text-xs sm:block">Görseller arasında geçiş için klavyedeki yön tuşlarını (← →) kullanabilirsiniz</p>
      </div>
    </div>
  );
}
