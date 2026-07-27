"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
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
      <div className={clsx("premium-nav-section p-2", className)}>
        <p className="flex items-center gap-1.5 px-2.5 pb-2 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-accent">
          <Sparkles className="h-3 w-3 animate-premium-pulse" fill="currentColor" />
          {PREMIUM_SECTION_LABEL}
        </p>
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
                    "premium-sidebar-item flex min-h-[52px] items-center gap-3 rounded-xl px-4 py-3 text-base font-medium",
                    isActive ? "is-active text-white" : "text-gray-300"
                  )}
                >
                  <Icon className={clsx("h-5 w-5 shrink-0", isActive ? "text-accent" : "text-accent/80")} />
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
    <div className={clsx("premium-nav-section", collapsed ? "mt-4 p-1" : "mt-6 p-2", className)}>
      {!collapsed && (
        <p className="flex items-center gap-1.5 px-2.5 pb-2 pt-1.5 text-[10px] font-bold uppercase tracking-widest text-accent">
          <Sparkles className="h-3 w-3 animate-premium-pulse" fill="currentColor" />
          {PREMIUM_SECTION_LABEL}
        </p>
      )}
      <ul className="space-y-1">
        {PREMIUM_FEATURES.map((item, index) => {
          const isActive = isNavPathActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "premium-sidebar-item flex items-center gap-3 rounded-xl py-3 text-sm font-medium transition-all duration-300",
                  collapsed ? "justify-center px-0" : "px-3",
                  isActive ? "is-active text-white" : "text-gray-300"
                )}
              >
                <Icon
                  className={clsx("h-[18px] w-[18px] shrink-0", isActive ? "text-accent" : "text-accent/80")}
                  strokeWidth={1.5}
                />
                {!collapsed && <span className="tracking-wide">{item.label}</span>}
                {!collapsed && isActive && (
                  <motion.div
                    layoutId="activePremiumIndicator"
                    className="ml-auto h-1.5 w-1.5 rounded-full bg-accent"
                    style={{ boxShadow: "0 0 10px rgba(238, 179, 16, 0.7)" }}
                  />
                )}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
