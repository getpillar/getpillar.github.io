"use client";

import { useEffect } from "react";
import { trackPageView, trackDemoStart, trackDemoEnd } from "@/lib/analytics";

export function PageTracker({ page }: { page: string }) {
  useEffect(() => {
    trackPageView(page);
  }, [page]);
  return null;
}

export function DemoTracker() {
  useEffect(() => {
    trackDemoStart();

    // Track demo end on page leave (beforeunload) or component unmount
    const handleUnload = () => trackDemoEnd();
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      trackDemoEnd();
    };
  }, []);
  return null;
}
