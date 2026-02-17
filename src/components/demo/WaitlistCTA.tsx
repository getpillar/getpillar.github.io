"use client";

import { motion } from "framer-motion";
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
  const { joined, submitting, error, join } = useWaitlist();
  const effectiveAPY = getEffectiveAPY(leverage);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;
    if (input.value) {
      const email = input.value;
      input.value = "";
      await join(email, "demo");
    }
  }

  return (
    <div
      id="demo-waitlist"
      className="rounded-xl border border-border overflow-hidden shadow-[0_1px_4px_rgba(12,21,34,0.08)]"
    >
      <div className="bg-navy px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-md">
            <p className="text-sm font-medium text-forest-light mb-2">
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
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 rounded-lg">
                <Check className="w-4 h-4 text-forest-light" />
                <span className="text-sm font-semibold text-white">
                  Early access secured
                </span>
              </div>
            </motion.div>
          ) : (
            <div className="w-full md:w-auto">
              <form
                onSubmit={handleSubmit}
                className="flex gap-2 w-full md:w-auto"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  disabled={submitting}
                  className="flex-1 md:w-64 px-4 py-3 rounded-lg bg-white/[0.08] border border-white/20 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-white text-navy text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap disabled:opacity-60"
                >
                  {submitting ? "Joining..." : "Join Waitlist"}
                </button>
              </form>
              {error && (
                <p className="text-sm text-red-400 mt-2">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
