"use client";

import { motion, type Variants } from "framer-motion";
import { ReactNode, Children } from "react";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 24,
    },
  },
};

interface StaggeredRevealProps {
  children: ReactNode;
  className?: string;
  /** Custom stagger delay in seconds (default: 0.08) */
  staggerDelay?: number;
  /** Trigger once on scroll into view (default: true) */
  once?: boolean;
  /** Viewport margin for triggering (default: "-10%") */
  viewportMargin?: string;
}

/**
 * Wraps children with intersection-observer-triggered stagger animations.
 * Each child fades up with configurable stagger delay.
 * Respects `prefers-reduced-motion` by instantly showing content.
 */
export function StaggeredReveal({
  children,
  className,
  staggerDelay = 0.08,
  once = true,
  viewportMargin = "-10%",
}: StaggeredRevealProps) {
  const customContainer: Variants = {
    ...containerVariants,
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: viewportMargin }}
      variants={customContainer}
      className={cn(className)}
    >
      {Children.map(children, (child) => (
        <motion.div variants={itemVariants}>{child}</motion.div>
      ))}
    </motion.div>
  );
}

/**
 * Individual stagger item — use when you need per-item control
 * within a StaggeredReveal container.
 */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={itemVariants} className={cn(className)}>
      {children}
    </motion.div>
  );
}
