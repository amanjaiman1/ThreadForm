/* Shared Open Graph / Twitter image layout rendered via next/og ImageResponse. */
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function renderOgImage(opts?: {
  title?: string;
  subtitle?: string;
  badge?: string;
}) {
  const title = opts?.title ?? "Design custom apparel your whole crew will wear";
  const subtitle =
    opts?.subtitle ??
    "T-shirts, hoodies & oversized tees · 3D preview · Bulk ordering";
  const badge = opts?.badge ?? "ThreadForm";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(135deg, #6C3CE9 0%, #2A1170 60%, #0E0E12 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 38,
              fontWeight: 800,
            }}
          >
            T
          </div>
          <div style={{ fontSize: 34, fontWeight: 700 }}>{badge}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 980,
            }}
          >
            {title}
          </div>
          <div style={{ fontSize: 30, color: "rgba(255,255,255,0.78)" }}>
            {subtitle}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              background: "#A6F000",
              color: "#0E0E12",
              padding: "14px 28px",
              borderRadius: 999,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Start designing — free
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.6)" }}>
            threadform.com
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
