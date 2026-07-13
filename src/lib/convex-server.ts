// =============================================================
// OTO POLİK — Convex Server-Side Client
// =============================================================
// Server bileşenlerden (RSC, server actions) Convex API'lerini
// çağırmak için kullanılır. Lazy init: URL env'de yoksa null
// döner; çağıran taraf fallback'leri yönetir.
// =============================================================

import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

let client: ConvexHttpClient | null = null;

function getUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url || url.length === 0) return null;
  if (url.includes("your-deployment")) return null;
  return url;
}

export function getConvexClient(): ConvexHttpClient | null {
  if (client) return client;
  const url = getUrl();
  if (!url) return null;
  client = new ConvexHttpClient(url);
  return client;
}

export function isConvexConfigured(): boolean {
  return getUrl() !== null;
}

export { api };
