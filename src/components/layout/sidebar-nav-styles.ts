import { clsx } from "clsx";

export type SidebarNavColor = "gold" | "indigo" | "purple" | "blue" | "orange" | "emerald";

const ICON_COLOR: Record<SidebarNavColor, string> = {
  gold: "text-slate-400 group-hover:text-accent",
  indigo: "text-slate-400 group-hover:text-indigo-500",
  purple: "text-slate-400 group-hover:text-purple-500",
  blue: "text-slate-400 group-hover:text-blue-500",
  orange: "text-slate-400 group-hover:text-orange-500",
  emerald: "text-slate-400 group-hover:text-emerald-500",
};

export const sidebarSectionLabelClass = "sidebar-section-label";

export function sidebarNavItemClass(
  isActive: boolean,
  collapsed: boolean,
  _color: SidebarNavColor = "gold"
) {
  return clsx(
    "sidebar-nav-item flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg border border-transparent transition-all duration-300",
    collapsed && "justify-center px-2 pl-2",
    isActive && "is-active"
  );
}

export function sidebarNavIconClass(isActive: boolean, color: SidebarNavColor = "gold") {
  return clsx(
    "sidebar-nav-icon w-5 h-5 shrink-0 transition-all duration-300",
    isActive ? "sidebar-nav-icon--active text-accent drop-shadow-[0_0_8px_rgba(238,179,16,0.5)]" : ICON_COLOR[color]
  );
}

export function sidebarNavLabelClass(isActive: boolean) {
  return clsx(
    "text-sm tracking-wide brand-font min-w-0 truncate",
    isActive
      ? "font-bold text-text-heading"
      : "font-medium text-text-muted group-hover:text-text-secondary"
  );
}
