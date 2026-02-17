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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PillarLogo size={28} />
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Pillar
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/demo"
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            Live Demo
          </Link>
          {joined ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-light rounded-full">
              <Check className="w-3.5 h-3.5 text-emerald" />
              <span className="text-sm font-semibold text-emerald">
                Access Secured
              </span>
            </div>
          ) : (
            <button
              onClick={handleWaitlistClick}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
            >
              Join Waitlist
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
