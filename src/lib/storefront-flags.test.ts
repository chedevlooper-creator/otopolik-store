import { afterEach, describe, expect, it, vi } from "vitest";

import { isCustomerAiUiEnabled } from "@/lib/storefront-flags";
import {
  isAiConfigured,
  isAiFeaturesEnabled,
} from "@/lib/ai/config";

describe("storefront flags", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([undefined, "", "false", "0"])(
    "keeps customer AI UI off for %s",
    (value) => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
      vi.stubEnv("AI_FEATURES_ENABLED", "true");
      vi.stubEnv("CUSTOMER_AI_UI_ENABLED", value);

      expect(isCustomerAiUiEnabled()).toBe(false);
    }
  );

  it.each(["true", "1"])(
    "enables customer AI UI for %s when AI is configured",
    (value) => {
      vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
      vi.stubEnv("AI_FEATURES_ENABLED", "true");
      vi.stubEnv("CUSTOMER_AI_UI_ENABLED", value);

      expect(isCustomerAiUiEnabled()).toBe(true);
    }
  );

  it.each([undefined, "", "your-anthropic-key", "sk-ant-placeholder"])(
    "keeps customer AI UI off for an unavailable API key (%s)",
    (apiKey) => {
      vi.stubEnv("ANTHROPIC_API_KEY", apiKey);
      vi.stubEnv("AI_FEATURES_ENABLED", "true");
      vi.stubEnv("CUSTOMER_AI_UI_ENABLED", "true");

      expect(isCustomerAiUiEnabled()).toBe(false);
    }
  );

  it("keeps customer AI UI off when the global capability is disabled", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
    vi.stubEnv("AI_FEATURES_ENABLED", "false");
    vi.stubEnv("CUSTOMER_AI_UI_ENABLED", "true");

    expect(isCustomerAiUiEnabled()).toBe(false);
  });

  it("does not change the existing AI capability helpers", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
    vi.stubEnv("AI_FEATURES_ENABLED", "true");
    vi.stubEnv("CUSTOMER_AI_UI_ENABLED", "false");

    expect(isAiFeaturesEnabled()).toBe(true);
    expect(isAiConfigured()).toBe(true);
    expect(isCustomerAiUiEnabled()).toBe(false);
  });
});
