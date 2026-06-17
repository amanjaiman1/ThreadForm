import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { steps } from "@/lib/content";

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-surface-0">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From idea to doorstep in four steps"
          description="No design degree required. ThreadForm guides your whole crew from a blank garment to a box at the door."
        />

        <ScrollRevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <ScrollRevealItem key={step.n}>
              <div className="group h-full rounded-xl border border-line-200 bg-surface-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-md">
                <span className="font-mono text-sm font-semibold text-brand-500">
                  {step.n}
                </span>
                <div className="mt-4 h-px w-full bg-line-200 transition-colors group-hover:bg-brand-300" />
                <h3 className="mt-4 text-h3">{step.title}</h3>
                <p className="mt-2 text-sm text-ink-500">{step.body}</p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </Container>
    </Section>
  );
}
