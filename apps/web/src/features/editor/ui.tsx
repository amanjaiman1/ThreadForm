"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PanelHeading({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="mb-3">
      <h2 className="text-sm font-bold text-ink-900">{title}</h2>
      {hint ? <p className="mt-0.5 text-xs text-ink-400">{hint}</p> : null}
    </div>
  );
}

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
        {label}
      </span>
      {children}
    </label>
  );
}

export function MiniButton({
  children,
  onClick,
  active,
  disabled,
  title,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-1.5 rounded-md border border-line-200 bg-surface-0 px-2.5 text-xs font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-ink-900 disabled:opacity-40 disabled:hover:border-line-200",
        active && "border-brand-500 bg-brand-50 text-brand-700",
        className
      )}
    >
      {children}
    </button>
  );
}

export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="h-1.5 w-full cursor-pointer appearance-none rounded-pill bg-line-200 accent-brand-500"
    />
  );
}

export function ColorSwatches({
  value,
  colors,
  onChange,
  allowCustom = true,
}: {
  value: string;
  colors: string[];
  onChange: (c: string) => void;
  allowCustom?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {colors.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={`Color ${c}`}
          onClick={() => onChange(c)}
          className={cn(
            "h-6 w-6 rounded-full ring-2 ring-offset-1 transition-transform hover:scale-110",
            value.toLowerCase() === c.toLowerCase() ? "ring-brand-500" : "ring-transparent"
          )}
          style={{ backgroundColor: c }}
        />
      ))}
      {allowCustom && (
        <label className="relative inline-flex h-6 w-6 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-line-200">
          <span
            className="absolute inset-0"
            style={{
              background:
                "conic-gradient(from 0deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
            }}
          />
          <input
            type="color"
            value={value.startsWith("#") ? value : "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </label>
      )}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-md border border-line-200 bg-surface-50 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 rounded-[6px] px-2 py-1.5 text-xs font-semibold transition-colors",
            value === o.value
              ? "bg-surface-0 text-ink-900 shadow-xs"
              : "text-ink-400 hover:text-ink-700"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
