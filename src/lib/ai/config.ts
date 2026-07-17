export type AiFeature = "vehicle-match";

export const AI_MODEL_IDS: Record<AiFeature, string> = {
  "vehicle-match": "claude-haiku-4-5-20251001",
};

const AI_MAX_TOKENS: Record<AiFeature, number> = {
  "vehicle-match": 256,
};

function getAnthropicApiKey(): string | null {
  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) return null;

  const normalized = apiKey.toLocaleLowerCase("en-US");
  if (
    normalized.includes("your-") ||
    normalized.includes("placeholder") ||
    normalized === "sk-ant-"
  ) {
    return null;
  }

  return apiKey;
}

export function isAiFeaturesEnabled(): boolean {
  const setting = process.env.AI_FEATURES_ENABLED?.trim().toLowerCase();
  return setting !== "false" && setting !== "0";
}

export function isAiConfigured(): boolean {
  return isAiFeaturesEnabled() && getAnthropicApiKey() !== null;
}

export function getAiMaxTokens(feature: AiFeature): number {
  return AI_MAX_TOKENS[feature];
}

export function getAiModelId(feature: AiFeature): string {
  return AI_MODEL_IDS[feature];
}
