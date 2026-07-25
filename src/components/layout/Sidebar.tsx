"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, ChevronRight, Lock, Sparkles, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand.config";
import {
  getVisibleWorkflowSteps,
  getCoreResourceNav,
  getVisibleResourceNav,
  isNavItemLocked,
} from "@/lib/features";
import { PREMIUM_FEATURES, PREMIUM_SECTION_LABEL } from "@/lib/premium-features";
import { getNavIcon } from "@/lib/nav-icons";
import { isNavPathActive } from "@/lib/nav-active";
import { BrandLogo } from "./BrandLogo";
import { isFeatureEnabled } from "@/config/features.config";
import { LiveActivityTicker } from "@/features/dopamine/components/LiveActivityTicker";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import { BlogBuilderNav } from "@/features/blog-builder/components/BlogBuilderNav";
import { storageKeys } from "@/lib/storage-keys";
import { homeNav, type NavItem } from "@/config/navigation.config";

interface SidebarContentProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

function SidebarContent({ collapsed, onToggle, onMobileClose }: SidebarContentProps) {
  const pathname = usePathname();
  const workflowSteps = getVisibleWorkflowSteps();
  const coreResourceNav = getCoreResourceNav();
  const resourceNav = getVisibleResourceNav();
  const workflow = useWorkflowNav();
  const workflowProgress = workflow?.progress ?? 0;
  const blogEnabled = isFeatureEnabled("blog-builder");
  const dopamineEnabled = isFeatureEnabled("dopamine");
  const showHomeNav = !workflowSteps.some((step) => step.path === homeNav.path);

  const currentWorkflowIndex = workflowSteps.findIndex((s) => s.path === pathname);
  const progress =
    currentWorkflowIndex >= 0
      ? ((currentWorkflowIndex + 1) / Math.max(workflowSteps.length, 1)) * 100
      : 0;

  const handleLogout = async () => {
    onMobileClose?.();
    if (workflow?.resetSession) {
      await workflow.resetSession();
      return;
    }
    const { supabase } = await import("@/lib/supabase");
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleNavClick = () => onMobileClose?.();

  const renderNavLink = (item: NavItem) => {
    const isActive = isNavPathActive(pathname, item.path);
    const Icon = getNavIcon(item.icon);
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
        onClick={handleNavClick}
        title={collapsed ? item.label : undefined}
        className={clsx("command-nav-link py-3 sm:py-4", isActive && "active", collapsed && "justify-center px-2")}
      >
        <div className={clsx("flex items-center gap-3 min-w-0 flex-1", collapsed && "justify-center")}>
          <Icon size={18} className={clsx("shrink-0", isActive ? "text-accent" : "text-text-muted")} />
          {!collapsed && (
            <span className="brand-font text-sm font-medium leading-snug">{item.label}</span>
          )}
        </div>
        {isActive && !collapsed && <ChevronRight size={14} className="text-accent ml-2 shrink-0" />}
      </Link>
    );
  };

  return (
    <div className="relative flex h-full flex-col">
      {workflowSteps.length > 0 && (
        <div className="absolute left-0 top-0 z-0 h-full w-0.5 bg-white/5">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            className="w-full"
            style={{
              backgroundColor: brand.colors.primary,
              boxShadow: `0 0 15px ${brand.colors.primary}80`,
            }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </div>
      )}

      <div className={clsx("relative z-10 shrink-0 border-b border-white/5", collapsed ? "px-3 py-4" : "px-4 py-5")}>
        <div className={clsx("flex items-center", collapsed ? "flex-col gap-3" : "justify-between gap-2")}>
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className={clsx("min-w-0", collapsed ? "flex justify-center" : "flex-1")}
            title={collapsed ? brand.productName : undefined}
          >
            <BrandLogo size="sm" compact={collapsed} splitTitle showTagline={!collapsed} />
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-text-muted transition-colors hover:bg-white/5 hover:text-text-primary lg:flex"
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
      </div>

      <nav className="sidebar-scrollbar relative z-10 flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-2 py-2 pb-4">
        {showHomeNav ? renderNavLink(homeNav) : null}

        {workflowSteps.length > 0 && (
          <>
            {!collapsed && (
              <span className="text-xs font-black tracking-[0.25em] text-text-muted uppercase px-3 sm:px-5 mb-2">
                Workflow
              </span>
            )}
            {workflowSteps.map((step) => renderNavLink(step))}
          </>
        )}

        {blogEnabled ? (
          <BlogBuilderNav pathname={pathname} onNavClick={handleNavClick} collapsed={collapsed} />
        ) : null}

        {PREMIUM_FEATURES.length > 0 && (
          <div className="mt-4">
            <div className={clsx("premium-nav-section", collapsed ? "p-1" : "p-2")}>
              {!collapsed && (
                <p className="relative z-10 flex items-center gap-1.5 px-2.5 sm:px-3 pb-2 pt-1.5 text-[10px] font-black tracking-[0.25em] text-accent uppercase">
                  <Sparkles className="h-3 w-3 shrink-0 animate-sparkle-pulse" fill="currentColor" />
                  {PREMIUM_SECTION_LABEL}
                </p>
              )}
              <ul className="relative z-10 space-y-1">
                {PREMIUM_FEATURES.map((item, index) => {
                  const isActive = isNavPathActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        onClick={handleNavClick}
                        title={collapsed ? item.label : undefined}
                        className={clsx(
                          "premium-sidebar-item flex items-center gap-3 rounded-xl py-3 text-sm font-medium text-text-secondary",
                          collapsed ? "justify-center px-2" : "px-3 sm:px-4",
                          isActive && "is-active"
                        )}
                      >
                        <Icon size={18} className={clsx("shrink-0", isActive ? "text-accent" : "text-accent/80")} />
                        {!collapsed && (
                          <span className="brand-font text-sm font-medium leading-snug">{item.label}</span>
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {(coreResourceNav.length > 0 || resourceNav.length > 0) && (
          <>
            {!collapsed && (
              <span className="text-[10px] font-black tracking-[0.25em] text-text-muted uppercase px-3 sm:px-5 mt-4 mb-2">
                Resources
              </span>
            )}
            {coreResourceNav.map((step) => renderNavLink(step))}
            {resourceNav.map((step) => renderNavLink(step))}
          </>
        )}
      </nav>

      <div className="relative z-10 shrink-0 border-t border-white/5 px-2 py-3">
        {dopamineEnabled && !collapsed ? (
          <div className="mb-3 px-2">
            <LiveActivityTicker />
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => void handleLogout()}
          title={collapsed ? "Sign Out" : undefined}
          className={clsx(
            "command-nav-link py-3 sm:py-4 text-red-400/60 hover:text-red-400 hover:bg-red-500/5",
            collapsed && "justify-center px-2"
          )}
        >
          <div className={clsx("flex items-center gap-3", collapsed && "justify-center")}>
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span className="brand-font text-sm font-medium">Sign Out</span>}
          </div>
        </button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKeys.sidebarCollapsed);
    const isCollapsed = stored === "1";
    setCollapsed(isCollapsed);
    document.documentElement.dataset.sidebar = isCollapsed ? "collapsed" : "expanded";
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(storageKeys.sidebarCollapsed, next ? "1" : "0");
      document.documentElement.dataset.sidebar = next ? "collapsed" : "expanded";
      return next;
    });
  };

  return (
    <aside
      className="sidebar-glass fixed left-0 top-0 z-30 hidden h-dvh flex-col overflow-hidden transition-[width] duration-300 ease-out lg:flex"
      style={{ width: "var(--sidebar-w)" }}
    >
      <SidebarContent collapsed={collapsed} onToggle={toggleCollapse} />
    </aside>
  );
}
