"use client";

import type { PrintAreaId, ProductId } from "./editor-types";

/**
 * 2D garment backdrop drawn behind the Fabric print area. Recolors live and
 * swaps silhouette per product / print side. Purely decorative (aria-hidden).
 */
export function GarmentMockup({
  product,
  area,
  color,
}: {
  product: ProductId;
  area: PrintAreaId;
  color: string;
}) {
  const isLight = ["#F2F2F4", "#D9C9A8"].includes(color.toUpperCase());
  const stroke = isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.14)";
  const seam = isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.16)";

  // body silhouette (viewBox 560 x 620)
  const body =
    "M210 92 L150 80 L40 168 L112 252 L176 212 L150 566 " +
    "L410 566 L384 212 L448 252 L520 168 L410 80 L350 92";
  const neckScoop =
    area === "back"
      ? "Q280 118 210 92 Z"
      : "Q280 150 210 92 Z";

  return (
    <svg
      viewBox="0 0 560 620"
      className="absolute left-1/2 top-1/2 h-[126%] w-[148%] -translate-x-1/2 -translate-y-1/2"
      aria-hidden
      style={{ filter: "drop-shadow(0 30px 50px rgba(42,17,112,0.25))" }}
    >
      <path d={body + " " + neckScoop} fill={color} stroke={stroke} strokeWidth={2} />

      {/* collar */}
      <path
        d={area === "back" ? "M210 92 Q280 110 350 92" : "M210 92 Q280 142 350 92"}
        fill="none"
        stroke={seam}
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* sleeve seams */}
      <path d="M176 212 L150 566" fill="none" stroke={seam} strokeWidth={2} />
      <path d="M384 212 L410 566" fill="none" stroke={seam} strokeWidth={2} />

      {/* oversized = wider sleeves hint */}
      {product === "oversized" && (
        <>
          <path d="M40 168 L18 210" stroke={seam} strokeWidth={2} fill="none" />
          <path d="M520 168 L542 210" stroke={seam} strokeWidth={2} fill="none" />
        </>
      )}

      {/* hoodie extras */}
      {product === "hoodie" && (
        <>
          <path
            d="M205 96 Q280 30 355 96 Q330 70 280 70 Q230 70 205 96 Z"
            fill={color}
            stroke={seam}
            strokeWidth={2}
          />
          {area === "front" && (
            <>
              <rect
                x="195"
                y="430"
                width="170"
                height="92"
                rx="12"
                fill="none"
                stroke={seam}
                strokeWidth={2}
              />
              <line x1="262" y1="150" x2="262" y2="250" stroke="#F2F2F4" strokeWidth={5} />
              <line x1="298" y1="150" x2="298" y2="250" stroke="#F2F2F4" strokeWidth={5} />
            </>
          )}
        </>
      )}
    </svg>
  );
}
