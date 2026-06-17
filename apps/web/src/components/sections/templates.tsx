import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { templates } from "@/lib/content";
import { STUDIO_URL } from "@/lib/site";

export function Templates() {
  return (
    <Section id="templates" className="bg-surface-50">
      <Container size="wide">
        <div className="flex flex-col items-end justify-between gap-6 sm:flex-row sm:items-center">
          <SectionHeading
            align="left"
            eyebrow="Templates"
            title="Start from a head-start"
            description="Battle-tested layouts for every kind of crew. Open one, swap your details, done."
            className="max-w-2xl"
          />
          <Button href={STUDIO_URL} variant="secondary" size="md" className="shrink-0">
            Browse all templates
          </Button>
        </div>

        <ScrollRevealGroup className="mt-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {templates.map((t) => (
            <ScrollRevealItem key={t.title}>
              <Link
                href={STUDIO_URL}
                className="group relative block aspect-[4/5] overflow-hidden rounded-xl border border-line-200 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-canvas"
                style={{ backgroundColor: t.garment }}
              >
                {/* faux print graphic */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <span
                    className="font-display text-3xl font-extrabold leading-none sm:text-4xl"
                    style={{ color: t.accent }}
                  >
                    {t.title.split(" ")[0].toUpperCase()}
                  </span>
                  <span className="mt-2 font-display text-lg font-bold uppercase tracking-wide text-white/90">
                    {t.title.split(" ").slice(1).join(" ")}
                  </span>
                </div>

                {/* hover footer */}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-4">
                  <span className="rounded-pill bg-white/15 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
                    {t.category}
                  </span>
                  <span className="translate-y-1 text-xs font-semibold text-volt-400 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Customize →
                  </span>
                </div>
              </Link>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </Container>
    </Section>
  );
}
