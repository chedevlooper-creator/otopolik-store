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
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="order-2 flex gap-3 sm:order-1 sm:flex-col">
        {gallery.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Görsel ${i + 1}`}
            className={`relative aspect-square w-16 overflow-hidden rounded-xl border-2 bg-neutral-100 transition-colors sm:w-20 ${
              active === i ? "border-brand-red" : "border-neutral-200 hover:border-neutral-400"
            }`}
          >
            <Image src={src} alt={`${alt} küçük görsel ${i + 1}`} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      <div className="relative order-1 aspect-square flex-1 overflow-hidden rounded-3xl bg-neutral-100 sm:order-2">
        <Image
          key={gallery[active]}
          src={gallery[active]}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={90}
          className="object-cover"
          priority
        />
        {badge && (
          <span className="absolute left-4 top-4 rounded-full bg-brand-red px-3 py-1 text-xs font-bold text-white">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
