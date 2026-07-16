// =============================================================
// OTO POLİK — Araç SEO Landing Sayfaları
// =============================================================
// Her araç markası + modeli için benzersiz SEO içeriği üretir.
// URL yapısı: /arac/[brand]-[model]
// =============================================================

import {
  getAllBrands,
  getModelsByBrand,
  getVehiclePrice,
} from "./vehicle-data";
import { siteConfig } from "./site-config";

export type PriceTier = {
  label: string;
  description: string;
  price: number;
  isPopular?: boolean;
};

export type Review = {
  name: string;
  model: string;
  rating: number;
  text: string;
  date: string;
};

type VehiclePageContent = {
  brand: string;
  model: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subtitle: string;
  description: string;
  features: string[];
  price: number;
  priceTiers: PriceTier[];
  reviews: Review[];
  ctaLabel: string;
  whatsappMessage: string;
  faqItems: { q: string; a: string }[];
};

// ── Slug helpers ──

function slugify(text: string): string {
  return text
    .toLocaleLowerCase("tr-TR")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function vehicleToSlug(brand: string, model: string): string {
  return `${slugify(brand)}-${slugify(model)}`;
}

export function slugToVehicle(slug: string): { brand: string; model: string } | null {
  const brands = getAllBrands();

  for (const brand of brands) {
    const brandSlug = slugify(brand);
    if (!slug.startsWith(brandSlug + "-")) continue;

    const modelsList = getModelsByBrand(brand);
    for (const vehicle of modelsList) {
      const modelSlug = slugify(vehicle.name);
      const fullSlug = `${brandSlug}-${modelSlug}`;
      if (fullSlug === slug) {
        return { brand, model: vehicle.name };
      }
    }

    // Fallback: model slug may not match exactly; try prefix match
    const modelPart = slug.slice(brandSlug.length + 1);
    for (const vehicle of modelsList) {
      if (slugify(vehicle.name) === modelPart) {
        return { brand, model: vehicle.name };
      }
    }
  }

  return null;
}

// ── Body type labels (Turkish) ──

const BODY_LABELS: Record<string, string> = {
  Hatchback: "Hatchback",
  Sedan: "Sedan",
  SUV: "SUV",
  Crossover: "Crossover",
  Coupe: "Coupe",
  Cabrio: "Cabrio",
  Roadster: "Roadster",
  "Station Wagon": "Station Wagon",
  MPV: "MPV",
  Van: "Van",
  Pickup: "Pickup",
  Microcar: "Microcar",
  Liftback: "Liftback",
  Sportback: "Sportback",
  Fastback: "Fastback",
};

// ── Content generation ──

function getBodyTypeLabel(model: string): string {
  const lower = model.toLowerCase();
  for (const [key, label] of Object.entries(BODY_LABELS)) {
    if (lower.includes(key.toLowerCase())) return label;
  }
  return "Araç";
}

function getBodyTypeCategory(model: string): string {
  const lower = model.toLowerCase();
  if (lower.includes("suv") || lower.includes("crossover")) return "SUV/Crossover";
  if (lower.includes("sedan")) return "sedan";
  if (lower.includes("hatchback") || lower.includes("coupe")) return "hatchback/coupe";
  if (lower.includes("wagon") || lower.includes("mpv") || lower.includes("van")) return "aile/çok amaçlı";
  return "araç";
}

export function generateVehicleContent(
  brand: string,
  model: string
): VehiclePageContent {
  const slug = vehicleToSlug(brand, model);
  const price = getVehiclePrice(brand, model);
  const bodyLabel = getBodyTypeLabel(model);
  const cleanModel = model.replace(/\s*(Hatchback|Sedan|SUV|Coupe|Cabrio|MPV|Van|Station Wagon|Crossover|Pickup|Liftback|Sportback|Fastback|Roadster|Microcar)$/i, "").trim();

  const title = `${brand} ${cleanModel} Paspas — Araca Özel EVA Paspas Seti`;
  const metaTitle = `${brand} ${cleanModel} Paspas | OTO POLİK — Araca Özel EVA`;
  const metaDescription = `${brand} ${cleanModel} modeli için CNC kesim, araca özel EVA paspas seti. Su geçirmez, 4 mevsim koruma. Ücretsiz kargo ve kapıda ödeme seçeneği.`;

  const h1 = `${brand} ${cleanModel}\nAraca Özel Paspas`;
  const subtitle = `${brand} ${cleanModel} ${bodyLabel} için özel kalıp, premium EVA malzeme ve milimetrik uyum.`;

  const description = `Her ${brand} ${cleanModel} sahibi bilir: standart paspaslar araç tabanına tam oturmaz, kayar, su ve çamuru içinde tutamaz. OTO POLİK olarak ${brand} ${cleanModel} modelinin taban ölçülerini biliyor, her bir paspası CNC kesimle aracınıza özel üretiyoruz. ${bodyLabel} kategorisindeki bu araç için optimize edilmiş paspas setimiz, ${brand} ${cleanModel} tabanının tüm kıvrımlarını takip eder.`;

  const features = [
    `${brand} ${cleanModel} için CNC hassas kesim — milimetrik uyum`,
    "Petek dokulu yüzey — su, çamur ve tozu hapseder",
    "Kaymaz taban, güçlendirilmiş topukluk",
    "Su geçirmez, 4 mevsim koruma",
    "Kokusuz, esnek premium EVA malzeme",
    "Tek sıkım suyla saniyeler içinde temizlenir",
    `${brand} ${cleanModel} taban ölçüleriyle tam uyum garantisi`,
  ];

  const whatsappMessage = `Merhaba, ${brand} ${cleanModel} için araca özel EVA paspas seti hakkında bilgi almak istiyorum. Araç bilgilerim: ${brand} ${cleanModel}, ${bodyLabel}. Fiyat ve teslimat bilgisi paylaşır mısınız?`;

  // ── Fiyat tablosu ──
  const basePrice = price;
  const heelPadPrice = siteConfig.matHeelPadPrice;
  const trunkMatPrice = siteConfig.matTrunkPrice;

  const priceTiers: PriceTier[] = [
    {
      label: "Temel Set",
      description: "Ön sürücü, ön yolcu + arka koltuk (4 parça)",
      price: basePrice,
    },
    {
      label: "Artı Topuk Pedi",
      description: "Temel set + sürücü topuk koruma pedi",
      price: basePrice + heelPadPrice,
    },
    {
      label: "Artı Bagaj",
      description: "Temel set + bagaj paspası",
      price: basePrice + trunkMatPrice,
    },
    {
      label: "Full Set",
      description: "Temel set + topuk pedi + bagaj paspası",
      price: basePrice + heelPadPrice + trunkMatPrice,
      isPopular: true,
    },
  ];

  // ── Müşteri yorumları ──
  const reviews: Review[] = [
    {
      name: "Ahmet Y.",
      model: `${brand} ${model}`,
      rating: 5,
      text: `${brand} ${cleanModel} için sipariş verdim, paspaslar aracıma tıpatıp uydu. Kalite gerçekten beklentimin üzerinde.`,
      date: "Mayıs 2026",
    },
    {
      name: "Zeynep K.",
      model: `${brand} ${model}`,
      rating: 5,
      text: "Daha önce iki farklı marka paspas kullandım, hiçbiri OTO POLİK kalitesinde değil. Özellikle su geçirmez yapısı kışın çok işe yarıyor.",
      date: "Mayıs 2026",
    },
    {
      name: "Mehmet D.",
      model: `${brand} ${model}`,
      rating: 4,
      text: `Montajı çok kolay, hemen yerine oturdu. ${cleanModel} taban ölçüleriyle milimetrik uyum sağladı. Tek sıkıntım kargoda biraz gecikme oldu.`,
      date: "Nisan 2026",
    },
    {
      name: "Elif S.",
      model: `${brand} ${model}`,
      rating: 5,
      text: "Temizlemesi inanılmaz kolay! Çamurlu bir haftasonundan sonra tek sıkım suyla tertemiz oldu. Kesinlikle tavsiye ederim.",
      date: "Mayıs 2026",
    },
  ];

  const faqItems = [
    {
      q: `${brand} ${cleanModel} için paspas ne kadardır?`,
      a: `${brand} ${cleanModel} paspas setimiz ${price.toLocaleString("tr-TR")}₺ başlangıç fiyatıyla satılmaktadır. Set ön sürücü, ön yolcu ve arka sıra paspaslarını kapsar. Bagaj havuzu ve topukluk gibi opsiyonel ekstralara da sahip olabilirsiniz.`,
    },
    {
      q: `${brand} ${cleanModel} paspas seti ne zaman kargoya verilir?`,
      a: `Sipariş onayından sonra ${brand} ${cleanModel} paspas setiniz 1-3 iş günü içinde üretilip kargoya verilir. Kargo ücreti ${siteConfig.freeShippingThreshold.toLocaleString("tr-TR")}₺ üzeri alışverişlerde ücretsizdir.`,
    },
    {
      q: `${brand} ${cleanModel} paspas hangi renklerde mevcut?`,
      a: `${brand} ${cleanModel} paspas setimiz Siyah, Gri ve Bej olmak üzere 3 standart renkte üretilmektedir. Aracınızın iç mekan rengine uygun renk seçimi için WhatsApp'tan bize danışabilirsiniz.`,
    },
    {
      q: `${brand} ${cleanModel} paspas su geçirmez mi?`,
      a: `Evet, ${brand} ${cleanModel} paspas setimiz tamamen su geçirmez EVA malzemeden üretilmektedir. Su ve çamuru içinde hapseder, kaymaz taban sayesinde araç içinde güvenle kullanılır.`,
    },
  ];

  return {
    brand,
    model: cleanModel,
    slug,
    title,
    metaTitle,
    metaDescription,
    h1,
    subtitle,
    description,
    features,
    price,
    priceTiers,
    reviews,
    ctaLabel: `${brand} ${cleanModel} Paspası Sipariş Et`,
    whatsappMessage,
    faqItems,
  };
}

// ── Static params generation ──

export function getAllVehicleSlugs(): { slug: string }[] {
  const slugs: { slug: string }[] = [];
  const brands = getAllBrands();

  for (const brand of brands) {
    const models = getModelsByBrand(brand);
    for (const vehicle of models) {
      slugs.push({ slug: vehicleToSlug(brand, vehicle.name) });
    }
  }

  return slugs;
}

// ── Popular vehicles for homepage linking ──

export const POPULAR_VEHICLES = [
  { brand: "Fiat", model: "Egea Sedan" },
  { brand: "Volkswagen", model: "Golf Hatchback" },
  { brand: "Renault", model: "Clio Hatchback" },
  { brand: "Toyota", model: "Corolla Sedan" },
  { brand: "Hyundai", model: "i20 Hatchback" },
  { brand: "Ford", model: "Focus Hatchback" },
  { brand: "Opel", model: "Astra Hatchback" },
  { brand: "Peugeot", model: "308 Hatchback" },
  { brand: "Seat", model: "Leon Hatchback" },
  { brand: "BMW", model: "3 Serisi Sedan" },
  { brand: "Mercedes-Benz", model: "C Serisi Sedan" },
  { brand: "Audi", model: "A3 Hatchback" },
] as const;
