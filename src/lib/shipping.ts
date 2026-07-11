import { siteConfig } from "./site-config";

export function getShippingCost(subtotal: number) {
  return subtotal >= siteConfig.freeShippingThreshold ? 0 : siteConfig.shippingFee;
}

export function getRemainingForFreeShipping(subtotal: number) {
  return Math.max(0, siteConfig.freeShippingThreshold - subtotal);
}
