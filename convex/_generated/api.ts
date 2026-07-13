// =============================================================
// OTO POLİK — Convex Generated API (Geçici Tipler)
// =============================================================
// BU DOSYA `npx convex dev` çalıştırıldığında Convex CLI
// tarafından otomatik olarak üretilir ve üzerine yazılır.
// Yerel geliştirmenin build'i geçmesi için placeholder
// tipler bırakılmıştır. Convex bağlanınca bu dosya yok sayılır.
// =============================================================

import type { FunctionReference, FunctionType } from "convex/server";

function makeRef<Type extends FunctionType>(
  type: Type,
  name: string
): FunctionReference<Type> {
  return {
    _type: type,
    _visibility: "public",
    _args: undefined as any,
    _returnType: undefined as any,
    _componentPath: undefined,
    [Symbol.for("functionName")]: name,
  } as FunctionReference<Type>;
}

export const api = {
  siteSettings: {
    getSettings: makeRef("query", "siteSettings:getSettings"),
    updateSettings: makeRef("mutation", "siteSettings:updateSettings"),
  },
  products: {
    listAll: makeRef("query", "products:listAll"),
    create: makeRef("mutation", "products:create"),
    update: makeRef("mutation", "products:update"),
    remove: makeRef("mutation", "products:remove"),
  },
  orders: {
    create: makeRef("mutation", "orders:create"),
    listAll: makeRef("query", "orders:listAll"),
    listRecent: makeRef("query", "orders:listRecent"),
    updateStatus: makeRef("mutation", "orders:updateStatus"),
    getStats: makeRef("query", "orders:getStats"),
  },
};

export const internal = {} as Record<string, never>;
