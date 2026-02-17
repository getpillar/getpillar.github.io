"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LEVERAGE_DEFAULT } from "@/data/mockData";
import BalanceCard from "@/components/demo/BalanceCard";
import YieldBoostDial from "@/components/demo/YieldBoostDial";
import YieldTracker from "@/components/demo/YieldTracker";
import AllocationBreakdown from "@/components/demo/AllocationBreakdown";
import ActivityFeed from "@/components/demo/ActivityFeed";
import WaitlistCTA from "@/components/demo/WaitlistCTA";
import RiskExplainer from "@/components/demo/RiskExplainer";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function DemoPage() {
  const [leverage, setLeverage] = useState(LEVERAGE_DEFAULT);

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUp}>
        <BalanceCard leverage={leverage} />
      </motion.div>
      {/* Yield Boost Dial + Performance side by side on large screens */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6"
      >
        <YieldBoostDial leverage={leverage} onLeverageChange={setLeverage} />
        <YieldTracker leverage={leverage} />
      </motion.div>

      <motion.div variants={fadeUp}>
        <AllocationBreakdown leverage={leverage} />
      </motion.div>
      <motion.div variants={fadeUp}>
        <ActivityFeed leverage={leverage} />
      </motion.div>
      <motion.div variants={fadeUp}>
        <WaitlistCTA leverage={leverage} />
      </motion.div>
      <motion.div variants={fadeUp}>
        <RiskExplainer />
      </motion.div>
    </motion.div>
  );
}
