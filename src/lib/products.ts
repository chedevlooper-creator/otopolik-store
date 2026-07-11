import { Product } from "./types";

const STANDARD_COLORS = [
  { name: "Siyah", hex: "#1a1a1a", image: "/media/eva-driver-black.png" },
  { name: "Gri", hex: "#8a8a8a", image: "/media/eva-detail-gray.png" },
  { name: "Bej", hex: "#c9b79c", image: "/media/eva-complete-beige.png" },
];

const STANDARD_FEATURES = [
  "Araca özel kalıp, boşluk bırakmadan tam uyum",
  "Su, çamur ve kire karşı 4 mevsim koruma",
  "Kaymaz taban ve güçlendirilmiş topukluk",
  "Tek sıkım suyla saniyeler içinde temizlenir",
  "Kokusuz, esnek premium EVA malzeme",
];

type SeedProduct = {
  slug: string;
  brand: string;
  model: string;
  price: number;
  oldPrice?: number;
  category?: Product["category"];
  badge?: string;
  /** Her ürün için public/media/products/ altındaki gerçek görsel sayısı */
  imageCount: number;
  /** Varsayılandan farklı uzantı kullanan görseller: { [index]: "uzanti" } */
  imageExtOverrides?: Record<number, string>;
};

const SEED_PRODUCTS: SeedProduct[] = [
  { slug: "volkswagen-golf-8-eva-paspas", brand: "Volkswagen", model: "Golf 8", price: 1149, oldPrice: 1399, badge: "Öne Çıkan", imageCount: 4 },
  { slug: "renault-clio-5-eva-paspas", brand: "Renault", model: "Clio 5", price: 999, oldPrice: 1249, badge: "Fırsat", imageCount: 4 },
  { slug: "fiat-egea-eva-paspas", brand: "Fiat", model: "Egea", price: 949, imageCount: 4 },
  { slug: "toyota-corolla-eva-paspas", brand: "Toyota", model: "Corolla", price: 1099, imageCount: 3, imageExtOverrides: { 1: ".webp" } },
  { slug: "hyundai-i20-eva-paspas", brand: "Hyundai", model: "i20", price: 949, imageCount: 3 },
  { slug: "ford-focus-4-eva-paspas", brand: "Ford", model: "Focus 4", price: 1049, imageCount: 4 },
  { slug: "dacia-duster-eva-paspas", brand: "Dacia", model: "Duster", price: 1199, badge: "Yeni", imageCount: 4 },
  { slug: "bmw-3-serisi-eva-paspas", brand: "BMW", model: "3 Serisi (F30/G20)", price: 1399, category: "eva-havuzlu", imageCount: 4 },
  { slug: "mercedes-c-serisi-eva-paspas", brand: "Mercedes", model: "C Serisi (W205/W206)", price: 1449, category: "eva-havuzlu", imageCount: 4 },
  { slug: "audi-a3-eva-paspas", brand: "Audi", model: "A3 (8Y)", price: 1349, category: "eva-havuzlu", imageCount: 4 },
  { slug: "opel-astra-k-eva-paspas", brand: "Opel", model: "Astra K", price: 999, imageCount: 3 },
  { slug: "peugeot-208-eva-paspas", brand: "Peugeot", model: "208", price: 979, imageCount: 3 },
];

/** Slug'dan görsel dosya adı öneki çıkarır ("-eva-paspas" son ekini kırpar) */
function imagePrefixFromSlug(slug: string): string {
  return slug.replace(/-eva-paspas$/, "");
}

/** Her ürün için public/media/products/ altındaki gerçek görsel listesini döndürür */
function getProductGallery(slug: string, imageCount: number, extOverrides?: Record<number, string>): string[] {
  const prefix = imagePrefixFromSlug(slug);
  const images: string[] = [];
  for (let i = 1; i <= imageCount; i++) {
    const ext = extOverrides?.[i] ?? ".jpg";
    images.push(`/media/products/${prefix}-${i}${ext}`);
  }
  return images;
}

/** İlk galeri görselini ana görsel olarak kullan */
function getProductMainImage(slug: string, extOverrides?: Record<number, string>): string {
  const prefix = imagePrefixFromSlug(slug);
  const ext = extOverrides?.[1] ?? ".jpg";
  return `/media/products/${prefix}-1${ext}`;
}

export const products: Product[] = SEED_PRODUCTS.map((seed) => {
  const category = seed.category ?? "eva-3d";
  const gallery = getProductGallery(seed.slug, seed.imageCount, seed.imageExtOverrides);

  return {
    slug: seed.slug,
    name: `${seed.brand} ${seed.model} Araca Özel EVA Paspas Seti`,
    brand: seed.brand,
    model: seed.model,
    category,
    price: seed.price,
    oldPrice: seed.oldPrice,
    image: getProductMainImage(seed.slug, seed.imageExtOverrides),
    gallery,
    colors: STANDARD_COLORS,
    description: `${seed.brand} ${seed.model} modeline özel kalıplanmış, aracınızın taban hatlarına milimetrik uyum sağlayan premium EVA paspas setidir. Su, çamur, kar ve toza karşı üstün koruma sağlar; tek sıkım suyla saniyeler içinde temizlenir.`,
    features: STANDARD_FEATURES,
    compatibility: {
      yearRange: "Model yılı sipariş öncesi teyit edilir",
      bodyOrChassis: `${seed.model} kasa/versiyon bilgisiyle üretilir`,
      note: "Aracınızın model yılı veya kasa bilgisi farklıysa WhatsApp'tan yazın; siparişten önce uyumluluğu teyit edelim.",
    },
    setContents: ["Ön sürücü paspası", "Ön yolcu paspası", "Arka sıra paspasları"],
    optionalExtras: ["Bagaj paspası (uyumluluk teyidiyle)", "Renk seçimi"],
    dispatchEstimate: "1-3 iş günü",
    badge: seed.badge,
  };
});

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getFeaturedProducts(count = 8) {
  return products.slice(0, count);
}

export function getRelatedProducts(slug: string, count = 4) {
  const current = getProductBySlug(slug);
  const others = products.filter((product) => product.slug !== slug);
  if (!current) return others.slice(0, count);
  const sameCategory = others.filter((product) => product.category === current.category);
  const rest = others.filter((product) => product.category !== current.category);
  return [...sameCategory, ...rest].slice(0, count);
}

export const brands = Array.from(new Set(products.map((product) => product.brand))).sort();
