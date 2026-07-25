"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Lock } from "lucide-react";
import { getBlogBuilderWorkflowSteps, getBlogBuilderResourceNav, isNavItemLocked } from "@/lib/features";
import { getNavIcon } from "@/lib/nav-icons";
import { isFeatureEnabled } from "@/config/features.config";
import { useWorkflowNav } from "@/context/WorkflowNavContext";

interface BlogBuilderNavProps {
  pathname: string;
  onNavClick?: () => void;
  collapsed?: boolean;
}

/** Blog-builder workflow nav section — shown when blog-builder feature is enabled. */
export function BlogBuilderNav({ pathname, onNavClick, collapsed = false }: BlogBuilderNavProps) {
  if (!isFeatureEnabled("blog-builder")) return null;

  const steps = getBlogBuilderWorkflowSteps();
  const resources = getBlogBuilderResourceNav();
  const workflow = useWorkflowNav();
  const workflowProgress = workflow?.progress ?? 0;

  const renderStep = (item: (typeof steps)[0]) => {
    const Icon = getNavIcon(item.icon);
    const isActive = pathname === item.path;
    const locked = isNavItemLocked(item, workflowProgress);

    if (locked) {
      return (
        <div
          key={item.path}
          className="command-nav-link py-3 sm:py-4 opacity-40 cursor-not-allowed"
          title="Complete the previous step first"
        >
          <div className={clsx("flex items-center gap-3 min-w-0", collapsed && "justify-center")}>
            <Lock size={18} className="text-text-muted shrink-0" />
            {!collapsed && (
              <span className="brand-font text-sm font-medium text-text-muted leading-snug">
                {item.label}
              </span>
            )}
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={onNavClick}
        title={collapsed ? item.label : undefined}
        className={clsx(
          "command-nav-link py-3 sm:py-4",
          isActive && "active",
          collapsed && "justify-center px-2"
        )}
      >
        <div className={clsx("flex items-center gap-3 min-w-0 flex-1", collapsed && "justify-center")}>
          <Icon size={18} className={clsx("shrink-0", isActive ? "text-accent" : "text-text-muted")} />
          {!collapsed && (
            <span className="brand-font text-sm font-medium leading-snug">{item.label}</span>
          )}
        </div>
      </Link>
    );
  };

  return (
    <>
      {steps.length > 0 && (
        <>
          {!collapsed && (
            <span className="text-[10px] font-black tracking-[0.25em] text-text-muted uppercase px-3 sm:px-5 mt-4 mb-2">
              Build Your Site
            </span>
          )}
          {steps.map(renderStep)}
        </>
      )}
      {resources.length > 0 && (
        <>
          {!collapsed && (
            <span className="text-[10px] font-black tracking-[0.25em] text-text-muted uppercase px-3 sm:px-5 mt-4 mb-2">
              My Sites
            </span>
          )}
          {resources.map((item) => {
            const Icon = getNavIcon(item.icon);
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onNavClick}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "command-nav-link py-3 sm:py-4",
                  isActive && "active",
                  collapsed && "justify-center px-2"
                )}
              >
                <div className={clsx("flex items-center gap-3 min-w-0 flex-1", collapsed && "justify-center")}>
                  <Icon size={18} className={clsx("shrink-0", isActive ? "text-accent" : "text-text-muted")} />
                  {!collapsed && (
                    <span className="brand-font text-sm font-medium leading-snug">{item.label}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
}
