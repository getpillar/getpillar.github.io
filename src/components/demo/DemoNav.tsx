"use client";

import Link from "next/link";
import { Check, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PillarLogo } from "@/components/ui/Logo";
import { useWaitlist } from "@/contexts/WaitlistContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function DemoNav() {
  const { joined } = useWaitlist();
  const { isDark, toggleTheme } = useTheme();

  function scrollToWaitlist() {
    const el = document.getElementById("demo-waitlist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const input = el.querySelector("input");
      if (input) setTimeout(() => input.focus(), 600);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 dark:bg-gray-950/80 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillarLogo size={28} />
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-50"
          >
            Pillar
          </Link>
          <Badge variant="outline">Paper Account</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors"
          >
            Home
          </Link>
          {joined ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-light dark:bg-emerald/10 rounded-full">
              <Check className="w-3.5 h-3.5 text-emerald" />
              <span className="text-sm font-semibold text-emerald">
                Access Secured
              </span>
            </div>
          ) : (
            <button
              onClick={scrollToWaitlist}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors"
            >
              Join Waitlist
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
