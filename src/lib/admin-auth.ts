// =============================================================
// OTO POLİK — Admin Oturum Yönetimi
// =============================================================
// Sunucu tarafı (server-only) — istemci bundle'ına girmemeli.
// HMAC-SHA256 imzalı süreli cookie: {expire}.{hmac(secret, expire)}
// Şifre tek başına gizli anahtar olarak kullanılır; ayrıca
// ADMIN_SECRET tanımlıysa o tercih edilir (daha güvenli).
// =============================================================

import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

async function hmac(message: string): Promise<string> {
  const secret = getSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("base64url");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function createSessionToken(): Promise<string> {
  const expire = Date.now() + SEVEN_DAYS_MS;
  const signature = await hmac(String(expire));
  return `${expire}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  // Ortam değişkenleri eksikse kapalı kal; boş anahtarla token doğrulama.
  if (!getSecret()) return false;
  if (!token || !token.includes(".")) return false;
  const [expireStr, signature] = token.split(".");
  if (!expireStr || !signature) return false;
  const expire = Number(expireStr);
  if (!Number.isFinite(expire) || expire < Date.now()) return false;
  const expected = await hmac(expireStr);
  return timingSafeEqual(expected, signature);
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export async function getSessionCookieName(): Promise<string> {
  return COOKIE_NAME;
}

export function getExpectedPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}
