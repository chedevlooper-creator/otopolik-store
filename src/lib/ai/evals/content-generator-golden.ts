export const CONTENT_STYLE_MARKERS = [
  "yalnızca doğal, kusursuz Türkçe",
  "premium, ölçülü",
  "spam ve pazar yeri ifadelerini kullanma",
  "fiyat, ölçü, malzeme, uyumluluk",
] as const;

export const CONTENT_GROUNDING_GOLDEN = {
  knownSlug: "eva-oto-paspas-seti",
  unknownSlug: "golden-olmayan-urun",
} as const;

export const NO_LIVE_WRITE_CONTRACT =
  "Generate yalnızca contentGenerations taslağına yazar; canlı CMS ve ürün yazımı ayrı publish action içindedir.";

export const ADMIN_KEY_CONTRACT = {
  server: "getAdminConvexKey",
  browser: "useAdminConvexKey",
} as const;
