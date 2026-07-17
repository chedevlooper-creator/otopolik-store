import "server-only";

import { createAnthropic } from "@ai-sdk/anthropic";

import {
  getAiModelId,
  isAiConfigured,
  type AiFeature,
} from "@/lib/ai/config";

type AnthropicProvider = ReturnType<typeof createAnthropic>;

let provider: AnthropicProvider | null = null;

export function getAnthropicProvider(): AnthropicProvider | null {
  if (!isAiConfigured()) return null;
  if (provider) return provider;

  provider = createAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
  return provider;
}

export function getLanguageModel(feature: AiFeature) {
  const anthropic = getAnthropicProvider();
  if (!anthropic) return null;
  return anthropic(getAiModelId(feature));
}
