"use client";

import Link from "next/link";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Magnetic } from "@/components/motion/magnetic";

type Variant = "primary" | "cta" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-pill font-semibold whitespace-nowrap transition-[transform,background-color,box-shadow,color] duration-200 ease-standard active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 select-none";

const variants: Record<Variant, string> = {
  // Thread Violet — default primary
  primary:
    "bg-brand-500 text-white shadow-brand hover:bg-brand-600 hover:shadow-lg",
  // Volt — one high-energy CTA per view
  cta: "bg-volt-500 text-ink-900 shadow-volt hover:bg-volt-400 hover:shadow-lg",
  secondary:
    "bg-surface-100 text-ink-900 hover:bg-line-200 border border-line-200",
  ghost: "bg-transparent text-ink-900 hover:bg-surface-100",
  outline:
    "bg-transparent text-ink-900 border border-ink-900/15 hover:border-ink-900/40 hover:bg-surface-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-[0.95rem]",
  lg: "h-14 px-8 text-base",
};

export type ButtonProps = {
  variant?: Variant;
  size?: Size;
  href?: string;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "ref">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      href,
      magnetic = false,
      className,
      children,
      ...props
    },
    ref
  ) {
    const classes = cn(base, variants[variant], sizes[size], className);

    const inner = href ? (
      <Link href={href} className={classes}>
        {children}
      </Link>
    ) : (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );

    if (magnetic) {
      return <Magnetic className="inline-flex">{inner}</Magnetic>;
    }
    return inner;
  }
);
