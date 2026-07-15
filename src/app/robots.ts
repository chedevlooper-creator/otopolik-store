import type { MetadataRoute } from "next";
import { getSiteSeo } from "@/lib/cms";
import { siteConfig } from "@/lib/site-config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo } = await getSiteSeo();
  const base = seo.siteUrl || siteConfig.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/sepet", "/odeme", "/tesekkurler", "/admin"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
