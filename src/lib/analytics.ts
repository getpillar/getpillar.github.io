import { trackEvent } from "./supabase";

let demoStartTime: number | null = null;

export function trackPageView(page: string) {
  trackEvent("page_view", page);
}

export function trackDemoStart() {
  demoStartTime = Date.now();
  trackEvent("demo_start", "/demo");
}

export function trackDemoEnd() {
  if (demoStartTime) {
    const duration_ms = Date.now() - demoStartTime;
    trackEvent("demo_end", "/demo", { duration_ms });
    demoStartTime = null;
  }
}

export function trackWaitlistSignup(source: "landing" | "demo") {
  trackEvent("waitlist_signup", source === "landing" ? "/" : "/demo", {
    source,
  });
}
