"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Lock } from "lucide-react";
import {
  getBlogBuilderWorkflowSteps,
  getBlogBuilderGenerateNav,
  getBlogBuilderLibrariesNav,
  isNavItemLocked,
} from "@/lib/features";
import {
  blogBuilderGenerateSectionLabel,
  blogBuilderLibrariesSectionLabel,
} from "@/config/navigation.config";
import { getNavIcon } from "@/lib/nav-icons";
import { isNavPathActive } from "@/lib/nav-active";
import { isFeatureEnabled } from "@/config/features.config";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import {
  sidebarNavIconClass,
  sidebarNavItemClass,
  sidebarNavLabelClass,
  sidebarSectionLabelClass,
  type SidebarNavColor,
} from "@/components/layout/sidebar-nav-styles";

interface BlogBuilderNavProps {
  pathname: string;
  onNavClick?: () => void;
  collapsed?: boolean;
}

const NAV_COLORS: Partial<Record<string, SidebarNavColor>> = {
  Rocket: "gold",
  Megaphone: "purple",
  Link2: "blue",
  FolderOpen: "indigo",
};

export function BlogBuilderNav({ pathname, onNavClick, collapsed = false }: BlogBuilderNavProps) {
  if (!isFeatureEnabled("blog-builder")) return null;

  const steps = getBlogBuilderWorkflowSteps();
  const generateNav = getBlogBuilderGenerateNav();
  const librariesNav = getBlogBuilderLibrariesNav();
  const workflow = useWorkflowNav();
  const workflowProgress = workflow?.progress ?? 0;

  const renderStep = (item: (typeof steps)[0]) => {
    const Icon = getNavIcon(item.icon);
    const isActive = isNavPathActive(pathname, item.path);
    const locked = isNavItemLocked(item, workflowProgress);
    const color = NAV_COLORS[item.icon] ?? "gold";

    if (locked) {
      return (
        <div
          key={item.path}
          className={clsx(
            "sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg opacity-40 cursor-not-allowed",
            collapsed && "justify-center px-2"
          )}
          title="Complete the previous step first"
        >
          <Lock size={18} className="text-text-muted shrink-0" />
          {!collapsed && (
            <span className="brand-font text-sm font-medium text-text-muted leading-snug truncate">
              {item.label}
            </span>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={onNavClick}
        title={collapsed ? item.label : undefined}
        className="block group"
      >
        <div className={sidebarNavItemClass(isActive, collapsed, color)}>
          <Icon className={sidebarNavIconClass(isActive, color)} size={20} />
          {!collapsed && <span className={sidebarNavLabelClass(isActive)}>{item.label}</span>}
        </div>
      </Link>
    );
  };

  const renderCoreLink = (item: (typeof generateNav)[0]) => {
    const Icon = getNavIcon(item.icon);
    const isActive = isNavPathActive(pathname, item.path);
    const color = NAV_COLORS[item.icon] ?? "gold";

    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={onNavClick}
        title={collapsed ? item.label : undefined}
        className="block group"
      >
        <div className={sidebarNavItemClass(isActive, collapsed, color)}>
          <Icon className={sidebarNavIconClass(isActive, color)} size={20} />
          {!collapsed && <span className={sidebarNavLabelClass(isActive)}>{item.label}</span>}
        </div>
      </Link>
    );
  };

  const sectionLabelClass = sidebarSectionLabelClass;

  return (
    <>
      {(steps.length > 0 || generateNav.length > 0) && (
        <>
          {!collapsed && <p className={sectionLabelClass}>{blogBuilderGenerateSectionLabel}</p>}
          {steps.map(renderStep)}
          {generateNav.map(renderCoreLink)}
        </>
      )}
      {librariesNav.length > 0 && (
        <>
          {!collapsed && <p className={sectionLabelClass}>{blogBuilderLibrariesSectionLabel}</p>}
          {librariesNav.map(renderCoreLink)}
        </>
      )}
    </>
  );
}
