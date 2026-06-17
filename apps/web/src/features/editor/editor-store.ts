"use client";

import { create } from "zustand";
import type { FabricEngine } from "./fabric-engine";
import type {
  LayerItem,
  PanelId,
  PrintAreaId,
  ProductId,
  SelectionSnapshot,
} from "./editor-types";

type EditorStore = {
  engine: FabricEngine | null;
  ready: boolean;

  activePanel: PanelId;
  product: ProductId;
  printArea: PrintAreaId;
  garmentColor: string;

  zoom: number;
  canUndo: boolean;
  canRedo: boolean;

  selection: SelectionSnapshot | null;
  layers: LayerItem[];

  mobilePanelOpen: boolean;
  saved: boolean;

  // setters
  setEngine: (e: FabricEngine | null) => void;
  setReady: (b: boolean) => void;
  setActivePanel: (p: PanelId) => void;
  setProduct: (p: ProductId) => void;
  setPrintArea: (a: PrintAreaId) => void;
  setGarmentColor: (c: string) => void;
  setZoom: (z: number) => void;
  setHistory: (canUndo: boolean, canRedo: boolean) => void;
  setSelection: (s: SelectionSnapshot | null) => void;
  setLayers: (l: LayerItem[]) => void;
  setMobilePanelOpen: (b: boolean) => void;
  setSaved: (b: boolean) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  engine: null,
  ready: false,

  activePanel: "templates",
  product: "crew",
  printArea: "front",
  garmentColor: "#1A1A1A",

  zoom: 1,
  canUndo: false,
  canRedo: false,

  selection: null,
  layers: [],

  mobilePanelOpen: false,
  saved: true,

  setEngine: (engine) => set({ engine }),
  setReady: (ready) => set({ ready }),
  setActivePanel: (activePanel) => set({ activePanel, mobilePanelOpen: true }),
  setProduct: (product) => set({ product }),
  setPrintArea: (printArea) => set({ printArea }),
  setGarmentColor: (garmentColor) => set({ garmentColor }),
  setZoom: (zoom) => set({ zoom }),
  setHistory: (canUndo, canRedo) => set({ canUndo, canRedo }),
  setSelection: (selection) => set({ selection }),
  setLayers: (layers) => set({ layers }),
  setMobilePanelOpen: (mobilePanelOpen) => set({ mobilePanelOpen }),
  setSaved: (saved) => set({ saved }),
}));
