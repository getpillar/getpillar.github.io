"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateTransactions, LEVERAGE_DEFAULT } from "@/data/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
  Gauge,
  ChevronDown,
  Clock,
} from "lucide-react";

const COLLAPSED_COUNT = 5;

const typeConfig = {
  deposit: {
    icon: ArrowDownLeft,
    color: "text-gray-900 dark:text-gray-50",
    bg: "bg-gray-100 dark:bg-gray-800",
    sign: "+",
  },
  yield_credit: {
    icon: TrendingUp,
    color: "text-emerald",
    bg: "bg-emerald-light dark:bg-emerald/10",
    sign: "+",
  },
  auto_invest: {
    icon: ArrowUpRight,
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
    sign: "-",
  },
  rebalance: {
    icon: RefreshCw,
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-100 dark:bg-gray-800",
    sign: "",
  },
  leverage_adjust: {
    icon: Gauge,
    color: "text-emerald",
    bg: "bg-emerald-light dark:bg-emerald/10",
    sign: "",
  },
};

interface ActivityFeedProps {
  leverage?: number;
}

export default function ActivityFeed({
  leverage = LEVERAGE_DEFAULT,
}: ActivityFeedProps) {
  const [expanded, setExpanded] = useState(false);
  const transactions = useMemo(
    () => generateTransactions(leverage),
    [leverage]
  );

  const visible = expanded
    ? transactions
    : transactions.slice(0, COLLAPSED_COUNT);
  const remaining = transactions.length - COLLAPSED_COUNT;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gray-400" />
        <CardTitle>Recent Activity</CardTitle>
      </div>
      <div>
        <AnimatePresence initial={false}>
          {visible.map((tx, i) => {
            const config = typeConfig[tx.type];
            const Icon = config.icon;
            const isLast = i === visible.length - 1;

            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "flex items-center gap-3 py-2.5",
                    !isLast && "border-b border-gray-50 dark:border-gray-800"
                  )}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      config.bg
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50 truncate">
                      {tx.description}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDate(tx.date)}
                      {tx.details && (
                        <span className="text-gray-300 dark:text-gray-600">
                          {" "}
                          &middot; {tx.details}
                        </span>
                      )}
                    </p>
                  </div>
                  {tx.amount !== 0 && (
                    <span
                      className={cn(
                        "text-sm font-semibold font-mono-financial shrink-0",
                        config.color
                      )}
                    >
                      {config.sign}
                      {formatCurrency(Math.abs(tx.amount))}
                    </span>
                  )}
                  {tx.amount === 0 && (
                    <span className="text-xs text-gray-300 dark:text-gray-600">&mdash;</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {remaining > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors border-t border-gray-50 dark:border-gray-800"
        >
          {expanded ? "Show less" : `Show ${remaining} more`}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              expanded && "rotate-180"
            )}
          />
        </button>
      )}
    </Card>
  );
}
