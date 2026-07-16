"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Hero arka plan videosu.
 * Chrome/Safari autoplay için muted + playsInline property şart.
 * prefers-reduced-motion UI animasyonlarını keser; sessiz dekoratif
 * hero videosunu engellemez (Windows'ta sık açık kalır).
 */
export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

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
        if (!cancelled) setPlaying(true);
      } catch {
        // Autoplay engeli — kullanıcı etkileşiminde tekrar
      }
    };

    void tryPlay();
    video.addEventListener("loadeddata", () => void tryPlay());
    video.addEventListener("canplay", () => void tryPlay());
    video.addEventListener("playing", () => setPlaying(true));
    video.addEventListener("pause", () => setPlaying(false));
    video.addEventListener("error", () => setFailed(true));

    const onVisible = () => {
      if (document.visibilityState === "visible") void tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);

    const retries = [200, 600, 1500, 3000].map((ms) =>
      window.setTimeout(() => void tryPlay(), ms)
    );

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

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused) {
      video.muted = true;
      void video.play().then(() => setPlaying(true)).catch(() => undefined);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero-poster.jpg?v=2"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        width={1920}
        height={1080}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          failed || !playing ? "opacity-80" : "opacity-0"
        }`}
      />
      <video
        ref={videoRef}
        src="/media/hero-video.mp4?v=2"
        poster="/media/hero-poster.jpg?v=2"
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
        className={`hero-media-video absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          failed ? "opacity-0" : "opacity-80"
        }`}
      />
      {!failed ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute bottom-4 right-4 z-20 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm hover:border-white/45 hover:text-white"
          aria-label={playing ? "Videoyu duraklat" : "Videoyu oynat"}
        >
          {playing ? "Duraklat" : "Oynat"}
        </button>
      ) : null}
    </>
  );
}
