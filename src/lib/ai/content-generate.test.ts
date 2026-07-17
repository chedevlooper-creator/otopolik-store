import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateTextMock, getLanguageModelMock } = vi.hoisted(() => ({
  generateTextMock: vi.fn(),
  getLanguageModelMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("ai", () => ({ generateText: generateTextMock }));
vi.mock("@/lib/ai/anthropic-client", () => ({
  getLanguageModel: getLanguageModelMock,
}));

import { generateContentDraft } from "@/lib/ai/content-generate";
import { getProductBySlug } from "@/lib/products";

describe("generateContentDraft", () => {
  beforeEach(() => {
    generateTextMock.mockReset();
    getLanguageModelMock.mockReset();
  });

  it("passes exact grounding facts and the content prompt to the model", async () => {
    const model = { modelId: "test-content-model" };
    getLanguageModelMock.mockReturnValue(model);
    generateTextMock.mockResolvedValue({ text: "Premium Türkçe taslak" });

    const product = getProductBySlug("eva-oto-paspas-seti");
    const result = await generateContentDraft({
      kind: "product_description",
      targetSlug: "eva-oto-paspas-seti",
    });

    expect(result).toEqual({ ok: true, draft: "Premium Türkçe taslak" });
    expect(generateTextMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model,
        system: expect.stringMatching(/yalnızca[\s\S]*Türkçe/i),
        prompt: expect.stringContaining(String(product?.price)),
      })
    );
    expect(generateTextMock.mock.calls[0]?.[0].prompt).toContain(
      "GROUNDING_FACTS"
    );
  });

  it("fails closed when the provider or product is unavailable", async () => {
    getLanguageModelMock.mockReturnValue(null);
    await expect(
      generateContentDraft({
        kind: "faq",
        targetSlug: "eva-oto-paspas-seti",
      })
    ).resolves.toEqual({ ok: false, error: "ai_unavailable" });

    getLanguageModelMock.mockReturnValue({ modelId: "test" });
    await expect(
      generateContentDraft({
        kind: "product_seo",
        targetSlug: "bilinmeyen-urun",
      })
    ).resolves.toEqual({ ok: false, error: "product_not_found" });
    expect(generateTextMock).not.toHaveBeenCalled();
  });
});
