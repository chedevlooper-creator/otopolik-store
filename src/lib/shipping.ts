import { siteConfig } from "./site-config";
import type { SiteSettings } from "./site-settings";

export function getShippingCost(
  subtotal: number,
  settings?: Pick<SiteSettings, "freeShippingThreshold" | "shippingFee">
) {
  const threshold = settings?.freeShippingThreshold ?? siteConfig.freeShippingThreshold;
  const fee = settings?.shippingFee ?? siteConfig.shippingFee;
  return subtotal >= threshold ? 0 : fee;
}

export function getRemainingForFreeShipping(
  subtotal: number,
  settings?: Pick<SiteSettings, "freeShippingThreshold">
) {
  const threshold = settings?.freeShippingThreshold ?? siteConfig.freeShippingThreshold;
  return Math.max(0, threshold - subtotal);
}
