// =============================================================
// OTO POLIK — Convex Generated Data Model (Geçici Tipler)
// =============================================================
// BU DOSYA `npx convex dev` çalıştırıldığında Convex CLI
// tarafından otomatik olarak üretilir ve üzerine yazılır.
// Yerel geliştirmenin build'i geçmesi için placeholder tipler.
// =============================================================

export type Id<TableName extends string> = string & { __tableName: TableName };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenericDoc = Record<string, any>;

export type DataModel = {
  siteSettings: GenericDoc;
  products: GenericDoc;
  orders: GenericDoc;
};
