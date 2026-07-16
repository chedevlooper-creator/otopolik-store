"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis tabanlı yumuşak kaydırma. prefers-reduced-motion altında hiç başlamaz;
 * modal/lightbox'ların body overflow kilidi Lenis'in native scroll'u üzerinde
 * çalışmaya devam eder (Lenis transform değil window scroll kullanır).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.12,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      anchors: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(raf);
    };
    frame = window.requestAnimationFrame(raf);

    return () => {
      window.cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
