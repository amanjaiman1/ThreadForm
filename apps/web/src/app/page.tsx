import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Templates } from "@/components/sections/templates";
import { Features } from "@/components/sections/features";
import { BulkOrdering } from "@/components/sections/bulk-ordering";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTA } from "@/components/sections/cta";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { faqs } from "@/lib/content";

export default function HomePage() {
  return (
    <>
      <FaqJsonLd items={faqs} />
      <Hero />
      <HowItWorks />
      <Templates />
      <Features />
      <BulkOrdering />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}
