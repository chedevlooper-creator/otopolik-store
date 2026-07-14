import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],

  images: {
    qualities: [75, 90, 95],
  },

  productionBrowserSourceMaps: false,

  // Vercel Analytics için (opsiyonel)
  // analyticsId: process.env.VERCEL_ANALYTICS_ID,

  // Performans: CSS inline boyutunu optimize et
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  // Gzip sıkıştırma için header'lar
  headers: async () => [
    {
      source: "/media/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;
