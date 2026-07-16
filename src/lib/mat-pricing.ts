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
} as const;

type MatPriceOptions = {
  basePrice?: number;
  heelPad?: boolean;
  trunkMat?: boolean;
  heelPadPrice?: number;
  trunkMatPrice?: number;
};

export function calculateMatPrice({
  basePrice = MAT_PRICING.basePrice,
  heelPad = false,
  trunkMat = false,
  heelPadPrice = MAT_PRICING.heelPadPrice,
  trunkMatPrice = MAT_PRICING.trunkMatPrice,
}: MatPriceOptions = {}): number {
  return (
    basePrice +
    (heelPad ? heelPadPrice : 0) +
    (trunkMat ? trunkMatPrice : 0)
  );
}
