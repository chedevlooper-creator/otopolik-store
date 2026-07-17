import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  getCustomerMatPrice,
  getCustomerVehiclePrice,
} from "@/lib/ai/customer-tools";
import { calculateMatPrice } from "@/lib/mat-pricing";
import { getVehiclePrice } from "@/lib/vehicle-data";

describe("customer-only AI tools", () => {
  it("returns vehicle prices from the catalog pricing function", () => {
    expect(getCustomerVehiclePrice("Volkswagen", "Passat Sedan")).toBe(
      getVehiclePrice("Volkswagen", "Passat Sedan")
    );
  });

  it("returns configured prices from the central pricing function", () => {
    const options = { heelPad: true, trunkMat: true };

    expect(getCustomerMatPrice(options)).toBe(calculateMatPrice(options));
  });

  it("has no admin authentication or mutation imports", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/ai/customer-tools.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/adminKey|requireAdminKey|convex\/.*admin/i);
    expect(source).not.toMatch(/\b(useMutation|mutation|internalMutation)\b/);
  });
});
