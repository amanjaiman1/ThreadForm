"use client";

import { useEditorStore } from "./editor-store";
import { cn } from "@/lib/utils";
import type { PanelId } from "./editor-types";

export const TOOLS: { id: PanelId; label: string; icon: React.ReactNode }[] = [
  {
    id: "templates",
    label: "Templates",
    icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  },
  {
    id: "text",
    label: "Text",
    icon: <path d="M4 7V5h16v2M9 5v14M9 19h6" />,
  },
  {
    id: "images",
    label: "Images",
    icon: <><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="8.5" cy="9.5" r="1.5" /><path d="m21 16-5-5L5 20" /></>,
  },
  {
    id: "logos",
    label: "Logos",
    icon: <path d="M12 2 15 9l7 .5-5.3 4.6L18.5 21 12 17l-6.5 4 1.8-6.9L2 9.5 9 9z" />,
  },
  {
    id: "shapes",
    label: "Shapes",
    icon: <><circle cx="8" cy="8" r="4.5" /><rect x="12.5" y="12.5" width="8" height="8" rx="1.5" /></>,
  },
  {
    id: "layers",
    label: "Layers",
    icon: <><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></>,
  },
];

export function LeftRail() {
  const active = useEditorStore((s) => s.activePanel);
  const setActive = useEditorStore((s) => s.setActivePanel);

  return (
    <nav className="flex w-[76px] shrink-0 flex-col gap-1 border-r border-line-200 bg-surface-0 p-2">
      {TOOLS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setActive(t.id)}
          className={cn(
            "flex flex-col items-center gap-1 rounded-lg py-2.5 text-[0.65rem] font-semibold transition-colors",
            active === t.id
              ? "bg-brand-50 text-brand-700"
              : "text-ink-400 hover:bg-surface-100 hover:text-ink-900"
          )}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
            {t.icon}
          </svg>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
