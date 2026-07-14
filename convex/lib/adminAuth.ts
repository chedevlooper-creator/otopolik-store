/**
 * Shared secret check for admin-only Convex functions.
 * Set the same ADMIN_SECRET (preferred) or ADMIN_PASSWORD on both
 * Vercel/Next and the Convex deployment.
 */
export function requireAdminKey(adminKey: string): void {
  const expected = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  if (!expected) {
    throw new Error("Admin secret is not configured on Convex.");
  }
  if (!adminKey || adminKey !== expected) {
    throw new Error("Unauthorized");
  }
}
