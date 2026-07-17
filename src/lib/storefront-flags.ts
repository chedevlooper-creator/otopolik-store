import { isAiConfigured } from "@/lib/ai/config";

/**
 * Controls customer-visible AI chrome only.
 * AI APIs and admin capabilities remain governed by the AI configuration.
 */
export function isCustomerAiUiEnabled(): boolean {
  const setting = process.env.CUSTOMER_AI_UI_ENABLED?.trim().toLowerCase();
  const explicitlyEnabled = setting === "true" || setting === "1";

  return explicitlyEnabled && isAiConfigured();
}
