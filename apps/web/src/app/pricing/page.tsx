import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Section, SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  ScrollReveal,
  ScrollRevealGroup,
  ScrollRevealItem,
} from "@/components/motion/scroll-reveal";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ProductJsonLd,
} from "@/components/seo/json-ld";
import { STUDIO_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pricing — Free to design, pay per piece",
  description:
    "ThreadForm is free to design, preview in 3D and share. Pay only when you order — with bulk pricing that drops automatically as your group grows. See per-garment pricing.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "ThreadForm Pricing — Free to design, pay per piece",
    description:
      "Free to design and share. Pay per piece with automatic bulk discounts for clubs, fests and teams.",
    url: "/pricing",
  },
};

const garments = [
  { name: "Classic Tee", prices: [499, 399, 349, 319] },
  { name: "Oversized Tee", prices: [649, 549, 499, 459] },
  { name: "Classic Hoodie", prices: [1199, 999, 849, 749] },
];
const qtyCols = ["1+", "10+", "25+", "50+"];

const plans = [
  {
    name: "Free",
    price: "₹0",
    note: "forever",
    highlight: false,
    cta: "Start designing",
    features: [
      "Full 3D design studio",
      "Text, logos & image uploads",
      "Save & share unlimited designs",
      "Order solo or start a group order",
      "Standard per-piece pricing",
    ],
  },
  {
    name: "Pro",
    price: "Coming soon",
    note: "for power creators",
    highlight: true,
    cta: "Join the waitlist",
    features: [
      "Everything in Free",
      "Reusable brand kits",
      "Ad-free experience",
      "Priority production",
      "Unlimited design storage",
    ],
  },
  {
    name: "Teams & Orgs",
    price: "Let's talk",
    note: "for large crews",
    highlight: false,
    cta: "Contact sales",
    features: [
      "Everything in Pro",
      "GST invoicing & POs",
      "Multi-admin workspaces",
      "Custom bulk deals & MOQs",
      "Dedicated support",
    ],
  },
];

const pricingFaqs = [
  {
    question: "Is designing really free?",
    answer:
      "Yes — designing, 3D previews, saving and sharing cost nothing. You only pay for apparel you choose to order.",
  },
  {
    question: "How does bulk pricing work?",
    answer:
      "Per-piece prices drop automatically at 10, 25 and 50+ units. The whole group benefits from the lower price as more members join.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No setup fees. You'll see the full price — including any add-ons, shipping and taxes — before you pay.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "All major cards, UPI and popular wallets via secure, encrypted checkout.",
  },
];

export default function PricingPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      <FaqJsonLd items={pricingFaqs} />
      <ProductJsonLd
        name="Custom Classic Hoodie"
        description="Design-your-own custom hoodie with 3D preview and bulk pricing."
        priceFrom={749}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+3rem)]">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        <Container className="text-center">
          <SectionHeading
            eyebrow="Pricing"
            title={
              <>
                Free to design.{" "}
                <span className="text-gradient-brand">Pay per piece.</span>
                <br className="hidden sm:block" /> Bulk saves more.
              </>
            }
            description="No subscriptions to start, no minimums. Design and share for free — pay only when your crew orders."
          />
          <ScrollReveal delay={0.15}>
            <div className="mt-8 flex justify-center">
              <Button href={STUDIO_URL} variant="cta" size="lg" magnetic>
                Start designing — free
              </Button>
            </div>
          </ScrollReveal>
        </Container>
      </section>

      {/* Per-garment bulk pricing */}
      <Section className="bg-surface-0 !pt-12">
        <Container size="content">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl border border-line-200">
              <div className="bg-surface-50 px-6 py-4">
                <h2 className="text-h3">Per-piece pricing (INR)</h2>
                <p className="mt-1 text-sm text-ink-500">
                  Indicative prices for a front print. Add-ons like back/sleeve
                  prints and embroidery are priced transparently at checkout.
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-left">
                  <thead>
                    <tr className="border-t border-line-200 text-sm text-ink-400">
                      <th className="px-6 py-3 font-semibold">Garment</th>
                      {qtyCols.map((q) => (
                        <th key={q} className="px-6 py-3 text-center font-semibold">
                          {q}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {garments.map((g) => (
                      <tr key={g.name} className="border-t border-line-200">
                        <td className="px-6 py-4 font-semibold text-ink-900">
                          {g.name}
                        </td>
                        {g.prices.map((p, i) => (
                          <td
                            key={i}
                            className={`px-6 py-4 text-center font-mono ${
                              i === g.prices.length - 1
                                ? "font-bold text-brand-600"
                                : "text-ink-700"
                            }`}
                          >
                            ₹{p}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </ScrollReveal>
        </Container>
      </Section>

      {/* Plans */}
      <Section className="bg-surface-50 !pt-4">
        <Container>
          <SectionHeading
            eyebrow="Plans"
            title="Start free, scale when you're ready"
          />
          <ScrollRevealGroup className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <ScrollRevealItem key={plan.name}>
                <div
                  className={`relative flex h-full flex-col rounded-2xl border p-7 ${
                    plan.highlight
                      ? "border-brand-300 bg-surface-0 shadow-canvas"
                      : "border-line-200 bg-surface-0"
                  }`}
                >
                  {plan.highlight && (
                    <span className="absolute -top-3 left-7 rounded-pill bg-volt-500 px-3 py-1 text-xs font-bold text-ink-900">
                      Most loved
                    </span>
                  )}
                  <h3 className="text-h3">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-bold text-ink-900">
                      {plan.price}
                    </span>
                    <span className="text-sm text-ink-400">{plan.note}</span>
                  </div>
                  <ul className="mt-6 flex flex-1 flex-col gap-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink-700">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7">
                    <Button
                      href={STUDIO_URL}
                      variant={plan.highlight ? "cta" : "secondary"}
                      size="md"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealGroup>
        </Container>
      </Section>

      <FAQ items={pricingFaqs} />
      <CTA
        title="Design free. Order when you're ready."
        subtitle="No subscription, no minimums. Just you, your crew, and apparel you'll love."
      />
    </>
  );
}
