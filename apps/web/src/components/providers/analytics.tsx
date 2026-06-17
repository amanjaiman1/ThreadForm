"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track, type AnalyticsEvent, type AnalyticsProps } from "@/lib/analytics";
import { STUDIO_URL } from "@/lib/site";

/**
 * Wires up automatic analytics:
 *  - page_view on every route change
 *  - cta_click on any link to the studio (and any [data-evt] element)
 *  - design_share on any [data-share] element
 * Explicit events elsewhere call track() directly.
 */
export function AnalyticsProvider() {
  const pathname = usePathname();

  // page views
  useEffect(() => {
    track("page_view", { path: pathname });
  }, [pathname]);

  // delegated click tracking
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el) return;

      // 1) explicit data-evt elements
      const explicit = el.closest<HTMLElement>("[data-evt]");
      if (explicit) {
        const event = explicit.dataset.evt as AnalyticsEvent;
        let props: AnalyticsProps = {};
        try {
          props = JSON.parse(explicit.dataset.evtProps || "{}");
        } catch {
          /* ignore */
        }
        track(event, props);
        return;
      }

      // 2) share buttons
      const share = el.closest<HTMLElement>("[data-share]");
      if (share) {
        track("design_share", {
          channel: share.dataset.share || "unknown",
        });
        return;
      }

      // 3) any anchor pointing at the studio = a CTA → design funnel entry
      const anchor = el.closest<HTMLAnchorElement>("a[href]");
      if (anchor) {
        const href = anchor.getAttribute("href") || "";
        if (href.startsWith(STUDIO_URL)) {
          const sectionId = anchor.closest("section")?.id;
          const inHeader = !!anchor.closest("header");
          const location = sectionId || (inHeader ? "nav" : "page");
          track("cta_click", { href, location, label: anchor.innerText.trim() });
        }
      }
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
