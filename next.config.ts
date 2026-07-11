import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // quality={90/95} kullanan görseller için izin listesi (Next 16'da zorunlu)
    qualities: [75, 90, 95],
  },
};

export default nextConfig;
