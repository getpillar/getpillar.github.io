"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Gauge, Lock } from "lucide-react";
import {
  getCurrentBalance,
  getDailyYield,
  getTotalYieldEarned,
  getYieldPerSecond,
  getEffectiveAPY,
  INITIAL_DEPOSIT,
  LEVERAGE_DEFAULT,
  LEVERAGE_LABELS,
} from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const actions = [
  { label: "Deposit", icon: ArrowDownLeft },
  { label: "Withdraw", icon: ArrowUpRight },
  { label: "Rebalance", icon: RefreshCw },
];

const BOOST_BADGE_STYLES: Record<number, { bg: string; text: string }> = {
  1: { bg: "bg-gray-100", text: "text-gray-500" },
  1.5: { bg: "bg-blue-50", text: "text-blue-600" },
  2: { bg: "bg-forest-light", text: "text-forest" },
  2.5: { bg: "bg-gold-light", text: "text-amber-600" },
  3: { bg: "bg-red-50", text: "text-red-500" },
};

interface BalanceCardProps {
  leverage?: number;
}

export default function BalanceCard({
  leverage = LEVERAGE_DEFAULT,
}: BalanceCardProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const balance = getCurrentBalance(leverage);
  const dailyYield = getDailyYield(leverage);
  const totalYield = getTotalYieldEarned(leverage);
  const effectiveAPY = getEffectiveAPY(leverage);
  const yieldPerSec = getYieldPerSecond(leverage);
  const tickingYield = useAnimatedNumber(dailyYield, yieldPerSec, 2000);
  const riskLabel = LEVERAGE_LABELS[leverage] || "Enhanced";
  const annualProjection = dailyYield * 365;

  function handleAction(label: string) {
    setActiveAction(label);
    setTimeout(() => setActiveAction(null), 1500);
  }

  return (
    <Card className="relative">
      {/* Balance + Lifetime stats */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1">Total Balance</p>
          <p className="text-3xl sm:text-4xl font-bold tracking-tight text-navy font-mono-financial">
            {formatCurrency(balance)}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {(() => {
              const style = BOOST_BADGE_STYLES[leverage] || BOOST_BADGE_STYLES[2];
              return (
                <span className={cn("inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[10px] font-medium", style.bg, style.text)}>
                  <Gauge className="w-3 h-3" />
                  Yield Boost {leverage}x &middot; {riskLabel}
                </span>
              );
            })()}
            <Badge variant="outline" className="text-[10px]">
              Not FDIC Insured &middot; AAA-Rated ETFs
            </Badge>
          </div>
        </div>
        <div className="text-right space-y-1.5 shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Lifetime yield</p>
            <p className="text-sm font-semibold text-forest font-mono-financial">
              +{formatCurrency(totalYield)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">Initial deposit</p>
            <p className="text-sm font-semibold text-navy font-mono-financial">
              {formatCurrency(INITIAL_DEPOSIT, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Daily paycheck strip */}
      <div className="mt-5 pt-4 border-t border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-forest animate-pulse-dot" />
            <span className="text-sm text-gray-500">Daily paycheck</span>
          </div>
          <span className="text-lg font-bold text-forest font-mono-financial">
            +${tickingYield.toFixed(2)}
          </span>
        </div>
        <span className="text-xs sm:text-sm text-gray-400 font-mono-financial">
          {formatCurrency(annualProjection, 0)}/yr at{" "}
          {formatPercent(effectiveAPY)} APY
        </span>
      </div>

      {/* Quick actions */}
      <div className="mt-4 pt-4 border-t border-border-light grid grid-cols-3 gap-1.5 sm:gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const isActive = activeAction === action.label;
          return (
            <button
              key={action.label}
              onClick={() => handleAction(action.label)}
              className={cn(
                "flex items-center justify-center gap-2 py-2.5 rounded-xl",
                "border transition-all text-xs sm:text-sm",
                isActive
                  ? "border-border bg-gray-50"
                  : "border-border-light hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {isActive ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-gray-300" />
                  <span className="font-medium text-gray-400">Demo only</span>
                </>
              ) : (
                <>
                  <Icon className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-600">{action.label}</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
