import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { testimonials, stats } from "@/lib/content";

export function Testimonials() {
  return (
    <Section id="testimonials" className="bg-surface-0">
      <Container>
        <SectionHeading
          eyebrow="Loved by crews"
          title="The crews behind India's best merch"
          description="Clubs, fests, teams and startups ship faster — and look better — with ThreadForm."
        />

        {/* stats */}
        <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-line-200 bg-surface-50 p-5 text-center"
            >
              <p className="text-gradient-brand font-display text-3xl font-bold">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <ScrollRevealGroup className="mt-10 grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <ScrollRevealItem key={t.name}>
              <figure className="flex h-full flex-col rounded-xl border border-line-200 bg-surface-50 p-7">
                <div className="flex text-volt-600" aria-hidden>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7L12 2z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-ink-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white">
                    {t.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink-900">
                      {t.name}
                    </span>
                    <span className="block text-sm text-ink-500">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </Container>
    </Section>
  );
}
