"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";

type PremiumUpgradesWidgetProps = {
  onNavigate?: () => void;
  className?: string;
  variant?: "featured" | "sidebar";
};

export function PremiumUpgradesWidget({
  onNavigate,
  className,
  variant = "featured",
}: PremiumUpgradesWidgetProps) {
  const pathname = usePathname();

  if (PREMIUM_FEATURES.length === 0) return null;

  if (variant === "sidebar") {
    return (
      <div className={clsx("premium-upgrades-panel premium-upgrades-panel--sidebar min-w-0 w-full", className)}>
        <div className="premium-upgrades-sidebar-header">
          <p className="premium-upgrades-sidebar-label text-[10px]">
            <Sparkles className="h-3 w-3 shrink-0 animate-premium-pulse" fill="currentColor" />
            Premium Features
          </p>
          <p className="text-xs leading-relaxed text-text-secondary">
            Unlock the tools that drive the biggest results.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {PREMIUM_FEATURES.map((feature, index) => {
            const isActive = isNavPathActive(pathname, feature.href);
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + index * 0.05, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              >
                <Link
                  href={feature.href}
                  onClick={onNavigate}
                  className={clsx(
                    "premium-upgrade-card premium-upgrade-card--sidebar group !min-h-0 flex-row items-center gap-2.5 !p-2.5",
                    isActive && "is-active"
                  )}
                >
                  <div
                    className={clsx(
                      "premium-upgrade-icon premium-upgrade-icon--sidebar flex shrink-0 items-center justify-center",
                      isActive && "bg-amber-100 text-amber-700"
                    )}
                  >
                    <Icon size={14} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block text-xs tracking-wide text-text-heading",
                        isActive ? "font-bold" : "font-semibold"
                      )}
                    >
                      {feature.label}
                    </span>
                    <p className="mt-0.5 line-clamp-1 text-[10px] leading-snug text-text-secondary">
                      {feature.description}
                    </p>
                  </div>

                  <span className="shrink-0 text-accent-readable">
                    {isActive ? (
                      <span className="text-[10px] font-semibold">Active</span>
                    ) : (
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
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

  return (
    <div className={clsx("premium-upgrades-panel premium-upgrades-panel--featured", className)}>
      <div className="mb-4 text-center md:text-left">
        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-readable md:justify-start">
          <Sparkles className="h-4 w-4 shrink-0 text-amber-600" fill="currentColor" />
          Premium Features
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
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300",
                      isActive
                        ? "border-amber-300 bg-accent text-black shadow-[0_0_16px_rgba(238,179,16,0.35)]"
                        : "border-amber-200 bg-amber-50 text-amber-700 group-hover:border-amber-300 group-hover:bg-accent group-hover:text-black group-hover:shadow-[0_0_16px_rgba(238,179,16,0.35)]"
                    )}
                  >
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block text-sm tracking-wide text-text-heading",
                        isActive ? "font-bold" : "font-semibold"
                      )}
                    >
                      {feature.label}
                    </span>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent-readable transition-colors group-hover:text-amber-700">
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
