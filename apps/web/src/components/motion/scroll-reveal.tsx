"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offset: Record<Direction, { x?: number; y?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

/**
 * Scroll-reveal wrapper. Fades + slides content in as it enters the viewport.
 * Honors prefers-reduced-motion (renders instantly with no transform).
 */
export function ScrollReveal({
  children,
  as = "div",
  direction = "up",
  delay = 0,
  duration = 0.6,
  className,
  once = true,
  amount = 0.25,
}: {
  children: ReactNode;
  as?: keyof typeof motion;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: { opacity: 0, ...(reduce ? {} : offset[direction]) },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.2, 0, 0, 1],
      },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Staggered container — children using <ScrollRevealItem> animate in sequence.
 */
export function ScrollRevealGroup({
  children,
  className,
  stagger = 0.08,
  once = true,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: reduce ? 0 : stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...(reduce ? {} : offset[direction]) },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: reduce ? 0 : 0.55, ease: [0.2, 0, 0, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
