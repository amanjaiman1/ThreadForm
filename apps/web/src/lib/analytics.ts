/**
 * Provider-agnostic analytics. Sends events to whatever is wired up at runtime
 * (Google Analytics gtag, Plausible, or a first-party /events endpoint per
 * API_SPEC.md) and no-ops safely if none are present. Never throws.
 */

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "design_start"
  | "design_share"
  | "design_save"
  | "design_export"
  | "template_open"
  | "add_text"
  | "add_image"
  | "add_shape";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: AnalyticsProps }) => void;
    dataLayer?: unknown[];
    __tfQueue?: { event: AnalyticsEvent; props: AnalyticsProps; ts: number }[];
  }
}

const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV !== "production";

/** Fire an analytics event to all detected providers. Safe everywhere. */
export function track(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  if (!isBrowser) return;
  const payload = { ...clean(props) };

  try {
    // Google Analytics 4
    if (typeof window.gtag === "function") {
      window.gtag("event", event, payload);
    }
    // Plausible custom events
    if (typeof window.plausible === "function") {
      window.plausible(event, { props: payload });
    }
    // First-party collector (best-effort, non-blocking). Enabled only when a
    // collector endpoint exists; uses sendBeacon so it never blocks the UI.
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT && "sendBeacon" in navigator) {
      const body = JSON.stringify({
        events: [{ name: event, props: payload, ts: new Date().toISOString() }],
      });
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT,
        new Blob([body], { type: "application/json" })
      );
    }
    // Always keep a local ring buffer (useful for debugging / later flush)
    window.__tfQueue = window.__tfQueue ?? [];
    window.__tfQueue.push({ event, props: payload, ts: Date.now() });
    if (window.__tfQueue.length > 100) window.__tfQueue.shift();

    if (isDev) {
      // eslint-disable-next-line no-console
      console.debug(`[analytics] ${event}`, payload);
    }
  } catch {
    /* analytics must never break the app */
  }
}

function clean(props: AnalyticsProps): AnalyticsProps {
  const out: AnalyticsProps = {};
  for (const [k, v] of Object.entries(props)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Build the data attributes a clickable element needs to be auto-tracked. */
export function trackAttrs(event: AnalyticsEvent, props: AnalyticsProps = {}) {
  return {
    "data-evt": event,
    "data-evt-props": JSON.stringify(clean(props)),
  } as const;
}
