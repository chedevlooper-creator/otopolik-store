import {
  getAllBrands,
  getModelsByBrand,
  type VehicleBodyType,
} from "@/lib/vehicle-data";

export type VehicleSearchResult = {
  brand: string;
  model: string;
  displayModel: string;
  bodyType: VehicleBodyType;
  href: string;
  configuratorHref: string;
};

type IndexedVehicle = VehicleSearchResult & {
  normalizedBrand: string;
  normalizedModel: string;
  normalizedLabel: string;
  modelTokens: string[];
};

export function normalizeSearchText(value: string): string {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/[çÇ]/g, "c")
    .replace(/[ğĞ]/g, "g")
    .replace(/[ıİ]/g, "i")
    .replace(/[öÖ]/g, "o")
    .replace(/[şŞ]/g, "s")
    .replace(/[üÜ]/g, "u")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function slugifyVehiclePart(value: string): string {
  return normalizeSearchText(value).replace(/\s+/g, "-");
}

function buildVehicleHref(brand: string, model: string): string {
  return `/arac/${slugifyVehiclePart(brand)}-${slugifyVehiclePart(model)}`;
}

function buildConfiguratorHref(brand: string, model: string): string {
  const search = new URLSearchParams({ marka: brand, model });
  return `/olusturucu?${search.toString()}`;
}

function getDisplayModel(model: string, bodyType: VehicleBodyType): string {
  const normalizedModel = normalizeSearchText(model);
  const normalizedBodyType = normalizeSearchText(bodyType);

  if (!normalizedModel.endsWith(` ${normalizedBodyType}`)) return model;

  const suffixStart = model.length - bodyType.length;
  return model.slice(0, suffixStart).trim() || model;
}

const bodyTypePriority: Record<VehicleBodyType, number> = {
  Sedan: 0,
  Hatchback: 1,
  SUV: 2,
  Crossover: 3,
  Liftback: 4,
  Fastback: 5,
  Sportback: 6,
  "Station Wagon": 7,
  Coupe: 8,
  Cabrio: 9,
  Roadster: 10,
  MPV: 11,
  Van: 12,
  Pickup: 13,
  Microcar: 14,
};

const vehicleIndex: IndexedVehicle[] = getAllBrands().flatMap((brand) =>
  getModelsByBrand(brand).map(({ name: model, bodyType }) => {
    const normalizedBrand = normalizeSearchText(brand);
    const normalizedModel = normalizeSearchText(model);

    return {
      brand,
      model,
      displayModel: getDisplayModel(model, bodyType),
      bodyType,
      href: buildVehicleHref(brand, model),
      configuratorHref: buildConfiguratorHref(brand, model),
      normalizedBrand,
      normalizedModel,
      normalizedLabel: `${normalizedBrand} ${normalizedModel}`,
      modelTokens: normalizedModel.split(" "),
    };
  })
);

function getMatchScore(vehicle: IndexedVehicle, query: string, tokens: string[]): number {
  if (vehicle.normalizedModel === query) return 0;
  if (vehicle.normalizedBrand === query) return 1;
  if (vehicle.normalizedModel.startsWith(query)) return 2;
  if (vehicle.modelTokens.some((token) => token === query)) return 3;
  if (vehicle.modelTokens.some((token) => token.startsWith(query))) return 4;
  if (vehicle.normalizedLabel.startsWith(query)) return 5;
  if (tokens.every((token) => vehicle.normalizedLabel.includes(token))) return 6;
  if (vehicle.normalizedLabel.includes(query)) return 7;
  return Number.POSITIVE_INFINITY;
}

export function searchVehicles(query: string, limit = 8): VehicleSearchResult[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery || limit <= 0) return [];

  const tokens = normalizedQuery.split(" ");

  return vehicleIndex
    .map((vehicle) => ({
      vehicle,
      score: getMatchScore(vehicle, normalizedQuery, tokens),
    }))
    .filter(({ score }) => Number.isFinite(score))
    .sort(
      (left, right) =>
        left.score - right.score ||
        (normalizedQuery === left.vehicle.normalizedBrand
          ? 0
          : bodyTypePriority[left.vehicle.bodyType] -
            bodyTypePriority[right.vehicle.bodyType]) ||
        left.vehicle.normalizedLabel.localeCompare(
          right.vehicle.normalizedLabel,
          "tr-TR"
        )
    )
    .slice(0, limit)
    .map(({ vehicle }) => ({
      brand: vehicle.brand,
      model: vehicle.model,
      displayModel: vehicle.displayModel,
      bodyType: vehicle.bodyType,
      href: vehicle.href,
      configuratorHref: vehicle.configuratorHref,
    }));
}
