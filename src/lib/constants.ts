// ─── Design Tokens ───────────────────────────────────────────────────────────

export const colors = {
  navy: "#0C1522",
  navyLight: "#1A2332",
  forest: "#22704A",
  forestLight: "#EDF3EF",
  gold: "#B8944F",
  goldLight: "#FFFBEB",
  background: "#FFFFFF",
  card: "#FFFFFF",
  text: {
    primary: "#0C1522",
    secondary: "#6B7280",
    tertiary: "#9CA3AF",
  },
  border: "#E2E4E8",
  borderLight: "#F0F1F3",
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
