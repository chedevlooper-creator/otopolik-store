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
    price: 1299,
    oldPrice: 1999,
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
    price: 1049,
    oldPrice: 1599,
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
  {
    slug: "premium-direksiyon-kilifi",
    name: "Premium Direksiyon Kılıfı",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "direksiyon-kilifi",
    price: 549,
    oldPrice: 949,
    image: "/media/scraped/evaotopaspas/direksiyon-kilifi/01-direksiyon-kilifi.jpeg",
    gallery: [
      "/media/scraped/evaotopaspas/direksiyon-kilifi/01-direksiyon-kilifi.jpeg",
    ],
    description:
      "Aracınızın direksiyonunu hem koruyun hem de sürüş konforunu artırın. Premium suni deri malzemeden üretilmiş, kaymaz yüzeyli, şık ve sportif tasarımlı direksiyon kılıfı.",
    features: [
      "Premium kalite suni deri",
      "Kaymaz yüzey — güçlü tutuş",
      "Direksiyonu aşınma ve güneşe karşı korur",
      "Şık ve sportif tasarım",
      "Kolay montaj",
    ],
    setContents: ["1 adet Premium Direksiyon Kılıfı"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "ortopedik-oto-minder-seti",
    name: "Ortopedik Oto Minder Seti",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "minder-seti",
    price: 2199,
    oldPrice: 2699,
    image: "/media/scraped/evaotopaspas/minder-seti/01-minder-seti.jpg",
    gallery: [
      "/media/scraped/evaotopaspas/minder-seti/01-minder-seti.jpg",
    ],
    description:
      "Uzun yolculuklarda bel ve kalça bölgelerindeki baskıyı azaltmak, doğru oturma pozisyonunu desteklemek için tasarlanmış ortopedik minder seti. Ev ve ofis kullanımına da uygundur.",
    features: [
      "Ergonomik ve ortopedik tasarım",
      "Yüksek kalite malzeme",
      "Kaymaz taban yapısı",
      "Kolay montaj ve taşıma",
      "Ev ve ofis kullanımına uygun",
    ],
    setContents: ["1 adet Ortopedik Koltuk Minderi"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "oto-ekran-koruyucu-set",
    name: "Oto Ekran Koruyucu Set",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "ekran-koruyucu",
    price: 899,
    oldPrice: 1699,
    badge: "Yeni",
    image: "/media/scraped/evaotopaspas/ekran-koruyucu/01-ekran-koruyucu.jpg",
    gallery: [
      "/media/scraped/evaotopaspas/ekran-koruyucu/01-ekran-koruyucu.jpg",
    ],
    description:
      "Aracınızın gösterge ve multimedya ekranlarını darbelere ve çizilmelere karşı koruyan 300 mikron nano ekran koruyucu set. Yüksek şeffaflık, kolay uygulama, 4 mevsim dayanıklılık.",
    features: [
      "300 mikron nano koruma",
      "Tam set uyum (gösterge + multimedya)",
      "Yüksek şeffaflık — görüntü kalitesini etkilemez",
      "Kolay uygulama, iz bırakmaz",
      "4 mevsim dayanıklılık",
      "Yerli üretim",
    ],
    setContents: ["Gösterge paneli koruyucu", "Multimedya ekran koruyucu"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "fiat-egea-eva-paspas-seti",
    name: "Fiat Egea Sedan Hücreli Premium EVA Paspas Seti",
    brand: "OTO POLİK",
    model: "Fiat Egea",
    category: "eva-3d",
    price: 1299,
    oldPrice: 1799,
    badge: "Öne Çıkan",
    image: "/media/scraped/trendyol/01-paspas-fiat-egea.jpg",
    gallery: [
      "/media/scraped/trendyol/01-paspas-fiat-egea.jpg",
      "/media/scraped/trendyol/02-paspas-fiat-egea.jpg",
      "/media/scraped/trendyol/03-paspas-fiat-egea.jpg",
      "/media/scraped/trendyol/04-paspas-fiat-egea.jpg",
      "/media/scraped/trendyol/05-paspas-fiat-egea.jpg",
    ],
    description:
      "Fiat Egea Sedan modelinize özel kalıplanmış, hücreli (petek) yüzeyiyle su ve çamuru hapseden premium EVA paspas seti. 8mm derinliğindeki hücreler sayesinde sıvıları tutar, aracınızın orijinal döşemesini korur.",
    features: [
      "Fiat Egea Sedan'a özel CNC kesim",
      "8mm hücreli yüzey — su ve çamuru hapseder",
      "3D tasarım, mükemmel uyum",
      "Kaymaz taban ve güçlendirilmiş topukluk",
      "Kokusuz, esnek premium EVA malzeme",
      "Tek sıkım suyla saniyeler içinde temizlenir",
    ],
    setContents: ["Ön sürücü paspası", "Ön yolcu paspası", "Arka sıra paspasları"],
    optionalExtras: ["Bagaj paspası", "Renk seçimi"],
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
