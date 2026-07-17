import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { getCustomerMatPrice } from "@/lib/ai/customer-tools";
import {
  draftOrderSummary,
  executeSupportGrounding,
  getSupportMatPrice,
  prepareWhatsAppHandoff,
} from "@/lib/ai/support-tools";
import { calculateMatPrice } from "@/lib/mat-pricing";

describe("support assistant tools", () => {
  it.each([
    { heelPad: false, trunkMat: false },
    { heelPad: true, trunkMat: false },
    { heelPad: false, trunkMat: true },
    { heelPad: true, trunkMat: true },
  ])("keeps support prices centralized for %o", (options) => {
    expect(getSupportMatPrice(options).price).toBe(calculateMatPrice(options));
    expect(getSupportMatPrice(options).price).toBe(
      getCustomerMatPrice(options)
    );
  });

  it("executes a fresh grounding builder for every tool call", async () => {
    const builder = vi
      .fn()
      .mockResolvedValueOnce({ settings: { freeShippingThreshold: 3_500 } })
      .mockResolvedValueOnce({ settings: { freeShippingThreshold: 5_000 } });

    await expect(executeSupportGrounding(builder)).resolves.toMatchObject({
      settings: { freeShippingThreshold: 3_500 },
    });
    await expect(executeSupportGrounding(builder)).resolves.toMatchObject({
      settings: { freeShippingThreshold: 5_000 },
    });
    expect(builder).toHaveBeenCalledTimes(2);
  });

  it("recomputes the order draft price and accepts no price override", () => {
    const input = {
      vehicleBrand: "BMW",
      vehicleModel: "3 Serisi",
      floorColor: "Gece Siyahı",
      edgeColor: "Alev Kırmızı",
      heelPad: true,
      trunkMat: true,
      notes: "2021 sedan",
    };
    const result = draftOrderSummary(input);

    expect(result.price).toBe(
      calculateMatPrice({ heelPad: true, trunkMat: true })
    );
    expect(result.currency).toBe("TRY");
    expect(result.draft).toContain("BMW 3 Serisi");
    expect(result.draft).toContain(result.price.toLocaleString("tr-TR"));
    expect(result.draft).toMatch(/kullanıcı.*gönder/i);
    expect(input).not.toHaveProperty("price");
  });

  it("prepares but never sends a WhatsApp message", () => {
    expect(
      prepareWhatsAppHandoff({ message: "İnsan desteği rica ediyorum." })
    ).toEqual({
      prepared: true,
      message: "İnsan desteği rica ediyorum.",
    });
  });

  it("keeps support tools and route isolated from admin and order mutations", () => {
    const sources = [
      "src/lib/ai/support-tools.ts",
      "src/app/api/ai/support/route.ts",
    ].map((file) => readFileSync(resolve(process.cwd(), file), "utf8"));

    for (const source of sources) {
      expect(source).not.toMatch(/adminKey|requireAdminKey|convex\/.*admin/i);
      expect(source).not.toMatch(
        /\b(useMutation|mutation|internalMutation|orders\.create)\b/
      );
      expect(source).not.toMatch(/chatSessions|chatMessages/i);
    }
  });
});
