"use client";

import { useEffect, useRef, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

/**
 * Hero arka plan videosu.
 * Chrome/Safari autoplay için muted + playsInline property şart.
 * prefers-reduced-motion açıksa video yerine poster gösterir (display:none yok).
 */
export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [usePosterOnly, setUsePosterOnly] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const saveData = Boolean(
      (navigator as NavigatorWithConnection).connection?.saveData
    );

    if (prefersReducedMotion || saveData) {
      setUsePosterOnly(true);
      video.pause();
      return;
    }

    // Autoplay politikası: attribute yetmez, property zorunlu
    video.defaultMuted = true;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");

    let cancelled = false;

    const tryPlay = async () => {
      if (cancelled) return;
      try {
        video.muted = true;
        await video.play();
      } catch {
        // Sessizce dene; kullanıcı etkileşiminde tekrar
      }
    };

    void tryPlay();
    video.addEventListener("loadeddata", () => void tryPlay());
    video.addEventListener("canplay", () => void tryPlay());
    video.addEventListener("error", () => setFailed(true));

    const onVisible = () => {
      if (document.visibilityState === "visible") void tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    const retries = [200, 600, 1500, 3000].map((ms) =>
      window.setTimeout(() => void tryPlay(), ms)
    );

    // İlk kullanıcı etkileşiminde garanti play (autoplay engeli kırılır)
    const unlock = () => {
      void tryPlay();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true, passive: true });
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      cancelled = true;
      retries.forEach((id) => window.clearTimeout(id));
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const showPoster = usePosterOnly || failed;

  return (
    <>
      {/* Poster her zaman altta — video yüklenene / oynamayana kadar boş ekran olmasın */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero-poster.jpg"
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          showPoster ? "opacity-80" : "opacity-0"
        }`}
      />
      {!usePosterOnly ? (
        <video
          ref={videoRef}
          src="/media/hero-video.mp4"
          poster="/media/hero-poster.jpg"
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          tabIndex={-1}
          aria-hidden="true"
          className={`hero-media-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            failed ? "opacity-0" : "opacity-80"
          }`}
        />
      ) : null}
    </>
  );
}
