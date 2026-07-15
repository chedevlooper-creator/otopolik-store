// =============================================================
// OTO POLİK — Sunucu Katalog Katmanı
// =============================================================
// Convex bağlıysa ürünleri oradan okur; değilse products.ts fallback.
// =============================================================

import "server-only";
import { getConvexClient, isConvexConfigured, api } from "@/lib/convex-server";
import {
  brands as staticBrands,
  CATEGORY_LABELS,
  getFeaturedProducts as staticFeatured,
  getProductBySlug as staticGetBySlug,
  getRelatedProducts as staticRelated,
  products as staticProducts,
} from "@/lib/products";
import type { Product } from "@/lib/types";

type ConvexProduct = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: Product["category"];
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  colors?: Product["colors"];
  description?: string;
  features?: string[];
  compatibility?: Product["compatibility"];
  setContents?: string[];
  optionalExtras?: string[];
  dispatchEstimate?: string;
  badge?: string;
  inStock?: boolean;
  isActive?: boolean;
};

function mapConvexProduct(row: ConvexProduct): Product {
  return {
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    model: row.model,
    category: row.category,
    price: row.price,
    oldPrice: row.oldPrice,
    image: row.image,
    gallery: row.gallery?.length ? row.gallery : [row.image],
    colors: row.colors?.length
      ? row.colors
      : [
          {
            name: "Siyah",
            hex: "#1a1a1a",
            image: row.image,
          },
        ],
    description: row.description ?? "",
    features: row.features ?? [],
    compatibility: row.compatibility ?? {
      yearRange: "Model yılı sipariş öncesi teyit edilir",
      bodyOrChassis: "Kasa/versiyon bilgisiyle üretilir",
      note: "Aracınızın model yılı veya kasa bilgisi farklıysa WhatsApp'tan yazın.",
    },
    setContents: row.setContents ?? [],
    optionalExtras: row.optionalExtras ?? [],
    dispatchEstimate: row.dispatchEstimate ?? "1-3 iş günü",
    badge: row.badge,
    inStock: row.inStock ?? true,
    isActive: row.isActive ?? true,
  };
}

export { CATEGORY_LABELS };

export async function getProducts(): Promise<Product[]> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return staticProducts;
  }
  try {
    const rows = (await client.query(api.products.listActive, {})) as ConvexProduct[];
    if (!rows.length) return staticProducts;
    return rows.map(mapConvexProduct);
  } catch (error) {
    console.error("catalog getProducts error:", error);
    return staticProducts;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return staticGetBySlug(slug) ?? null;
  }
  try {
    const row = (await client.query(api.products.getBySlug, {
      slug,
    })) as ConvexProduct | null;
    if (!row) {
      // Convex boşsa statik fallback
      return staticGetBySlug(slug) ?? null;
    }
    return mapConvexProduct(row);
  } catch (error) {
    console.error("catalog getProductBySlug error:", error);
    return staticGetBySlug(slug) ?? null;
  }
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  const all = await getProducts();
  if (!all.length) return staticFeatured(count);
  return all.slice(0, count);
}

export async function getRelatedProducts(
  slug: string,
  count = 4
): Promise<Product[]> {
  const all = await getProducts();
  if (!all.length) return staticRelated(slug, count);
  const current = all.find((p) => p.slug === slug);
  const others = all.filter((p) => p.slug !== slug);
  if (!current) return others.slice(0, count);
  const sameCategory = others.filter((p) => p.category === current.category);
  const rest = others.filter((p) => p.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export async function getProductSlugs(): Promise<string[]> {
  const client = getConvexClient();
  if (!isConvexConfigured() || !client) {
    return staticProducts.map((p) => p.slug);
  }
  try {
    const slugs = (await client.query(api.products.listSlugs, {})) as string[];
    if (!slugs.length) return staticProducts.map((p) => p.slug);
    return slugs;
  } catch (error) {
    console.error("catalog getProductSlugs error:", error);
    return staticProducts.map((p) => p.slug);
  }
}

export async function getBrands(): Promise<string[]> {
  const all = await getProducts();
  if (!all.length) return staticBrands;
  return Array.from(new Set(all.map((p) => p.brand))).sort();
}
