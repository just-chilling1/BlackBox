"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
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
        "premium-nav-section w-full",
        isFeatured ? "p-3 md:p-4" : "p-2.5 md:p-3",
        className
      )}
    >
      <div className={clsx("px-1 pb-2.5 pt-1.5", isFeatured && "text-center md:text-left")}>
        <p
          className={clsx(
            "flex items-center gap-1.5 font-bold uppercase tracking-widest text-accent",
            isSidebar ? "text-[10px]" : "justify-center text-xs md:justify-start"
          )}
        >
          <Sparkles
            className={clsx("animate-premium-pulse shrink-0", isSidebar ? "h-3 w-3" : "h-4 w-4")}
            fill="currentColor"
          />
          Premium Upgrades
        </p>
        {!collapsed && (
          <p
            className={clsx(
              "mt-1 leading-relaxed text-text-secondary",
              isSidebar ? "text-[11px]" : "mx-auto max-w-2xl text-sm md:mx-0"
            )}
          >
            Unlock the tools that drive the biggest results.
          </p>
        )}
      </div>

      <div
        className={clsx(
          "grid gap-2",
          isFeatured ? "sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4" : "grid-cols-2"
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
                  "premium-upgrade-card group h-full flex-col items-start gap-2",
                  isSidebar ? "p-2.5" : "gap-3 p-4",
                  isActive && "is-active"
                )}
              >
                <div className="flex w-full items-start gap-2">
                  <div
                    className={clsx(
                      "flex shrink-0 items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300",
                      isSidebar ? "h-8 w-8" : "h-10 w-10",
                      isActive
                        ? "from-accent to-indigo-600 text-white shadow-[0_0_12px_rgba(238,179,16,0.35)]"
                        : "from-accent/20 to-indigo-600/15 text-accent group-hover:from-accent group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-[0_0_12px_rgba(238,179,16,0.35)]"
                    )}
                  >
                    <Icon size={isSidebar ? 15 : 19} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block font-bold tracking-wide text-text-heading",
                        isSidebar ? "text-[11px] leading-tight" : "text-sm"
                      )}
                    >
                      {feature.label}
                    </span>
                    <p
                      className={clsx(
                        "mt-0.5 line-clamp-2 leading-snug text-text-muted",
                        isSidebar ? "text-[10px]" : "text-xs"
                      )}
                    >
                      {feature.description}
                    </p>
                  </div>
                </div>

                <span
                  className={clsx(
                    "inline-flex items-center gap-0.5 font-semibold transition-colors",
                    isSidebar ? "text-[10px]" : "text-xs",
                    isActive ? "text-accent" : "text-text-muted group-hover:text-accent"
                  )}
                >
                  Explore
                  <ArrowRight
                    size={isSidebar ? 10 : 12}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
