import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { FeatureIcon } from "@/components/ui/icon";
import {
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { features } from "@/lib/content";

export function Features() {
  return (
    <Section id="features" className="bg-surface-0">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="A studio that feels like magic, built like a pro tool"
          description="The friendliness of Canva, the realism of Nike By You, the precision of Figma — purpose-built for apparel."
        />

        <ScrollRevealGroup className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <ScrollRevealItem key={f.title}>
              <div className="group h-full rounded-xl border border-line-200 bg-surface-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-md">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white">
                  <FeatureIcon name={f.icon} />
                </div>
                <h3 className="mt-5 text-h3">{f.title}</h3>
                <p className="mt-2 text-body text-ink-500">{f.body}</p>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealGroup>
      </Container>
    </Section>
  );
}
