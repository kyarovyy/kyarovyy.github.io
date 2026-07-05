"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;

    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    navigator.serviceWorker.register(`${basePath}/sw.js`).catch(() => {
      // Offline support is helpful, but the app must still work if registration is blocked.
    });
  }, []);

  return null;
}
