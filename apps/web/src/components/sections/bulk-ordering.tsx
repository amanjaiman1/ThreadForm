import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { STUDIO_URL } from "@/lib/site";

const perks = [
  "Share one link — members pick their own size & color",
  "Split payment: everyone pays their share, or you cover it",
  "Bulk pricing unlocks automatically as your group grows",
  "Names & numbers auto-generated for team jerseys",
];

export function BulkOrdering() {
  return (
    <section
      id="bulk"
      className="scroll-mt-24 bg-gradient-brand py-20 text-white sm:py-28 lg:py-32"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 rounded-pill bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-volt-400 backdrop-blur">
                Bulk & group ordering
              </span>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h2 className="mt-5 text-h1">
                Kit out your <span className="text-volt-400">entire crew</span>{" "}
                without the spreadsheet
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-4 max-w-xl text-lead text-white/70">
                Built for clubs, fests and teams that order together. One
                organizer, one link, zero chasing people for sizes and money.
              </p>
            </ScrollReveal>

            <ul className="mt-8 flex flex-col gap-3">
              {perks.map((p, i) => (
                <ScrollReveal as="li" key={p} delay={0.12 + i * 0.06}>
                  <span className="flex items-start gap-3 text-white/90">
                    <Check />
                    <span>{p}</span>
                  </span>
                </ScrollReveal>
              ))}
            </ul>

            <ScrollReveal delay={0.4}>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={STUDIO_URL} variant="cta" size="lg" magnetic>
                  Start a group order
                </Button>
                <Button
                  href="/pricing"
                  size="lg"
                  className="border border-white/25 bg-white/5 text-white hover:bg-white/10"
                >
                  See bulk pricing
                </Button>
              </div>
            </ScrollReveal>
          </div>

          {/* CampaignTracker mock */}
          <ScrollReveal direction="left" delay={0.2}>
            <CampaignTrackerCard />
          </ScrollReveal>
        </div>
      </Container>
    </section>
  );
}

function CampaignTrackerCard() {
  const sizes = [
    { s: "S", n: 6 },
    { s: "M", n: 14 },
    { s: "L", n: 11 },
    { s: "XL", n: 5 },
  ];
  const joined = 36;
  const target = 45;
  const pct = Math.round((joined / target) * 100);

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Spring Fest Hoodies</p>
          <p className="text-xs text-white/60">Closes in 2 days</p>
        </div>
        <span className="rounded-pill bg-volt-500 px-3 py-1 text-xs font-bold text-ink-900">
          Collecting
        </span>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/70">
            {joined} of {target} joined
          </span>
          <span className="font-semibold text-volt-400">{pct}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-pill bg-white/10">
          <div
            className="h-full rounded-pill bg-gradient-volt"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-4 gap-2">
        {sizes.map((x) => (
          <div
            key={x.s}
            className="rounded-lg bg-white/[0.06] p-3 text-center"
          >
            <p className="text-lg font-bold">{x.n}</p>
            <p className="text-xs text-white/60">{x.s}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
        <div className="flex -space-x-2">
          {["RS", "AM", "MN", "DP", "+"].map((a, i) => (
            <span
              key={i}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand-700 bg-white/15 text-xs font-semibold"
            >
              {a}
            </span>
          ))}
        </div>
        <span className="text-sm font-semibold text-white/80">
          28 paid · 8 pending
        </span>
      </div>
    </div>
  );
}

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-volt-500 text-ink-900">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
