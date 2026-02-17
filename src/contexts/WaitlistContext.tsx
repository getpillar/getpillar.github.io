"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { submitWaitlist } from "@/lib/supabase";
import { trackWaitlistSignup } from "@/lib/analytics";

interface WaitlistContextValue {
  joined: boolean;
  submitting: boolean;
  error: string | null;
  join: (email: string, source: "landing" | "demo") => Promise<void>;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  joined: false,
  submitting: false,
  error: null,
  join: async () => {},
});

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [joined, setJoined] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const join = useCallback(async (email: string, source: "landing" | "demo") => {
    setSubmitting(true);
    setError(null);
    try {
      const result = await submitWaitlist(email, source);
      if (result.ok) {
        setJoined(true);
        trackWaitlistSignup(source);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, []);

  return (
    <WaitlistContext.Provider value={{ joined, submitting, error, join }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  return useContext(WaitlistContext);
}
