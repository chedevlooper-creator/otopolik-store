import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // quality={90/95} kullanan görseller için izin listesi (Next 16'da zorunlu)
    qualities: [75, 90, 95],
    // Vercel'de remote görseller için (gerekirse)
    // remotePatterns: [{ protocol: "https", hostname: "**.vercel.app" }],
  },

  // Production'da kaynak haritalarını kapat (performans + güvenlik)
  productionBrowserSourceMaps: false,

  // Vercel Analytics için (opsiyonel)
  // analyticsId: process.env.VERCEL_ANALYTICS_ID,
};

export default nextConfig;
