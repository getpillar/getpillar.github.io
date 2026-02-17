"use client";

import { motion } from "framer-motion";
import { Shield, Activity, Clock, Building2, ShieldCheck } from "lucide-react";

const trustPoints = [
  {
    icon: Shield,
    label: "AAA Rated",
    detail: "Highest credit quality available",
  },
  {
    icon: Activity,
    label: "0.00% Default Rate",
    detail: "30+ years, zero AAA CLO defaults",
  },
  {
    icon: ShieldCheck,
    label: "Auto-Deleverage",
    detail: "Positions rebalance if spreads compress",
  },
  {
    icon: Clock,
    label: "Daily Liquidity",
    detail: "Withdraw your full balance anytime",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-navy">Built on trust</h2>
        <p className="mt-3 text-gray-500">
          Transparency is not a feature — it{"'"}s the foundation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {trustPoints.map((point, i) => {
          const Icon = point.icon;
          return (
            <motion.div
              key={point.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-xl border border-border p-5 text-center shadow-[0_1px_4px_rgba(12,21,34,0.08)]"
            >
              <div className="w-10 h-10 rounded-full bg-forest-light flex items-center justify-center mx-auto mb-3">
                <Icon className="w-5 h-5 text-forest" />
              </div>
              <p className="text-sm font-semibold text-navy">
                {point.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">{point.detail}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Risk disclosure */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="mt-8 max-w-2xl mx-auto bg-gray-100 rounded-xl p-6"
      >
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Important Disclosure
        </p>
        <p className="text-sm text-gray-500 leading-relaxed">
          Pillar accounts are not bank accounts. Your funds are invested in
          publicly traded ETFs and are{" "}
          <strong className="text-gray-700">not FDIC insured</strong>. Yield
          Boost uses leverage which amplifies both gains and losses. While the
          auto-deleveraging engine manages risk, all investments carry risk
          including possible loss of principal. Past performance does not
          guarantee future results.
        </p>
      </motion.div>
    </section>
  );
}
