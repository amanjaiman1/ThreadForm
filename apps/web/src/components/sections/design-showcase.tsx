"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import { STUDIO_URL } from "@/lib/site";
import {
  showcaseCategories,
  showcaseItems,
  type ShowcaseItem,
} from "@/lib/content";

export function DesignShowcase() {
  const [active, setActive] = useState<(typeof showcaseCategories)[number]>("All");

  const items =
    active === "All"
      ? showcaseItems
      : showcaseItems.filter((i) => i.category === active);

  return (
    <Section id="showcase" className="bg-surface-0">
      <Container size="wide">
        <SectionHeading
          eyebrow="Design showcase"
          title="Real drops from real crews"
          description="A peek at what clubs, fests and teams across India have brought to life on ThreadForm."
        />

        {/* filter pills */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {showcaseCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-pill border px-4 py-2 text-sm font-semibold transition-all duration-200",
                active === cat
                  ? "border-brand-500 bg-brand-500 text-white shadow-brand"
                  : "border-line-200 bg-surface-0 text-ink-500 hover:border-brand-300 hover:text-ink-900"
              )}
              aria-pressed={active === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          layout
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <ShowcaseCard key={item.title + item.sub} item={item} />
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </Section>
  );
}

function ShowcaseCard({ item }: { item: ShowcaseItem }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
    >
      <Link
        href={STUDIO_URL}
        className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-line-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-canvas"
        style={{ backgroundColor: item.garment }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center">
          <span
            className="font-display text-2xl font-extrabold leading-none sm:text-3xl"
            style={{ color: item.accent }}
          >
            {item.title}
          </span>
          <span className="mt-2 text-xs font-semibold uppercase tracking-wide text-white/80">
            {item.sub}
          </span>
        </div>

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span className="rounded-pill bg-white/15 px-2.5 py-1 text-[0.7rem] font-semibold text-white backdrop-blur">
            {item.category}
          </span>
          <span className="flex items-center gap-1 rounded-pill bg-black/25 px-2 py-1 text-[0.7rem] font-medium text-white backdrop-blur">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 21s-7-4.5-9.5-8.5C.9 9.7 2.2 6 5.5 6c2 0 3.2 1.2 4.5 3 1.3-1.8 2.5-3 4.5-3 3.3 0 4.6 3.7 3 6.5C19 16.5 12 21 12 21Z" />
            </svg>
            {item.likes}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-end bg-gradient-to-t from-black/60 to-transparent p-3">
          <span className="translate-y-1 text-xs font-semibold text-volt-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            Remix this →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
