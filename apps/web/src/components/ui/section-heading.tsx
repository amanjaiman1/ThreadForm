import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

/** Consistent section header: eyebrow + title + optional description. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <ScrollReveal>
          <span className="eyebrow">{eyebrow}</span>
        </ScrollReveal>
      ) : null}
      <ScrollReveal delay={0.05}>
        <h2
          className={cn(
            "text-h1 max-w-3xl",
            align === "center" && "mx-auto",
            titleClassName
          )}
        >
          {title}
        </h2>
      </ScrollReveal>
      {description ? (
        <ScrollReveal delay={0.1}>
          <p
            className={cn(
              "text-lead text-ink-500 max-w-2xl",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </ScrollReveal>
      ) : null}
    </div>
  );
}

/** Vertical rhythm wrapper for page sections. */
export function Section({
  children,
  id,
  className,
}: {
  children: ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 py-20 sm:py-28 lg:py-32", className)}
    >
      {children}
    </section>
  );
}
