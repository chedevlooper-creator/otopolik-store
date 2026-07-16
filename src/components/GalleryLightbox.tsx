"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { GalleryItem } from "@/lib/gallery-media";

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

function supportsClosedBy() {
  return typeof HTMLDialogElement !== "undefined" && "closedBy" in HTMLDialogElement.prototype;
}

export default function GalleryLightbox({ items, initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const onCloseRef = useRef(onClose);
  const handlePrevRef = useRef<() => void>(() => {});
  const handleNextRef = useRef<() => void>(() => {});

  const currentItem = items[currentIndex] ?? items[0];

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setIsPlaying(true);
  }, [items.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  }, [items.length]);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    handlePrevRef.current = handlePrev;
    handleNextRef.current = handleNext;
  }, [handlePrev, handleNext]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.setAttribute("closedby", "any");
    if (!dialog.open) dialog.showModal();

    let ignoreClose = false;
    const onDialogClose = () => {
      if (!ignoreClose) onCloseRef.current();
    };
    dialog.addEventListener("close", onDialogClose);

    let onBackdropClick: ((event: MouseEvent) => void) | undefined;
    if (!supportsClosedBy()) {
      onBackdropClick = (event: MouseEvent) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const inContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (inContent) return;
        dialog.close();
      };
      dialog.addEventListener("click", onBackdropClick);
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevRef.current();
      if (e.key === "ArrowRight") handleNextRef.current();
    };
    dialog.addEventListener("keydown", onKeyDown);

    return () => {
      ignoreClose = true;
      dialog.removeEventListener("close", onDialogClose);
      dialog.removeEventListener("keydown", onKeyDown);
      if (onBackdropClick) dialog.removeEventListener("click", onBackdropClick);
      if (dialog.open) dialog.close();
    };
  }, []);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0]?.clientX ?? 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (currentItem?.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    void video.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [currentIndex, currentItem?.type]);

  if (!currentItem) return null;

  return (
    <dialog
      ref={dialogRef}
      aria-label="Galeri görüntüleyici"
      className="gallery-lightbox-dialog m-0 h-full max-h-none w-full max-w-none border-0 bg-transparent p-0"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex h-full min-h-[100dvh] w-full flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-lg">
        <div className="flex w-full items-center justify-between border-b border-white/10 pb-4 text-white">
          <span className="text-sm font-medium tracking-wide text-white/70">
            {currentIndex + 1} / {items.length}
          </span>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Kapat"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative flex h-[70vh] w-full max-w-4xl items-center justify-center">
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:flex lg:-left-16"
            aria-label="Önceki Görsel"
          >
            <ChevronLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:flex lg:-right-16"
            aria-label="Sonraki Görsel"
          >
            <ChevronRightIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {currentItem.type === "photo" ? (
            // eslint-disable-next-line @next/next/no-img-element -- gallery URLs are dynamic scraped media
            <img
              src={currentItem.src}
              alt="Müşteri çekimi oto paspas"
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />
          ) : (
            <div className="relative max-h-full max-w-full overflow-hidden rounded-lg bg-black shadow-2xl">
              <video
                ref={videoRef}
                src={currentItem.src}
                loop
                muted={isMuted}
                playsInline
                autoPlay
                className="max-h-[70vh] max-w-full object-contain"
                onClick={togglePlay}
              />
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur">
                <button type="button" onClick={togglePlay} aria-label={isPlaying ? "Durdur" : "Oynat"}>
                  {isPlaying ? <PauseIcon className="h-4 w-4" aria-hidden="true" /> : <PlayIcon className="h-4 w-4" aria-hidden="true" />}
                </button>
                <span className="h-4 w-px bg-white/20" aria-hidden="true" />
                <button type="button" onClick={toggleMute} aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}>
                  {isMuted ? <VolumeXIcon className="h-4 w-4" aria-hidden="true" /> : <Volume2Icon className="h-4 w-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 pb-4 text-center text-white/50">
          <p className="text-xs sm:hidden">Görseller arasında geçiş için kaydırın</p>
          <p className="hidden text-xs sm:block">
            Görseller arasında geçiş için klavyedeki yön tuşlarını (← →) kullanabilirsiniz
          </p>
        </div>
      </div>
    </dialog>
  );
}
