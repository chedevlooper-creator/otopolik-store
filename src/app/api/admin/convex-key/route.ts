import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/admin-auth";
import { getAdminConvexKey } from "@/lib/admin-convex-key";

/**
 * Authenticated admin browser clients need this key to call protected
 * Convex admin queries/mutations. Never returns a key without a valid session.
 */
export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const adminKey = getAdminConvexKey();
    return NextResponse.json({ adminKey });
  } catch {
    return NextResponse.json(
      { error: "Admin secret is not configured." },
      { status: 503 }
    );
  }
}
