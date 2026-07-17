import { describe, expect, it } from "vitest";

import { buildContentGroundingFacts } from "@/lib/ai/content-grounding";
import { getProductBySlug } from "@/lib/products";
import { getVehiclePrice } from "@/lib/vehicle-data";

describe("content grounding", () => {
  it("copies known product facts without changing catalog values", () => {
    const product = getProductBySlug("eva-oto-paspas-seti");
    const result = buildContentGroundingFacts({
      kind: "product_description",
      targetSlug: "eva-oto-paspas-seti",
    });

    expect(product).toBeDefined();
    expect(result.ok).toBe(true);
    if (!result.ok || !product) return;
    expect(result.facts.product.price).toBe(product.price);
    expect(result.facts.product.features).toEqual(product.features);
    expect(result.serialized).toContain(product.name);
  });

  it("returns an explicit not-found result for an unknown slug", () => {
    const result = buildContentGroundingFacts({
      kind: "product_seo",
      targetSlug: "uydurma-urun-999",
    });

    expect(result.ok).toBe(false);
    expect(result.serialized).not.toContain('"price"');
    expect(result.serialized).not.toContain("Uydurma Ürün");
  });

  it("copies vehicle metadata and code-owned price when supplied", () => {
    const result = buildContentGroundingFacts({
      kind: "faq",
      targetSlug: "eva-oto-paspas-seti",
      vehicle: { brand: "BMW", model: "3 Serisi Sedan" },
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.facts.vehicle?.price).toBe(
      getVehiclePrice("BMW", "3 Serisi Sedan")
    );
    expect(result.facts.vehicle?.bodyType).toBe("Sedan");
  });
});
