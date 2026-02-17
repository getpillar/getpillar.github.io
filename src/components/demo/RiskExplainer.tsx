"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen } from "lucide-react";
import { faqItems } from "@/data/mockData";
import { Card, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function RiskExplainer() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-4 h-4 text-gray-400" />
        <CardTitle>Understanding Your Investment</CardTitle>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Plain-English answers to common questions about structured credit.
      </p>

      <div className="border-t border-gray-100 dark:border-gray-800">
        {faqItems.map((item, i) => {
          const isOpen = expanded === i;
          const isLast = i === faqItems.length - 1;

          return (
            <div
              key={i}
              className={cn(
                !isLast && "border-b border-gray-100 dark:border-gray-800"
              )}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className="w-full flex items-center justify-between py-3.5 hover:text-emerald transition-colors text-left cursor-pointer group"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-50 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gray-300 dark:text-gray-600 transition-transform shrink-0 ml-4",
                    isOpen && "rotate-180 text-gray-500 dark:text-gray-400"
                  )}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
