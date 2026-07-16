"use client";

import { useEffect } from "react";

/**
 * Enables scroll-aware FABs via CSS container scroll-state when supported.
 * Falls back to IntersectionObserver + html class toggles otherwise.
 * Sentinels are separate elements placed by SiteChrome.
 */
export default function ScrollStateRoot() {
  useEffect(() => {
    if (CSS.supports("container-type", "scroll-state")) return;

    const top = document.querySelector(".scroll-sentinel-top");
    const bottom = document.querySelector(".scroll-sentinel-bottom");
    if (!top || !bottom) return;

    const root = document.documentElement;

    const topObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        root.classList.toggle("scrolled-down", !entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const bottomObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        root.classList.toggle("scrolled-bottom", entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px 80px 0px" }
    );

    topObserver.observe(top);
    bottomObserver.observe(bottom);

    return () => {
      topObserver.disconnect();
      bottomObserver.disconnect();
      root.classList.remove("scrolled-down", "scrolled-bottom");
    };
  }, []);

  return null;
}
