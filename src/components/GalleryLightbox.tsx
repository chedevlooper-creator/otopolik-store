"use client";

import { useEffect, useState, useRef } from "react";
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon, Volume2Icon, VolumeXIcon } from "lucide-react";
import { GalleryItem } from "@/lib/gallery-media";

interface GalleryLightboxProps {
  items: GalleryItem[];
  initialIndex: number;
  onClose: () => void;
}

export default function GalleryLightbox({ items, initialIndex, onClose }: GalleryLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const currentItem = items[currentIndex];

  // Navigation handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    setIsPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent background scroll

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [currentIndex]);

  // Touch swiping handlers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50; // px
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Video play/pause toggle
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

  // Video mute/unmute toggle
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Reset video settings when index changes
  useEffect(() => {
    if (currentItem.type === "video" && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [currentIndex, currentItem.type]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/95 p-4 backdrop-blur-lg transition-opacity duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header controls */}
      <div className="flex w-full items-center justify-between border-b border-white/10 pb-4 text-white">
        <span className="text-sm font-medium tracking-wide text-white/70">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          aria-label="Kapat"
        >
          <XIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Main media wrapper */}
      <div className="relative flex h-[70vh] w-full max-w-4xl items-center justify-center">
        {/* Navigation buttons - Desktop */}
        <button
          onClick={handlePrev}
          className="absolute left-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:flex lg:-left-16"
          aria-label="Önceki Görsel"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-2 z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:flex lg:-right-16"
          aria-label="Sonraki Görsel"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>

        {/* Media content */}
        {currentItem.type === "photo" ? (
          <img
            src={currentItem.src}
            alt="Müşteri çekimi oto paspas"
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl transition-all duration-300"
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
            
            {/* Custom Video Control Overlay */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/60 px-4 py-2 text-white backdrop-blur">
              <button onClick={togglePlay} aria-label={isPlaying ? "Durdur" : "Oynat"}>
                {isPlaying ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
              </button>
              <span className="h-4 w-[1px] bg-white/20" />
              <button onClick={toggleMute} aria-label={isMuted ? "Sesi Aç" : "Sesi Kapat"}>
                {isMuted ? <VolumeXIcon className="h-4 w-4" /> : <Volume2Icon className="h-4 w-4" />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Mobile swipe indicator */}
      <div className="flex flex-col items-center gap-2 pb-4 text-center text-white/50">
        <p className="text-xs sm:hidden">Görseller arasında geçiş için kaydırın</p>
        <p className="hidden text-xs sm:block">Görseller arasında geçiş için klavyedeki yön tuşlarını (← →) kullanabilirsiniz</p>
      </div>
    </div>
  );
}
