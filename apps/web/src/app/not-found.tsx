import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] items-center pt-[var(--header-h)]">
      <Container className="text-center">
        <p className="text-gradient-brand font-display text-7xl font-bold sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 text-h2">This design doesn&apos;t exist (yet)</h1>
        <p className="mx-auto mt-3 max-w-md text-lead text-ink-500">
          The page you&apos;re looking for moved or never existed. Let&apos;s get
          you back to designing.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" variant="cta" size="lg" magnetic>
            Back to home
          </Button>
          <Button href="/pricing" variant="outline" size="lg">
            View pricing
          </Button>
        </div>
      </Container>
    </section>
  );
}
