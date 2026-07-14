"use client";

import { useEffect, useState } from "react";

type AdminKeyState =
  | { status: "loading"; adminKey: null }
  | { status: "ready"; adminKey: string }
  | { status: "error"; adminKey: null; message: string };

/**
 * Loads the Convex admin key for the current admin session.
 * Used by admin client pages that call protected Convex APIs.
 */
export function useAdminConvexKey(): AdminKeyState {
  const [state, setState] = useState<AdminKeyState>({
    status: "loading",
    adminKey: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/admin/convex-key", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as {
            error?: string;
          } | null;
          if (!cancelled) {
            setState({
              status: "error",
              adminKey: null,
              message:
                body?.error ||
                "Admin anahtarı alınamadı. Yeniden giriş yapıp deneyin.",
            });
          }
          return;
        }
        const data = (await response.json()) as { adminKey?: string };
        if (!data.adminKey) {
          if (!cancelled) {
            setState({
              status: "error",
              adminKey: null,
              message: "Admin anahtarı boş döndü.",
            });
          }
          return;
        }
        if (!cancelled) {
          setState({ status: "ready", adminKey: data.adminKey });
        }
      } catch {
        if (!cancelled) {
          setState({
            status: "error",
            adminKey: null,
            message: "Admin anahtarı alınırken ağ hatası oluştu.",
          });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
