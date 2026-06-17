import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { STUDIO_URL } from "@/lib/site";

export function CTA({
  title = "Ready to design something your crew will love?",
  subtitle = "Start free. Preview in 3D. Order one or five hundred. No design skills, no commitments.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-line-200 bg-ink-900 px-6 py-16 text-center sm:px-12 sm:py-20">
            {/* glow accents */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-brand-500/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-volt-500/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-[0.15]" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-h1 text-white">{title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-lead text-white/70">
                {subtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Button href={STUDIO_URL} variant="cta" size="lg" magnetic>
                  Start designing — free
                </Button>
                <Button
                  href="/pricing"
                  size="lg"
                  className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                >
                  View pricing
                </Button>
              </div>
              <p className="mt-5 text-sm text-white/50">
                Free to design & share · Pay only when you order
              </p>
            </div>
          </div>
        </ScrollReveal>
      </Container>
    </section>
  );
}
