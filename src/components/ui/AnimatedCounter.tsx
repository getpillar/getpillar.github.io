"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  duration?: number;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 2,
  className,
  duration = 2,
}: AnimatedCounterProps) {
  const spring = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration,
  });

  const display = useTransform(spring, (current) => {
    return `${prefix}${current.toFixed(decimals)}${suffix}`;
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return <motion.span className={className}>{display}</motion.span>;
}

export function TickingYieldCounter({
  baseValue,
  ratePerSecond,
  className,
}: {
  baseValue: number;
  ratePerSecond: number;
  className?: string;
}) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number>(0);

  // Phase 1: spring animate from 0 to baseValue
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const [phase, setPhase] = useState<"spring" | "ticking">("spring");

  const display = useTransform(spring, (val) => {
    if (phase === "spring") {
      return `+$${val.toFixed(2)}`;
    }
    return `+$${current.toFixed(2)}`;
  });

  useEffect(() => {
    spring.set(baseValue);
    const timeout = setTimeout(() => {
      setPhase("ticking");
      setCurrent(baseValue);
      startTime.current = Date.now();
    }, 2000);
    return () => clearTimeout(timeout);
  }, [spring, baseValue]);

  useEffect(() => {
    if (phase !== "ticking") return;

    const tick = () => {
      if (startTime.current) {
        const elapsed = (Date.now() - startTime.current) / 1000;
        setCurrent(baseValue + elapsed * ratePerSecond);
      }
      animationFrame.current = requestAnimationFrame(tick);
    };

    animationFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrame.current);
  }, [phase, baseValue, ratePerSecond]);

  if (phase === "ticking") {
    return <span className={className}>+${current.toFixed(2)}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
}
