"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Marquee } from "@/components/motion/marquee";
import { HeroVisual } from "@/features/hero/hero-visual";
import { DynamicHeadline } from "@/features/hero/dynamic-headline";
import { STUDIO_URL } from "@/lib/site";

const TRUST = [
  "IIT Bombay clubs",
  "VIT Riviera",
  "Delhi University societies",
  "Startup India teams",
  "NIT sports clubs",
  "BITS Pilani fests",
  "Manipal communities",
  "SRM events",
];

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.05 * i, duration: 0.6, ease: [0.2, 0, 0, 1] },
  }),
};

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-[calc(var(--header-h)+2rem)] sm:pt-[calc(var(--header-h)+3rem)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid opacity-[0.5] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-8">
          {/* Copy */}
          <div className="flex flex-col items-start">
            <motion.span
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="eyebrow"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-volt-500" />
              India&apos;s design-first apparel studio
            </motion.span>

            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-5 text-display"
            >
              Custom apparel
              <br className="hidden sm:block" /> your whole{" "}
              <DynamicHeadline /> will wear.
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-5 max-w-xl text-lead text-ink-500"
            >
              Design t-shirts, hoodies and oversized tees in 3D. Add your logo,
              preview it live, share a link — then order one or five hundred.
              No design skills, no minimums to start.
            </motion.p>

            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Button href={STUDIO_URL} variant="cta" size="lg" magnetic>
                Start designing — free
              </Button>
              <Button href="#how-it-works" variant="outline" size="lg">
                See how it works
              </Button>
            </motion.div>

            <motion.div
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-8 flex items-center gap-5 text-sm text-ink-500"
            >
              <div className="flex items-center gap-1.5">
                <Stars />
                <span className="font-semibold text-ink-900">4.9/5</span>
                <span>from 2,300+ crews</span>
              </div>
              <span className="hidden h-4 w-px bg-line-200 sm:block" />
              <span className="hidden sm:block">
                <span className="font-semibold text-ink-900">120k+</span> pieces
                shipped
              </span>
            </motion.div>
          </div>

          {/* 3D visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.2, 0, 0, 1.2] }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </Container>

      {/* trust marquee */}
      <div className="mt-14 border-y border-line-200 bg-surface-50 py-5">
        <p className="container-px mb-3 text-center text-xs font-semibold uppercase tracking-[0.14em] text-ink-400">
          Trusted by crews across India
        </p>
        <Marquee speed={36}>
          {TRUST.map((t) => (
            <span
              key={t}
              className="mx-2 whitespace-nowrap rounded-pill border border-line-200 bg-surface-0 px-5 py-2 text-sm font-semibold text-ink-700"
            >
              {t}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}

function Stars() {
  return (
    <span className="flex text-volt-600" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
        </svg>
      ))}
    </span>
  );
}
