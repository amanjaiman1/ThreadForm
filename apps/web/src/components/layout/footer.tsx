import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { footerNav, siteConfig, STUDIO_URL } from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line-200 bg-surface-50">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div className="flex flex-col gap-5">
            <Logo />
            <p className="max-w-xs text-sm text-ink-500">
              {siteConfig.description}
            </p>
            <Button href={STUDIO_URL} variant="cta" size="md" className="w-fit">
              Start designing — it&apos;s free
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerNav.map((group) => (
              <div key={group.title} className="flex flex-col gap-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-400">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-sm text-ink-700 transition-colors hover:text-brand-600"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line-200 pt-6 text-sm text-ink-400 sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.legalName}. Designed in India 🇮🇳
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-ink-700">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-ink-700">
              Terms
            </Link>
            <a
              href={`mailto:${siteConfig.email}`}
              className="hover:text-ink-700"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
