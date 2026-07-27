"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";

type PremiumUpgradesWidgetProps = {
  layout?: "sidebar" | "featured";
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

function SidebarPremiumCard({
  feature,
  isActive,
  onNavigate,
}: {
  feature: (typeof PREMIUM_FEATURES)[number];
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = feature.icon;

  return (
    <Link
      href={feature.href}
      onClick={onNavigate}
      className={clsx("premium-upgrade-card premium-upgrade-card--sidebar group", isActive && "is-active")}
    >
      <div className="flex w-full items-start gap-2">
        <div className="premium-upgrade-icon premium-upgrade-icon--sidebar">
          <Icon size={13} strokeWidth={1.75} />
        </div>
        <span className="min-w-0 flex-1 text-[11px] font-bold leading-tight text-text-heading line-clamp-2">
          {feature.label}
        </span>
      </div>

      <p className="w-full text-[10px] leading-snug text-text-muted line-clamp-2">{feature.description}</p>

      <span
        className={clsx(
          "mt-auto inline-flex items-center gap-0.5 text-[10px] font-semibold transition-colors",
          isActive ? "text-amber-600" : "text-text-muted group-hover:text-amber-600"
        )}
      >
        Explore
        <ArrowRight size={10} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function FeaturedPremiumCard({
  feature,
  isActive,
  onNavigate,
}: {
  feature: (typeof PREMIUM_FEATURES)[number];
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const Icon = feature.icon;

  return (
    <Link
      href={feature.href}
      onClick={onNavigate}
      className={clsx("premium-upgrade-card group p-4", isActive && "is-active")}
    >
      <div className="flex w-full items-start gap-2.5">
        <div className="premium-upgrade-icon h-10 w-10">
          <Icon size={18} strokeWidth={1.75} />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-sm font-bold text-text-heading">{feature.label}</span>
        </div>
      </div>

      <p className="text-xs leading-snug text-text-muted line-clamp-2">{feature.description}</p>

      <span
        className={clsx(
          "mt-auto inline-flex items-center gap-0.5 text-xs font-semibold transition-colors",
          isActive ? "text-amber-600" : "text-text-muted group-hover:text-amber-600"
        )}
      >
        Explore
        <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

export function PremiumUpgradesWidget({
  layout = "featured",
  collapsed = false,
  onNavigate,
  className,
}: PremiumUpgradesWidgetProps) {
  const pathname = usePathname();
  const isSidebar = layout === "sidebar";
  const isFeatured = layout === "featured";

  if (PREMIUM_FEATURES.length === 0) return null;

  if (isSidebar && collapsed) {
    return (
      <div className={clsx("flex flex-col items-center gap-1.5 py-2", className)}>
        {PREMIUM_FEATURES.map((feature) => {
          const isActive = isNavPathActive(pathname, feature.href);
          const Icon = feature.icon;

          return (
            <Link
              key={feature.href}
              href={feature.href}
              onClick={onNavigate}
              title={feature.label}
              className={clsx(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200",
                isActive
                  ? "border-amber-300 bg-amber-50 text-amber-600"
                  : "border-slate-200 bg-white text-amber-500 hover:border-amber-200 hover:bg-amber-50"
              )}
            >
              <Icon size={18} strokeWidth={1.5} />
            </Link>
          );
        })}
      </div>
    );
  }

  if (isSidebar) {
    return (
      <div className={clsx("premium-upgrades-panel premium-upgrades-panel--sidebar w-full", className)}>
        <div className="premium-upgrades-sidebar-header">
          <p className="premium-upgrades-sidebar-label text-[10px]">
            <Sparkles className="h-3 w-3 shrink-0" fill="currentColor" />
            Premium Upgrades
          </p>
          <p className="text-[11px] leading-relaxed text-text-secondary">
            Unlock the tools that drive the biggest results.
          </p>
        </div>

        <div className="premium-upgrades-sidebar-grid">
          {PREMIUM_FEATURES.map((feature) => (
            <SidebarPremiumCard
              key={feature.href}
              feature={feature}
              isActive={isNavPathActive(pathname, feature.href)}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("premium-upgrades-panel premium-upgrades-panel--featured", className)}>
      <div className="mb-4 flex items-start gap-3">
        <div className="premium-upgrades-header-icon">
          <Sparkles className="h-5 w-5" fill="currentColor" />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold tracking-tight text-text-heading sm:text-xl">Premium Upgrades</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Unlock the tools that drive the biggest results.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {PREMIUM_FEATURES.map((feature) => (
          <FeaturedPremiumCard
            key={feature.href}
            feature={feature}
            isActive={isNavPathActive(pathname, feature.href)}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
