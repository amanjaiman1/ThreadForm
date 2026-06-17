"use client";

import { useEditorStore } from "./editor-store";
import { Field, Slider, ColorSwatches, SegmentedControl, MiniButton, PanelHeading } from "./ui";
import {
  DESIGN_FONTS,
  FONT_WEIGHTS,
  GARMENT_COLORS,
  PRODUCTS,
  type PrintAreaId,
  type ProductId,
} from "./editor-types";

export function PropertiesPanel() {
  const selection = useEditorStore((s) => s.selection);
  if (!selection) return <GarmentProperties />;
  return <ObjectProperties />;
}

/* ---------------------------- Garment (no sel) --------------------------- */

function GarmentProperties() {
  const product = useEditorStore((s) => s.product);
  const setProduct = useEditorStore((s) => s.setProduct);
  const printArea = useEditorStore((s) => s.printArea);
  const setPrintArea = useEditorStore((s) => s.setPrintArea);
  const garmentColor = useEditorStore((s) => s.garmentColor);
  const setGarmentColor = useEditorStore((s) => s.setGarmentColor);

  return (
    <div className="flex flex-col gap-5">
      <PanelHeading title="Garment" hint="Select an element to edit it." />
      <Field label="Product">
        <SegmentedControl<ProductId>
          options={PRODUCTS.map((p) => ({ value: p.id, label: p.label }))}
          value={product}
          onChange={setProduct}
        />
      </Field>
      <Field label="Print side">
        <SegmentedControl<PrintAreaId>
          options={[
            { value: "front", label: "Front" },
            { value: "back", label: "Back" },
          ]}
          value={printArea}
          onChange={setPrintArea}
        />
      </Field>
      <Field label="Garment color">
        <ColorSwatches
          value={garmentColor}
          colors={GARMENT_COLORS}
          onChange={setGarmentColor}
        />
      </Field>
    </div>
  );
}

/* ------------------------------ Selection -------------------------------- */

function ObjectProperties() {
  const engine = useEditorStore((s) => s.engine);
  const sel = useEditorStore((s) => s.selection)!;
  const p = sel.props;

  if (!engine) return null;

  return (
    <div className="flex flex-col gap-5">
      <PanelHeading
        title={
          sel.multiple
            ? `${sel.count} items`
            : sel.isText
            ? "Text"
            : sel.isImage
            ? "Image"
            : "Shape"
        }
      />

      {/* arrange + actions */}
      <div className="grid grid-cols-4 gap-1.5">
        <MiniButton title="Bring forward" onClick={() => engine.bringForward()}>↑</MiniButton>
        <MiniButton title="Send backward" onClick={() => engine.sendBackwards()}>↓</MiniButton>
        <MiniButton title="Duplicate" onClick={() => engine.duplicate()}>⧉</MiniButton>
        <MiniButton title="Delete" onClick={() => engine.deleteSelection()}>🗑</MiniButton>
      </div>

      {/* alignment */}
      <Field label="Align">
        <div className="grid grid-cols-6 gap-1">
          {(
            [
              ["left", "M4 4v16M8 8h10v3H8zM8 14h7v3H8z"],
              ["centerX", "M12 4v16M7 8h10v3H7zM8.5 14h7v3h-7z"],
              ["right", "M20 4v16M6 8h10v3H6zM9 14h7v3H9z"],
              ["top", "M4 4h16M8 8v10h3V8zM14 8v7h3V8z"],
              ["centerY", "M4 12h16M8 7v10h3V7zM14 8.5v7h3v-7z"],
              ["bottom", "M4 20h16M8 6v10h3V6zM14 9v7h3V9z"],
            ] as const
          ).map(([k, d]) => (
            <button
              key={k}
              type="button"
              title={`Align ${k}`}
              onClick={() => engine.align(k)}
              className="inline-flex h-8 items-center justify-center rounded-md border border-line-200 text-ink-600 hover:border-brand-300 hover:text-ink-900"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d={d} />
              </svg>
            </button>
          ))}
        </div>
      </Field>

      {/* opacity */}
      <Field label={`Opacity · ${Math.round(p.opacity * 100)}%`}>
        <Slider
          value={p.opacity}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => engine.setProp("opacity", v)}
        />
      </Field>

      {/* fill / color */}
      {!sel.isImage && (
        <Field label="Color">
          <ColorSwatches
            value={p.fill}
            colors={["#FFFFFF", "#1A1A1A", "#6C3CE9", "#A6F000", "#E5484D", "#2F77F0"]}
            onChange={(c) => engine.setProp("fill", c)}
          />
        </Field>
      )}

      {sel.isText && <TextControls />}
      {sel.isImage && <ImageControls />}
    </div>
  );
}

function TextControls() {
  const engine = useEditorStore((s) => s.engine)!;
  const p = useEditorStore((s) => s.selection)!.props;

  return (
    <>
      <Field label="Font">
        <select
          value={p.fontFamily}
          onChange={(e) => engine.setProp("fontFamily", e.target.value)}
          className="h-9 rounded-md border border-line-200 bg-surface-0 px-2 text-sm"
        >
          {DESIGN_FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Weight">
          <select
            value={String(p.fontWeight)}
            onChange={(e) => engine.setProp("fontWeight", Number(e.target.value))}
            className="h-9 rounded-md border border-line-200 bg-surface-0 px-2 text-sm"
          >
            {FONT_WEIGHTS.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label={`Size · ${p.fontSize}`}>
          <Slider
            value={p.fontSize ?? 32}
            min={8}
            max={160}
            onChange={(v) => engine.setProp("fontSize", Math.round(v))}
          />
        </Field>
      </div>

      <Field label="Alignment">
        <SegmentedControl
          options={[
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" },
          ]}
          value={(p.textAlign as string) ?? "center"}
          onChange={(v) => engine.setProp("textAlign", v)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Letter spacing">
          <Slider
            value={p.charSpacing ?? 0}
            min={-100}
            max={800}
            step={10}
            onChange={(v) => engine.setProp("charSpacing", v)}
          />
        </Field>
        <Field label="Line height">
          <Slider
            value={p.lineHeight ?? 1.16}
            min={0.7}
            max={2.4}
            step={0.02}
            onChange={(v) => engine.setProp("lineHeight", v)}
          />
        </Field>
      </div>

      <Field label={`Curve · ${p.curve ?? 0}`}>
        <Slider
          value={p.curve ?? 0}
          min={0}
          max={100}
          onChange={(v) => engine.setCurve(v)}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Stroke">
          <ColorSwatches
            value={p.stroke || "#000000"}
            colors={["#000000", "#FFFFFF", "#6C3CE9", "#A6F000"]}
            onChange={(c) => engine.setProp("stroke", c)}
          />
        </Field>
        <Field label={`Stroke width · ${p.strokeWidth ?? 0}`}>
          <Slider
            value={p.strokeWidth ?? 0}
            min={0}
            max={12}
            step={0.5}
            onChange={(v) => engine.setProp("strokeWidth", v)}
          />
        </Field>
      </div>

      <label className="flex items-center justify-between rounded-md border border-line-200 px-3 py-2.5">
        <span className="text-sm font-medium text-ink-800">Drop shadow</span>
        <input
          type="checkbox"
          checked={!!p.shadow}
          onChange={(e) => engine.setShadow(e.target.checked)}
          className="h-4 w-4 accent-brand-500"
        />
      </label>
    </>
  );
}

function ImageControls() {
  const engine = useEditorStore((s) => s.engine)!;
  return (
    <>
      <Field label="Rotate">
        <div className="grid grid-cols-2 gap-2">
          <MiniButton onClick={() => engine.rotateActive(-90)}>⟲ 90° left</MiniButton>
          <MiniButton onClick={() => engine.rotateActive(90)}>⟳ 90° right</MiniButton>
        </div>
      </Field>
      <Field label="Crop">
        <div className="grid grid-cols-4 gap-1.5">
          <MiniButton title="Square" onClick={() => engine.cropToAspect(1)}>1:1</MiniButton>
          <MiniButton title="Portrait" onClick={() => engine.cropToAspect(3 / 4)}>3:4</MiniButton>
          <MiniButton title="Landscape" onClick={() => engine.cropToAspect(4 / 3)}>4:3</MiniButton>
          <MiniButton title="Wide" onClick={() => engine.cropToAspect(16 / 9)}>16:9</MiniButton>
        </div>
      </Field>
      <p className="text-xs text-ink-400">
        Drag the handles on canvas to resize. Background removal &amp; AI enhance
        are coming soon.
      </p>
    </>
  );
}
