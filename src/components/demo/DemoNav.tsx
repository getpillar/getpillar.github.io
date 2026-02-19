"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { PillarLogo } from "@/components/ui/Logo";
import { useWaitlist } from "@/contexts/WaitlistContext";

export default function DemoNav() {
  const { joined } = useWaitlist();

  function scrollToWaitlist() {
    const el = document.getElementById("demo-waitlist");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      const input = el.querySelector("input");
      if (input) setTimeout(() => input.focus(), 600);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillarLogo size={28} />
          <Link
            href="/"
            className="text-base font-semibold tracking-wide text-navy uppercase"
          >
            Pillar
          </Link>
          <Badge variant="outline" className="hidden sm:inline-flex">Paper Account</Badge>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-navy transition-colors"
          >
            Home
          </Link>
          {joined ? (
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-forest-light rounded-md">
              <Check className="w-3.5 h-3.5 text-forest" />
              <span className="text-xs sm:text-sm font-semibold text-forest">
                Secured
              </span>
            </div>
          ) : (
            <button
              onClick={scrollToWaitlist}
              className="px-4 sm:px-5 py-2 bg-navy text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-navy-light transition-colors whitespace-nowrap"
            >
              Join Waitlist
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
