import { describe, expect, it, vi } from "vitest";

import { runVehicleMatch } from "@/lib/ai/vehicle-match";
import { VEHICLE_MATCH_GOLDEN_CASES } from "@/lib/ai/evals/vehicle-match-golden";
import { getVehiclePrice } from "@/lib/vehicle-data";

const ENGLISH_STOP_WORDS = /\b(the|and|your|vehicle|please|try|match)\b/gi;

describe("vehicle match golden evaluation", () => {
  vi.stubEnv("ANTHROPIC_API_KEY", "");
  vi.stubEnv("AI_FEATURES_ENABLED", "true");

  it("contains at least 20 Turkish-domain cases", () => {
    expect(VEHICLE_MATCH_GOLDEN_CASES.length).toBeGreaterThanOrEqual(20);
    expect(
      VEHICLE_MATCH_GOLDEN_CASES.some(({ input }) =>
        /[çğıöşü]|model|kasa|sedan|araç/i.test(input)
      )
    ).toBe(true);
  });

  it.each(VEHICLE_MATCH_GOLDEN_CASES)(
    "$name",
    async ({ input, expected }) => {
      const result = await runVehicleMatch(input);

      expect(result.status).toBe(expected.status);
      if (expected.status === "matched") {
        expect(expected.priceTier).toBe(
          getVehiclePrice(expected.brand, expected.model)
        );
        expect(result.status).toBe("matched");
        if (result.status !== "matched") return;
        expect(result.candidate).toMatchObject({
          brand: expected.brand,
          model: expected.model,
          priceTier: expected.priceTier,
        });
      }

      if (result.status === "no_match" && result.message) {
        const englishWords = result.message.match(ENGLISH_STOP_WORDS) ?? [];
        expect(englishWords.length).toBeLessThanOrEqual(1);
      }
    }
  );
});
