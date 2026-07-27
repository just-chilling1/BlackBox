import { clsx } from "clsx";

export type SidebarNavColor = "gold" | "indigo" | "purple" | "blue" | "orange" | "emerald";

const ICON_COLOR: Record<SidebarNavColor, string> = {
  gold: "text-text-secondary group-hover:text-accent",
  indigo: "text-text-secondary group-hover:text-indigo-500",
  purple: "text-text-secondary group-hover:text-purple-500",
  blue: "text-text-secondary group-hover:text-blue-500",
  orange: "text-text-secondary group-hover:text-orange-500",
  emerald: "text-text-secondary group-hover:text-emerald-500",
};

export function sidebarNavItemClass(
  isActive: boolean,
  collapsed: boolean,
  _color: SidebarNavColor = "gold"
) {
  return clsx(
    "sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent transition-all duration-300",
    collapsed && "justify-center px-2",
    isActive && "is-active"
  );
}

export function sidebarNavIconClass(isActive: boolean, color: SidebarNavColor = "gold") {
  return clsx(
    "w-5 h-5 shrink-0 transition-all duration-300",
    isActive ? "text-accent drop-shadow-[0_0_6px_rgba(238,179,16,0.45)]" : ICON_COLOR[color]
  );
}

export function sidebarNavLabelClass(isActive: boolean) {
  return clsx(
    "font-medium text-sm tracking-wide brand-font min-w-0 truncate",
    isActive ? "text-text-heading" : "text-text-secondary group-hover:text-text-primary"
  );
}
