"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TopToolbar } from "./toolbar";
import { LeftRail, TOOLS } from "./left-rail";
import { ActivePanel } from "./panels";
import { PropertiesPanel } from "./properties";
import { CenterStage } from "./center-stage";
import { useEditorStore } from "./editor-store";
import { useEditorShortcuts } from "./use-editor-shortcuts";
import { cn } from "@/lib/utils";

export function EditorShell() {
  useEditorShortcuts();
  const [mobileMode, setMobileMode] = useState<"panel" | "props" | null>(null);
  const activePanel = useEditorStore((s) => s.activePanel);
  const setActivePanel = useEditorStore((s) => s.setActivePanel);
  const selection = useEditorStore((s) => s.selection);

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-surface-50">
      <TopToolbar />

      <div className="flex min-h-0 flex-1">
        {/* desktop: rail + active panel */}
        <div className="hidden lg:flex">
          <LeftRail />
          <aside className="w-[300px] overflow-y-auto border-r border-line-200 bg-surface-0 p-4">
            <ActivePanel />
          </aside>
        </div>

        {/* canvas stage */}
        <div className="relative min-w-0 flex-1">
          <CenterStage />
        </div>

        {/* desktop: properties */}
        <aside className="hidden w-[300px] overflow-y-auto border-l border-line-200 bg-surface-0 p-4 lg:block">
          <PropertiesPanel />
        </aside>
      </div>

      {/* mobile: bottom tool bar */}
      <nav className="flex shrink-0 items-center gap-0.5 overflow-x-auto border-t border-line-200 bg-surface-0 px-1.5 py-1.5 lg:hidden">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setActivePanel(t.id);
              setMobileMode("panel");
            }}
            className={cn(
              "flex min-w-[58px] flex-col items-center gap-1 rounded-lg py-1.5 text-[0.6rem] font-semibold transition-colors",
              activePanel === t.id && mobileMode === "panel"
                ? "bg-brand-50 text-brand-700"
                : "text-ink-400"
            )}
          >
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              {t.icon}
            </svg>
            {t.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setMobileMode("props")}
          className={cn(
            "flex min-w-[58px] flex-col items-center gap-1 rounded-lg py-1.5 text-[0.6rem] font-semibold transition-colors",
            mobileMode === "props" ? "bg-brand-50 text-brand-700" : "text-ink-400",
            selection && "text-brand-600"
          )}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
          </svg>
          Style
        </button>
      </nav>

      {/* mobile: bottom-sheet drawer */}
      <AnimatePresence>
        {mobileMode && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-ink-900/30"
              onClick={() => setMobileMode(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[66dvh] overflow-y-auto rounded-t-2xl border-t border-line-200 bg-surface-0 p-4 pb-8 shadow-lg"
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-pill bg-line-200" />
              {mobileMode === "panel" ? <ActivePanel /> : <PropertiesPanel />}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
