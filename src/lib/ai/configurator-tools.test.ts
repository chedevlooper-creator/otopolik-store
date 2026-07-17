import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { getCustomerMatPrice } from "@/lib/ai/customer-tools";
import {
  executeMatchVehicle,
  setEdgeColorInputSchema,
  setFloorColorInputSchema,
} from "@/lib/ai/configurator-tools";
import { calculateMatPrice } from "@/lib/mat-pricing";

vi.mock("@/lib/ai/vehicle-match", () => ({
  runVehicleMatch: vi.fn(async (query: string) => ({
    status: "no_match" as const,
    message: query,
  })),
}));

describe("configurator assistant tools", () => {
  it.each([
    { heelPad: false, trunkMat: false },
    { heelPad: true, trunkMat: false },
    { heelPad: false, trunkMat: true },
    { heelPad: true, trunkMat: true },
  ])("keeps configured prices centralized for %o", (options) => {
    expect(getCustomerMatPrice(options)).toBe(calculateMatPrice(options));
  });

  it("delegates vehicle matching to the Phase 5 matcher", async () => {
    await expect(executeMatchVehicle({ query: "BMW 3 Serisi" })).resolves.toEqual({
      status: "no_match",
      message: "BMW 3 Serisi",
    });
  });

  it("rejects colors outside the real configurator palettes", () => {
    expect(() =>
      setFloorColorInputSchema.parse({ color: "Uydurma Altın" })
    ).toThrow();
    expect(() =>
      setEdgeColorInputSchema.parse({ color: "Uydurma Altın" })
    ).toThrow();
    expect(setFloorColorInputSchema.parse({ color: "Gece Siyahı" })).toEqual({
      color: "Gece Siyahı",
    });
    expect(setEdgeColorInputSchema.parse({ color: "Alev Kırmızı" })).toEqual({
      color: "Alev Kırmızı",
    });
  });

  it("has no admin authentication or mutation imports", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/ai/configurator-tools.ts"),
      "utf8"
    );

    expect(source).not.toMatch(/adminKey|requireAdminKey|convex\/.*admin/i);
    expect(source).not.toMatch(/\b(useMutation|mutation|internalMutation)\b/);
  });
});
