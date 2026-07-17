/**
 * V1 uses a process-local sliding window. On multi-instance Vercel deployments
 * this is intentionally a soft limit; a shared KV limiter can replace it later.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 10;

type RateLimitBucket = {
  timestamps: number[];
};

const buckets = new Map<string, RateLimitBucket>();

export type AiRateLimitResult =
  | { allowed: true }
  | { allowed: false; retryAfterSec: number };

export function checkAiRateLimit(key: string): AiRateLimitResult {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const bucket = buckets.get(key) ?? { timestamps: [] };
  const activeTimestamps = bucket.timestamps.filter(
    (timestamp) => timestamp > windowStart
  );

  if (activeTimestamps.length >= MAX_REQUESTS) {
    const retryAfterMs = activeTimestamps[0] + WINDOW_MS - now;
    buckets.set(key, { timestamps: activeTimestamps });
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil(retryAfterMs / 1_000)),
    };
  }

  activeTimestamps.push(now);
  buckets.set(key, { timestamps: activeTimestamps });
  return { allowed: true };
}
