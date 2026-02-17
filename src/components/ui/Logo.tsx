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
      <rect width="32" height="32" rx="7" fill="#111827" />
      <rect x="12" y="7" width="8" height="18" rx="2" fill="#FFFFFF" />
      <rect x="12" y="7" width="8" height="6" rx="2" fill="#059669" />
    </svg>
  );
}
