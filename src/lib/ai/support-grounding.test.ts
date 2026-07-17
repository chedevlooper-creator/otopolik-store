import { describe, expect, it, vi } from "vitest";

import {
  buildSupportGroundingFacts,
  type SupportGroundingDependencies,
} from "@/lib/ai/support-grounding";
import type { SiteSettings } from "@/lib/site-settings";

function createSettings(
  freeShippingThreshold: number,
  shippingFee = 149
): SiteSettings {
  return {
    phoneDisplay: "0850 000 00 00",
    whatsappNumber: "905550000000",
    email: "destek@example.com",
    address: "İstanbul",
    instagram: "otopolik",
    freeShippingThreshold,
    shippingFee,
    estimatedDispatch: "2 iş günü",
    businessHours: "09:00–18:00",
    matBasePrice: 1,
    matHeelPadPrice: 1,
    matTrunkPrice: 1,
  };
}

function createDependencies(
  getStoreSettings: SupportGroundingDependencies["getStoreSettings"]
): SupportGroundingDependencies {
  return {
    getFaqs: vi.fn(async () => ({
      source: "convex" as const,
      items: [
        {
          id: "faq-1",
          sortOrder: 1,
          question: "Ücretsiz kargo sınırı nedir?",
          answer: "{freeShippingThreshold} TL ve üzeri ücretsizdir.",
          isPublished: true,
        },
      ],
    })),
    getContentPage: vi.fn(async () => ({
      source: "convex" as const,
      page: {
        slug: "kargo",
        path: "/bilgiler/kargo",
        pageType: "utility" as const,
        metaTitle: "Kargo",
        metaDescription: "Kargo bilgileri",
        title: "Kargo",
        description: "Teslimat",
        isPublished: true,
        sortOrder: 1,
      },
      sections: [
        {
          pageSlug: "kargo",
          sectionKey: "shipping",
          sortOrder: 1,
          title: "Gönderim",
          body: "Kargo {shippingFee} TL, çıkış {estimatedDispatch}.",
          isPublished: true,
        },
      ],
    })),
    getStoreSettings,
  };
}

describe("support grounding", () => {
  it("interpolates live settings into FAQ and shipping copy", async () => {
    const facts = await buildSupportGroundingFacts(
      createDependencies(async () => createSettings(4_250))
    );

    expect(facts.faqs[0]?.answer).toContain("4.250");
    expect(facts.shippingSections[0]?.body).toContain("149");
    expect(facts.shippingSections[0]?.body).toContain("2 iş günü");
    expect(facts.settings).toMatchObject({
      freeShippingThreshold: 4_250,
      shippingFee: 149,
      estimatedDispatch: "2 iş günü",
    });
  });

  it("re-fetches settings on every call instead of caching a fact pack", async () => {
    let threshold = 3_500;
    const getStoreSettings = vi.fn(async () => createSettings(threshold));
    const dependencies = createDependencies(getStoreSettings);

    const first = await buildSupportGroundingFacts(dependencies);
    threshold = 5_000;
    const second = await buildSupportGroundingFacts(dependencies);

    expect(first.settings.freeShippingThreshold).toBe(3_500);
    expect(second.settings.freeShippingThreshold).toBe(5_000);
    expect(first.faqs[0]?.answer).toContain("3.500");
    expect(second.faqs[0]?.answer).toContain("5.000");
    expect(getStoreSettings).toHaveBeenCalledTimes(2);
  });
});
