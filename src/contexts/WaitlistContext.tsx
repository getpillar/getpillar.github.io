"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface WaitlistContextValue {
  joined: boolean;
  join: () => void;
}

const WaitlistContext = createContext<WaitlistContextValue>({
  joined: false,
  join: () => {},
});

export function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [joined, setJoined] = useState(false);
  const join = useCallback(() => setJoined(true), []);

  return (
    <WaitlistContext.Provider value={{ joined, join }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  return useContext(WaitlistContext);
}
