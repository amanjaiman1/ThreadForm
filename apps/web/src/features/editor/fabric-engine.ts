"use client";

import {
  ActiveSelection,
  Canvas,
  Circle,
  FabricImage,
  FabricObject,
  Group,
  Path,
  Rect,
  Shadow,
  Textbox,
  Triangle,
} from "fabric";
import type { LayerItem, SelectionSnapshot } from "./editor-types";

type EngineCallbacks = {
  onChange: () => void;
  onSelection: (snap: SelectionSnapshot | null) => void;
  onLayers: (layers: LayerItem[]) => void;
  onHistory: (canUndo: boolean, canRedo: boolean) => void;
  onDirty: () => void;
};

const PERSIST_PROPS = ["id", "locked", "tfHidden", "selectable", "evented", "name"];

let idc = 0;
const genId = () => `obj_${Date.now().toString(36)}_${idc++}`;

// Loose alias for fabric's dynamic object shapes (custom props, mixed types).
type AnyObj = any;

export class FabricEngine {
  canvas: Canvas;
  private cb: EngineCallbacks;
  private clipboard: FabricObject | null = null;
  private undoStack: string[] = [];
  private redoStack: string[] = [];
  private isRestoring = false;
  private recordTimer: ReturnType<typeof setTimeout> | null = null;
  readonly width = 380;
  readonly height = 480;

  constructor(el: HTMLCanvasElement, cb: EngineCallbacks) {
    this.cb = cb;
    this.canvas = new Canvas(el, {
      width: this.width,
      height: this.height,
      backgroundColor: "transparent",
      preserveObjectStacking: true,
      selection: true,
      controlsAboveOverlay: true,
    });

    this.canvas.on("object:added", () => this.afterChange());
    this.canvas.on("object:removed", () => this.afterChange());
    this.canvas.on("object:modified", () => this.afterChange());
    this.canvas.on("selection:created", () => this.emitSelection());
    this.canvas.on("selection:updated", () => this.emitSelection());
    this.canvas.on("selection:cleared", () => this.emitSelection());

    this.attachSmartGuides();
    this.recordHistory(true);
  }

  dispose() {
    if (this.recordTimer) clearTimeout(this.recordTimer);
    this.canvas.dispose();
  }

  /* ----------------------------- state sync ----------------------------- */

  private afterChange() {
    if (this.isRestoring) return;
    this.emitLayers();
    this.cb.onDirty();
    this.recordHistory();
  }

  private emitLayers() {
    const active = this.canvas.getActiveObjects();
    const layers: LayerItem[] = this.canvas
      .getObjects()
      .map((o) => {
        const obj = o as AnyObj;
        return {
          id: obj.id ?? (obj.id = genId()),
          name: obj.name ?? this.defaultName(o),
          type: o.type,
          locked: !!obj.locked,
          visible: o.visible !== false,
          active: active.includes(o),
        };
      })
      .reverse(); // top layer first in the list
    this.cb.onLayers(layers);
    this.cb.onChange();
  }

  private defaultName(o: FabricObject) {
    const obj = o as AnyObj;
    if (o.type === "textbox" || o.type === "i-text")
      return (obj.text || "Text").slice(0, 18);
    if (o.type === "image") return "Image";
    if (o.type === "group") return "Group";
    return o.type.charAt(0).toUpperCase() + o.type.slice(1);
  }

  private emitSelection() {
    const objs = this.canvas.getActiveObjects();
    if (objs.length === 0) {
      this.cb.onSelection(null);
      this.emitLayers();
      return;
    }
    const o = this.canvas.getActiveObject() as AnyObj;
    const isText = o.type === "textbox" || o.type === "i-text";
    const isImage = o.type === "image";
    const snap: SelectionSnapshot = {
      count: objs.length,
      multiple: objs.length > 1,
      type: o.type,
      isText,
      isImage,
      locked: !!o.locked,
      props: {
        opacity: o.opacity ?? 1,
        fill: typeof o.fill === "string" ? o.fill : "#1A1A1A",
        angle: Math.round(o.angle ?? 0),
        ...(isText
          ? {
              text: o.text,
              fontFamily: o.fontFamily,
              fontWeight: o.fontWeight,
              fontSize: Math.round(o.fontSize),
              textAlign: o.textAlign,
              lineHeight: o.lineHeight,
              charSpacing: o.charSpacing,
              stroke: o.stroke || "",
              strokeWidth: o.strokeWidth || 0,
              shadow: !!o.shadow,
              curve: o.tfCurve ?? 0,
            }
          : {}),
      },
    };
    this.cb.onSelection(snap);
    this.emitLayers();
  }

  /* ------------------------------ history -------------------------------- */

  private snapshot() {
    return JSON.stringify(this.canvas.toObject(PERSIST_PROPS));
  }

  private recordHistory(immediate = false) {
    const doRecord = () => {
      const snap = this.snapshot();
      if (this.undoStack[this.undoStack.length - 1] === snap) return;
      this.undoStack.push(snap);
      if (this.undoStack.length > 60) this.undoStack.shift();
      this.redoStack = [];
      this.cb.onHistory(this.undoStack.length > 1, false);
    };
    if (immediate) return doRecord();
    if (this.recordTimer) clearTimeout(this.recordTimer);
    this.recordTimer = setTimeout(doRecord, 250);
  }

  private async restore(json: string) {
    this.isRestoring = true;
    await this.canvas.loadFromJSON(json);
    // re-apply lock interactivity
    this.canvas.getObjects().forEach((o) => {
      const obj = o as AnyObj;
      if (obj.locked) {
        o.selectable = false;
        o.evented = false;
      }
    });
    this.canvas.requestRenderAll();
    this.isRestoring = false;
    this.emitLayers();
    this.emitSelection();
  }

  async undo() {
    if (this.undoStack.length <= 1) return;
    const current = this.undoStack.pop()!;
    this.redoStack.push(current);
    const prev = this.undoStack[this.undoStack.length - 1];
    await this.restore(prev);
    this.cb.onHistory(this.undoStack.length > 1, this.redoStack.length > 0);
  }

  async redo() {
    if (this.redoStack.length === 0) return;
    const next = this.redoStack.pop()!;
    this.undoStack.push(next);
    await this.restore(next);
    this.cb.onHistory(this.undoStack.length > 1, this.redoStack.length > 0);
  }

  /* ------------------------------- adders -------------------------------- */

  private place(obj: FabricObject, center = true) {
    (obj as AnyObj).id = genId();
    this.canvas.add(obj);
    if (center) this.canvas.centerObject(obj);
    this.canvas.setActiveObject(obj);
    this.canvas.requestRenderAll();
    this.emitSelection();
  }

  addText(value = "Your text") {
    const t = new Textbox(value, {
      width: 240,
      fontFamily: "Anton",
      fontSize: 44,
      fill: "#FFFFFF",
      textAlign: "center",
      editable: true,
    });
    this.place(t);
  }

  addShape(kind: "rect" | "circle" | "triangle" | "line" | "star") {
    let obj: FabricObject;
    const common = { fill: "#A6F000", left: 0, top: 0 };
    switch (kind) {
      case "circle":
        obj = new Circle({ radius: 70, ...common });
        break;
      case "triangle":
        obj = new Triangle({ width: 140, height: 130, ...common });
        break;
      case "line":
        obj = new Rect({ width: 180, height: 10, rx: 5, ry: 5, ...common });
        break;
      case "star":
        obj = new Path(starPath(60, 28, 5), { ...common });
        break;
      default:
        obj = new Rect({ width: 150, height: 120, rx: 8, ry: 8, ...common });
    }
    this.place(obj);
  }

  async addImageFromURL(url: string, name = "Image") {
    const img = await FabricImage.fromURL(url, { crossOrigin: "anonymous" });
    const max = 260;
    const scale = Math.min(max / (img.width || max), max / (img.height || max), 1);
    img.scale(scale);
    (img as AnyObj).name = name;
    this.place(img);
  }

  addImageFromFile(file: File) {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          await this.addImageFromURL(String(reader.result), file.name);
          resolve();
        } catch (e) {
          reject(e);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /** Vector "logo" presets drawn as paths so they stay crisp. */
  addLogo(kind: "badge" | "monogram" | "wave" | "shield") {
    const map: Record<string, string> = {
      badge: "M50 2 61 38 98 38 68 60 80 96 50 74 20 96 32 60 2 38 39 38Z",
      monogram: "M20 80V20h12l18 30 18-30h12v60H68V44L50 72 32 44v36Z",
      wave: "M2 50q24-40 48 0t48 0v30H2Z",
      shield: "M50 2 92 16v34q0 30-42 46Q8 80 8 50V16Z",
    };
    const obj = new Path(map[kind], { fill: "#6C3CE9" });
    obj.scaleToWidth(140);
    this.place(obj);
  }

  /* ---------------------------- selection ops ---------------------------- */

  deleteSelection() {
    const objs = this.canvas.getActiveObjects();
    objs.forEach((o) => this.canvas.remove(o));
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emitSelection();
  }

  async duplicate() {
    const active = this.canvas.getActiveObject();
    if (!active) return;
    const cloned = await active.clone();
    cloned.set({ left: (active.left ?? 0) + 24, top: (active.top ?? 0) + 24 });
    (cloned as AnyObj).id = genId();
    this.canvas.add(cloned);
    this.canvas.setActiveObject(cloned);
    this.canvas.requestRenderAll();
    this.emitSelection();
  }

  async copy() {
    const active = this.canvas.getActiveObject();
    if (!active) return;
    this.clipboard = await active.clone();
  }

  async paste() {
    if (!this.clipboard) return;
    const cloned = await this.clipboard.clone();
    cloned.set({ left: (cloned.left ?? 0) + 24, top: (cloned.top ?? 0) + 24 });
    (cloned as AnyObj).id = genId();
    this.canvas.add(cloned);
    this.canvas.setActiveObject(cloned);
    this.canvas.requestRenderAll();
    this.emitSelection();
  }

  selectAll() {
    const objs = this.canvas.getObjects().filter((o) => o.selectable);
    if (objs.length === 0) return;
    this.canvas.discardActiveObject();
    const sel = new ActiveSelection(objs, { canvas: this.canvas });
    this.canvas.setActiveObject(sel);
    this.canvas.requestRenderAll();
    this.emitSelection();
  }

  /* ------------------------------ layer ops ------------------------------ */

  private byId(id: string) {
    return this.canvas.getObjects().find((o) => (o as AnyObj).id === id) || null;
  }

  selectById(id: string) {
    const o = this.byId(id);
    if (!o || !o.selectable) return;
    this.canvas.setActiveObject(o);
    this.canvas.requestRenderAll();
    this.emitSelection();
  }

  bringForward() {
    const o = this.canvas.getActiveObject();
    if (o) this.canvas.bringObjectForward(o);
    this.canvas.requestRenderAll();
    this.afterChange();
  }
  sendBackwards() {
    const o = this.canvas.getActiveObject();
    if (o) this.canvas.sendObjectBackwards(o);
    this.canvas.requestRenderAll();
    this.afterChange();
  }
  bringToFront() {
    const o = this.canvas.getActiveObject();
    if (o) this.canvas.bringObjectToFront(o);
    this.canvas.requestRenderAll();
    this.afterChange();
  }
  sendToBack() {
    const o = this.canvas.getActiveObject();
    if (o) this.canvas.sendObjectToBack(o);
    this.canvas.requestRenderAll();
    this.afterChange();
  }

  toggleLock(id?: string) {
    const o = id ? this.byId(id) : this.canvas.getActiveObject();
    if (!o) return;
    const obj = o as AnyObj;
    obj.locked = !obj.locked;
    o.selectable = !obj.locked;
    o.evented = !obj.locked;
    if (obj.locked) this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.recordHistory();
  }

  toggleVisibility(id?: string) {
    const o = id ? this.byId(id) : this.canvas.getActiveObject();
    if (!o) return;
    o.visible = o.visible === false;
    this.canvas.requestRenderAll();
    this.emitLayers();
    this.recordHistory();
  }

  group() {
    const active = this.canvas.getActiveObject();
    if (!active || active.type !== "activeselection") return;
    try {
      const sel = active as ActiveSelection;
      const objects = sel.getObjects();
      this.canvas.discardActiveObject();
      objects.forEach((o) => this.canvas.remove(o));
      const group = new Group(objects);
      (group as AnyObj).id = genId();
      this.canvas.add(group);
      this.canvas.setActiveObject(group);
      this.canvas.requestRenderAll();
      this.afterChange();
      this.emitSelection();
    } catch {
      /* grouping unsupported in edge cases — ignore */
    }
  }

  ungroup() {
    const active = this.canvas.getActiveObject();
    if (!active || active.type !== "group") return;
    try {
      const group = active as Group;
      const items = group.removeAll();
      this.canvas.remove(group);
      items.forEach((o) => {
        (o as AnyObj).id = (o as AnyObj).id ?? genId();
        this.canvas.add(o);
      });
      const sel = new ActiveSelection(items, { canvas: this.canvas });
      this.canvas.setActiveObject(sel);
      this.canvas.requestRenderAll();
      this.afterChange();
      this.emitSelection();
    } catch {
      /* ungrouping unsupported in edge cases — ignore */
    }
  }

  /* --------------------------- property setters -------------------------- */

  private active() {
    return this.canvas.getActiveObject() as AnyObj | null;
  }

  setProp(key: string, value: unknown) {
    const o = this.active();
    if (!o) return;
    o.set(key, value);
    o.setCoords?.();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.recordHistory();
  }

  setShadow(enabled: boolean) {
    const o = this.active();
    if (!o) return;
    o.set(
      "shadow",
      enabled
        ? new Shadow({ color: "rgba(0,0,0,0.45)", blur: 8, offsetX: 3, offsetY: 3 })
        : null
    );
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.recordHistory();
  }

  setCurve(amount: number) {
    const o = this.active();
    if (!o || (o.type !== "textbox" && o.type !== "i-text")) return;
    o.tfCurve = amount;
    if (!amount) {
      o.set("path", undefined);
    } else {
      const w = (o.width || 200) * (o.scaleX || 1);
      const bend = (amount / 100) * (w * 0.8);
      const d = `M ${-w / 2} 0 Q 0 ${-bend} ${w / 2} 0`;
      const path = new Path(d, { fill: "", stroke: "" });
      o.set("path", path);
      o.set("pathAlign", "center");
    }
    o.setCoords?.();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.recordHistory();
  }

  rotateActive(delta: number) {
    const o = this.active();
    if (!o) return;
    o.rotate(((o.angle ?? 0) + delta) % 360);
    o.setCoords();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.recordHistory();
  }

  /** Quick centered crop to a target aspect ratio for images. */
  cropToAspect(ratio: number) {
    const o = this.active();
    if (!o || o.type !== "image") return;
    const w = o.width as number;
    const h = o.height as number;
    let cw = w;
    let ch = w / ratio;
    if (ch > h) {
      ch = h;
      cw = h * ratio;
    }
    o.set({
      cropX: (w - cw) / 2,
      cropY: (h - ch) / 2,
      width: cw,
      height: ch,
    });
    o.setCoords();
    this.canvas.requestRenderAll();
    this.emitSelection();
    this.recordHistory();
  }

  /* ----------------------------- alignment ------------------------------- */

  align(kind: "left" | "centerX" | "right" | "top" | "centerY" | "bottom") {
    const o = this.active();
    if (!o) return;
    const b = o.getBoundingRect();
    const c = o.getCenterPoint();
    switch (kind) {
      case "left":
        o.set({ left: (o.left ?? 0) - b.left });
        break;
      case "right":
        o.set({ left: (o.left ?? 0) + (this.width - (b.left + b.width)) });
        break;
      case "centerX":
        o.set({ left: (o.left ?? 0) + (this.width / 2 - c.x) });
        break;
      case "top":
        o.set({ top: (o.top ?? 0) - b.top });
        break;
      case "bottom":
        o.set({ top: (o.top ?? 0) + (this.height - (b.top + b.height)) });
        break;
      case "centerY":
        o.set({ top: (o.top ?? 0) + (this.height / 2 - c.y) });
        break;
    }
    o.setCoords();
    this.canvas.requestRenderAll();
    this.recordHistory();
  }

  /* --------------------------- smart snap guides ------------------------- */

  private attachSmartGuides() {
    const threshold = 6;
    let guides: { x?: number; y?: number } = {};

    this.canvas.on("object:moving", (e) => {
      const o = e.target;
      if (!o) return;
      guides = {};
      const c = o.getCenterPoint();
      const cx = this.width / 2;
      const cy = this.height / 2;
      if (Math.abs(c.x - cx) < threshold) {
        o.set({ left: (o.left ?? 0) + (cx - c.x) });
        guides.x = cx;
      }
      if (Math.abs(c.y - cy) < threshold) {
        o.set({ top: (o.top ?? 0) + (cy - c.y) });
        guides.y = cy;
      }
      o.setCoords();
    });

    this.canvas.on("after:render", () => {
      const ctx = this.canvas.getSelectionContext();
      if (!ctx || (guides.x === undefined && guides.y === undefined)) return;
      ctx.save();
      ctx.strokeStyle = "#A6F000";
      ctx.lineWidth = 1;
      const z = this.canvas.getZoom();
      if (guides.x !== undefined) {
        ctx.beginPath();
        ctx.moveTo(guides.x * z, 0);
        ctx.lineTo(guides.x * z, this.height * z);
        ctx.stroke();
      }
      if (guides.y !== undefined) {
        ctx.beginPath();
        ctx.moveTo(0, guides.y * z);
        ctx.lineTo(this.width * z, guides.y * z);
        ctx.stroke();
      }
      ctx.restore();
    });

    this.canvas.on("mouse:up", () => {
      if (guides.x !== undefined || guides.y !== undefined) {
        guides = {};
        this.canvas.requestRenderAll();
      }
    });
  }

  /* ------------------------------- IO ------------------------------------ */

  exportPNG(multiplier = 3) {
    return this.canvas.toDataURL({ format: "png", multiplier, quality: 1 });
  }

  toJSON() {
    return JSON.stringify(this.canvas.toObject(PERSIST_PROPS));
  }

  async loadJSON(json: string) {
    await this.restore(json);
  }

  clearAll() {
    this.canvas.getObjects().slice().forEach((o) => this.canvas.remove(o));
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
    this.afterChange();
    this.emitSelection();
  }
}

function starPath(outer: number, inner: number, points: number) {
  let d = "";
  const step = Math.PI / points;
  for (let i = 0; i < 2 * points; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = i * step - Math.PI / 2;
    const x = outer + r * Math.cos(a);
    const y = outer + r * Math.sin(a);
    d += `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)} `;
  }
  return d + "Z";
}
