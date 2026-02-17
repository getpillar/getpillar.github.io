"use client";

import { motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { CURRENT_APY } from "@/data/mockData";
import { formatPercent } from "@/lib/utils";
import { useWaitlist } from "@/contexts/WaitlistContext";

export default function HeroSection() {
  const { joined, submitting, error, join } = useWaitlist();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input.value) {
      join(input.value, "landing");
      input.value = "";
    }
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center text-center pt-16 pb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        {/* APY pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-light rounded-full mb-8"
        >
          <div className="w-2 h-2 rounded-full bg-emerald animate-pulse-dot" />
          <span className="text-sm font-semibold text-emerald font-mono-financial">
            Earning {formatPercent(CURRENT_APY)} APY with Yield Boost
          </span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
          Your cash deserves
          <br />
          better than a bank.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto leading-relaxed">
          Access the same AAA-rated structured credit yields that power top
          hedge funds — now automated for everyone. No minimums, no lock-ups,
          withdraw anytime.
        </p>

        {/* Waitlist CTA */}
        <div id="waitlist" className="mt-10 max-w-md mx-auto">
          {joined ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-light rounded-full">
                <Check className="w-4 h-4 text-emerald" />
                <span className="text-sm font-semibold text-emerald">
                  Early access secured
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-400">
                You{"'"}ll be first in line when Pillar launches.
              </p>
            </motion.div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  id="waitlist-email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-full border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-emerald/20 transition-all bg-white animate-input-glow disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {submitting ? "Joining..." : "Join Waitlist"}
                </button>
              </form>
              {error ? (
                <p className="mt-3 text-xs text-red-500">{error}</p>
              ) : (
                <p className="mt-3 text-xs text-gray-400">
                  Early access when we launch. No spam, ever.
                </p>
              )}
            </>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-400">
          or{" "}
          <a
            href="/demo"
            className="text-gray-900 font-medium underline underline-offset-4 hover:text-emerald transition-colors"
          >
            try the live demo with $50K
          </a>
          {" "}&mdash; no sign-up required
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 6, 0] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
      >
        <ChevronDown className="w-5 h-5 text-gray-300" />
      </motion.div>
    </section>
  );
}
