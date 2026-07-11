// TODO: Gerçek işletme bilgileriyle güncelleyin.
export const siteConfig = {
  name: "OTO POLİK",
  tagline: "Oto Paspasları",
  description:
    "Aracınıza özel üretim, EVA malzemeden 4 mevsim kullanılabilir, çamura ve suya karşı üstün korumalı oto paspasları.",
  // Vercel ortam değişkeninden alınır; yoksa varsayılan değer kullanılır.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://otopolik.com",
  // Yayına almadan önce işletmenin doğrulanmış bilgileriyle güncelleyin.
  phoneDisplay: "0555 000 00 00",
  // WhatsApp numarası ülke kodu + alan kodu + numara, boşluksuz (örn: 905550000000)
  whatsappNumber: "905550000000",
  email: "siparis@otopolik.com",
  address: "Örnek Mah. Sanayi Cad. No:1, İstanbul",
  instagram: "https://instagram.com/otopolik",
  freeShippingThreshold: 1500,
  shippingFee: 99,
  estimatedDispatch: "1-3 iş günü",
  businessHours: "Pazartesi - Cumartesi, 09:00 - 18:00",
} as const;

export function buildWhatsAppOrderLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encoded}`;
}
