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
  const gallery = colorImage ? [colorImage, ...images.filter((image) => image !== colorImage)] : images;

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-3 sm:flex-row">
      <div className="order-2 flex max-w-full gap-3 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:overflow-visible sm:pb-0">
        {gallery.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`${alt}, görsel ${i + 1} görüntüle`}
            aria-pressed={active === i}
            className={`bg-eva relative aspect-square w-16 shrink-0 overflow-hidden border-2 bg-surface transition-colors sm:w-20 ${
              active === i ? "border-sand" : "border-border hover:border-muted"
            }`}
          >
            <Image src={src} alt="" fill sizes="80px" className="object-contain p-1.5" />
          </button>
        ))}
      </div>

      <div className="bg-eva-strong relative order-1 aspect-[4/3] min-w-0 flex-1 overflow-hidden border border-border bg-surface sm:order-2 sm:aspect-square">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(211,189,150,0.12),transparent_62%)]" />
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
        {badge && (
          <span className="spec-value absolute left-4 top-4 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-sand">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
