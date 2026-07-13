// =============================================================
// OTO POLİK — Convex Client-Side Helpers
// =============================================================
// Client bileşenlerde Convex URL'inin varlığını kontrol eder.
// URL yoksa (env tanımsız) Convex çağrılarını atlar; site
// yine de fallback davranışıyla çalışır.
// =============================================================

export function isConvexConfiguredClient(): boolean {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url || url.length === 0) return false;
  if (url.includes("your-deployment")) return false;
  return true;
}
