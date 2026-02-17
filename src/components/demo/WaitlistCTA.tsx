"use client";

import { useState, useEffect } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Check } from "lucide-react";
import { getEffectiveAPY, LEVERAGE_DEFAULT } from "@/data/mockData";
import { formatPercent } from "@/lib/utils";
import { useWaitlist } from "@/contexts/WaitlistContext";

interface WaitlistCTAProps {
  leverage?: number;
}

export default function WaitlistCTA({
  leverage = LEVERAGE_DEFAULT,
}: WaitlistCTAProps) {
  const { joined, join } = useWaitlist();
  const [settled, setSettled] = useState(joined);
  const effectiveAPY = getEffectiveAPY(leverage);
  const controls = useAnimationControls();

  // Start the default rotation on mount (only if not already joined)
  useEffect(() => {
    if (!joined) {
      controls.start({
        rotate: 360,
        transition: { duration: 4, repeat: Infinity, ease: "linear" },
      });
    }
  }, [controls, joined]);

  // If already joined on mount (e.g. navigated from landing page), skip animation
  useEffect(() => {
    if (joined) setSettled(true);
  }, [joined]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input.value) {
      input.value = "";
      // Immediately update content state
      join();
      // Run celebration animation on the border, then settle
      celebrate();
    }
  }

  async function celebrate() {
    // Fast celebratory spin with bright gradient
    await controls.start({
      rotate: [0, 720],
      transition: { duration: 1.2, ease: "easeOut" },
    });
    setSettled(true);
  }

  // Show bright gradient during celebration, normal sweep otherwise
  const gradient = joined && !settled
    ? "conic-gradient(from 0deg, rgba(5,150,105,0.4) 0%, rgba(16,185,129,1) 25%, rgba(5,150,105,0.6) 50%, rgba(16,185,129,1) 75%, rgba(5,150,105,0.4) 100%)"
    : "conic-gradient(from 0deg, transparent 0%, transparent 60%, rgba(5,150,105,0.15) 68%, rgba(16,185,129,0.5) 75%, rgba(5,150,105,1) 82%, rgba(16,185,129,0.5) 89%, rgba(5,150,105,0.15) 94%, transparent 100%)";

  return (
    <div
      id="demo-waitlist"
      className="relative rounded-2xl p-[3px] overflow-hidden"
    >
      {/* Animated border — rotating sweep pre-join, static glow post-settle */}
      {settled ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-2xl bg-emerald/20"
        />
      ) : (
        <motion.div
          className="absolute inset-[-50%] z-0"
          style={{ background: gradient }}
          animate={controls}
        />
      )}

      {/* Card content */}
      <div className="relative z-10 overflow-hidden rounded-[13px] bg-gray-900 dark:bg-gray-950 px-6 py-8 md:px-10 md:py-10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-md">
            <p className="text-sm font-medium text-emerald mb-2">
              {joined ? "You\u2019re on the list" : "Get early access"}
            </p>
            <h3 className="text-xl font-bold text-white leading-snug">
              Earn {formatPercent(effectiveAPY)} on your cash.
              <br />
              <span className="text-gray-400">
                {joined
                  ? "We\u2019ll reach out the moment we launch."
                  : "Launching soon \u2014 join the waitlist."}
              </span>
            </h3>
            {!joined && (
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                Be first in line when Pillar opens to the public. Same AAA-rated
                strategy, real yield from day one.
              </p>
            )}
          </div>

          {joined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center md:items-end gap-2"
            >
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald/10 border border-emerald/20 rounded-full">
                <Check className="w-4 h-4 text-emerald" />
                <span className="text-sm font-semibold text-emerald">
                  Early access secured
                </span>
              </div>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 w-full md:w-auto"
            >
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="flex-1 md:w-64 px-4 py-3 rounded-full bg-white/[0.08] border border-emerald/30 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald/60 focus:ring-2 focus:ring-emerald/25 transition-all animate-input-glow"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-white text-gray-900 text-sm font-semibold rounded-full hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Join Waitlist
              </button>
            </form>
          )}
        </div>

        {/* Subtle gradient accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      </div>
    </div>
  );
}
