import { afterEach, describe, expect, it, vi } from "vitest";

import {
  AI_MODEL_IDS,
  getAiMaxTokens,
  isAiConfigured,
  isAiFeaturesEnabled,
} from "@/lib/ai/config";

describe("AI configuration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([undefined, "", "your-anthropic-key", "sk-ant-placeholder"])(
    "treats %s as an unset API key",
    (apiKey) => {
      if (apiKey === undefined) {
        vi.stubEnv("ANTHROPIC_API_KEY", "");
      } else {
        vi.stubEnv("ANTHROPIC_API_KEY", apiKey);
      }
      vi.stubEnv("AI_FEATURES_ENABLED", "true");

      expect(isAiConfigured()).toBe(false);
    }
  );

  it.each(["false", "0"])("honors the %s kill-switch value", (value) => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
    vi.stubEnv("AI_FEATURES_ENABLED", value);

    expect(isAiFeaturesEnabled()).toBe(false);
    expect(isAiConfigured()).toBe(false);
  });

  it("defaults the feature switch to enabled", () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "sk-ant-test-key");
    vi.stubEnv("AI_FEATURES_ENABLED", "");

    expect(isAiFeaturesEnabled()).toBe(true);
    expect(isAiConfigured()).toBe(true);
  });

  it("caps vehicle matching output tokens", () => {
    expect(getAiMaxTokens("vehicle-match")).toBe(256);
    expect(AI_MODEL_IDS["vehicle-match"]).toBe(
      "claude-haiku-4-5-20251001"
    );
  });
});
