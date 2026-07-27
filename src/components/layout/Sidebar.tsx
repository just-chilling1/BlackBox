"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Lock,
  PanelLeftClose,
  PanelLeftOpen,
  ExternalLink,
  PlayCircle,
} from "lucide-react";
import { clsx } from "clsx";
import { useEffect, useState } from "react";
import { brand } from "@/config/brand.config";
import {
  getVisibleWorkflowSteps,
  getCoreResourceNav,
  getVisibleResourceNav,
  isNavItemLocked,
} from "@/lib/features";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { PremiumFeatureNavList } from "@/components/dashboard/PremiumFeatureNavList";
import { getNavIcon } from "@/lib/nav-icons";
import { isNavPathActive } from "@/lib/nav-active";
import { isFeatureEnabled } from "@/config/features.config";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import { BlogBuilderNav } from "@/features/blog-builder/components/BlogBuilderNav";
import { storageKeys } from "@/lib/storage-keys";
import { homeNav, type NavItem } from "@/config/navigation.config";
import { getExclusiveOffers } from "@/config/offers.config";
import { trainingContent } from "@/config/training.config";
import { supabase } from "@/lib/supabase";
import {
  sidebarNavIconClass,
  sidebarNavItemClass,
  sidebarNavLabelClass,
  type SidebarNavColor,
} from "./sidebar-nav-styles";

interface SidebarContentProps {
  collapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

const NAV_COLORS: Partial<Record<string, SidebarNavColor>> = {
  LayoutGrid: "gold",
  Search: "blue",
  Brain: "indigo",
  Radar: "purple",
  MessageSquare: "emerald",
  GraduationCap: "orange",
  Headphones: "blue",
  TrendingUp: "emerald",
  Rocket: "gold",
  Megaphone: "purple",
  Link2: "blue",
  FolderOpen: "indigo",
};

function SidebarContent({ collapsed, onToggle, onMobileClose }: SidebarContentProps) {
  const pathname = usePathname();
  const workflowSteps = getVisibleWorkflowSteps();
  const coreResourceNav = getCoreResourceNav();
  const resourceNav = getVisibleResourceNav();
  const workflow = useWorkflowNav();
  const workflowProgress = workflow?.progress ?? 0;
  const blogEnabled = isFeatureEnabled("blog-builder");
  const showHomeNav = !workflowSteps.some((step) => step.path === homeNav.path);
  const exclusiveOffers = getExclusiveOffers(trainingContent.externalTrainingUrl);

  const [displayName, setDisplayName] = useState("Member");
  const [userInitials, setUserInitials] = useState("BC");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user } }) => {
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
    if (workflow?.resetSession) {
      await workflow.resetSession();
      return;
    }
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleNavClick = () => onMobileClose?.();

  const renderNavLink = (item: NavItem) => {
    const isActive = isNavPathActive(pathname, item.path);
    const Icon = getNavIcon(item.icon);
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
          <Lock size={18} className="text-gray-500 shrink-0" />
          {!collapsed && (
            <span className="brand-font text-sm font-medium text-gray-500 leading-snug truncate">
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
        onClick={handleNavClick}
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

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-white/5 bg-[var(--sidebar-bg)] backdrop-blur-xl">
      <div className={clsx("shrink-0 border-b border-white/5", collapsed ? "p-3" : "p-6 pb-2")}>
        <div className={clsx("flex items-center", collapsed ? "flex-col gap-3" : "justify-between gap-2")}>
          <Link
            href="/dashboard"
            onClick={handleNavClick}
            className="block min-w-0 transition-opacity hover:opacity-80"
            title={brand.productName}
          >
            {collapsed ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logo.iconSrc}
                alt={brand.logo.alt}
                width={40}
                height={40}
                className="mx-auto h-10 w-10 rounded-xl border border-accent/30 object-contain p-1 shadow-[0_0_15px_rgba(238,179,16,0.15)]"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brand.logo.src}
                alt={brand.logo.alt}
                className="h-9 w-auto max-w-[210px] object-contain object-left"
              />
            )}
          </Link>
          <button
            type="button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
      </div>

      <nav
        aria-label="Main navigation"
        className="sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain py-2 pl-2 pr-1 md:pl-4 md:pr-2"
      >
        <div className="space-y-1">
          {showHomeNav ? renderNavLink(homeNav) : null}
          {workflowSteps.map((step) => renderNavLink(step))}
          {blogEnabled ? (
            <BlogBuilderNav pathname={pathname} onNavClick={handleNavClick} collapsed={collapsed} />
          ) : null}
          {coreResourceNav.map((step) => renderNavLink(step))}
          {resourceNav.map((step) => renderNavLink(step))}
        </div>

        {PREMIUM_FEATURES.length > 0 && (
          <PremiumFeatureNavList collapsed={collapsed} onNavigate={handleNavClick} />
        )}

        {!collapsed && exclusiveOffers.length > 0 && (
          <div className="mt-4 space-y-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
            <p className="px-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              Exclusive Offers
            </p>
            {exclusiveOffers.map((offer) => (
              <a
                key={offer.href + offer.title}
                href={offer.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-emerald-500/10 hover:text-white"
              >
                <PlayCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                <span className="flex-1">{offer.title}</span>
                <ExternalLink className="h-3 w-3 text-emerald-400" />
              </a>
            ))}
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-white/5 p-2 md:p-4">
        <div className={clsx("rounded-xl bg-black/20 p-3", collapsed && "px-2")}>
          <div className={clsx("flex items-center gap-3", collapsed && "flex-col")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-accent to-indigo-600 text-sm font-bold text-black shadow-[0_0_15px_rgba(238,179,16,0.35)]">
              {userInitials}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="brand-font truncate text-sm font-bold text-white">{displayName}</div>
                <div className="text-xs text-gray-500">Active Member</div>
              </div>
            )}
            <button
              type="button"
              onClick={() => void handleLogout()}
              className="rounded-lg p-2 text-gray-500 transition-all hover:bg-red-500/10 hover:text-red-400"
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
      className="fixed left-0 top-0 z-50 hidden h-dvh border-r border-white/10 bg-[var(--sidebar-shell-bg)] backdrop-blur-md transition-[width] duration-300 lg:flex"
      style={{ width: "var(--sidebar-w)" }}
    >
      <SidebarContent collapsed={collapsed} onToggle={toggleCollapse} />
    </aside>
  );
}
