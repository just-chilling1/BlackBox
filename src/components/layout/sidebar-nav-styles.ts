import { clsx } from "clsx";

export const sidebarSectionLabelClass = "sidebar-section-label";

export function sidebarNavItemClass(isActive: boolean, collapsed: boolean) {
  return clsx(
    "sidebar-nav-item group flex items-center gap-3 pl-3 pr-3 py-2.5",
    collapsed && "justify-center px-2.5 py-3",
    isActive && "is-active"
  );
}

export function sidebarNavIconClass(isActive: boolean) {
  return clsx(
    "sidebar-nav-icon h-[18px] w-[18px] shrink-0",
    isActive ? "is-active" : null
  );
}

export function sidebarNavLabelClass(isActive: boolean) {
  return clsx(
    "sidebar-nav-label min-w-0 truncate text-[14px] leading-snug",
    isActive && "is-active"
  );
}
