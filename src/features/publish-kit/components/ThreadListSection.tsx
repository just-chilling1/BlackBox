"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

export function ThreadListSection({
  title,
  count,
  defaultOpen = true,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 border-b border-transparent bg-gradient-to-r from-amber-50/40 to-white px-4 py-3.5 transition-colors hover:bg-amber-50/30 group-open:border-slate-100 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={16}
          className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
        />
        <span className="min-w-0 flex-1 text-sm font-bold text-text-heading">{title}</span>
        {count !== undefined && (
          <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-amber-800">
            {count}
          </span>
        )}
      </summary>
      <div className="space-y-3 bg-slate-50/40 p-3">{children}</div>
    </details>
  );
}
