export type PanelId =
  | "templates"
  | "text"
  | "images"
  | "logos"
  | "shapes"
  | "layers";

export type ProductId = "crew" | "oversized" | "hoodie";
export type PrintAreaId = "front" | "back";

export type LayerItem = {
  id: string;
  name: string;
  type: string;
  locked: boolean;
  visible: boolean;
  active: boolean;
};

/** Snapshot of the current selection for the reactive Properties panel. */
export type SelectionSnapshot = {
  count: number;
  multiple: boolean;
  type: string; // 'i-text' | 'image' | 'rect' | 'group' | ...
  isText: boolean;
  isImage: boolean;
  locked: boolean;
  props: {
    opacity: number;
    fill: string;
    // text-specific
    text?: string;
    fontFamily?: string;
    fontWeight?: string | number;
    fontSize?: number;
    textAlign?: string;
    lineHeight?: number;
    charSpacing?: number;
    stroke?: string;
    strokeWidth?: number;
    shadow?: boolean;
    curve?: number;
    // image-specific
    angle?: number;
  };
};

export const DESIGN_FONTS = [
  "Inter",
  "Anton",
  "Bebas Neue",
  "Oswald",
  "Poppins",
  "Playfair Display",
  "Archivo Black",
  "Pacifico",
] as const;

export const FONT_WEIGHTS = [
  { label: "Light", value: 300 },
  { label: "Regular", value: 400 },
  { label: "Medium", value: 500 },
  { label: "Bold", value: 700 },
  { label: "Black", value: 900 },
];

export const PRODUCTS: { id: ProductId; label: string }[] = [
  { id: "crew", label: "Crew Tee" },
  { id: "oversized", label: "Oversized" },
  { id: "hoodie", label: "Hoodie" },
];

export const GARMENT_COLORS = [
  "#1A1A1A",
  "#F2F2F4",
  "#6C3CE9",
  "#0B3D2E",
  "#14213D",
  "#D9C9A8",
  "#E5484D",
];
