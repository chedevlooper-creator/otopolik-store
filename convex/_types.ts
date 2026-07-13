// =============================================================
// OTO POLİK — Convex yardımcı tipleri (elle yazılan, codegen değil)
// =============================================================
// `_generated/server.ts` placeholder'ı gerçek Convex query builder
// tiplerini üretmediği için `withIndex` callback'lerinde kullanılan
// minimal bir arayüz. `npx convex dev` çalıştırıldığında gerçek
// codegen tipleri devreye girer, bu dosya sadece yerel build'i
// strict TypeScript altında `any`'siz geçirmek için var.
// =============================================================

export type IndexQuery = {
  eq(field: string, value: unknown): IndexQuery;
};
