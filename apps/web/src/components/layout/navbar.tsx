"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { mainNav, STUDIO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex h-[var(--header-h)] max-w-wide items-center justify-between gap-4 px-5 transition-all duration-300 ease-standard sm:px-8 lg:px-10",
          scrolled &&
            "supports-[backdrop-filter]:bg-surface-0/70 backdrop-blur-xl"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-x-3 top-2 -z-10 h-[calc(var(--header-h)-8px)] rounded-pill border border-transparent transition-all duration-300 ease-standard",
            scrolled && "border-line-200/80 bg-surface-0/60 shadow-sm"
          )}
        />
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-pill px-3.5 py-2 text-sm font-medium text-ink-500 transition-colors hover:bg-surface-100 hover:text-ink-900",
                  active && "bg-surface-100 text-ink-900"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Button href={STUDIO_URL} variant="ghost" size="sm">
            Sign in
          </Button>
          <Button href={STUDIO_URL} variant="cta" size="sm" magnetic>
            Start designing
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-200 bg-surface-0/80 lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "h-0.5 w-5 bg-ink-900 transition-transform duration-300",
                open && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 bg-ink-900 transition-opacity duration-200",
                open && "opacity-0"
              )}
            />
            <span
              className={cn(
                "h-0.5 w-5 bg-ink-900 transition-transform duration-300",
                open && "-translate-y-2 -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
            className="lg:hidden"
          >
            <div className="mx-3 mt-2 rounded-xl border border-line-200 bg-surface-0/95 p-4 shadow-lg backdrop-blur-xl">
              <nav className="flex flex-col">
                {mainNav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-3 text-base font-medium text-ink-700 hover:bg-surface-100"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 flex flex-col gap-2">
                <Button href={STUDIO_URL} variant="secondary" size="md">
                  Sign in
                </Button>
                <Button href={STUDIO_URL} variant="cta" size="md">
                  Start designing
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
