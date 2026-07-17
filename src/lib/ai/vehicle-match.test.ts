import { afterEach, describe, expect, it, vi } from "vitest";

import { runVehicleMatch } from "@/lib/ai/vehicle-match";
import { getVehiclePrice } from "@/lib/vehicle-data";

describe("runVehicleMatch", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("matches a unique catalog vehicle without an AI key", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    const result = await runVehicleMatch("Honda City Sedan");

    expect(result.status).toBe("matched");
    if (result.status !== "matched") return;
    expect(result.candidate).toMatchObject({
      brand: "Honda",
      model: "City Sedan",
      source: "deterministic",
      priceTier: getVehiclePrice("Honda", "City Sedan"),
    });
  });

  it("returns all strong catalog candidates for an ambiguous model", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    const result = await runVehicleMatch("Passat");

    expect(result.status).toBe("needs_disambiguation");
    if (result.status !== "needs_disambiguation") return;
    expect(result.candidates.length).toBeGreaterThan(1);
    expect(result.candidates.every((candidate) => candidate.brand === "Volkswagen"))
      .toBe(true);
    for (const candidate of result.candidates) {
      expect(candidate.priceTier).toBe(
        getVehiclePrice(candidate.brand, candidate.model)
      );
    }
  });

  it("does not invent a vehicle when no catalog result exists", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    await expect(runVehicleMatch("uçan halı 9999")).resolves.toEqual({
      status: "no_match",
      message: "Aracınızı eşleştiremedik. Marka ve modeli ayrı yazarak deneyin.",
    });
  });

  it("keeps an extracted four-digit year on deterministic candidates", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    const result = await runVehicleMatch("2021 Honda City Sedan");

    expect(result.status).toBe("matched");
    if (result.status !== "matched") return;
    expect(result.candidate.year).toBe("2021");
  });
});
