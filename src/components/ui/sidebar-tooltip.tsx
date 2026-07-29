"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarTooltipProps {
  label: string;
  children: ReactNode;
  /** Show tooltip (typically when sidebar is collapsed). */
  show?: boolean;
  className?: string;
}

export function SidebarTooltip({ label, children, show = true, className }: SidebarTooltipProps) {
  if (!show) return <>{children}</>;

  return (
    <div className={cn("group/sidebar-tip relative flex w-full", className)}>
      {children}
      <span
        role="tooltip"
        className={cn(
          "sidebar-tooltip pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-[60]",
          "-translate-y-1/2 whitespace-nowrap rounded-lg border border-border-dim bg-surface px-2.5 py-1.5",
          "text-xs font-semibold text-text-primary shadow-lg",
          "opacity-0 translate-x-1 transition-all duration-200",
          "group-hover/sidebar-tip:opacity-100 group-hover/sidebar-tip:translate-x-0",
          "group-focus-within/sidebar-tip:opacity-100 group-focus-within/sidebar-tip:translate-x-0"
        )}
      >
        {label}
        <span
          className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-border-dim"
          aria-hidden
        />
        <span
          className="absolute right-full top-1/2 -mr-px -translate-y-1/2 border-[4px] border-transparent border-r-surface"
          aria-hidden
        />
      </span>
    </div>
  );
}
