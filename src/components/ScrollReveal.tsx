"use client";

import { useEffect, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Gecikme (ms) — kart ızgaralarında kademeli giriş için */
  delay?: number;
};

/**
 * Scroll reveal — production'da hydrate gecikmesinde içerik gizli kalmasın diye
 * güvenlik zaman aşımı ve düşük threshold kullanır.
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

    const show = () => {
      el.classList.add("reveal-visible");
    };

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      show();
      return;
    }

    // Hydrate / layout sonrası hâlâ görünür değilse içeriği kilitleme
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

    // Layout settle — IO'nun viewport'u doğru okuması için
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
