"use client";

import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import DemoNav from "@/components/demo/DemoNav";

function DemoShell({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background dark:bg-gray-950 transition-colors duration-300">
        <DemoNav />
        <main className="max-w-6xl mx-auto px-6 pt-24 pb-20">{children}</main>
      </div>
    </div>
  );
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <DemoShell>{children}</DemoShell>
    </ThemeProvider>
  );
}
