"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gauge, ShieldCheck } from "lucide-react";
import {
  getEffectiveAPY,
  BASE_APY,
  NET_SPREAD,
  DELEVERAGE_THRESHOLDS,
} from "@/data/mockData";
import { formatPercent } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const STEPS = [1, 1.5, 2, 2.5, 3];
const STEP_LABELS: Record<number, string> = {
  1: "1x",
  1.5: "1.5x",
  2: "2x",
  2.5: "2.5x",
  3: "3x",
};
const RISK_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: "Conservative", color: "text-gray-500" },
  1.5: { label: "Moderate", color: "text-blue-600" },
  2: { label: "Enhanced", color: "text-forest" },
  2.5: { label: "Aggressive", color: "text-amber-600" },
  3: { label: "Max Boost", color: "text-red-500" },
};

interface YieldBoostDialProps {
  leverage: number;
  onLeverageChange: (leverage: number) => void;
}

export default function YieldBoostDial({
  leverage,
  onLeverageChange,
}: YieldBoostDialProps) {
  const [showDeleverage, setShowDeleverage] = useState(false);
  const effectiveAPY = getEffectiveAPY(leverage);
  const riskInfo = RISK_LABELS[leverage] || RISK_LABELS[2];
  const leverageTurns = leverage - 1;
  const boostAmount = Number((leverageTurns * NET_SPREAD).toFixed(2));
  const hasBoost = leverage > 1;

  return (
    <Card className="flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Gauge className="w-4 h-4 text-gray-400" />
        <CardTitle>Yield Boost</CardTitle>
      </div>

      {/* APY display */}
      <div className="text-center mb-6">
        <motion.p
          key={effectiveAPY}
          initial={{ scale: 1.05, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" as const }}
          className="text-4xl font-bold text-forest font-mono-financial"
        >
          {formatPercent(effectiveAPY)}
        </motion.p>
        <p className="text-sm text-gray-400 mt-1">
          effective APY
          <span className={cn("ml-2 font-medium", riskInfo.color)}>
            {riskInfo.label}
          </span>
        </p>
      </div>

      {/* Segmented control */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        {STEPS.map((step) => (
          <button
            key={step}
            onClick={() => onLeverageChange(step)}
            className={cn(
              "flex-1 py-2.5 text-xs font-semibold rounded-md transition-all font-mono-financial",
              step === leverage
                ? "bg-white text-navy shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {STEP_LABELS[step]}
          </button>
        ))}
      </div>

      {/* Auto-deleverage badge */}
      <AnimatePresence>
        {hasBoost && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <button
              onClick={() => setShowDeleverage(!showDeleverage)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-forest-light text-forest text-xs font-medium transition-colors hover:bg-forest-light/80 mb-6"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Auto-Deleverage Active
            </button>
            <AnimatePresence>
              {showDeleverage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden -mt-4 mb-6"
                >
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      Triggers
                    </p>
                    {DELEVERAGE_THRESHOLDS.map((t, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] leading-snug">
                        <span className="text-gray-400 shrink-0">
                          {t.trigger}
                        </span>
                        <span className="ml-auto text-forest font-medium whitespace-nowrap">
                          &rarr; {t.action}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Yield math — condensed */}
      <div className="mt-auto pt-4 border-t border-border-light space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Base portfolio yield</span>
          <span className="font-mono-financial text-navy">
            {formatPercent(BASE_APY)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">
            {leverage > 1
              ? `Boost (${leverageTurns} ${leverageTurns === 1 ? "turn" : "turns"} × ${formatPercent(NET_SPREAD)})`
              : "No boost applied"}
          </span>
          <span className="font-mono-financial text-forest">
            +{formatPercent(boostAmount)}
          </span>
        </div>
        <div className="flex justify-between pt-2 border-t border-border-light font-medium">
          <span className="text-navy">Effective yield</span>
          <span className="font-mono-financial text-forest">
            {formatPercent(effectiveAPY)}
          </span>
        </div>
        <p className="text-[10px] text-gray-300 leading-snug pt-2">
          * Based on current 30-day SEC yields and repo funding rates. Rates
          are variable and subject to change. Leverage amplifies both gains
          and losses.
        </p>
      </div>
    </Card>
  );
}
