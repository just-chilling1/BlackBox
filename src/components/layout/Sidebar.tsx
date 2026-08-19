"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand.config";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  getVisibleWorkflowSteps,
  getCoreResourceNav,
  getVisibleResourceNav,
  isNavItemLocked,
} from "@/lib/features";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { PremiumFeatureNavList } from "@/components/dashboard/PremiumFeatureNavList";
import { ExclusiveOffersNavSection } from "@/components/layout/ExclusiveOffersNavSection";
import { getNavIcon } from "@/lib/nav-icons";
import { isNavPathActive } from "@/lib/nav-active";
import { isFeatureEnabled } from "@/config/features.config";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import { BlogBuilderNav } from "@/features/blog-builder/components/BlogBuilderNav";
import { storageKeys } from "@/lib/storage-keys";
import { homeNav, supportNav, type NavItem } from "@/config/navigation.config";
import { getExclusiveOffers } from "@/config/offers.config";
import { supabase } from "@/lib/supabase";
import { getCachedClientUser } from "@/lib/auth-client-cache";
import { WarmNavLink } from "@/components/layout/WarmNavLink";
import {
  sidebarNavIconClass,
  sidebarNavItemClass,
  sidebarNavLabelClass,
} from "./sidebar-nav-styles";

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
  const showHomeNav = !workflowSteps.some((step) => step.path === homeNav.path);
  const exclusiveOffers = getExclusiveOffers();

  const [displayName, setDisplayName] = useState("Member");
  const [userInitials, setUserInitials] = useState("NP");

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      if (!user) return;
      const handle = user.email?.split("@")[0] || "Member";
      const name =
        (user.user_metadata?.full_name as string | undefined)?.trim() ||
        handle.charAt(0).toUpperCase() + handle.slice(1);
      setDisplayName(name);
      setUserInitials(name.substring(0, 2).toUpperCase());
    });
  }, []);

  const handleLogout = async () => {
    onMobileClose?.();
    try {
      await workflow.resetSession();
    } catch (err) {
      console.error("[logout] session reset failed", err);
    }
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
      <WarmNavLink
        key={item.path}
        href={item.path}
        onClick={handleNavClick}
        title={collapsed ? item.label : undefined}
        className="block group"
      >
        <div className={sidebarNavItemClass(isActive, collapsed)}>
          <Icon className={sidebarNavIconClass(isActive)} size={20} />
          {!collapsed && <span className={sidebarNavLabelClass(isActive)}>{item.label}</span>}
        </div>
      </WarmNavLink>
    );
  };

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]">
      <div className={clsx("shrink-0 border-b border-[var(--sidebar-border)]", collapsed ? "p-3" : "px-[14px] py-4")}>
        <div className={clsx("flex w-full items-center", collapsed ? "flex-col gap-3" : "gap-2")}>
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className={clsx(
              "transition-opacity hover:opacity-90",
              collapsed ? "flex w-full justify-center" : "min-w-0 flex-1"
            )}
            title={brand.productName}
          >
            <BrandLogo size="sidebar" showTagline={false} compact={collapsed} className="w-full" />
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            suppressHydrationWarning
            className={clsx(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-dim text-ink-3 transition-colors hover:bg-pulse-100 hover:text-ink",
              !collapsed && "ml-auto"
            )}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
      </div>

      <div className="sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain">
        <nav
          aria-label="Main navigation"
          className="py-2 px-[14px]"
        >
          <div className="space-y-0.5">
            {showHomeNav ? renderNavLink(homeNav) : null}
            {workflowSteps.map((step) => renderNavLink(step))}
            {blogEnabled ? (
              <BlogBuilderNav
                pathname={pathname}
                onNavClick={handleNavClick}
                collapsed={collapsed}
                sections={["workflow", "generate"]}
              />
            ) : null}

            {blogEnabled ? (
              <BlogBuilderNav
                pathname={pathname}
                onNavClick={handleNavClick}
                collapsed={collapsed}
                sections={["libraries"]}
              />
            ) : null}
            {coreResourceNav.map((step) => renderNavLink(step))}
            {resourceNav.map((step) => renderNavLink(step))}
          </div>

          {PREMIUM_FEATURES.length > 0 ? (
            <PremiumFeatureNavList collapsed={collapsed} onNavigate={handleNavClick} highlighted />
          ) : null}

          <ExclusiveOffersNavSection offers={exclusiveOffers} collapsed={collapsed} />
        </nav>
      </div>

      <div className="shrink-0 space-y-2 border-t border-[var(--sidebar-border)] p-2 md:p-4">
        {renderNavLink(supportNav)}

        <div className={clsx("p-3", collapsed && "px-2")}>
          <div className={clsx("flex items-center gap-3", collapsed && "flex-col")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-grad-pulse text-[15px] font-medium text-pulse-900 shadow-pulse">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="brand-font truncate text-[15px] text-ink">{displayName}</div>
                <div className="text-[13px] text-ink-5">Active Member</div>
              </div>
            )}
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="sidebar-sign-out rounded-lg p-2"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function readSidebarCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(storageKeys.sidebarCollapsed) === "1";
}

function applySidebarLayout(collapsed: boolean) {
  document.documentElement.dataset.sidebar = collapsed ? "collapsed" : "expanded";
  document.documentElement.style.setProperty("--sidebar-w", collapsed ? "76px" : "280px");
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = readSidebarCollapsed();
    setCollapsed(stored);
    applySidebarLayout(stored);
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(storageKeys.sidebarCollapsed, next ? "1" : "0");
      applySidebarLayout(next);
      return next;
    });
  };

  return (
    <aside
      className="fixed left-0 top-0 z-50 hidden h-dvh border-r border-[var(--sidebar-border)] bg-[var(--sidebar-shell-bg)] shadow-sm transition-[width] duration-300 lg:flex"
      style={{ width: "var(--sidebar-w)" }}
    >
      <SidebarContent collapsed={collapsed} onToggle={toggleCollapse} />
    </aside>
  );
}
