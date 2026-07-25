"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PREMIUM_FEATURES } from "@/lib/premium-features";

export function PremiumUpgradesWidget() {
  const pathname = usePathname();

  if (PREMIUM_FEATURES.length === 0) return null;

  return (
    <div className="premium-nav-section p-2">
      <div className="px-3 pb-3 pt-2.5">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-accent">
          <Sparkles className="h-4 w-4 animate-sparkle-pulse" fill="currentColor" />
          Premium Upgrades
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
          Unlock the tools that drive the biggest results.
        </p>
      </div>

      <div className="space-y-2">
        {PREMIUM_FEATURES.map((feature, index) => {
          const isActive = pathname === feature.href;
          const Icon = feature.icon;

          return (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href={feature.href}
                className={`premium-upgrade-card group ${isActive ? "is-active" : ""}`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br transition-all duration-300 ${
                    isActive
                      ? "from-accent to-accent-muted text-white shadow-[0_0_16px_rgba(234,179,8,0.45)]"
                      : "from-accent/25 to-accent-muted/20 text-accent group-hover:from-accent group-hover:to-accent-muted group-hover:text-white"
                  }`}
                >
                  <Icon size={19} strokeWidth={1.5} />
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={`block text-sm font-bold tracking-wide ${
                      isActive ? "text-white" : "text-text-primary group-hover:text-white"
                    }`}
                  >
                    {feature.label}
                  </span>
                  <p className="mt-0.5 text-xs leading-relaxed text-text-muted">{feature.description}</p>
                </div>

                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-accent/30 text-white"
                      : "bg-white/5 text-text-muted group-hover:bg-accent/30 group-hover:text-white"
                  }`}
                >
                  <ArrowRight size={14} />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
