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
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillarLogo size={28} />
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-navy"
          >
            Pillar
          </Link>
          <Badge variant="outline">Paper Account</Badge>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-navy transition-colors"
          >
            Home
          </Link>
          {joined ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-forest-light rounded-md">
              <Check className="w-3.5 h-3.5 text-forest" />
              <span className="text-sm font-semibold text-forest">
                Access Secured
              </span>
            </div>
          ) : (
            <button
              onClick={scrollToWaitlist}
              className="px-5 py-2 bg-navy text-white text-sm font-semibold rounded-lg hover:bg-navy-light transition-colors"
            >
              Join Waitlist
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
