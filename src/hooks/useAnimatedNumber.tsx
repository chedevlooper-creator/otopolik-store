"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, useMotionValue, useTransform, motion } from "framer-motion";

/**
 * Hook that smoothly interpolates between numeric values with spring physics.
 * Returns a MotionValue<string> formatted via the provided formatter.
 */
export function useAnimatedNumber(
  value: number,
  formatter: (n: number) => string = (n) => n.toFixed(0),
  springConfig = { stiffness: 100, damping: 20, mass: 0.5 }
) {
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, springConfig);
  const [display, setDisplay] = useState(formatter(value));
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      motionValue.set(value);
      prevValue.current = value;
    }
  }, [value, motionValue]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (latest: number) => {
      setDisplay(formatter(latest));
    });
    return unsubscribe;
  }, [spring, formatter]);

  return display;
}

/**
 * Animated number component — renders a span that smoothly rolls between values.
 */
export function AnimatedNumber({
  value,
  formatter,
  className,
  springConfig,
}: {
  value: number;
  formatter?: (n: number) => string;
  className?: string;
  springConfig?: { stiffness: number; damping: number; mass?: number };
}) {
  const config = springConfig ? { mass: 0.5, ...springConfig } : undefined;
  const display = useAnimatedNumber(value, formatter, config);
  return <span className={className}>{display}</span>;
}
