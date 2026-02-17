import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "emerald" | "red" | "outline";
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
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400":
            variant === "default",
          "bg-emerald-light text-emerald dark:bg-emerald/10":
            variant === "emerald",
          "bg-red-50 text-red-500 dark:bg-red-500/10": variant === "red",
          "border border-gray-200 text-gray-500 dark:border-gray-700 dark:text-gray-400":
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
