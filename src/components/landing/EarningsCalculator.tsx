"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { CURRENT_APY } from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { cn } from "@/lib/utils";

const AMOUNTS = [10_000, 25_000, 50_000, 100_000, 250_000];
const NATIONAL_AVG = 0.39;

function RollingNumber({
  value,
  decimals = 0,
  prefix = "+",
  active,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  active: boolean;
}) {
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(v);
    return `${prefix}${formatted}`;
  });

  useEffect(() => {
    if (active) spring.set(value);
  }, [spring, value, active]);

  return <motion.span>{display}</motion.span>;
}

export default function EarningsCalculator() {
  const [amount, setAmount] = useState(50_000);
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  const dailyPillar = (amount * CURRENT_APY) / 100 / 365;
  const monthlyPillar = dailyPillar * 30;
  const annualPillar = (amount * CURRENT_APY) / 100;
  const annualAvg = (amount * NATIONAL_AVG) / 100;
  const extraEarnings = annualPillar - annualAvg;

  return (
    <section className="py-20">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-navy">
          See what your cash could earn
        </h2>
        <p className="mt-3 text-gray-500">
          Choose a deposit amount and see your projected earnings at{" "}
          <span className="font-semibold text-forest font-mono-financial">
            {formatPercent(CURRENT_APY)} APY
          </span>
          .
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Amount pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => setAmount(amt)}
              className={cn(
                "px-5 py-2.5 rounded-lg text-sm font-medium transition-all font-mono-financial",
                amt === amount
                  ? "bg-navy text-white"
                  : "bg-white border border-border text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              ${(amt / 1000).toFixed(0)}K
            </button>
          ))}
        </div>

        {/* Earnings card */}
        <div ref={cardRef} className="bg-white rounded-xl border border-border p-8 shadow-[0_1px_3px_rgba(12,21,34,0.04)]">
          <p className="text-sm text-gray-400 text-center mb-6">
            On a{" "}
            <span className="font-semibold text-navy font-mono-financial">
              {formatCurrency(amount, 0)}
            </span>{" "}
            deposit
          </p>

          <div className="grid grid-cols-3 divide-x divide-border-light">
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-forest font-mono-financial">
                <RollingNumber value={dailyPillar} decimals={2} active={isInView} />
              </p>
              <p className="text-xs text-gray-400 mt-1">per day</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-forest font-mono-financial">
                <RollingNumber value={monthlyPillar} active={isInView} />
              </p>
              <p className="text-xs text-gray-400 mt-1">per month</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-forest font-mono-financial">
                <RollingNumber value={annualPillar} active={isInView} />
              </p>
              <p className="text-xs text-gray-400 mt-1">per year</p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-border-light text-center">
            <p className="text-sm text-gray-500">
              That{"'"}s{" "}
              <span className="font-bold text-forest font-mono-financial">
                <RollingNumber value={extraEarnings} active={isInView} />/yr more
              </span>{" "}
              than the {formatPercent(NATIONAL_AVG)} national savings average.
            </p>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-300">
          * Projected at {formatPercent(CURRENT_APY)} APY with Yield Boost at
          2x. Rates are variable based on underlying ETF yields and repo
          funding costs.
        </p>
      </div>
    </section>
  );
}
