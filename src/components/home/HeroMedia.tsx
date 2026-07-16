"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroMedia() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Image
        src="/media/hero-luxury-interior.png"
        alt=""
        aria-hidden="true"
        fill
        priority
        quality={95}
        sizes="100vw"
        onLoad={() => setLoaded(true)}
        className={`object-cover object-[62%_50%] transition duration-1000 md:object-center ${loaded ? "scale-100 opacity-100" : "scale-[1.015] opacity-0"}`}
      />
    </>
  );
}
