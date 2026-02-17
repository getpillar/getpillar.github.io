import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "forest" | "red" | "outline";
  children: React.ReactNode;
}

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-600":
            variant === "default",
          "bg-forest-light text-forest":
            variant === "forest",
          "bg-red-50 text-red-500": variant === "red",
          "border border-border text-gray-500":
            variant === "outline",
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
