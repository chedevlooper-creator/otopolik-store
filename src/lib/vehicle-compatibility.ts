import type { Product } from "./types";

export const OTHER_VEHICLE_BRAND = "diger";

export type VehicleDetails = {
  brand: string;
  model: string;
  year: string;
  bodyOrChassis: string;
};

export const EMPTY_VEHICLE_DETAILS: VehicleDetails = {
  brand: "",
  model: "",
  year: "",
  bodyOrChassis: "",
};

const VEHICLE_REQUIRED_CATEGORIES = new Set<Product["category"]>([
  "eva-3d",
  "eva-havuzlu",
  "bagaj",
  "bagaj-havuzu",
]);

const VEHICLE_REQUIRED_SLUGS = new Set([
  "eva-oto-paspas-seti",
  "eva-oto-bagaj-havuzu",
]);

export function productRequiresVehicle(product: Pick<Product, "category">): boolean {
  return VEHICLE_REQUIRED_CATEGORIES.has(product.category);
}

export function cartItemRequiresVehicle(slug: string): boolean {
  return slug.startsWith("ozel-tasarim-") || VEHICLE_REQUIRED_SLUGS.has(slug);
}

export function isVehicleDetailsComplete(details: VehicleDetails): boolean {
  return Boolean(
    details.brand.trim() &&
      details.model.trim() &&
      /^\d{4}$/.test(details.year.trim()) &&
      details.bodyOrChassis.trim().length >= 2
  );
}

export function formatVehicleLabel(details: VehicleDetails): string {
  const brandAndModel =
    details.brand === OTHER_VEHICLE_BRAND
      ? details.model.trim()
      : `${details.brand.trim()} ${details.model.trim()}`.trim();

  return [brandAndModel, details.year.trim(), details.bodyOrChassis.trim()]
    .filter(Boolean)
    .join(" · ");
}

export function vehicleDetailsKey(details: VehicleDetails): string {
  return [details.brand, details.model, details.year, details.bodyOrChassis]
    .join("-")
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9çğıöşü]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
