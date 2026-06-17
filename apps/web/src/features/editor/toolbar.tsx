"use client";

import Link from "next/link";
import { useEditorStore } from "./editor-store";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";

export function TopToolbar() {
  const engine = useEditorStore((s) => s.engine);
  const canUndo = useEditorStore((s) => s.canUndo);
  const canRedo = useEditorStore((s) => s.canRedo);
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);
  const saved = useEditorStore((s) => s.saved);
  const setSaved = useEditorStore((s) => s.setSaved);

  const changeZoom = (dir: 1 | -1) =>
    setZoom(Math.min(2, Math.max(0.4, +(zoom + dir * 0.1).toFixed(2))));

  const onSave = () => {
    if (!engine) return;
    try {
      localStorage.setItem("tf_design", engine.toJSON());
    } catch {
      /* storage may be unavailable */
    }
    setSaved(true);
    track("design_save", {});
  };

  const onExport = () => {
    if (!engine) return;
    const url = engine.exportPNG(3);
    const a = document.createElement("a");
    a.href = url;
    a.download = "threadform-design.png";
    a.click();
    track("design_export", { format: "png" });
  };

  const onShare = () => {
    // analytics 'design_share' is emitted by the delegated [data-share] handler
    onSave();
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line-200 bg-surface-0 px-3">
      <div className="flex items-center gap-3">
        <Logo withWordmark={false} />
        <span className="hidden text-sm font-semibold text-ink-700 sm:block">
          Untitled design
        </span>
        <span
          className={cn(
            "hidden rounded-pill px-2 py-0.5 text-[0.65rem] font-bold sm:inline-block",
            saved ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
          )}
        >
          {saved ? "Saved" : "Unsaved"}
        </span>
      </div>

      {/* center: undo/redo + zoom */}
      <div className="flex items-center gap-1">
        <ToolBtn title="Undo (Ctrl+Z)" disabled={!canUndo} onClick={() => engine?.undo()}>
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h11a5 5 0 0 1 0 10h-3" />
        </ToolBtn>
        <ToolBtn title="Redo (Ctrl+Y)" disabled={!canRedo} onClick={() => engine?.redo()}>
          <path d="m15 14 5-5-5-5" />
          <path d="M20 9H9a5 5 0 0 0 0 10h3" />
        </ToolBtn>
        <div className="mx-1 hidden items-center gap-1 rounded-md border border-line-200 px-1 sm:flex">
          <ToolBtn title="Zoom out" onClick={() => changeZoom(-1)} bare>
            <path d="M5 12h14" />
          </ToolBtn>
          <span className="w-10 text-center text-xs font-semibold text-ink-600">
            {Math.round(zoom * 100)}%
          </span>
          <ToolBtn title="Zoom in" onClick={() => changeZoom(1)} bare>
            <path d="M12 5v14M5 12h14" />
          </ToolBtn>
        </div>
      </div>

      {/* right: actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          data-share="link"
          className="hidden h-9 items-center rounded-pill border border-line-200 px-4 text-sm font-semibold text-ink-700 hover:border-brand-300 sm:inline-flex"
        >
          Share
        </button>
        <button
          type="button"
          onClick={onSave}
          className="inline-flex h-9 items-center rounded-pill border border-line-200 px-4 text-sm font-semibold text-ink-700 hover:border-brand-300"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex h-9 items-center rounded-pill bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Export
        </button>
        <Link
          href="/"
          aria-label="Exit editor"
          className="ml-1 hidden h-9 w-9 items-center justify-center rounded-full text-ink-400 hover:bg-surface-100 hover:text-ink-900 sm:inline-flex"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </Link>
      </div>
    </header>
  );
}

function ToolBtn({
  children,
  title,
  onClick,
  disabled,
  bare,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  bare?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-600 transition-colors hover:bg-surface-100 hover:text-ink-900 disabled:opacity-30 disabled:hover:bg-transparent",
        !bare && "border border-line-200"
      )}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}
