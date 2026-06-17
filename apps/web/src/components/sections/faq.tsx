"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { faqs as defaultFaqs, type Faq } from "@/lib/content";

export function FAQ({ items = defaultFaqs }: { items?: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-surface-50">
      <Container size="content" className="max-w-3xl">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions, answered"
          description="Everything you need to know before you start designing."
        />

        <div className="mt-12 flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-line-200 bg-surface-0"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="text-base font-semibold text-ink-900">
                    {item.question}
                  </span>
                  <span
                    className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-200 text-ink-500 transition-transform duration-300 ${
                      isOpen ? "rotate-45 border-brand-300 text-brand-600" : ""
                    }`}
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
                    >
                      <p className="px-6 pb-6 text-body text-ink-500">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
