import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { DesignPreviewFallback } from "@/features/hero/design-preview-fallback";

export const metadata: Metadata = {
  title: "Design Studio",
  description: "The ThreadForm design studio is launching soon.",
  robots: { index: false, follow: true },
};

export default function StudioPage() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden pt-[var(--header-h)]">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-dotgrid opacity-50 [mask-image:radial-gradient(circle,black,transparent_75%)]" />
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-volt-500" />
              The studio is coming
            </span>
            <h1 className="mt-5 text-display">
              The 3D design studio is{" "}
              <span className="text-gradient-brand">almost here</span>
            </h1>
            <p className="mt-5 max-w-lg text-lead text-ink-500">
              We&apos;re putting the finishing touches on the ThreadForm studio —
              design t-shirts, hoodies and oversized tees in 3D, share with your
              crew, and order in bulk. Want early access?
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                href="mailto:hello@threadform.com?subject=Early%20access"
                variant="cta"
                size="lg"
                magnetic
              >
                Request early access
              </Button>
              <Button href="/" variant="outline" size="lg">
                Back to home
              </Button>
            </div>
          </div>
          <div className="mx-auto aspect-square w-full max-w-[440px]">
            <DesignPreviewFallback />
          </div>
        </div>
      </Container>
    </section>
  );
}
