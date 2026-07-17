import { describe, expect, it } from "vitest";

import { checkAiRateLimit } from "@/lib/ai/rate-limit";

describe("AI rate limiting", () => {
  it("allows ten requests per key and limits the next request", () => {
    const key = `test-${crypto.randomUUID()}`;

    for (let request = 0; request < 10; request += 1) {
      expect(checkAiRateLimit(key)).toEqual({ allowed: true });
    }

    const limited = checkAiRateLimit(key);
    expect(limited.allowed).toBe(false);
    expect(limited.retryAfterSec).toBeGreaterThan(0);
    expect(limited.retryAfterSec).toBeLessThanOrEqual(60);
  });

  it("tracks distinct keys independently", () => {
    const firstKey = `test-a-${crypto.randomUUID()}`;
    const secondKey = `test-b-${crypto.randomUUID()}`;

    for (let request = 0; request < 10; request += 1) {
      checkAiRateLimit(firstKey);
    }

    expect(checkAiRateLimit(firstKey).allowed).toBe(false);
    expect(checkAiRateLimit(secondKey)).toEqual({ allowed: true });
  });
});
