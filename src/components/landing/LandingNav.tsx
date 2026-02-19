"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { PillarLogo } from "@/components/ui/Logo";
import { useWaitlist } from "@/contexts/WaitlistContext";

export default function LandingNav() {
  const { joined } = useWaitlist();
  function handleWaitlistClick(e: React.MouseEvent) {
    e.preventDefault();
    const input = document.getElementById(
      "waitlist-email"
    ) as HTMLInputElement;
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => input.focus(), 400);
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillarLogo size={28} />
          <span className="text-base font-semibold tracking-wide text-navy uppercase">
            Pillar
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="hidden sm:block text-sm text-gray-500 hover:text-navy transition-colors"
          >
            Live Demo
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
              onClick={handleWaitlistClick}
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
