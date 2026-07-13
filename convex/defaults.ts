// =============================================================
// OTO POLİK — Convex Varsayılan Değerler
// =============================================================
// Şemadaki tablolar için başlangıç değerleri. Schema buraya
// bağımlı olmamalı; sadece seed/insert sırasında kullanılır.
// =============================================================

export function siteSettingsDefaults() {
  return {
    phoneDisplay: "0555 000 00 00",
    whatsappNumber: "905550000000",
    email: "siparis@otopolik.com",
    address: "Örnek Mah. Sanayi Cad. No:1, İstanbul",
    instagram: "https://instagram.com/otopolik",
    freeShippingThreshold: 1500,
    shippingFee: 99,
    estimatedDispatch: "1-3 iş günü",
    businessHours: "Pazartesi - Cumartesi, 09:00 - 18:00",
    matBasePrice: 1149,
    matHeelPadPrice: 149,
    matTrunkPrice: 349,
  } as const;
}
