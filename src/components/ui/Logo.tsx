export function PillarLogo({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <rect width="32" height="32" rx="4" fill="#0C1522" />
      {/* Geometric serif P — refined proportions */}
      <path
        d="M11.5 24V8h5c1.35 0 2.42.44 3.22 1.32.8.88 1.2 1.98 1.2 3.3 0 1.32-.4 2.42-1.2 3.3-.8.88-1.87 1.32-3.22 1.32H14.5V24h-3z"
        fill="#FFFFFF"
      />
      <path
        d="M14.5 10.5v4.24h2c.56 0 1-.2 1.34-.58.34-.4.5-.9.5-1.54 0-.64-.16-1.14-.5-1.54-.34-.38-.78-.58-1.34-.58h-2z"
        fill="#0C1522"
      />
      {/* Gold base accent — thin precision line */}
      <rect x="10" y="26" width="12" height="0.8" rx="0.4" fill="#B8944F" />
    </svg>
  );
}
