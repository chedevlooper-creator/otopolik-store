/**
 * EVA paspas fiyatlandırmasının tek kaynak noktası.
 *
 * Katalog yalnızca taban fiyatı gösterir. Konfigüratörler ise kullanıcının
 * gerçekten seçtiği ekstraları bu fiyatın üzerine ekler.
 */
export const MAT_PRICING = {
  basePrice: 3500,
  heelPadPrice: 500,
  trunkMatPrice: 1750,
  yerliBasePrice: 2350,
  yerliTrunkMatPrice: 1350,
  logoPrice: 150,
} as const;

export const BAG_PRICES = {
  "40cm": 1850,
  "50cm": 2000,
  "70cm": 2250,
  "90cm": 2500,
} as const;

export type BagSize = keyof typeof BAG_PRICES | "none";

type MatPriceOptions = {
  basePrice?: number;
  heelPad?: boolean;
  trunkMat?: boolean;
  heelPadPrice?: number;
  trunkMatPrice?: number;
  quality?: "ithal" | "yerli";
  logoCount?: number;
  logoPrice?: number;
  bagSize?: BagSize;
};

export function calculateMatPrice({
  basePrice,
  heelPad = false,
  trunkMat = false,
  heelPadPrice,
  trunkMatPrice,
  quality = "ithal",
  logoCount = 0,
  logoPrice = MAT_PRICING.logoPrice,
  bagSize = "none",
}: MatPriceOptions = {}): number {
  const resolvedBase = basePrice ?? (quality === "yerli" ? MAT_PRICING.yerliBasePrice : MAT_PRICING.basePrice);
  const resolvedTrunk = trunkMatPrice ?? (quality === "yerli" ? MAT_PRICING.yerliTrunkMatPrice : MAT_PRICING.trunkMatPrice);
  const resolvedHeelPad = heelPadPrice ?? MAT_PRICING.heelPadPrice;

  // Bag Pricing & Discount
  let bagPrice = 0;
  if (bagSize && bagSize !== "none") {
    const originalBagPrice = BAG_PRICES[bagSize] ?? 0;
    let discountPercent = 0;
    if (quality === "ithal" && trunkMat) {
      discountPercent = 0.50; // İthal takım full alana 50% indirim
    } else if (quality === "yerli") {
      discountPercent = 0.30; // Yerli kalite alana 30% indirim
    }
    bagPrice = originalBagPrice * (1 - discountPercent);
  }

  return (
    resolvedBase +
    (heelPad ? resolvedHeelPad : 0) +
    (trunkMat ? resolvedTrunk : 0) +
    (logoCount * logoPrice) +
    bagPrice
  );
}
