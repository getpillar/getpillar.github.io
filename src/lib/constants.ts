// ─── Design Tokens ───────────────────────────────────────────────────────────

export const colors = {
  background: "#F9F9FB",
  card: "#FFFFFF",
  emerald: "#059669",
  emeraldLight: "#ECFDF5",
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  red: "#DC2626",
  redLight: "#FEF2F2",
} as const;

// ─── Animation Presets ───────────────────────────────────────────────────────

export const animation = {
  spring: {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
  },
  springFast: {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  },
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  },
  stagger: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
} as const;
