// ─── Design Tokens ───────────────────────────────────────────────────────────

export const colors = {
  navy: "#0C1522",
  navyLight: "#1A2332",
  forest: "#1A5C3A",
  forestLight: "#E8F5EE",
  gold: "#B8944F",
  goldLight: "#F9F3E8",
  background: "#FAF9F7",
  card: "#FFFFFF",
  text: {
    primary: "#0C1522",
    secondary: "#5A6472",
    tertiary: "#8B919A",
  },
  border: "#E8E5E0",
  borderLight: "#F3F1ED",
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
