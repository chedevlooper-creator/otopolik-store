"use client";

import { useEffect, useRef, useState } from "react";

type NavigatorWithConnection = Navigator & {
  connection?: {
    saveData?: boolean;
  };
};

type WindowWithOptionalIdleCallback = {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/**
 * Poster ilk boyamayı ve LCP'yi taşır. Ağır video yalnızca tarayıcı
 * boşta kaldığında, veri tasarrufu ve reduced-motion kapalıysa yüklenir.
 */
export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const saveData = (navigator as NavigatorWithConnection).connection?.saveData;
    if (prefersReducedMotion || saveData) return;

    const loadVideo = () => {
      video.src = "/media/hero-video.mp4";
      video.load();
      void video.play().catch(() => undefined);
    };

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const idleWindow = window as unknown as WindowWithOptionalIdleCallback;

    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(loadVideo, { timeout: 1800 });
    } else {
      timeoutId = setTimeout(loadVideo, 700);
    }

    return () => {
      if (idleId !== undefined) {
        idleWindow.cancelIdleCallback?.(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      muted
      loop
      playsInline
      preload="none"
      tabIndex={-1}
      aria-hidden="true"
      onCanPlay={() => setReady(true)}
      className={`hero-media-video absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
        ready ? "opacity-80" : "opacity-0"
      }`}
    />
  );
}
