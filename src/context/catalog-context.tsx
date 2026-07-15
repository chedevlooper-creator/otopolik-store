"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { Product } from "@/lib/types";

const CatalogContext = createContext<Product[]>([]);

export function CatalogProvider({
  products,
  children,
}: {
  products: Product[];
  children: ReactNode;
}) {
  const value = useMemo(() => products, [products]);
  return (
    <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>
  );
}

export function useCatalogProducts(): Product[] {
  return useContext(CatalogContext);
}
