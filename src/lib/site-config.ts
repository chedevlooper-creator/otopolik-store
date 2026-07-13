// =============================================================
// OTO POLİK — Site Konfigürasyonu
// =============================================================
// Tüm alanlar Vercel / .env.local üzerinden override edilebilir.
// NEXT_PUBLIC_ önekli değişkenler client bundle'a da gömülür
// (Header, Footer, CartDrawer, WhatsAppFloat kullanımı için).
// Fallback değerler placeholder; yayın öncesi env ile ezilmeli.
// =============================================================

function readEnv(key: string, fallback: string): string {
  const value = process.env[key];
  if (value && value.trim().length > 0) return value.trim();
  return fallback;
}

function readEnvNumber(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const siteConfig = {
  name: "OTO POLİK",
  tagline: "Oto Paspasları",
  description:
    "Aracınıza özel üretim, EVA malzemeden 4 mevsim kullanılabilir, çamura ve suya karşı üstün korumalı oto paspasları.",

  // Site URL — Vercel domain ya da özel domain
  url: readEnv("NEXT_PUBLIC_SITE_URL", "https://otopolik.com"),

  // Telefon — kullanıcıya gösterilecek format
  phoneDisplay: readEnv("NEXT_PUBLIC_SITE_PHONE", "0555 000 00 00"),

  // WhatsApp numarası — ülke kodu + alan kodu + numara, boşluksuz
  // Örn: 905551234567 (Türkiye için 90)
  whatsappNumber: readEnv("NEXT_PUBLIC_SITE_WHATSAPP_NUMBER", "905550000000"),

  // E-posta
  email: readEnv("NEXT_PUBLIC_SITE_EMAIL", "siparis@otopolik.com"),

  // Adres
  address: readEnv("NEXT_PUBLIC_SITE_ADDRESS", "Örnek Mah. Sanayi Cad. No:1, İstanbul"),

  // Instagram
  instagram: readEnv("NEXT_PUBLIC_SITE_INSTAGRAM", "https://instagram.com/otopolik"),

  // Kargo
  freeShippingThreshold: readEnvNumber("NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD", 1500),
  shippingFee: readEnvNumber("NEXT_PUBLIC_SHIPPING_FEE", 99),
  estimatedDispatch: readEnv("NEXT_PUBLIC_ESTIMATED_DISPATCH", "1-3 iş günü"),
  businessHours: readEnv("NEXT_PUBLIC_BUSINESS_HOURS", "Pazartesi - Cumartesi, 09:00 - 18:00"),

  // Konfigüratör fiyatlandırma (TL)
  // basePrice: araç seçilmediğinde veya "Diğer Araç" seçildiğinde kullanılan fallback
  matBasePrice: readEnvNumber("NEXT_PUBLIC_MAT_BASE_PRICE", 1149),
  matHeelPadPrice: readEnvNumber("NEXT_PUBLIC_MAT_HEEL_PAD_PRICE", 149),
  matTrunkPrice: readEnvNumber("NEXT_PUBLIC_MAT_TRUNK_PRICE", 349),
} as const;

export function buildWhatsAppOrderLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
