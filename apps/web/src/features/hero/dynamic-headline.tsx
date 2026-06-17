"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const WORDS = ["clubs", "fests", "teams", "events", "startups"];
// widest word reserves the width so trailing text never reflows (zero CLS)
const WIDEST = WORDS.reduce((a, b) => (b.length > a.length ? b : a), "");

/** Rotating gradient word used inside the hero headline. */
export function DynamicHeadline() {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setI((v) => (v + 1) % WORDS.length), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <span className="relative inline-block whitespace-nowrap align-baseline">
      {/* invisible sizer keeps layout stable */}
      <span className="invisible" aria-hidden>
        {WIDEST}
      </span>
      <span className="absolute inset-0 flex items-baseline overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={WORDS[i]}
            initial={reduce ? false : { y: "0.9em", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? undefined : { y: "-0.9em", opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
            className="text-gradient-brand"
          >
            {WORDS[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  );
}
