import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/urunler`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteConfig.url}/olusturucu`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/hakkimizda`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteConfig.url}/iletisim`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    ...["kargo", "iade", "ozel-uretim", "gizlilik"].map((slug) => ({ url: `${siteConfig.url}/bilgiler/${slug}`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteConfig.url}/urunler/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
