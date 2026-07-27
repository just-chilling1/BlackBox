"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";

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

  return (
    <div
      className={clsx(
        "premium-nav-section",
        isFeatured ? "p-3 md:p-4" : "p-2",
        className
      )}
    >
      {!collapsed && (
        <div className={clsx("px-3 pb-2 pt-2.5", isFeatured && "text-center md:text-left")}>
          <p
            className={clsx(
              "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent",
              isFeatured ? "justify-center md:justify-start" : "justify-start"
            )}
          >
            <Sparkles className="h-4 w-4 animate-premium-pulse shrink-0" fill="currentColor" />
            Premium Upgrades
          </p>
        </div>
      )}

      <div
        className={clsx(
          "gap-2",
          isFeatured ? "grid sm:grid-cols-2 xl:grid-cols-4" : "space-y-2"
        )}
      >
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
                  "premium-upgrade-card group h-full",
                  isFeatured && "p-4",
                  isActive && "is-active"
                )}
              >
                <div className="flex w-full items-center gap-3">
                  <div
                    className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300",
                      isActive
                        ? "from-accent to-indigo-600 text-white shadow-[0_0_12px_rgba(238,179,16,0.35)]"
                        : "from-accent/20 to-indigo-600/15 text-accent group-hover:from-accent group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-[0_0_12px_rgba(238,179,16,0.35)]"
                    )}
                  >
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  <span
                    className={clsx(
                      "min-w-0 flex-1 text-sm font-bold tracking-wide text-text-heading",
                      isActive && "text-text-heading"
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
