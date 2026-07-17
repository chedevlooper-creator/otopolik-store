import type { ContentGenerationKind } from "@/lib/ai/content-prompt";
import { getProductBySlug } from "@/lib/products";
import { getModelsByBrand, getVehiclePrice } from "@/lib/vehicle-data";

type VehicleSelection = {
  brand: string;
  model: string;
};

type ProductGrounding = {
  slug: string;
  name: string;
  brand: string;
  model: string;
  category: string;
  price: number;
  features: string[];
  setContents: string[];
  optionalExtras: string[];
  compatibility: {
    yearRange: string;
    bodyOrChassis: string;
    note: string;
  };
};

type VehicleGrounding = VehicleSelection & {
  bodyType: string;
  price: number;
};

export type ContentGroundingResult =
  | {
      ok: true;
      facts: {
        kind: ContentGenerationKind;
        product: ProductGrounding;
        vehicle?: VehicleGrounding;
      };
      serialized: string;
    }
  | {
      ok: false;
      error: "product_not_found";
      facts: null;
      serialized: string;
    };

export function buildContentGroundingFacts({
  kind,
  targetSlug,
  vehicle,
}: {
  kind: ContentGenerationKind;
  targetSlug: string;
  vehicle?: VehicleSelection;
}): ContentGroundingResult {
  const product = getProductBySlug(targetSlug);
  if (!product) {
    return {
      ok: false,
      error: "product_not_found",
      facts: null,
      serialized: JSON.stringify({
        error: "product_not_found",
        targetSlug,
      }),
    };
  }

  const productFacts: ProductGrounding = {
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    model: product.model,
    category: product.category,
    price: product.price,
    features: [...product.features],
    setContents: [...product.setContents],
    optionalExtras: [...product.optionalExtras],
    compatibility: { ...product.compatibility },
  };

  let vehicleFacts: VehicleGrounding | undefined;
  if (vehicle) {
    const knownModel = getModelsByBrand(vehicle.brand).find(
      (candidate) => candidate.name === vehicle.model
    );
    if (knownModel) {
      vehicleFacts = {
        ...vehicle,
        bodyType: knownModel.bodyType,
        price: getVehiclePrice(vehicle.brand, vehicle.model),
      };
    }
  }

  const facts = {
    kind,
    product: productFacts,
    ...(vehicleFacts ? { vehicle: vehicleFacts } : {}),
  };

  return {
    ok: true,
    facts,
    serialized: JSON.stringify(facts, null, 2),
  };
}
