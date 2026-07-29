"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";
import { sidebarSectionLabelClass } from "@/components/layout/sidebar-nav-styles";

type PremiumUpgradesWidgetProps = {
  layout?: "sidebar" | "featured";
  collapsed?: boolean;
  onNavigate?: () => void;
  className?: string;
};

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
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
                isActive
                  ? "border-accent/50 bg-accent/15 text-accent shadow-sm"
                  : "border-border-dim bg-white text-accent/80 hover:border-accent/35 hover:bg-accent/10"
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
      <div className={clsx("premium-nav-section p-2", className)}>
        {!collapsed && (
          <div className="px-3 pb-2 pt-2.5">
            <p className={clsx(sidebarSectionLabelClass, "flex items-center gap-2 px-0 pt-0 pb-0 first:pt-0")}>
              <Sparkles className="h-3.5 w-3.5 animate-premium-pulse shrink-0 text-accent" fill="currentColor" />
              Premium Upgrades
            </p>
          </div>
        )}

        <div className="space-y-2">
          {PREMIUM_FEATURES.map((feature, index) => {
            const isActive = isNavPathActive(pathname, feature.href);
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="min-w-0"
              >
                <Link
                  href={feature.href}
                  onClick={onNavigate}
                  className={clsx("premium-upgrade-card group h-full", isActive && "is-active")}
                >
                  <div className="flex w-full items-center gap-3">
                    <div
                      className={clsx(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300",
                        isActive
                          ? "from-accent to-indigo-600 text-white shadow-[0_0_12px_rgba(238,179,16,0.35)]"
                          : "from-slate-100 to-slate-50 text-slate-400 group-hover:from-accent group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-[0_0_12px_rgba(238,179,16,0.35)]"
                      )}
                    >
                      <Icon size={19} strokeWidth={1.5} />
                    </div>

                    <span
                      className={clsx(
                        "min-w-0 flex-1 text-sm tracking-wide",
                        isActive ? "font-bold text-text-heading" : "font-semibold text-text-secondary"
                      )}
                    >
                      {feature.label}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("premium-nav-section p-3 md:p-4", className)}>
      <div className="px-3 pb-3 pt-2.5 text-center md:text-left">
        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-accent md:justify-start">
          <Sparkles className="h-4 w-4 animate-premium-pulse shrink-0" fill="currentColor" />
          Premium Upgrades
        </p>
        <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-text-secondary md:mx-0">
          Unlock the tools that drive the biggest results.
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4">
        {PREMIUM_FEATURES.map((feature, index) => {
          const isActive = isNavPathActive(pathname, feature.href);
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
              className="min-w-0"
            >
              <Link
                href={feature.href}
                onClick={onNavigate}
                className={clsx(
                  "premium-upgrade-card group flex h-full flex-col items-start gap-3 p-4",
                  isActive && "is-active"
                )}
              >
                <div className="flex w-full items-start gap-3">
                  <div
                    className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300",
                      isActive
                        ? "from-accent to-indigo-600 text-white shadow-[0_0_16px_rgba(238,179,16,0.35)]"
                        : "from-slate-100 to-slate-50 text-slate-400 group-hover:from-accent group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(238,179,16,0.35)]"
                    )}
                  >
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block text-sm tracking-wide",
                        isActive ? "font-bold text-text-heading" : "font-semibold text-text-secondary"
                      )}
                    >
                      {feature.label}
                    </span>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <span
                  className={clsx(
                    "inline-flex items-center gap-1 text-xs font-semibold transition-colors",
                    isActive ? "text-accent-readable" : "text-text-muted group-hover:text-accent"
                  )}
                >
                  {isActive ? (
                    "Active"
                  ) : (
                    <>
                      Explore
                      <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
