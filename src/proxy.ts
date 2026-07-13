import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/admin-auth";

const COOKIE_NAME = "admin_session";
const LOGIN_PATH = "/admin/login";

// Next.js 16+ yeni convention: "proxy" dosyası, "middleware"in yerini alır.
// Aynı API (NextRequest/NextResponse) kullanılır.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Login sayfası herkese açık
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
