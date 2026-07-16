// =============================================================
// OTO POLİK — Sunucu Katalog Katmanı
// =============================================================
// Vitrin kataloğunun tek kaynağı products.ts dosyasıdır.
// Convex yalnızca sipariş ve yönetim işlemleri için kullanılmaktadır.
// =============================================================

import "server-only";
import {
  brands as staticBrands,
  CATEGORY_LABELS,
  getFeaturedProducts as staticFeatured,
  getProductBySlug as staticGetBySlug,
  getRelatedProducts as staticRelated,
  products as staticProducts,
} from "@/lib/products";
import type { Product } from "@/lib/types";

export { CATEGORY_LABELS };

export async function getProducts(): Promise<Product[]> {
  return staticProducts;
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  return staticGetBySlug(slug) ?? null;
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
  return staticProducts.map((p) => p.slug);
}

export async function getBrands(): Promise<string[]> {
  const all = await getProducts();
  if (!all.length) return staticBrands;
  return Array.from(new Set(all.map((p) => p.brand))).sort();
}
