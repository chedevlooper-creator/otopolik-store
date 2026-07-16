import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/catalog";
import { getSiteSeo } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [{ seo }, slugs] = await Promise.all([getSiteSeo(), getProductSlugs()]);
  const base = seo.siteUrl || siteConfig.url;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/urunler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/olusturucu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${base}/galeri`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${base}/hakkimizda`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${base}/iletisim`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...[
      "kargo",
      "iade",
      "ozel-uretim",
      "gizlilik",
      "mesafeli-satis",
      "on-bilgilendirme",
    ].map((slug) => ({
      url: `${base}/bilgiler/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  const productRoutes: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/urunler/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
