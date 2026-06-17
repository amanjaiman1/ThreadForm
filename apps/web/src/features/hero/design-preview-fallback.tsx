"use client";

import { useEffect, useRef, useState } from "react";
import { apparelDesigns } from "./designs";

/**
 * Lightweight 2D preview used as the loading skeleton for the 3D scene and as
 * a graceful fallback when WebGL is unavailable. Draws the same artwork on a
 * garment-colored "print card" and cycles through designs.
 */
export function DesignPreviewFallback({
  cycle = true,
  showLabel = true,
}: {
  cycle?: boolean;
  showLabel?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!cycle) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % apparelDesigns.length),
      3400
    );
    return () => clearInterval(id);
  }, [cycle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = (canvas.width = 512);
    const h = (canvas.height = 640);
    const design = apparelDesigns[index % apparelDesigns.length];
    ctx.clearRect(0, 0, w, h);
    // garment-colored card
    ctx.fillStyle = design.garment;
    const r = 28;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(w, 0, w, h, r);
    ctx.arcTo(w, h, 0, h, r);
    ctx.arcTo(0, h, 0, 0, r);
    ctx.arcTo(0, 0, w, 0, r);
    ctx.closePath();
    ctx.fill();
    design.draw(ctx, w, h);
  }, [index]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative w-[62%] max-w-[280px] overflow-hidden rounded-2xl shadow-canvas transition-opacity duration-500">
        <canvas
          ref={canvasRef}
          className="block h-auto w-full"
          aria-hidden
        />
        <div className="skeleton-shimmer pointer-events-none absolute inset-0 opacity-40" />
      </div>
      {showLabel && (
        <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-pill bg-ink-900/80 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {apparelDesigns[index % apparelDesigns.length].label}
        </span>
      )}
    </div>
  );
}
