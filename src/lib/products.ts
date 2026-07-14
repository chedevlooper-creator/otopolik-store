import { Product } from "./types";

const STANDARD_COLORS = [
  { name: "Siyah", hex: "#1a1a1a", image: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png" },
  { name: "Gri", hex: "#8a8a8a", image: "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg" },
  { name: "Bej", hex: "#c9b79c", image: "/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg" },
];

type SeedProduct = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: Product["category"];
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
  gallery: string[];
  description: string;
  features: string[];
  setContents: string[];
  optionalExtras: string[];
  dispatchEstimate: string;
};

const SEED_PRODUCTS: SeedProduct[] = [
  {
    slug: "eva-oto-paspas-seti",
    name: "Eva Oto Paspas Seti",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "eva-3d",
    price: 3500,
    oldPrice: 4500,
    badge: "Çok Satan",
    image: "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
    gallery: [
      "/media/scraped/evaotopaspas/paspas-seti/01-siyah-urun.png",
      "/media/scraped/evaotopaspas/paspas-seti/02-siyah-urun-tam.png",
      "/media/scraped/evaotopaspas/paspas-seti/03-gallery-1.jpg",
      "/media/scraped/evaotopaspas/paspas-seti/04-gallery-2.jpg",
      "/media/scraped/evaotopaspas/paspas-seti/05-comparison.webp",
      "/media/scraped/evaotopaspas/paspas-seti/06-metal-topukluk.jpg",
    ],
    description:
      'Aracınıza özel kalıplanmış, petek dokulu yüzeyiyle su ve çamuru hapseden premium EVA paspas setidir. 6000\'den fazla araç modeli için özel kesimle üretilir, mükemmel uyum sağlar.',
    features: [
      "Araca özel CNC kesim, milimetrik uyum",
      "Petek dokulu yüzey — su ve çamuru hapseder",
      "Kaymaz taban, güçlendirilmiş topukluk",
      "Su geçirmez, 4 mevsim koruma",
      "Kokusuz, esnek premium EVA malzeme",
      "Tek sıkım suyla saniyeler içinde temizlenir",
    ],
    setContents: ["Ön sürücü paspası", "Ön yolcu paspası", "Arka sıra paspasları"],
    optionalExtras: ["Bagaj paspası", "Renk seçimi (Siyah, Gri, Bej)"],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "eva-oto-bagaj-havuzu",
    name: "Eva Oto Bagaj Havuzu",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "bagaj-havuzu",
    price: 1750,
    oldPrice: 2500,
    badge: "Yeni",
    image: "/media/scraped/evaotopaspas/bagaj-havuzu/01-siyah-bagaj.png",
    gallery: [
      "/media/scraped/evaotopaspas/bagaj-havuzu/01-siyah-bagaj.png",
      "/media/scraped/evaotopaspas/bagaj-havuzu/02-antrasit-bagaj.png",
      "/media/scraped/evaotopaspas/bagaj-havuzu/03-gri-bagaj.png",
    ],
    description:
      "Aracınızın bagajını su, çamur, toz ve dökülmelere karşı korumak için özel olarak tasarlanmıştır. Araca özel ölçülerde üretilir, tam uyum sağlar. Dayanıklı EVA malzemesi sayesinde uzun ömürlüdür.",
    features: [
      "Araca özel üretim — 6000'den fazla model için kalıp",
      "Su geçirmez ve kaymaz yüzey",
      "Dayanıklı ve esnek EVA malzeme",
      "Su ile kolayca temizlenir",
      "Koku yapmaz, hijyenik",
    ],
    setContents: ["1 adet bagaj havuzu"],
    optionalExtras: ["Renk seçimi (Siyah, Antrasit, Gri)"],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "eva-bagaj-cantasi",
    name: "Eva Bagaj Çantası",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "bagaj-cantasi",
    price: 899,
    oldPrice: 1399,
    badge: "Fırsat",
    image: "/media/scraped/evaotopaspas/bagaj-cantasi/01-bagaj-cantasi.jpg",
    gallery: [
      "/media/scraped/evaotopaspas/bagaj-cantasi/01-bagaj-cantasi.jpg",
    ],
    description:
      "Araç bagajınızda düzeni sağlamak ve eşyalarınızı korumak için özel olarak tasarlanmış EVA bagaj çantası. Su geçirmez, katlanabilir ve kaymaz tabanlıdır.",
    features: [
      "Dayanıklı EVA malzeme",
      "Su geçirmez ve kolay temizlenebilir",
      "Katlanabilir — yer kaplamaz",
      "Kaymaz taban",
      "Bölmeli iç yapı",
    ],
    setContents: ["1 adet EVA Bagaj Çantası"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },




];

export const CATEGORY_LABELS: Record<Product["category"], string> = {
  "eva-3d": "3D EVA Paspas",
  "eva-havuzlu": "Havuzlu EVA Paspas",
  bagaj: "Bagaj Paspası",
  "bagaj-havuzu": "Bagaj Havuzu",
  "bagaj-cantasi": "Bagaj Çantası",
  "direksiyon-kilifi": "Direksiyon Kılıfı",
  "minder-seti": "Minder Seti",
  "ekran-koruyucu": "Ekran Koruyucu",
};

export const products: Product[] = SEED_PRODUCTS.map((seed) => ({
  slug: seed.slug,
  name: seed.name,
  brand: seed.brand,
  model: seed.model,
  category: seed.category,
  price: seed.price,
  oldPrice: seed.oldPrice,
  image: seed.image,
  gallery: seed.gallery,
  colors: STANDARD_COLORS,
  description: seed.description,
  features: seed.features,
  compatibility: {
    yearRange: "Model yılı sipariş öncesi teyit edilir",
    bodyOrChassis: "Kasa/versiyon bilgisiyle üretilir",
    note: "Aracınızın model yılı veya kasa bilgisi farklıysa WhatsApp'tan yazın; siparişten önce uyumluluğu teyit edelim.",
  },
  setContents: seed.setContents,
  optionalExtras: seed.optionalExtras,
  dispatchEstimate: seed.dispatchEstimate,
  badge: seed.badge,
  inStock: true,
  isActive: true,
}));

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
