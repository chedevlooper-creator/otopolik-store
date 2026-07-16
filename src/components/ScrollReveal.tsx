"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Gecikme (ms) — kart ızgaralarında kademeli giriş için (IO fallback) */
  delay?: number;
};

function supportsScrollDrivenReveal() {
  return (
    typeof CSS !== "undefined" &&
    CSS.supports("(animation-timeline: view()) and (animation-range: entry)")
  );
}

/**
 * Scroll reveal — native view-timeline when supported; IntersectionObserver fallback.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("reveal-visible");
      return;
    }

    if (supportsScrollDrivenReveal()) {
      el.classList.add("reveal-sda");
      return;
    }

    const show = () => {
      el.classList.add("reveal-visible");
    };

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    const fallback = window.setTimeout(show, 900);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.clearTimeout(fallback);
            show();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -8% 0px" }
    );

    const frame = window.requestAnimationFrame(() => {
      observer.observe(el);
    });

    return () => {
      window.clearTimeout(fallback);
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
