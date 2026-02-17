"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const actions = [
  { label: "Deposit", icon: ArrowDownLeft, description: "Add funds" },
  { label: "Withdraw", icon: ArrowUpRight, description: "Cash out" },
  { label: "Rebalance", icon: RefreshCw, description: "Optimize" },
];

export default function QuickActions() {
  const [toast, setToast] = useState<string | null>(null);

  function handleClick(label: string) {
    setToast(label);
    setTimeout(() => setToast(null), 2000);
  }

  return (
    <Card className="relative">
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => handleClick(action.label)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 px-3 rounded-xl",
                "border border-gray-100 hover:border-gray-300 hover:bg-gray-50",
                "transition-all text-center"
              )}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Icon className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {action.label}
                </p>
                <p className="text-xs text-gray-400">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Demo toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-medium px-4 py-2 rounded-full whitespace-nowrap shadow-lg z-10"
          >
            {toast} is disabled in demo mode
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
