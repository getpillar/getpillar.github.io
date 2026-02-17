const SUPABASE_URL = "https://fqtqgpvgftupkotbgeuy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_WA2QIJTlY7Ai5C_0Jf5dFA_1vo65tfM";

async function supabaseInsert(table: string, data: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify(data),
  });
  return res.ok;
}

// ─── Waitlist ─────────────────────────────────────────────────────────────────

export async function submitWaitlist(
  email: string,
  source: "landing" | "demo"
): Promise<{ ok: boolean; duplicate: boolean }> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/waitlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      email,
      source,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
    }),
  });

  if (res.ok) return { ok: true, duplicate: false };

  // 409 = unique constraint violation (already signed up)
  if (res.status === 409) return { ok: true, duplicate: true };

  return { ok: false, duplicate: false };
}

// ─── Analytics Events ─────────────────────────────────────────────────────────

function getSessionId(): string {
  if (typeof sessionStorage === "undefined") return crypto.randomUUID();
  let id = sessionStorage.getItem("pillar_sid");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("pillar_sid", id);
  }
  return id;
}

export function trackEvent(
  type: string,
  page: string,
  extra: Record<string, unknown> = {}
) {
  const { duration_ms, ...metadata } = extra;
  supabaseInsert("events", {
    type,
    page,
    session_id: getSessionId(),
    duration_ms: duration_ms ?? null,
    referrer: typeof document !== "undefined" ? document.referrer || null : null,
    user_agent:
      typeof navigator !== "undefined" ? navigator.userAgent : null,
    metadata: Object.keys(metadata).length > 0 ? metadata : {},
  }).catch(() => {
    // Analytics should never block the user experience
  });
}
