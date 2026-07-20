// =============================================================
// OTO POLİK — Site Konfigürasyonu
// =============================================================
// Tüm alanlar Vercel / .env.local üzerinden override edilebilir.
// NEXT_PUBLIC_ önekli değişkenler client bundle'a da gömülür
// (Header, Footer, CartDrawer, WhatsAppFloat kullanımı için).
// Fallback değerler placeholder; yayın öncesi env ile ezilmeli.
// =============================================================

function readEnv(value: string | undefined, fallback: string): string {
  if (value && value.trim().length > 0) return value.trim();
  return fallback;
}

function readEnvNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const siteConfig = {
  name: "OTO POLİK",
  tagline: "Oto Paspasları",
  description:
    "Aracınıza özel üretim, EVA malzemeden 4 mevsim kullanılabilir, çamura ve suya karşı üstün korumalı oto paspasları.",

  // Site URL — Vercel domain ya da özel domain
  url: readEnv(process.env.NEXT_PUBLIC_SITE_URL, "https://otopolik.com"),

  // Telefon — kullanıcıya gösterilecek format
  phoneDisplay: readEnv(process.env.NEXT_PUBLIC_SITE_PHONE, "0537 267 26 89"),

  // WhatsApp numarası — ülke kodu + alan kodu + numara, boşluksuz
  // Örn: 905551234567 (Türkiye için 90)
  whatsappNumber: readEnv(process.env.NEXT_PUBLIC_SITE_WHATSAPP_NUMBER, "905372672689"),

  // E-posta
  email: readEnv(process.env.NEXT_PUBLIC_SITE_EMAIL, "info@otopolik.com"),

  // Adres
  address: readEnv(process.env.NEXT_PUBLIC_SITE_ADDRESS, "İOSB Mah. Sefaköy San. Sit. 7.Blok No:10-12, Başakşehir/İstanbul"),

  // Instagram
  instagram: readEnv(process.env.NEXT_PUBLIC_SITE_INSTAGRAM, "https://instagram.com/otopolik"),
  youtube: readEnv(process.env.NEXT_PUBLIC_SITE_YOUTUBE, "https://youtube.com/@otopolik"),

  // Kargo
  freeShippingThreshold: readEnvNumber(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD, 0),
  shippingFee: readEnvNumber(process.env.NEXT_PUBLIC_SHIPPING_FEE, 0),
  estimatedDispatch: readEnv(process.env.NEXT_PUBLIC_ESTIMATED_DISPATCH, "1-3 iş günü"),
  businessHours: readEnv(process.env.NEXT_PUBLIC_BUSINESS_HOURS, "Pazartesi - Cumartesi, 09:00 - 18:00"),

} as const;

