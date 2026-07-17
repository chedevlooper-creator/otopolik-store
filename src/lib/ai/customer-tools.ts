import { calculateMatPrice } from "@/lib/mat-pricing";
import { getVehiclePrice } from "@/lib/vehicle-data";

export type CustomerMatPriceOptions = {
  heelPad?: boolean;
  trunkMat?: boolean;
};

export function getCustomerVehiclePrice(
  brand: string,
  model: string
): number {
  return getVehiclePrice(brand, model);
}

export function getCustomerMatPrice(
  options: CustomerMatPriceOptions = {}
): number {
  return calculateMatPrice(options);
}
