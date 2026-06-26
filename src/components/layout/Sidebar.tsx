"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, ChevronRight, Sparkles, Lock, X } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { brand } from "@/config/brand.config";
import { homeNav, premiumSectionLabel } from "@/config/navigation.config";
import {
  getVisibleWorkflowSteps,
  getCoreResourceNav,
  getVisibleResourceNav,
  getVisibleUpgradeNav,
  isNavItemLocked,
} from "@/lib/features";
import { getNavIcon } from "@/lib/nav-icons";
import { SidebarPromos } from "./PromoOrchestrator";
import { isFeatureEnabled } from "@/config/features.config";
import { LiveActivityTicker } from "@/features/dopamine/components/LiveActivityTicker";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import { BrandLogo } from "./BrandLogo";

interface SidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ mobileOpen = false, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const workflowSteps = getVisibleWorkflowSteps();
  const coreResourceNav = getCoreResourceNav();
  const resourceNav = getVisibleResourceNav();
  const upgradeNav = getVisibleUpgradeNav();
  const workflow = useWorkflowNav();

  const workflowProgress = workflow?.progress ?? 0;
  const currentWorkflowIndex = workflowSteps.findIndex((s) => s.path === pathname);
  const progress =
    currentWorkflowIndex >= 0
      ? ((currentWorkflowIndex + 1) / Math.max(workflowSteps.length, 1)) * 100
      : pathname === homeNav.path
        ? 0
        : 100;

  const handleLogout = async () => {
    onMobileClose?.();
    if (workflow?.resetSession) {
      await workflow.resetSession();
      return;
    }
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleNavClick = () => {
    onMobileClose?.();
  };

  const renderNavLink = (item: typeof homeNav) => {
    const isActive = pathname === item.path;
    const Icon = getNavIcon(item.icon);
    const locked = isNavItemLocked(item, workflowProgress);

    if (locked) {
      return (
        <div
          key={item.path}
          className="command-nav-link group py-3 sm:py-4 opacity-40 cursor-not-allowed"
          title="Complete the previous step first"
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Lock size={18} className="text-text-muted shrink-0" />
            <span className="brand-font tracking-wide text-sm font-medium text-text-muted leading-snug">
              {item.label}
            </span>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={handleNavClick}
        className={clsx("command-nav-link group py-3 sm:py-4", isActive && "active")}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          <Icon
            size={18}
            className={clsx(
              "shrink-0",
              isActive ? "text-accent" : "text-text-muted group-hover:text-text-primary"
            )}
          />
          <span className="brand-font tracking-wide text-sm font-medium leading-snug">{item.label}</span>
        </div>
        {isActive && <ChevronRight size={14} className="text-accent ml-2 shrink-0" />}
      </Link>
    );
  };

  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 z-50 flex flex-col h-[100dvh] overflow-hidden border-r border-[#141414] shrink-0",
        "w-[min(18rem,88vw)] lg:static lg:w-72 lg:translate-x-0",
        "transition-transform duration-300 ease-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
      style={{ backgroundColor: brand.colors.sidebar }}
    >
      {workflowSteps.length > 0 && (
        <div className="absolute left-0 top-0 w-0.5 h-full bg-[#141414] z-0">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${progress}%` }}
            className="w-full shadow-[0_0_15px_rgba(212,175,55,0.4)]"
            style={{ backgroundColor: brand.colors.primary }}
            transition={{ duration: 1, ease: "circOut" }}
          />
        </div>
      )}

      <div className="flex flex-col p-4 sm:p-6 gap-6 sm:gap-10 relative z-10 h-full">
        <div className="flex items-start justify-between gap-2">
          <Link href="/dashboard" className="min-w-0 flex-1" onClick={handleNavClick}>
            <BrandLogo size="sm" />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onMobileClose}
            className="lg:hidden flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border-dim text-text-muted hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 w-full flex-1 overflow-y-auto no-scrollbar pb-6">
          <div className="flex flex-col gap-2 mb-4 sm:mb-6">
            <span className="text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-[#475569] uppercase px-3 sm:px-5 mb-2">
              Navigation
            </span>
            {renderNavLink(homeNav)}
            {workflowSteps.length > 0 && (
              <>
                <span className="text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-[#475569] uppercase px-3 sm:px-5 mt-4 mb-2">
                  Workflow
                </span>
                {workflowSteps.map((step) => renderNavLink(step))}
              </>
            )}
            {coreResourceNav.length > 0 && (
              <>
                <span className="text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-[#475569] uppercase px-3 sm:px-5 mt-4 mb-2">
                  Resources
                </span>
                {coreResourceNav.map((step) => renderNavLink(step))}
              </>
            )}
            {resourceNav.length > 0 && (
              <>
                <span className="text-[10px] font-black tracking-[0.25em] sm:tracking-[0.3em] text-[#475569] uppercase px-3 sm:px-5 mt-4 mb-2">
                  More Training
                </span>
                {resourceNav.map((step) => renderNavLink(step))}
              </>
            )}
          </div>

          <SidebarPromos />

          {upgradeNav.length > 0 && (
            <div className="flex flex-col mx-1 sm:mx-2 mt-4">
              <div className="bg-[#0A0A0B] border border-accent/20 rounded-[14px] p-3 sm:p-4 flex flex-col gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
                <div className="flex items-center gap-2 mb-1 px-1">
                  <Sparkles className="text-accent shrink-0" size={16} strokeWidth={2} />
                  <span className="text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.15em] text-accent uppercase">
                    {premiumSectionLabel}
                  </span>
                </div>
                {upgradeNav.map((step) => {
                  const isActive = pathname === step.path;
                  const Icon = getNavIcon(step.icon);
                  return (
                    <Link
                      key={step.path}
                      href={step.path}
                      onClick={handleNavClick}
                      className={clsx(
                        "flex items-center justify-center gap-2 sm:gap-3 py-3 sm:py-3.5 rounded-full transition-all duration-300 border text-center",
                        isActive
                          ? "bg-accent/10 border-accent/40 text-accent"
                          : "bg-[#111111] border-white/5 text-text-muted hover:border-white/10 hover:text-white"
                      )}
                    >
                      <Icon size={16} strokeWidth={1.5} className="shrink-0" />
                      <span className="text-[13px] sm:text-[14px] font-medium tracking-wide leading-tight">
                        {step.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 mt-auto pt-4 sm:pt-6">
            {isFeatureEnabled("dopamine") && <LiveActivityTicker />}
            <button
              type="button"
              onClick={handleLogout}
              className="command-nav-link group py-3 sm:py-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <LogOut size={18} className="shrink-0" />
                <span className="brand-font tracking-wide text-sm font-medium">Logout</span>
              </div>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
