"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES } from "@/lib/premium-features";

type PremiumUpgradesWidgetProps = {
  layout?: "sidebar" | "featured";
};

export function PremiumUpgradesWidget({ layout = "featured" }: PremiumUpgradesWidgetProps) {
  const pathname = usePathname();
  const isFeatured = layout === "featured";

  if (PREMIUM_FEATURES.length === 0) return null;

  return (
    <div className={clsx("premium-nav-section", isFeatured ? "p-3 md:p-4" : "p-2")}>
      <div className={clsx("px-3 pb-3 pt-2.5", isFeatured && "text-center md:text-left")}>
        <p className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-accent md:justify-start">
          <Sparkles className="h-4 w-4 animate-premium-pulse" fill="currentColor" />
          Premium Upgrades
        </p>
        <p className="mx-auto mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-400 md:mx-0">
          Unlock the tools that drive the biggest results.
        </p>
      </div>

      <div
        className={clsx(
          "gap-2",
          isFeatured ? "grid sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4" : "space-y-2"
        )}
      >
        {PREMIUM_FEATURES.map((feature, index) => {
          const isActive = pathname === feature.href;
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
                className={clsx(
                  "premium-upgrade-card group h-full",
                  isFeatured && "flex-col items-start gap-3 p-4",
                  isActive && "is-active"
                )}
              >
                <div className="flex w-full items-start gap-3">
                  <div
                    className={clsx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br transition-all duration-300",
                      isActive
                        ? "from-accent to-indigo-600 text-white shadow-[0_0_16px_rgba(238,179,16,0.45)]"
                        : "from-accent/25 to-indigo-600/20 text-accent group-hover:from-accent group-hover:to-indigo-600 group-hover:text-white group-hover:shadow-[0_0_16px_rgba(238,179,16,0.45)]"
                    )}
                  >
                    <Icon size={19} strokeWidth={1.5} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={clsx(
                        "block text-sm font-bold tracking-wide",
                        isActive ? "text-white" : "text-gray-100 group-hover:text-white"
                      )}
                    >
                      {feature.label}
                    </span>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
                      {feature.description}
                    </p>
                  </div>

                  {!isFeatured && (
                    <span
                      className={clsx(
                        "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                        isActive
                          ? "bg-accent/30 text-white"
                          : "bg-white/5 text-gray-500 group-hover:translate-x-0.5 group-hover:bg-accent/30 group-hover:text-white"
                      )}
                    >
                      <ArrowRight size={14} />
                    </span>
                  )}
                </div>

                {isFeatured && (
                  <span
                    className={clsx(
                      "inline-flex items-center gap-1 text-xs font-semibold transition-colors",
                      isActive ? "text-accent" : "text-gray-500 group-hover:text-accent"
                    )}
                  >
                    Explore
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
