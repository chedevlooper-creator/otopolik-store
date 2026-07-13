"use server";

import { cookies } from "next/headers";
import {
  createSessionToken,
  getExpectedPassword,
  getSessionCookieName,
} from "@/lib/admin-auth";

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

export type LoginResult =
  | { ok: true; redirectTo: string }
  | { ok: false; message: string };

export async function loginAction(
  password: string,
  nextPath: string
): Promise<LoginResult> {
  const expected = getExpectedPassword();

  if (!expected) {
    return {
      ok: false,
      message: "Sunucu tarafında ADMIN_PASSWORD tanımlı değil. Yöneticiye başvurun.",
    };
  }

  // Basit sabit-zamanlı string karşılaştırma (constant-time)
  if (
    typeof password !== "string" ||
    password.length === 0 ||
    password.length !== expected.length ||
    !safeEqual(password, expected)
  ) {
    // Hata mesajında "yanlış" demek yerine genel ifade — enumeration koruması
    return { ok: false, message: "Giriş başarısız. Şifreyi kontrol edin." };
  }

  const token = await createSessionToken();
  const cookieName = await getSessionCookieName();

  const store = await cookies();
  store.set({
    name: cookieName,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS_SECONDS,
  });

  // Açık yönlendirmeleri engelle — sadece admin altındaki dahili yollar
  const safeNext =
    nextPath.startsWith("/admin") && !nextPath.startsWith("/admin/login")
      ? nextPath
      : "/admin";

  return { ok: true, redirectTo: safeNext };
}

function safeEqual(a: string, b: string): boolean {
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
