"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  images: string[];
  alt: string;
  badge?: string;
  colorImage?: string;
};

export default function ProductGallery({ images, alt, badge, colorImage }: Props) {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const gallery = colorImage
    ? [colorImage, ...images.filter((image) => image !== colorImage)]
    : images;

  function handleSelect(i: number) {
    if (i === active) return;
    setAnimating(true);
    setActive(i);
    window.setTimeout(() => setAnimating(false), 220);
  }

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row">
      {/* Thumbnail rail */}
      <div
        role="tablist"
        aria-label="Ürün görselleri"
        className="order-2 flex max-w-full gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0"
      >
        {gallery.map((src, i) => {
          const isActive = active === i;
          return (
            <button
              key={src + i}
              type="button"
              role="tab"
              onClick={() => handleSelect(i)}
              aria-label={`${alt}, görsel ${i + 1} görüntüle`}
              aria-selected={isActive}
              aria-current={isActive}
              className={`group/thumb relative aspect-square w-16 shrink-0 overflow-hidden border-2 bg-surface transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand sm:w-20 ${
                isActive
                  ? "border-sand shadow-[3px_3px_0_0_var(--brand-red)]"
                  : "border-border hover:border-muted hover:-translate-y-0.5"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-red"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main image */}
      <div className="bg-eva-strong relative order-1 aspect-[4/3] min-w-0 flex-1 overflow-hidden border border-border bg-surface sm:order-2 sm:aspect-square">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(211,189,150,0.12),transparent_62%)]" />
        <div
          className={`absolute inset-0 transition-opacity duration-200 ${
            animating ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            key={gallery[active]}
            src={gallery[active]}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={90}
            className="object-contain p-4 sm:p-8"
            priority
          />
        </div>
        {badge && (
          <span className="spec-value absolute left-4 top-4 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-sand">
            {badge}
          </span>
        )}
        <div className="spec-value absolute bottom-3 right-3 bg-background/85 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
          {active + 1} / {gallery.length}
        </div>
      </div>
    </div>
  );
}
