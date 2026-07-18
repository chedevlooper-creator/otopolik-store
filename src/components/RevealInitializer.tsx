"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site geneli scroll-reveal — .reveal öğelerine görünür olduklarında
 * .reveal-visible ekler (globals.css). ShowroomRevealInitializer'ın
 * (.rev/.on, yalnızca ana sayfa) site geneli eşdeğeri.
 * pathname değiştikçe yeniden çalışır, çünkü SiteChrome sayfalar arası
 * kalıcıdır ve yeni rotanın .reveal öğeleri ilk mount'ta gözlemlenmemiş olur.
 */
export default function RevealInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("reveal-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const frame = requestAnimationFrame(() => {
      document
        .querySelectorAll(".reveal:not(.reveal-visible)")
        .forEach((el) => io.observe(el));
    });

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, [pathname]);

  return null;
}
