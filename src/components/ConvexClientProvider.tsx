// =============================================================
// OTO POLİK — Convex Client Provider
// =============================================================
// Client bileşenlerde Convex query/mutation kullanımı için
// ConvexReactClient'ı sağlar. Root layout'ta sarmalanır.
// =============================================================

"use client";

import { ConvexReactClient, ConvexProvider } from "convex/react";
import type { ReactNode } from "react";

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = new ConvexReactClient(
  url && !url.includes("your-deployment")
    ? url
    : "https://placeholder.convex.cloud"
);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
