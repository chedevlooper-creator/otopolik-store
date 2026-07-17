import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import { getCustomerMatPrice } from "@/lib/ai/customer-tools";
import { CONFIGURATOR_SYSTEM_PROMPT } from "@/lib/ai/configurator-prompt";
import { CONFIGURATOR_CHAT_GOLDEN_CASES } from "@/lib/ai/evals/configurator-chat-golden";
import { buildConfiguredMatCartItem } from "@/lib/configurator-cart-item";
import { calculateMatPrice } from "@/lib/mat-pricing";

describe("configurator chat golden eval", () => {
  it("covers at least eight representative configurations", () => {
    expect(CONFIGURATOR_CHAT_GOLDEN_CASES.length).toBeGreaterThanOrEqual(8);
  });

  it.each(CONFIGURATOR_CHAT_GOLDEN_CASES)(
    "$id keeps tool and cart prices equal to calculateMatPrice",
    ({ vehicle, floor, edge, heelPad, trunkMat }) => {
      const options = { heelPad, trunkMat };
      const expectedPrice = calculateMatPrice(options);
      const item = buildConfiguredMatCartItem({
        vehicle,
        floor,
        edge,
        heelPad,
        trunkMat,
      });

      expect(getCustomerMatPrice(options)).toBe(expectedPrice);
      expect(item).not.toBeNull();
      expect(item?.price).toBe(expectedPrice);
      expect(item?.configuration).toMatchObject({
        baseColor: floor.name,
        edgeColor: edge.name,
        heelPad,
        trunkMat,
      });
    }
  );

  it("locks Turkish flow vocabulary and AI disclosure into the prompt", () => {
    expect(CONFIGURATOR_SYSTEM_PROMPT).toContain("AI Asistan");
    expect(CONFIGURATOR_SYSTEM_PROMPT).toMatch(/taban/i);
    expect(CONFIGURATOR_SYSTEM_PROMPT).toMatch(/kenar/i);
    expect(CONFIGURATOR_SYSTEM_PROMPT).toMatch(/topuk/i);
    expect(CONFIGURATOR_SYSTEM_PROMPT).toMatch(/bagaj/i);
    expect(CONFIGURATOR_SYSTEM_PROMPT).toMatch(/insan.*temsilci/i);
    expect(CONFIGURATOR_SYSTEM_PROMPT).toMatch(/fiyat.*uydurmak/i);
  });

  it("keeps chat tools and route isolated from admin mutations", () => {
    const sources = [
      "src/lib/ai/configurator-tools.ts",
      "src/app/api/ai/chat/route.ts",
    ].map((file) => readFileSync(resolve(process.cwd(), file), "utf8"));

    for (const source of sources) {
      expect(source).not.toMatch(/adminKey|requireAdminKey|convex\/.*admin/i);
      expect(source).not.toMatch(
        /\b(useMutation|mutation|internalMutation)\b/
      );
    }
  });

  it("does not accept a model-supplied price override", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/configurator-cart-item.ts"),
      "utf8"
    );

    expect(source).toContain("calculateMatPrice");
    expect(source).not.toMatch(/overridePrice|modelPrice|input\.price/);
  });
});
