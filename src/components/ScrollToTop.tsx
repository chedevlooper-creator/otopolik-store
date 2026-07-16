"use client";

import { ArrowUpIcon } from "lucide-react";

/**
 * Back-to-top — visibility via CSS scroll-state / .scrolled-down fallback.
 */
export default function ScrollToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Sayfanın başına dön"
      className="scroll-aware-fab fixed bottom-20 right-4 z-40 flex h-10 w-10 items-center justify-center border border-border bg-background/90 text-muted backdrop-blur-md transition-[opacity,translate,visibility] duration-200 hover:border-sand hover:text-sand sm:bottom-24 sm:right-5 sm:h-11 sm:w-11"
    >
      <ArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
    </button>
  );
}
