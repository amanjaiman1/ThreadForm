"use client";

import dynamic from "next/dynamic";

// The editor (fabric.js, heavy, browser-only) is lazy-loaded and never SSR'd.
const EditorShell = dynamic(
  () => import("@/features/editor/editor-shell").then((m) => m.EditorShell),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export function StudioClient() {
  return <EditorShell />;
}

function EditorSkeleton() {
  return (
    <div className="flex h-[100dvh] flex-col bg-surface-50">
      <div className="h-14 border-b border-line-200 bg-surface-0" />
      <div className="flex flex-1">
        <div className="hidden w-[76px] border-r border-line-200 bg-surface-0 lg:block" />
        <div className="hidden w-[300px] border-r border-line-200 bg-surface-0 lg:block" />
        <div className="relative flex flex-1 items-center justify-center bg-surface-100 bg-dotgrid">
          <div className="relative h-[420px] w-[330px] overflow-hidden rounded-xl bg-line-200">
            <div className="skeleton-shimmer absolute inset-0" />
          </div>
        </div>
        <div className="hidden w-[300px] border-l border-line-200 bg-surface-0 lg:block" />
      </div>
    </div>
  );
}
