"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSessionCookieName } from "@/lib/admin-auth";

export async function logoutAction() {
  const store = await cookies();
  store.delete(await getSessionCookieName());
  redirect("/admin/login");
}
