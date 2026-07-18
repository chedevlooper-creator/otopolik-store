"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { ShieldAlertIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

/**
 * Next.js Image wrapper that catches load errors and shows a premium
 * dark gradient placeholder with a subtle warning icon.
 */
export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setError(false);
  }

  if (error || !src) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center border border-white/5 bg-gradient-to-b from-surface to-background p-4 text-center",
          fallbackClassName || className
        )}
      >
        <ShieldAlertIcon className="h-6 w-6 text-white/20 animate-pulse" />
        <span className="mt-2 text-[10px] uppercase tracking-[0.14em] text-white/40">
          Görsel yüklenemedi
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}
