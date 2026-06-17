"use client";

import { useEffect } from "react";
import { useEditorStore } from "./editor-store";

/** Global keyboard shortcuts for the editor. */
export function useEditorShortcuts() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const engine = useEditorStore.getState().engine;
      if (!engine) return;

      // ignore while typing in inputs or editing text on canvas
      const el = document.activeElement;
      const typing =
        el &&
        (el.tagName === "INPUT" ||
          el.tagName === "TEXTAREA" ||
          (el as HTMLElement).isContentEditable);
      const editingText = (engine.canvas.getActiveObject() as { isEditing?: boolean } | null)
        ?.isEditing;
      if (typing || editingText) return;

      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();

      if (mod && key === "z" && !e.shiftKey) {
        e.preventDefault();
        engine.undo();
      } else if (mod && (key === "y" || (key === "z" && e.shiftKey))) {
        e.preventDefault();
        engine.redo();
      } else if (mod && key === "c") {
        engine.copy();
      } else if (mod && key === "v") {
        e.preventDefault();
        engine.paste();
      } else if (mod && key === "d") {
        e.preventDefault();
        engine.duplicate();
      } else if (mod && key === "a") {
        e.preventDefault();
        engine.selectAll();
      } else if (key === "delete" || key === "backspace") {
        e.preventDefault();
        engine.deleteSelection();
      } else if (key.startsWith("arrow")) {
        const o = engine.canvas.getActiveObject();
        if (!o) return;
        e.preventDefault();
        const d = e.shiftKey ? 10 : 1;
        if (key === "arrowup") o.set({ top: (o.top ?? 0) - d });
        if (key === "arrowdown") o.set({ top: (o.top ?? 0) + d });
        if (key === "arrowleft") o.set({ left: (o.left ?? 0) - d });
        if (key === "arrowright") o.set({ left: (o.left ?? 0) + d });
        o.setCoords();
        engine.canvas.requestRenderAll();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
