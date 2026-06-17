import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";

/** Centered max-width content wrapper with responsive horizontal padding. */
export function Container({
  children,
  className,
  as: Tag = "div",
  size = "content",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: "content" | "wide";
}) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full container-px",
        size === "wide" ? "max-w-wide" : "max-w-content",
        className
      )}
    >
      {children}
    </Tag>
  );
}
