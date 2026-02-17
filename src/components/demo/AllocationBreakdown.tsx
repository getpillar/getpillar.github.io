"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PieChart as PieChartIcon } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
  etfHoldings,
  getCurrentBalance,
  getEffectiveAPY,
  LEVERAGE_DEFAULT,
  LEVERAGE_LABELS,
} from "@/data/mockData";
import { formatPercent, formatCurrency } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const COLORS = ["#22704A", "#4A9B6E", "#8B919A", "#BFC3C8"];

const BOOST_COLORS: Record<number, string> = {
  1: "text-gray-500",
  1.5: "text-blue-600",
  2: "text-forest",
  2.5: "text-amber-600",
  3: "text-red-500",
};

const pieData = etfHoldings.map((etf) => ({
  name: etf.ticker,
  value: etf.allocation,
}));

interface AllocationBreakdownProps {
  leverage?: number;
}

export default function AllocationBreakdown({
  leverage = LEVERAGE_DEFAULT,
}: AllocationBreakdownProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const balance = getCurrentBalance(leverage);
  const effectiveAPY = getEffectiveAPY(leverage);
  const hasBoost = leverage > 1;

  const activeIndex = expanded
    ? etfHoldings.findIndex((etf) => etf.ticker === expanded)
    : -1;

  const pieStroke = "#FFFFFF";

  function handlePieClick(_: unknown, index: number) {
    const ticker = etfHoldings[index].ticker;
    setExpanded(expanded === ticker ? null : ticker);
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <PieChartIcon className="w-4 h-4 text-gray-400" />
        <CardTitle>How Your Money Works</CardTitle>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Allocated across four AAA-rated ETFs for yield and liquidity.
      </p>

      <div className="grid md:grid-cols-[180px_1fr] gap-6 items-center">
        {/* Donut chart */}
        <div className="relative mx-auto md:mx-0">
          <ResponsiveContainer width={180} height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={76}
                paddingAngle={0}
                dataKey="value"
                stroke={pieStroke}
                strokeWidth={3}
                isAnimationActive={true}
                animationDuration={600}
                onClick={handlePieClick}
              >
                {pieData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={COLORS[idx]}
                    opacity={
                      activeIndex >= 0 && idx !== activeIndex ? 0.25 : 1
                    }
                    style={{ cursor: "pointer", outline: "none" }}
                  />
                ))}
              </Pie>

              {activeIndex >= 0 && (
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="transparent"
                  strokeWidth={3}
                  isAnimationActive={false}
                  onClick={handlePieClick}
                >
                  {pieData.map((_, idx) => (
                    <Cell
                      key={idx}
                      fill={idx === activeIndex ? COLORS[idx] : "transparent"}
                      stroke={idx === activeIndex ? pieStroke : "transparent"}
                      style={{ cursor: "pointer", outline: "none" }}
                    />
                  ))}
                </Pie>
              )}
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="text-2xl font-bold font-mono-financial text-forest">
                {formatPercent(effectiveAPY)}
              </p>
              <p className="text-[10px] font-medium text-gray-400">
                {hasBoost ? (
                  <>
                    with{" "}
                    <span className={BOOST_COLORS[leverage] || "text-forest"}>
                      {leverage}x Boost
                    </span>
                  </>
                ) : (
                  "Blended APY"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* ETF list */}
        <div className="space-y-2">
          {etfHoldings.map((etf, i) => {
            const isActive = expanded === etf.ticker;

            return (
              <div
                key={etf.ticker}
                className={cn(
                  "border rounded-xl overflow-hidden transition-colors",
                  isActive
                    ? "border-border"
                    : "border-border-light"
                )}
              >
                <button
                  onClick={() =>
                    setExpanded(isActive ? null : etf.ticker)
                  }
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: COLORS[i] }}
                    />
                    <span className="font-semibold text-sm text-navy font-mono-financial">
                      {etf.ticker}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">
                      {etf.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-medium text-forest font-mono-financial">
                      {formatPercent(etf.yield)}
                    </span>
                    <span className="text-xs font-medium text-navy font-mono-financial w-8 text-right">
                      {etf.allocation}%
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-gray-400 transition-transform",
                        isActive && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-2.5 border-t border-border-light pt-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          <Badge>{etf.rating}</Badge>
                          <Badge variant="outline">AUM: {etf.aum}</Badge>
                          <Badge variant="outline">
                            Your allocation:{" "}
                            {formatCurrency(
                              (balance * etf.allocation) / 100
                            )}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {etf.description}
                        </p>
                        <div className="bg-forest-light rounded-lg p-2.5">
                          <p className="text-[11px] text-forest font-medium leading-relaxed">
                            {etf.riskNote}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
