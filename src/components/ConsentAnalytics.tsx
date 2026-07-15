"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import {
  getStoredConsent,
  type ConsentValue,
} from "@/components/CookieConsent";

/** Loads Vercel Analytics only after marketing/analytics consent. */
export default function ConsentAnalytics() {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
    function onConsent(event: Event) {
      const detail = (event as CustomEvent<ConsentValue>).detail;
      setConsent(detail);
    }
    window.addEventListener("otopolik:consent", onConsent);
    return () => window.removeEventListener("otopolik:consent", onConsent);
  }, []);

  if (consent !== "accepted") return null;
  return <Analytics />;
}
