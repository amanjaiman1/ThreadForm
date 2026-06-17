import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { HowItWorks } from "@/components/sections/how-it-works";
import { BulkOrdering } from "@/components/sections/bulk-ordering";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { FaqJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { STUDIO_URL } from "@/lib/site";
import type { UseCase } from "@/lib/use-cases";

export function UseCasePage({ data }: { data: UseCase }) {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: data.nav, url: `/${data.slug}` },
        ]}
      />
      <FaqJsonLd items={data.faqs} />

      {/* Hero */}
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+3.5rem)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <ScrollReveal>
                <span className="eyebrow">
                  <span className="h-1.5 w-1.5 rounded-full bg-volt-500" />
                  {data.eyebrow}
                </span>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <h1 className="mt-5 text-display">
                  {data.title}{" "}
                  <span className="text-gradient-brand">{data.highlight}</span>
                  {data.titleTail}
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="mt-5 max-w-xl text-lead text-ink-500">
                  {data.description}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.15}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={STUDIO_URL} variant="cta" size="lg" magnetic>
                    Start designing — free
                  </Button>
                  <Button href="#how-it-works" variant="outline" size="lg">
                    See how it works
                  </Button>
                </div>
              </ScrollReveal>
            </div>

            {/* showcase tiles */}
            <ScrollReveal direction="left" delay={0.2}>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {data.showcase.map((tile, i) => (
                  <div
                    key={tile.title}
                    className={`flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-line-200 p-4 text-center shadow-sm ${
                      i === 1 ? "translate-y-4 sm:translate-y-6" : ""
                    }`}
                    style={{ backgroundColor: tile.garment }}
                  >
                    <span
                      className="font-display text-2xl font-extrabold sm:text-3xl"
                      style={{ color: tile.accent }}
                    >
                      {tile.title}
                    </span>
                    <span className="mt-1 text-xs font-semibold uppercase tracking-wide text-white/80">
                      {tile.sub}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <Section className="bg-surface-0">
        <Container>
          <SectionHeading
            eyebrow="Why ThreadForm"
            title={`Built for ${data.nav.toLowerCase()}`}
          />
          <ScrollRevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {data.benefits.map((b) => (
              <ScrollRevealItem key={b.title}>
                <div className="flex h-full gap-4 rounded-xl border border-line-200 bg-surface-50 p-6">
                  <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-h3">{b.title}</h3>
                    <p className="mt-1.5 text-body text-ink-500">{b.body}</p>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </Container>
      </Section>

      <HowItWorks />
      <BulkOrdering />
      <FAQ items={data.faqs} />
      <CTA title={data.ctaTitle} subtitle={data.ctaSubtitle} />
    </>
  );
}
