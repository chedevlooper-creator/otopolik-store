"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80;
      setVisible(window.scrollY > 400 && !scrolledToBottom);
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Sayfanın başına dön"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-20 right-4 z-40 flex h-11 w-11 items-center justify-center border border-border bg-background/90 text-muted backdrop-blur-md transition-all duration-200 hover:border-sand hover:text-sand sm:bottom-24 sm:right-5 ${
        visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
    </button>
  );
}
