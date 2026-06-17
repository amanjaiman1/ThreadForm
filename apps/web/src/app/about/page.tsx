import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { CTA } from "@/components/sections/cta";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { stats } from "@/lib/content";

export const metadata: Metadata = {
  title: "About — Custom apparel, made effortless",
  description:
    "ThreadForm is on a mission to make custom apparel as easy as posting a story and as powerful as a pro design tool — built in India for clubs, fests, teams and communities.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About ThreadForm",
    description:
      "Our mission: make custom apparel effortless for the crews who order together.",
    url: "/about",
  },
};

const values = [
  {
    title: "Design first, account later",
    body: "Creativity should never be gated behind a signup. Start designing the second you arrive.",
  },
  {
    title: "The garment is the hero",
    body: "Realistic 3D previews give you the confidence to buy — what you see is what you wear.",
  },
  {
    title: "Groups are the point",
    body: "We obsess over making it effortless for whole clubs and teams to order together.",
  },
  {
    title: "Trust is a feature",
    body: "Transparent pricing, clear timelines and a sub-2% defect promise. No nasty surprises.",
  },
];

const inspirations = [
  { name: "Canva", for: "friendliness" },
  { name: "Nike By You", for: "realism" },
  { name: "Printful", for: "production" },
  { name: "Figma", for: "precision" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "About", url: "/about" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+3rem)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <Container className="text-center">
          <SectionHeading
            eyebrow="Our mission"
            title={
              <>
                Make custom apparel{" "}
                <span className="text-gradient-brand">effortless</span> for the
                crews who order together
              </>
            }
            description="ThreadForm started with a simple frustration: ordering matching merch for a club or fest meant spreadsheets, group chats, and designers who ghosted. We're fixing all of it."
          />
        </Container>
      </section>

      {/* Story */}
      <Section className="bg-surface-0">
        <Container size="content" className="max-w-3xl">
          <ScrollReveal>
            <div className="space-y-5 text-lg leading-relaxed text-ink-700">
              <p>
                We believe designing the clothes your community wears should be
                as easy as posting a story — and as powerful as a professional
                design tool. No installs. No design degree. No middlemen.
              </p>
              <p>
                So we built a studio where you drag a logo onto a hoodie, watch
                it spin in 3D, share a link with your crew, collect everyone's
                sizes and payments automatically, and get it delivered. From an
                idea in a group chat to a box at the door.
              </p>
              <p>
                We're proudly built in India, for the clubs, fests, teams,
                startups and communities who bring people together — and want to
                look unmistakably theirs while doing it.
              </p>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Inspirations */}
      <Section className="bg-surface-50 !py-20">
        <Container>
          <SectionHeading
            eyebrow="What we're building"
            title="Four great products, one apparel studio"
            description="We borrow the best ideas and make them apparel-native."
          />
          <ScrollRevealGroup className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {inspirations.map((x) => (
              <ScrollRevealItem key={x.name}>
                <div className="rounded-xl border border-line-200 bg-surface-0 p-6 text-center">
                  <p className="font-display text-xl font-bold text-ink-900">
                    {x.name}
                  </p>
                  <p className="mt-1 text-sm text-ink-400">
                    for its {x.for}
                  </p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </Container>
      </Section>

      {/* Values */}
      <Section className="bg-surface-0">
        <Container>
          <SectionHeading eyebrow="Our principles" title="What we stand for" />
          <ScrollRevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {values.map((v) => (
              <ScrollRevealItem key={v.title}>
                <div className="h-full rounded-xl border border-line-200 bg-surface-50 p-7">
                  <h3 className="text-h3">{v.title}</h3>
                  <p className="mt-2 text-body text-ink-500">{v.body}</p>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </Container>
      </Section>

      {/* Stats band */}
      <section className="bg-gradient-brand py-16 text-white">
        <Container>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-bold">{s.value}</p>
                <p className="mt-1 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA
        title="Come build your crew's next drop"
        subtitle="Join thousands of clubs, fests and teams designing apparel they're proud of."
      />
    </>
  );
}
