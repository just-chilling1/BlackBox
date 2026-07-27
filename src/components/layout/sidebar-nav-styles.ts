import { clsx } from "clsx";

export type SidebarNavColor = "gold" | "indigo" | "purple" | "blue" | "orange" | "emerald";

const NAV_GLOW: Record<SidebarNavColor, string> = {
  gold: "hover:shadow-[0_0_20px_rgba(238,179,16,0.22)] hover:border-accent/40",
  indigo: "hover:shadow-[0_0_20px_rgba(99,102,241,0.22)] hover:border-indigo-400/40",
  purple: "hover:shadow-[0_0_20px_rgba(168,85,247,0.22)] hover:border-purple-400/40",
  blue: "hover:shadow-[0_0_20px_rgba(59,130,246,0.22)] hover:border-blue-400/40",
  orange: "hover:shadow-[0_0_20px_rgba(249,115,22,0.22)] hover:border-orange-400/40",
  emerald: "hover:shadow-[0_0_20px_rgba(16,185,129,0.22)] hover:border-emerald-400/40",
};

const ICON_COLOR: Record<SidebarNavColor, string> = {
  gold: "text-gray-500 group-hover:text-accent",
  indigo: "text-gray-500 group-hover:text-indigo-400",
  purple: "text-gray-500 group-hover:text-purple-400",
  blue: "text-gray-500 group-hover:text-blue-400",
  orange: "text-gray-500 group-hover:text-orange-400",
  emerald: "text-gray-500 group-hover:text-emerald-400",
};

export function sidebarNavItemClass(
  isActive: boolean,
  collapsed: boolean,
  color: SidebarNavColor = "gold"
) {
  return clsx(
    "sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg border border-transparent transition-all duration-300",
    collapsed && "justify-center px-2",
    isActive
      ? "is-active bg-white/10 border-accent/45 shadow-[0_0_20px_rgba(238,179,16,0.18)]"
      : clsx("hover:bg-white/5", NAV_GLOW[color])
  );
}

export function sidebarNavIconClass(isActive: boolean, color: SidebarNavColor = "gold") {
  return clsx(
    "w-5 h-5 shrink-0 transition-all duration-300",
    isActive
      ? "text-accent drop-shadow-[0_0_8px_rgba(238,179,16,0.75)]"
      : ICON_COLOR[color]
  );
}

export function sidebarNavLabelClass(isActive: boolean) {
  return clsx(
    "font-medium text-sm tracking-wide brand-font min-w-0 truncate",
    isActive ? "text-white" : "text-gray-400 group-hover:text-white"
  );
}
