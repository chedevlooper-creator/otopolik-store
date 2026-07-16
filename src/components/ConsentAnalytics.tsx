"use client";

import { Analytics } from "@vercel/analytics/react";
import { useStoredConsent } from "@/components/CookieConsent";

/** Loads Vercel Analytics only after marketing/analytics consent. */
export default function ConsentAnalytics() {
  const consent = useStoredConsent();

  if (consent !== "accepted") return null;
  return <Analytics />;
}
