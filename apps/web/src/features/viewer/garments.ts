/* Pure data + types for the garment viewer. NO three.js import here so the
 * control UI can use it without pulling the 3D engine into the page bundle. */

export type ModelId = "crew" | "oversized" | "hoodie";
export type MaterialId = "cotton" | "premium" | "fleece";
export type ViewId = "front" | "back" | "left" | "right" | "iso";

export const models: { id: ModelId; label: string }[] = [
  { id: "crew", label: "Crew Neck" },
  { id: "oversized", label: "Oversized" },
  { id: "hoodie", label: "Hoodie" },
];

export const materials: {
  id: MaterialId;
  label: string;
  roughness: number;
  metalness: number;
  sheen: number;
}[] = [
  { id: "cotton", label: "Cotton", roughness: 0.92, metalness: 0.0, sheen: 0 },
  { id: "premium", label: "Premium Cotton", roughness: 0.58, metalness: 0.06, sheen: 0.4 },
  { id: "fleece", label: "Hoodie Fleece", roughness: 0.98, metalness: 0.0, sheen: 0 },
];

/** Camera presets per view: [position]; target is always origin. */
export const views: { id: ViewId; label: string; position: [number, number, number] }[] = [
  { id: "front", label: "Front", position: [0, 0, 6.4] },
  { id: "back", label: "Back", position: [0, 0, -6.4] },
  { id: "left", label: "Left", position: [-6.4, 0, 0.001] },
  { id: "right", label: "Right", position: [6.4, 0, 0.001] },
  { id: "iso", label: "Isometric", position: [4.4, 2.6, 4.8] },
];

export const garmentColors: { name: string; hex: string }[] = [
  { name: "Black", hex: "#1A1A1A" },
  { name: "Violet", hex: "#6C3CE9" },
  { name: "Forest", hex: "#0B3D2E" },
  { name: "Navy", hex: "#14213D" },
  { name: "Sand", hex: "#D9C9A8" },
  { name: "White", hex: "#F2F2F4" },
];

/** Silhouette definitions consumed by the (three.js) geometry builder. */
export const SILHOUETTES: Record<
  ModelId,
  { pts: [number, number][]; depth: number; neckY: number }
> = {
  crew: {
    depth: 0.36,
    neckY: 1.18,
    pts: [
      [-0.45, 1.45], [-1.0, 1.42], [-1.7, 0.92], [-1.42, 0.46], [-0.82, 0.78],
      [-0.9, -1.55], [0.9, -1.55], [0.82, 0.78], [1.42, 0.46], [1.7, 0.92],
      [1.0, 1.42], [0.45, 1.45],
    ],
  },
  oversized: {
    depth: 0.42,
    neckY: 1.22,
    pts: [
      [-0.55, 1.5], [-1.25, 1.46], [-1.88, 1.08], [-1.6, 0.5], [-1.05, 0.72],
      [-1.14, -1.98], [1.14, -1.98], [1.05, 0.72], [1.6, 0.5], [1.88, 1.08],
      [1.25, 1.46], [0.55, 1.5],
    ],
  },
  hoodie: {
    depth: 0.46,
    neckY: 1.1,
    pts: [
      [-0.5, 1.34], [-1.05, 1.4], [-1.74, 0.9], [-1.46, 0.42], [-0.86, 0.74],
      [-0.95, -1.62], [0.95, -1.62], [0.86, 0.74], [1.46, 0.42], [1.74, 0.9],
      [1.05, 1.4], [0.5, 1.34],
    ],
  },
};
