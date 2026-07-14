import "server-only";

/**
 * Secret used by Next server → Convex admin calls.
 * Must match Convex env ADMIN_SECRET / ADMIN_PASSWORD.
 */
export function getAdminConvexKey(): string {
  const key = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!key) {
    throw new Error("ADMIN_SECRET (veya ADMIN_PASSWORD) tanımlı değil.");
  }
  return key;
}
