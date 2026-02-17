"use client";

import { motion } from "framer-motion";
import { ArrowDownLeft, Zap, TrendingUp, Gauge } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ArrowDownLeft,
    title: "Deposit cash",
    description:
      "Link your bank and transfer any amount. No minimums, no lock-ups. Funds settle in one business day.",
  },
  {
    step: "02",
    icon: Zap,
    title: "We auto-invest in AAA ETFs",
    description:
      "Your cash is allocated across JAAA, CLOA, FLOT, and BIL — publicly traded, AAA-rated ETFs with $80B+ in combined assets.",
  },
  {
    step: "03",
    icon: Gauge,
    title: "Turn the Yield Boost dial",
    description:
      "Set your leverage from 1x to 3x with one click. Automated repo facility amplifies your yield. Auto-deleveraging keeps you safe.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Watch your yield accrue daily",
    description:
      "Yield accrues every single day. Withdraw anytime — no penalties, no lock-ups. Your money finally works as hard as you do.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-serif text-navy">
          Simple by design
        </h2>
        <p className="mt-3 text-gray-500">
          Four steps. No complexity. Amplified yields.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white rounded-xl border border-border p-6 relative shadow-[0_1px_3px_rgba(12,21,34,0.04)]"
            >
              <span className="text-xs font-bold text-gray-300 font-mono-financial">
                {step.step}
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mt-3 mb-4">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-base font-semibold text-navy">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
