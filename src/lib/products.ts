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
      // Gerçek araç içi çekimler — /media/galeri/paspas-seti/ altında tüm renkler mevcut
      "/media/galeri/paspas-seti/01-taba-surucu-detay.jpg",
      "/media/galeri/paspas-seti/02-taba-arka-sira.jpg",
      "/media/galeri/paspas-seti/03-taba-surucu.jpg",
      "/media/galeri/paspas-seti/04-taba-on-yolcu.jpg",
      "/media/galeri/paspas-seti/05-taba-surucu-genis.jpg",
      "/media/galeri/paspas-seti/06-taba-kenar-detay.jpg",
      "/media/galeri/paspas-seti/07-siyah-arka-detay.jpg",
      "/media/galeri/paspas-seti/08-siyah-arka-sira.jpg",
      "/media/galeri/paspas-seti/09-siyah-on-yolcu.jpg",
      "/media/galeri/paspas-seti/10-siyah-surucu.jpg",
      "/media/galeri/paspas-seti/11-siyah-on-yolcu-suv.jpg",
      "/media/galeri/paspas-seti/12-siyah-beyaz-kenar-arka.jpg",
      "/media/galeri/paspas-seti/13-siyah-beyaz-kenar-arka-2.jpg",
      "/media/galeri/paspas-seti/14-gri-arka-sira.jpg",
      "/media/galeri/paspas-seti/15-gri-surucu.jpg",
      "/media/galeri/paspas-seti/16-mavi-on-yolcu.jpg",
      "/media/galeri/paspas-seti/17-bej-arka-sira.jpg",
      "/media/galeri/paspas-seti/18-bej-surucu.jpg",
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
      "/media/galeri/bagaj-havuzu/01-taba-bagaj.jpg",
      "/media/galeri/bagaj-havuzu/02-siyah-bagaj.jpg",
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
      "/media/galeri/bagaj-cantasi/01-koleksiyon-kahve.jpg",
      "/media/galeri/bagaj-cantasi/02-koleksiyon-mavi.jpg",
      "/media/galeri/bagaj-cantasi/03-bagajda-kullanim.jpg",
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
    slug: "hali-oto-paspas-seti",
    name: "Halı Oto Paspas Seti",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "hali-paspas",
    price: 1250,
    oldPrice: 1650,
    badge: "Yeni",
    image: "/media/galeri/hali-paspas/01-siyah-on.jpg",
    gallery: [
      "/media/galeri/hali-paspas/01-siyah-on.jpg",
      "/media/galeri/hali-paspas/02-siyah-arka.jpg",
    ],
    description:
      "Aracınıza özel kesim, kenarları overloklu premium halı paspas seti. Yumuşak dokusuyla konfor sağlarken kaymaz tabanı sayesinde yerinden oynamaz. Ön ve arka sıra için tam takımdır.",
    features: [
      "Araca özel kesim, tam uyum",
      "Kenar overlok dikişli, şık görünüm",
      "Kaymaz taban — sabit durur",
      "Yumuşak, yoğun halı dokusu",
      "Yıkanabilir, kolay bakım",
    ],
    setContents: ["Ön sürücü paspası", "Ön yolcu paspası", "Arka sıra paspasları"],
    optionalExtras: ["Bagaj paspası"],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "premium-direksiyon-kilifi",
    name: "Premium Direksiyon Kılıfı",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "direksiyon-kilifi",
    price: 450,
    oldPrice: 650,
    badge: "Yeni",
    image: "/media/scraped/evaotopaspas/direksiyon-kilifi/01-direksiyon-kilifi.jpeg",
    gallery: [
      "/media/scraped/evaotopaspas/direksiyon-kilifi/01-direksiyon-kilifi.jpeg",
    ],
    description:
      "Yüksek kaliteli suni deriden üretilen, zarif dikiş işçilikli premium direksiyon kılıfı. Kaymaz yüzeyiyle daha iyi kavrama ve sürüş konforu sağlar, direksiyonunuzu aşınma ve güneşe karşı korur.",
    features: [
      "Premium suni deri, uzun ömürlü",
      "Kaymaz yüzey — konforlu tutuş",
      "Standart direksiyonlara tam uyum",
      "Aşınma ve güneşe karşı koruma",
      "Silerek kolayca temizlenir",
    ],
    setContents: ["1 adet direksiyon kılıfı"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "arac-ekran-koruyucu",
    name: "Araç Ekran Koruyucu",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "ekran-koruyucu",
    price: 350,
    oldPrice: 500,
    badge: "Yeni",
    image: "/media/scraped/evaotopaspas/ekran-koruyucu/01-ekran-koruyucu.jpg",
    gallery: [
      "/media/scraped/evaotopaspas/ekran-koruyucu/01-ekran-koruyucu.jpg",
    ],
    description:
      "Aracınızın multimedya ve gösterge ekranını çizilmeye, toza ve parmak izine karşı koruyan şeffaf ekran koruyucu. Araca özel kesim sayesinde ekranınıza tam oturur, dokunmatik hassasiyetini etkilemez.",
    features: [
      "Araca özel kesim, tam uyum",
      "Çizilmeye karşı koruma",
      "Parmak izi ve toz tutmaz",
      "Dokunmatik hassasiyetini korur",
      "Kabarcıksız kolay montaj",
    ],
    setContents: ["1 adet ekran koruyucu"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },
  {
    slug: "ortopedik-minder-seti",
    name: "Ortopedik Oto Minder Seti",
    brand: "OTO POLİK",
    model: "Tüm Modeller",
    category: "minder-seti",
    price: 950,
    oldPrice: 1350,
    badge: "Yeni",
    image: "/media/scraped/evaotopaspas/minder-seti/01-minder-seti.jpg",
    gallery: [
      "/media/scraped/evaotopaspas/minder-seti/01-minder-seti.jpg",
    ],
    description:
      "Terletmeyen kumaşı ve ortopedik dolgusuyla uzun yolculuklarda konfor sağlayan oto minder seti. Cepli tasarımı ile pratik saklama alanı sunar, koltuklarınızı aşınma ve lekelere karşı korur.",
    features: [
      "Ortopedik dolgu — uzun yolda konfor",
      "Terletmeyen nefes alan kumaş",
      "Cepli tasarım, pratik saklama",
      "Koltukları aşınma ve lekeye karşı korur",
      "Çoğu araç koltuğuna uyumlu",
    ],
    setContents: ["Ön koltuk minderleri", "Boyun yastıkları"],
    optionalExtras: [],
    dispatchEstimate: "1-3 iş günü",
  },
];

export const CATEGORY_LABELS: Record<Product["category"], string> = {
  "eva-3d": "3D EVA Paspas",
  "eva-havuzlu": "Havuzlu EVA Paspas",
  "hali-paspas": "Halı Paspas",
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
