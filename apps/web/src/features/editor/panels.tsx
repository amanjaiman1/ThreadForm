"use client";

import { useRef } from "react";
import { useEditorStore } from "./editor-store";
import { PanelHeading, MiniButton } from "./ui";
import { DESIGN_FONTS } from "./editor-types";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function ActivePanel() {
  const panel = useEditorStore((s) => s.activePanel);
  switch (panel) {
    case "templates":
      return <TemplatesPanel />;
    case "text":
      return <TextPanel />;
    case "images":
      return <ImagesPanel />;
    case "logos":
      return <LogosPanel />;
    case "shapes":
      return <ShapesPanel />;
    case "layers":
      return <LayersPanel />;
  }
}

function useEngine() {
  return useEditorStore((s) => s.engine);
}

/* ------------------------------ Templates -------------------------------- */

const templates = [
  { id: "fest", label: "Fest Crew", color: "#1A1A1A" },
  { id: "club", label: "Club Monogram", color: "#2A1170" },
  { id: "team", label: "Team Jersey", color: "#0B3D2E" },
  { id: "startup", label: "Launch Tee", color: "#0E0E12" },
];

function TemplatesPanel() {
  const engine = useEngine();
  const setColor = useEditorStore((s) => s.setGarmentColor);

  const apply = (id: string, color: string) => {
    if (!engine) return;
    engine.clearAll();
    setColor(color);
    if (id === "fest") {
      engine.addText("SPRING FEST");
      engine.setProp("fontSize", 40);
      engine.addText("'26");
    } else if (id === "club") {
      engine.addShape("circle");
      engine.addText("RC");
    } else if (id === "team") {
      engine.addText("TITANS");
      engine.addText("10");
      engine.setProp("fontSize", 120);
    } else {
      engine.addText("MAKE IT YOURS");
    }
    track("template_open", { template: id });
  };

  return (
    <div>
      <PanelHeading title="Templates" hint="Start from a head-start, then customize." />
      <div className="grid grid-cols-2 gap-2.5">
        {templates.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => apply(t.id, t.color)}
            className="group flex aspect-[4/5] flex-col items-center justify-center rounded-lg border border-line-200 text-center transition-transform hover:-translate-y-0.5 hover:shadow-md"
            style={{ backgroundColor: t.color }}
          >
            <span className="font-display text-sm font-bold text-white">
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Text ----------------------------------- */

const textPresets = [
  { label: "Heading", size: 56, weight: 900, font: "Anton" },
  { label: "Subheading", size: 34, weight: 700, font: "Oswald" },
  { label: "Body", size: 22, weight: 400, font: "Inter" },
];

function TextPanel() {
  const engine = useEngine();

  const add = (preset?: (typeof textPresets)[number]) => {
    if (!engine) return;
    engine.addText(preset ? preset.label : "Your text");
    if (preset) {
      engine.setProp("fontFamily", preset.font);
      engine.setProp("fontSize", preset.size);
      engine.setProp("fontWeight", preset.weight);
    }
    track("add_text", {});
  };

  return (
    <div>
      <PanelHeading title="Text" hint="Click to add, then edit on the canvas." />
      <MiniButton onClick={() => add()} className="mb-3 w-full">
        + Add a text box
      </MiniButton>
      <div className="flex flex-col gap-2">
        {textPresets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => add(p)}
            className="rounded-lg border border-line-200 bg-surface-0 px-4 py-3 text-left transition-colors hover:border-brand-300"
            style={{ fontFamily: p.font }}
          >
            <span
              className="text-ink-900"
              style={{ fontSize: Math.min(p.size / 2, 22), fontWeight: p.weight }}
            >
              {p.label}
            </span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">
        Fonts
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {DESIGN_FONTS.map((f) => (
          <span
            key={f}
            className="rounded-md border border-line-200 px-2 py-1 text-xs text-ink-500"
            style={{ fontFamily: f }}
          >
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Images ---------------------------------- */

function ImagesPanel() {
  const engine = useEngine();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && engine) {
      await engine.addImageFromFile(file);
      track("add_image", { via: "upload" });
    }
    e.target.value = "";
  };

  return (
    <div>
      <PanelHeading title="Images" hint="Upload your art, photos or logos." />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line-200 bg-surface-50 px-4 py-8 text-center transition-colors hover:border-brand-300"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C3CE9" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 16V4m0 0L8 8m4-4 4 4" />
          <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
        </svg>
        <span className="text-sm font-semibold text-ink-900">Upload image</span>
        <span className="text-xs text-ink-400">PNG, JPG, SVG · or drag onto canvas</span>
      </button>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-ink-400">
        Coming soon
      </p>
      <div className="mt-2 flex flex-col gap-2">
        {["Background removal", "AI image enhance"].map((f) => (
          <div
            key={f}
            className="flex items-center justify-between rounded-lg border border-line-200 bg-surface-50 px-3 py-2.5 text-sm text-ink-400"
          >
            {f}
            <span className="rounded-pill bg-brand-50 px-2 py-0.5 text-[0.65rem] font-bold text-brand-600">
              SOON
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Logos ---------------------------------- */

const logos: { id: "badge" | "monogram" | "wave" | "shield"; d: string }[] = [
  { id: "badge", d: "M50 5 61 38 96 38 68 60 79 94 50 74 21 94 32 60 4 38 39 38Z" },
  { id: "monogram", d: "M20 80V20h12l18 30 18-30h12v60H68V44L50 72 32 44v36Z" },
  { id: "wave", d: "M5 50q24-40 45 0t45 0v40H5Z" },
  { id: "shield", d: "M50 5 90 18v32q0 28-40 44Q10 78 10 50V18Z" },
];

function LogosPanel() {
  const engine = useEngine();
  return (
    <div>
      <PanelHeading title="Logos & marks" hint="Drop in a vector mark, then recolor." />
      <div className="grid grid-cols-2 gap-2.5">
        {logos.map((l) => (
          <button
            key={l.id}
            type="button"
            onClick={() => engine?.addLogo(l.id)}
            className="flex aspect-square items-center justify-center rounded-lg border border-line-200 bg-surface-0 transition-colors hover:border-brand-300"
          >
            <svg width="48" height="48" viewBox="0 0 100 100" fill="#6C3CE9">
              <path d={l.d} />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Shapes --------------------------------- */

const shapes: { id: "rect" | "circle" | "triangle" | "line" | "star"; node: React.ReactNode }[] = [
  { id: "rect", node: <rect x="15" y="22" width="70" height="56" rx="8" /> },
  { id: "circle", node: <circle cx="50" cy="50" r="34" /> },
  { id: "triangle", node: <path d="M50 16 86 84 14 84Z" /> },
  { id: "line", node: <rect x="12" y="44" width="76" height="12" rx="6" /> },
  { id: "star", node: <path d="M50 12 61 40 92 40 67 60 76 90 50 72 24 90 33 60 8 40 39 40Z" /> },
];

function ShapesPanel() {
  const engine = useEngine();
  return (
    <div>
      <PanelHeading title="Shapes" hint="Build badges, banners and accents." />
      <div className="grid grid-cols-3 gap-2.5">
        {shapes.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              engine?.addShape(s.id);
              track("add_shape", { shape: s.id });
            }}
            className="flex aspect-square items-center justify-center rounded-lg border border-line-200 bg-surface-0 transition-colors hover:border-brand-300"
          >
            <svg width="40" height="40" viewBox="0 0 100 100" fill="#5B5B66">
              {s.node}
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- Layers --------------------------------- */

function LayersPanel() {
  const engine = useEngine();
  const layers = useEditorStore((s) => s.layers);
  const selection = useEditorStore((s) => s.selection);

  return (
    <div>
      <PanelHeading title="Layers" hint="Reorder, lock, hide and group." />
      <div className="mb-2 flex gap-2">
        <MiniButton
          onClick={() => engine?.group()}
          disabled={!selection?.multiple}
          className="flex-1"
        >
          Group
        </MiniButton>
        <MiniButton
          onClick={() => engine?.ungroup()}
          disabled={selection?.type !== "group"}
          className="flex-1"
        >
          Ungroup
        </MiniButton>
      </div>

      {layers.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-200 px-3 py-6 text-center text-xs text-ink-400">
          Nothing here yet. Add text, images or shapes.
        </p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {layers.map((l) => (
            <li
              key={l.id}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-2 py-1.5",
                l.active
                  ? "border-brand-500 bg-brand-50"
                  : "border-line-200 bg-surface-0"
              )}
            >
              <button
                type="button"
                onClick={() => engine?.selectById(l.id)}
                className="flex flex-1 items-center gap-2 overflow-hidden text-left"
              >
                <LayerTypeIcon type={l.type} />
                <span
                  className={cn(
                    "truncate text-xs font-medium",
                    l.visible ? "text-ink-800" : "text-ink-400 line-through"
                  )}
                >
                  {l.name}
                </span>
              </button>
              <IconAction title="Up" onClick={() => { engine?.selectById(l.id); engine?.bringForward(); }}>
                <path d="m6 15 6-6 6 6" />
              </IconAction>
              <IconAction title="Down" onClick={() => { engine?.selectById(l.id); engine?.sendBackwards(); }}>
                <path d="m6 9 6 6 6-6" />
              </IconAction>
              <IconAction
                title={l.visible ? "Hide" : "Show"}
                onClick={() => engine?.toggleVisibility(l.id)}
              >
                {l.visible ? (
                  <>
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="2.5" />
                  </>
                ) : (
                  <path d="M3 3l18 18M10.6 10.6A2.5 2.5 0 0 0 12 14.5M6.5 6.7C3.9 8.3 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1M9.5 5.2A9 9 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3" />
                )}
              </IconAction>
              <IconAction
                title={l.locked ? "Unlock" : "Lock"}
                onClick={() => engine?.toggleLock(l.id)}
                active={l.locked}
              >
                {l.locked ? (
                  <>
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                  </>
                ) : (
                  <>
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V8a4 4 0 0 1 7.5-2" />
                  </>
                )}
              </IconAction>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconAction({
  children,
  title,
  onClick,
  active,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-surface-100 hover:text-ink-900",
        active && "text-brand-600"
      )}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

function LayerTypeIcon({ type }: { type: string }) {
  const isText = type.includes("text");
  const isImage = type === "image";
  return (
    <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-100 text-ink-500">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {isText ? (
          <path d="M4 7V5h16v2M9 5v14M9 19h6" />
        ) : isImage ? (
          <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="m21 15-5-5L5 20" />
          </>
        ) : (
          <rect x="5" y="5" width="14" height="14" rx="3" />
        )}
      </svg>
    </span>
  );
}
