"use client";

import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp } from "lucide-react";
import {
  generateBalanceHistory,
  INITIAL_DEPOSIT,
  getEffectiveAPY,
  LEVERAGE_DEFAULT,
} from "@/data/mockData";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const TIME_RANGES = ["1W", "1M", "3M", "1Y", "All"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

function filterByRange(
  data: { date: string; balance: number; event?: string }[],
  range: TimeRange
) {
  if (range === "All") return data;
  const now = new Date();
  const cutoff = new Date();
  switch (range) {
    case "1W":
      cutoff.setDate(now.getDate() - 7);
      break;
    case "1M":
      cutoff.setMonth(now.getMonth() - 1);
      break;
    case "3M":
      cutoff.setMonth(now.getMonth() - 3);
      break;
    case "1Y":
      cutoff.setFullYear(now.getFullYear() - 1);
      break;
  }
  return data.filter((p) => new Date(p.date) >= cutoff);
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: { date: string; balance: number; event?: string };
  }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  const balance = payload[0].value;
  const yieldEarned = balance - INITIAL_DEPOSIT;
  return (
    <div className="rounded-lg shadow-lg border px-4 py-3 bg-white border-border">
      {data.event && (
        <p className="text-xs font-semibold text-forest mb-1">
          {data.event}
        </p>
      )}
      <p className="text-xs text-gray-500">{data.date}</p>
      <p className="text-sm font-bold text-navy font-mono-financial">
        {formatCurrency(balance)}
      </p>
      <p className="text-xs font-medium text-forest font-mono-financial mt-0.5">
        +{formatCurrency(yieldEarned)} earned
      </p>
    </div>
  );
}

// Gradient opacity scales with leverage for visual feedback
function getGradientOpacity(leverage: number): [number, number] {
  const factor = (leverage - 1) / 2; // 0 at 1x, 1 at 3x
  return [0.08 + factor * 0.18, 0.01];
}

// Custom dot: only render for event points
function EventDot(props: Record<string, unknown>) {
  const { cx, cy, payload, index } = props as {
    cx: number;
    cy: number;
    payload: { event?: string };
    index: number;
  };
  if (!payload?.event) return <g key={`dot-${index}`} />;

  const isToday = payload.event === "Today";

  return (
    <g key={`dot-${index}`}>
      {isToday && (
        <circle cx={cx} cy={cy} r={8} fill="#22704A" opacity={0.15}>
          <animate
            attributeName="r"
            values="6;12;6"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.2;0;0.2"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      <circle
        cx={cx}
        cy={cy}
        r={3.5}
        fill={isToday ? "#22704A" : "#FFFFFF"}
        stroke="#22704A"
        strokeWidth={2}
      />
    </g>
  );
}

interface YieldTrackerProps {
  leverage?: number;
}

export default function YieldTracker({
  leverage = LEVERAGE_DEFAULT,
}: YieldTrackerProps) {
  const [range, setRange] = useState<TimeRange>("All");
  const fullHistory = useMemo(
    () => generateBalanceHistory(leverage),
    [leverage]
  );
  const data = useMemo(
    () => filterByRange(fullHistory, range),
    [fullHistory, range]
  );

  const effectiveAPY = getEffectiveAPY(leverage);

  const periodStart = data[0]?.balance ?? INITIAL_DEPOSIT;
  const periodEnd = data[data.length - 1]?.balance ?? periodStart;
  const periodYield = periodEnd - periodStart;

  const minBalance = Math.min(...data.map((d) => d.balance));
  const maxBalance = Math.max(...data.map((d) => d.balance));
  const padding = (maxBalance - minBalance) * 0.15 || 100;

  const [topOpacity, bottomOpacity] = getGradientOpacity(leverage);
  const strokeWidth = 1.5 + ((leverage - 1) / 2) * 1;

  const axisTickColor = "#8B919A";
  const refLineColor = "#E8E5E0";

  return (
    <Card className="flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <CardTitle>Yield Performance</CardTitle>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">
            <span className="font-semibold text-forest font-mono-financial">
              +{formatCurrency(periodYield)}
            </span>{" "}
            earned at {formatPercent(effectiveAPY)} APY
          </p>
        </div>
        <div className="flex gap-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                r === range
                  ? "bg-navy text-white"
                  : "text-gray-500 hover:text-navy hover:bg-gray-100"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0" style={{ minHeight: "220px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} key={`chart-${leverage}-${range}`} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient
                id={`yieldGrad-${leverage}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#22704A"
                  stopOpacity={topOpacity}
                />
                <stop
                  offset="100%"
                  stopColor="#22704A"
                  stopOpacity={bottomOpacity}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: axisTickColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => {
                const d = new Date(val);
                return d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              minTickGap={40}
            />
            <YAxis
              tick={{ fontSize: 10, fill: axisTickColor }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
              domain={[minBalance - padding, maxBalance + padding]}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={INITIAL_DEPOSIT}
              stroke={refLineColor}
              strokeDasharray="4 4"
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#22704A"
              strokeWidth={strokeWidth}
              fill={`url(#yieldGrad-${leverage})`}
              dot={<EventDot />}
              activeDot={{
                r: 5,
                stroke: "#22704A",
                fill: "#fff",
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
