// =============================================================
// OTO POLİK — Convex Varsayılan Değerler
// =============================================================
// site-config.ts / .env.example ile hizalı başlangıç değerleri.
// =============================================================

export function siteSettingsDefaults() {
  return {
    phoneDisplay: "0537 267 26 89",
    whatsappNumber: "905372672689",
    email: "info@otopolik.com",
    address:
      "İOSB Mah. Sefaköy San. Sit. 7.Blok No:10-12, Başakşehir/İstanbul",
    instagram: "https://instagram.com/otopolik",
    freeShippingThreshold: 3500,
    shippingFee: 99,
    estimatedDispatch: "1-3 iş günü",
    businessHours: "Pazartesi - Cumartesi, 09:00 - 18:00",
    matBasePrice: 3500,
    matHeelPadPrice: 500,
    matTrunkPrice: 1750,
  } as const;
}
