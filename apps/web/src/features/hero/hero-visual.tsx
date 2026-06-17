"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DesignPreviewFallback } from "./design-preview-fallback";

// 3D scene is heavy + browser-only → lazy load, never SSR, skeleton meanwhile.
const ShirtScene = dynamic(() => import("./shirt-scene"), {
  ssr: false,
  loading: () => <DesignPreviewFallback />,
});

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [canRender3D, setCanRender3D] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Defer 3D a beat so it never competes with first paint / LCP.
    const supported = supportsWebGL();
    if (!supported) return;
    const t = setTimeout(() => setCanRender3D(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      {/* glow backdrop */}
      <div className="absolute inset-0 -z-10 scale-110 rounded-[40%] bg-gradient-brand opacity-20 blur-3xl" />
      <div className="absolute inset-0 -z-10 bg-dotgrid opacity-60 [mask-image:radial-gradient(circle,black,transparent_72%)]" />

      <div className="h-full w-full">
        {mounted && canRender3D ? (
          <ShirtScene reducedMotion={!!reduce} />
        ) : (
          <DesignPreviewFallback />
        )}
      </div>

      {/* floating UI chips for a premium "design tool" feel */}
      <FloatingChip
        className="left-[-6%] top-[18%]"
        delay={0.3}
        reduce={!!reduce}
      >
        <span className="h-2 w-2 rounded-full bg-success" />
        Print-safe · 300 DPI
      </FloatingChip>
      <FloatingChip
        className="right-[-4%] top-[34%]"
        delay={0.5}
        reduce={!!reduce}
      >
        <span className="h-2 w-2 rounded-full bg-volt-500" />
        Live 3D preview
      </FloatingChip>
      <FloatingChip
        className="bottom-[12%] left-[2%]"
        delay={0.7}
        reduce={!!reduce}
      >
        <ColorDots />
        12 garment colors
      </FloatingChip>
    </div>
  );
}

function FloatingChip({
  children,
  className,
  delay,
  reduce,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.2, 0, 0, 1.2] }}
      className={`absolute z-10 flex items-center gap-2 rounded-pill border border-line-200 bg-surface-0/90 px-3 py-2 text-xs font-semibold text-ink-700 shadow-md backdrop-blur ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

function ColorDots() {
  const colors = ["#1A1A1A", "#6C3CE9", "#0B3D2E", "#E5484D"];
  return (
    <span className="flex -space-x-1">
      {colors.map((c) => (
        <span
          key={c}
          className="h-3 w-3 rounded-full ring-2 ring-surface-0"
          style={{ backgroundColor: c }}
        />
      ))}
    </span>
  );
}
