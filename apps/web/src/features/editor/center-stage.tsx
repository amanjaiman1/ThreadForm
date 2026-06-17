"use client";

import { useEffect, useRef, useState } from "react";
import { FabricEngine } from "./fabric-engine";
import { useEditorStore } from "./editor-store";
import { GarmentMockup } from "./garment-mockup";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function CenterStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const product = useEditorStore((s) => s.product);
  const area = useEditorStore((s) => s.printArea);
  const garmentColor = useEditorStore((s) => s.garmentColor);
  const zoom = useEditorStore((s) => s.zoom);
  const [dragOver, setDragOver] = useState(false);

  // init the fabric engine once
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const store = useEditorStore.getState;

    const engine = new FabricEngine(el, {
      onChange: () => {},
      onSelection: (s) => store().setSelection(s),
      onLayers: (l) => store().setLayers(l),
      onHistory: (u, r) => store().setHistory(u, r),
      onDirty: () => store().setSaved(false),
    });

    store().setEngine(engine);
    store().setReady(true);
    track("design_start", { surface: "studio" });

    // restore autosave if present
    try {
      const saved = localStorage.getItem("tf_design");
      if (saved) engine.loadJSON(saved);
    } catch {
      /* ignore */
    }

    return () => {
      engine.dispose();
      store().setEngine(null);
      store().setReady(false);
    };
  }, []);

  // swap design content when switching print side (front/back keep separate art)
  const areaCache = useRef<Record<string, string>>({});
  const prevArea = useRef(area);
  useEffect(() => {
    const engine = useEditorStore.getState().engine;
    if (!engine || prevArea.current === area) return;
    areaCache.current[prevArea.current] = engine.toJSON();
    const next = areaCache.current[area];
    if (next) engine.loadJSON(next);
    else engine.clearAll();
    prevArea.current = area;
  }, [area]);

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const engine = useEditorStore.getState().engine;
    if (!engine) return;
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      await engine.addImageFromFile(file);
      track("add_image", { via: "drop" });
    }
  };

  return (
    <div
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-surface-100 bg-dotgrid p-4"
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
    >
      <div
        className="relative transition-transform duration-200 ease-standard"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* garment behind */}
        <div className="pointer-events-none absolute inset-0">
          <GarmentMockup product={product} area={area} color={garmentColor} />
        </div>

        {/* print-area frame + fabric canvas */}
        <div
          className={cn(
            "relative rounded-lg outline-dashed outline-2 outline-offset-4",
            dragOver ? "outline-volt-500" : "outline-brand-300/60"
          )}
        >
          <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-brand-500 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-white">
            {area} · print area
          </span>
          <canvas ref={canvasRef} />
        </div>
      </div>

      {dragOver && (
        <div className="pointer-events-none absolute inset-4 flex items-center justify-center rounded-xl border-2 border-dashed border-volt-500 bg-volt-500/10 text-sm font-semibold text-brand-700">
          Drop image to add it to your design
        </div>
      )}
    </div>
  );
}
