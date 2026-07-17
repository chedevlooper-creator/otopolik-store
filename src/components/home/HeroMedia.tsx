"use client";

import { useRef, useState } from "react";

/**
 * Hero arka plan videosu (lüks sedan kabin / paspas).
 * Chrome/Safari autoplay için muted + playsInline property şart.
 * prefers-reduced-motion UI animasyonlarını keser; sessiz dekoratif
 * hero videosunu engellemez (Windows'ta sık açık kalır).
 */
export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused) {
      video.muted = true;
      void video
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
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
        className={`absolute inset-0 h-full w-full object-cover object-[62%_50%] transition-opacity duration-700 md:object-center ${
          failed || !playing ? "opacity-90" : "opacity-0"
        }`}
      />
      <video
        ref={videoRef}
        src="/media/hero-video.mp4?v=2"
        poster="/media/hero-poster.jpg?v=2"
        muted
        loop
        playsInline
        preload="metadata"
        tabIndex={-1}
        aria-hidden="true"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setFailed(true)}
        className={`hero-media-video absolute inset-0 h-full w-full object-cover object-[62%_50%] transition-opacity duration-700 md:object-center ${
          failed ? "opacity-0" : "opacity-90"
        }`}
      />
      {!failed ? (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute bottom-4 right-4 z-20 rounded-full border border-white/25 bg-black/45 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-sm hover:border-white/45 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          aria-label={playing ? "Videoyu duraklat" : "Videoyu oynat"}
        >
          {playing ? "Duraklat" : "Oynat"}
        </button>
      ) : null}
    </>
  );
}
