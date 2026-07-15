"use client";

import { useEffect, useRef } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    if (prefersReducedMotion || saveData) return;

    const tryPlay = () => {
      void video.play().catch(() => undefined);
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    // Bazı mobil tarayıcılarda ilk play sessizce başarısız oluyor
    const retry = window.setTimeout(tryPlay, 400);

    return () => {
      window.clearTimeout(retry);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      src="/media/hero-video.mp4"
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      tabIndex={-1}
      aria-hidden="true"
      className="hero-media-video absolute inset-0 h-full w-full object-cover opacity-80"
    />
  );
}
