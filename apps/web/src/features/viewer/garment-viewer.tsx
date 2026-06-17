"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  garmentColors,
  materials,
  models,
  views,
} from "./garments";
import { useViewerStore } from "./viewer-store";

const GarmentScene = dynamic(() => import("./garment-scene"), {
  ssr: false,
  loading: () => <ViewerSkeleton />,
});

export function GarmentViewer({ className }: { className?: string }) {
  const store = useViewerStore();

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-line-200 bg-gradient-to-b from-surface-50 to-surface-100",
        className
      )}
    >
      {/* dotgrid backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-50 [mask-image:radial-gradient(circle,black,transparent_75%)]" />

      {/* model switcher (top-left) */}
      <div className="absolute left-3 top-3 z-10 flex gap-1 rounded-pill border border-line-200 bg-surface-0/85 p-1 shadow-sm backdrop-blur">
        {models.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => store.setModel(m.id)}
            className={cn(
              "rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors",
              store.model === m.id
                ? "bg-brand-500 text-white"
                : "text-ink-500 hover:text-ink-900"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* zoom + reset (top-right) */}
      <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
        <IconBtn label="Zoom in" onClick={store.zoomIn}>
          <path d="M12 5v14M5 12h14" />
        </IconBtn>
        <IconBtn label="Zoom out" onClick={store.zoomOut}>
          <path d="M5 12h14" />
        </IconBtn>
        <IconBtn label="Reset view" onClick={store.reset}>
          <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
        </IconBtn>
      </div>

      {/* the 3D canvas */}
      <div className="aspect-[4/3] w-full sm:aspect-[16/10]">
        <GarmentScene />
      </div>

      {/* camera modes (bottom) */}
      <div className="absolute inset-x-0 bottom-3 z-10 flex justify-center">
        <div className="flex gap-1 rounded-pill border border-line-200 bg-surface-0/85 p-1 shadow-sm backdrop-blur">
          {views.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => store.setView(v.id)}
              className={cn(
                "rounded-pill px-3 py-1.5 text-xs font-semibold transition-colors",
                store.view === v.id
                  ? "bg-ink-900 text-white"
                  : "text-ink-500 hover:text-ink-900"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* materials + colors (right rail) */}
      <div className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col items-end gap-3">
        <div className="flex flex-col gap-1 rounded-xl border border-line-200 bg-surface-0/85 p-1.5 shadow-sm backdrop-blur">
          {materials.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => store.setMaterial(m.id)}
              title={m.label}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-[0.7rem] font-semibold transition-colors",
                store.material === m.id
                  ? "bg-brand-50 text-brand-700"
                  : "text-ink-400 hover:text-ink-900"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1.5 rounded-pill border border-line-200 bg-surface-0/85 p-1.5 shadow-sm backdrop-blur">
          {garmentColors.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => store.setColor(c.hex)}
              title={c.name}
              aria-label={`Color ${c.name}`}
              className={cn(
                "h-5 w-5 rounded-full ring-2 transition-transform hover:scale-110",
                store.color === c.hex ? "ring-brand-500" : "ring-transparent"
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <span className="pointer-events-none absolute bottom-3 left-3 z-10 hidden rounded-pill bg-ink-900/70 px-2.5 py-1 text-[0.7rem] font-medium text-white sm:block">
        Drag to rotate · scroll / pinch to zoom
      </span>
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-200 bg-surface-0/85 text-ink-700 shadow-sm backdrop-blur transition-colors hover:bg-surface-0 hover:text-brand-600"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

function ViewerSkeleton() {
  return (
    <div className="flex aspect-[4/3] w-full items-center justify-center sm:aspect-[16/10]">
      <div className="relative h-1/2 w-1/3 overflow-hidden rounded-2xl bg-line-200">
        <div className="skeleton-shimmer absolute inset-0" />
      </div>
    </div>
  );
}
