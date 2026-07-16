/** Maps vehicle brand names to logo files under /media/galeri/markalar/ */
const BRAND_LOGO_SLUGS: Record<string, string> = {
  Audi: "audi",
  BMW: "bmw",
  Chevrolet: "chevrolet",
  Chrysler: "chrysler",
  Cupra: "cupra",
  Dacia: "dacia",
  Dodge: "dodge",
  Fiat: "fiat",
  Geely: "geely",
  Infiniti: "infiniti",
  Isuzu: "isuzu",
  Jeep: "jeep",
  "Land Rover": "land-rover",
  Mazda: "mazda",
  Mini: "mini",
  "MINI": "mini",
  Nissan: "nissan",
  Opel: "opel",
  Saab: "saab",
  Seat: "seat",
  SEAT: "seat",
  SsangYong: "ssangyong",
  Suzuki: "suzuki",
  Tesla: "tesla",
  Togg: "togg",
  TOGG: "togg",
  Volkswagen: "volkswagen",
};

export function getBrandLogoSrc(brand: string): string | null {
  const slug = BRAND_LOGO_SLUGS[brand];
  if (!slug) return null;
  return `/media/galeri/markalar/${slug}.png`;
}

/** Featured brands shown first in the homepage carousel */
export const FEATURED_BRANDS = [
  "BMW",
  "Audi",
  "Volkswagen",
  "Mercedes-Benz",
  "Toyota",
  "Honda",
  "Jeep",
  "Ford",
  "Hyundai",
  "Fiat",
  "Opel",
  "Renault",
  "Peugeot",
  "Skoda",
  "Seat",
  "Cupra",
  "Dacia",
  "Nissan",
  "Mazda",
  "Tesla",
  "Togg",
] as const;
