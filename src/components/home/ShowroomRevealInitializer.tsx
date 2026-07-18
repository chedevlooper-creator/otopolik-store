"use client";

import { useEffect } from "react";

export default function ShowroomRevealInitializer() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".rev").forEach((el) => el.classList.add("on"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    document.querySelectorAll(".rev").forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
    };
  }, []);

  return null;
}
