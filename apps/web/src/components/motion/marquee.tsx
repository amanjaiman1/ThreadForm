"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Infinite marquee. Duplicates children once and translates -50% so the loop
 * is seamless. CSS-driven (GPU transform only) for 60fps; pauses on hover.
 */
export function Marquee({
  children,
  reverse = false,
  speed = 30,
  pauseOnHover = true,
  className,
}: {
  children: ReactNode;
  reverse?: boolean;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn("group relative w-full overflow-hidden mask-fade-x", className)}
      style={{ ["--marquee-duration" as string]: `${speed}s` }}
    >
      <div
        className={cn(
          "flex w-max items-center gap-4",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          pauseOnHover && "group-hover:[animation-play-state:paused]"
        )}
      >
        <div className="flex shrink-0 items-center gap-4">{children}</div>
        <div className="flex shrink-0 items-center gap-4" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
