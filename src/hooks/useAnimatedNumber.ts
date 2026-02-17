"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export function useAnimatedNumber(
  targetValue: number,
  ratePerSecond: number,
  springDurationMs = 2000
) {
  const [value, setValue] = useState(0);
  const [isTicking, setIsTicking] = useState(false);
  const startTime = useRef<number>(0);
  const frameRef = useRef<number>(0);

  // Phase 1: Spring animation from 0 to target
  useEffect(() => {
    const start = performance.now();
    const duration = springDurationMs;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(targetValue * eased);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setValue(targetValue);
        setIsTicking(true);
        startTime.current = performance.now();
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [targetValue, springDurationMs]);

  // Phase 2: Real-time ticking
  useEffect(() => {
    if (!isTicking) return;

    const tick = () => {
      const elapsed = (performance.now() - startTime.current) / 1000;
      setValue(targetValue + elapsed * ratePerSecond);
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [isTicking, targetValue, ratePerSecond]);

  return value;
}
