"use client";

import { create } from "zustand";
import type { ModelId, MaterialId, ViewId } from "./garments";

type ViewerState = {
  model: ModelId;
  material: MaterialId;
  color: string;
  view: ViewId;
  /** bumped to trigger imperative camera actions inside the Canvas */
  resetNonce: number;
  zoomNonce: number;
  zoomDir: "in" | "out";
  loading: boolean;

  setModel: (m: ModelId) => void;
  setMaterial: (m: MaterialId) => void;
  setColor: (c: string) => void;
  setView: (v: ViewId) => void;
  reset: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setLoading: (b: boolean) => void;
};

export const useViewerStore = create<ViewerState>((set) => ({
  model: "crew",
  material: "cotton",
  color: "#6C3CE9",
  view: "front",
  resetNonce: 0,
  zoomNonce: 0,
  zoomDir: "in",
  loading: true,

  setModel: (model) =>
    set((s) => ({
      model,
      // hoodie defaults to fleece, others to cotton when switching
      material: model === "hoodie" ? "fleece" : s.material === "fleece" ? "cotton" : s.material,
    })),
  setMaterial: (material) => set({ material }),
  setColor: (color) => set({ color }),
  setView: (view) => set({ view }),
  reset: () => set((s) => ({ view: "front", resetNonce: s.resetNonce + 1 })),
  zoomIn: () => set((s) => ({ zoomNonce: s.zoomNonce + 1, zoomDir: "in" })),
  zoomOut: () => set((s) => ({ zoomNonce: s.zoomNonce + 1, zoomDir: "out" })),
  setLoading: (loading) => set({ loading }),
}));
