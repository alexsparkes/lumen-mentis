"use client";

import { useEffect } from "react";

export default function ServiceWorkerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then(() => console.log("Service Worker registered"))
        .catch((error) =>
          console.error("Service Worker registration failed:", error)
        );
    }
  }, []);

  return <>{children}</>;
}
