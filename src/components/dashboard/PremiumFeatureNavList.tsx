"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES, PREMIUM_SECTION_LABEL } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";

interface PremiumFeatureNavListProps {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function PremiumFeatureNavList({
  collapsed = false,
  mobile = false,
  onNavigate,
  className,
}: PremiumFeatureNavListProps) {
  const pathname = usePathname();

  if (PREMIUM_FEATURES.length === 0) return null;

  if (mobile) {
    return (
      <div className={clsx("premium-upgrades-panel p-3", className)}>
        <div className="premium-upgrades-sidebar-header mb-2">
          <p className="premium-upgrades-sidebar-label text-[10px]">
            <Sparkles className="h-3 w-3 shrink-0" fill="currentColor" />
            {PREMIUM_SECTION_LABEL}
          </p>
        </div>
        <ul className="space-y-1">
          {PREMIUM_FEATURES.map((item) => {
            const isActive = isNavPathActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={clsx(
                    "premium-sidebar-item flex min-h-[48px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                    isActive ? "is-active text-text-heading" : "text-text-secondary"
                  )}
                >
                  <span className="premium-upgrade-icon premium-upgrade-icon--sidebar">
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div className={clsx("premium-upgrades-panel", collapsed ? "mt-4 p-2" : "mt-6 p-2.5", className)}>
      {!collapsed && (
        <div className="premium-upgrades-sidebar-header mb-2">
          <p className="premium-upgrades-sidebar-label text-[10px]">
            <Sparkles className="h-3 w-3 shrink-0" fill="currentColor" />
            {PREMIUM_SECTION_LABEL}
          </p>
        </div>
      )}
      <ul className="space-y-1">
        {PREMIUM_FEATURES.map((item) => {
          const isActive = isNavPathActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "premium-sidebar-item flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200",
                  collapsed ? "justify-center px-0" : "px-2.5",
                  isActive ? "is-active text-text-heading" : "text-text-secondary"
                )}
              >
                <span className={clsx("premium-upgrade-icon", collapsed ? "h-8 w-8 rounded-full" : "premium-upgrade-icon--sidebar")}>
                  <Icon
                    className={clsx(collapsed ? "h-4 w-4" : "h-3.5 w-3.5")}
                    strokeWidth={1.75}
                  />
                </span>
                {!collapsed && <span className="tracking-wide">{item.label}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
