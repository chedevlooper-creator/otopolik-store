import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it, vi } from "vitest";

import { draftOrderSummary } from "@/lib/ai/support-tools";
import { SUPPORT_SYSTEM_PROMPT } from "@/lib/ai/support-prompt";
import {
  OFF_TOPIC_GOLDEN_PROMPTS,
  SUPPORT_GROUNDING_GOLDEN_CASES,
  SUPPORT_PRICE_GOLDEN_CASES,
  USER_SENDS_CONTRACT,
} from "@/lib/ai/evals/support-chat-golden";
import {
  buildSupportGroundingFacts,
  type SupportGroundingDependencies,
} from "@/lib/ai/support-grounding";
import type { SiteSettings } from "@/lib/site-settings";
import { calculateMatPrice } from "@/lib/mat-pricing";

function settings(freeShippingThreshold: number, shippingFee: number): SiteSettings {
  return {
    phoneDisplay: "0850 000 00 00",
    whatsappNumber: "905550000000",
    email: "destek@example.com",
    address: "İstanbul",
    instagram: "otopolik",
    freeShippingThreshold,
    shippingFee,
    estimatedDispatch: "1-3 iş günü",
    businessHours: "09:00–18:00",
    matBasePrice: 0,
    matHeelPadPrice: 0,
    matTrunkPrice: 0,
  };
}

function dependencies(
  getStoreSettings: SupportGroundingDependencies["getStoreSettings"]
): SupportGroundingDependencies {
  return {
    getStoreSettings,
    getFaqs: vi.fn(async () => ({
      source: "convex" as const,
      items: [
        {
          sortOrder: 1,
          question: "Kargo",
          answer:
            "{freeShippingThreshold} TL üzeri ücretsiz, aksi durumda {shippingFee} TL.",
          isPublished: true,
        },
      ],
    })),
    getContentPage: vi.fn(async () => ({
      source: "convex" as const,
      page: null,
      sections: [
        {
          pageSlug: "kargo",
          sectionKey: "shipping",
          sortOrder: 1,
          body:
            "{freeShippingThreshold} TL üzeri ücretsiz, ücret {shippingFee} TL.",
          isPublished: true,
        },
      ],
    })),
  };
}

describe("support chat golden eval", () => {
  it("rebuilds grounding from changed live shipping settings", async () => {
    let current = SUPPORT_GROUNDING_GOLDEN_CASES[0]!;
    const getStoreSettings = vi.fn(async () =>
      settings(current.freeShippingThreshold, current.shippingFee)
    );
    const deps = dependencies(getStoreSettings);

    const first = await buildSupportGroundingFacts(deps);
    current = SUPPORT_GROUNDING_GOLDEN_CASES[1]!;
    const second = await buildSupportGroundingFacts(deps);

    expect(first.settings).toMatchObject({
      freeShippingThreshold:
        SUPPORT_GROUNDING_GOLDEN_CASES[0]?.freeShippingThreshold,
      shippingFee: SUPPORT_GROUNDING_GOLDEN_CASES[0]?.shippingFee,
    });
    expect(second.settings).toMatchObject({
      freeShippingThreshold:
        SUPPORT_GROUNDING_GOLDEN_CASES[1]?.freeShippingThreshold,
      shippingFee: SUPPORT_GROUNDING_GOLDEN_CASES[1]?.shippingFee,
    });
    expect(first.faqs[0]?.answer).toContain("3.500");
    expect(second.faqs[0]?.answer).toContain("5.250");
    expect(second.faqs[0]?.answer).toContain("189");
    expect(getStoreSettings).toHaveBeenCalledTimes(2);
  });

  it.each(SUPPORT_PRICE_GOLDEN_CASES)(
    "$id keeps order draft pricing equal to calculateMatPrice",
    ({ heelPad, trunkMat }) => {
      const result = draftOrderSummary({
        vehicleBrand: "BMW",
        vehicleModel: "3 Serisi",
        floorColor: "Gece Siyahı",
        edgeColor: "Alev Kırmızı",
        heelPad,
        trunkMat,
      });

      expect(result.price).toBe(calculateMatPrice({ heelPad, trunkMat }));
      expect(result.draft).toContain(result.price.toLocaleString("tr-TR"));
    }
  );

  it("locks AI disclosure, grounding, no-invention, and scoped refusal", () => {
    expect(OFF_TOPIC_GOLDEN_PROMPTS.length).toBeGreaterThanOrEqual(4);
    expect(SUPPORT_SYSTEM_PROMPT).toContain("AI Asistan");
    expect(SUPPORT_SYSTEM_PROMPT).toMatch(/yapay zekâ/i);
    expect(SUPPORT_SYSTEM_PROMPT).toMatch(/get_support_grounding/);
    expect(SUPPORT_SYSTEM_PROMPT).toMatch(/fiyat.*uydurmak|sayı.*uydurmak/i);
    expect(SUPPORT_SYSTEM_PROMPT).toMatch(/kapsam dışı/i);
    expect(SUPPORT_SYSTEM_PROMPT).toMatch(/açık alan yanıtı verme/i);
  });

  it("isolates support surfaces from admin, order writes, and transcripts", () => {
    const sources = [
      "src/lib/ai/support-tools.ts",
      "src/app/api/ai/support/route.ts",
      "src/components/support/SupportChat.tsx",
    ].map((file) => readFileSync(resolve(process.cwd(), file), "utf8"));

    for (const source of sources) {
      expect(source).not.toMatch(/adminKey|requireAdminKey|convex\/.*admin/i);
      expect(source).not.toMatch(
        /\b(useMutation|mutation|internalMutation|orders\.create)\b/
      );
      expect(source).not.toMatch(
        /chatSessions|chatMessages|persistTranscript|saveTranscript/i
      );
    }
  });

  it("keeps WhatsApp handoff user-initiated", () => {
    const tools = readFileSync(
      resolve(process.cwd(), "src/lib/ai/support-tools.ts"),
      "utf8"
    );
    const route = readFileSync(
      resolve(process.cwd(), "src/app/api/ai/support/route.ts"),
      "utf8"
    );
    const ui = readFileSync(
      resolve(process.cwd(), "src/components/support/SupportChat.tsx"),
      "utf8"
    );

    expect(USER_SENDS_CONTRACT).toMatch(/kullanıcı.*gönder/i);
    expect(tools).not.toMatch(/fetch\s*\(\s*["'`]https:\/\/wa\.me/i);
    expect(route).not.toMatch(/window\.open|wa\.me/i);
    expect(ui).not.toMatch(/window\.open/);
    expect(ui).toContain(
      "href={buildWhatsAppLink(settings.whatsappNumber, whatsAppDraft)}"
    );
  });

  it("exposes the deterministic package gate", () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8")
    ) as { scripts?: Record<string, string> };

    expect(packageJson.scripts?.["ai:eval:support-chat"]).toBe(
      "vitest run src/lib/ai/evals/support-chat-eval.test.ts"
    );
  });
});
