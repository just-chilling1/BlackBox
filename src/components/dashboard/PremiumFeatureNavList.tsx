"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { PREMIUM_FEATURES, PREMIUM_SECTION_LABEL } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";

interface PremiumFeatureNavListProps {
  /** Compact icon-only rows for collapsed sidebar */
  collapsed?: boolean;
  /** Larger tap targets for mobile sheet */
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

  return (
    <div className={clsx("premium-feature-panel", className)}>
      {!collapsed && (
        <p className="premium-feature-panel__header">
          <Sparkles className="premium-feature-panel__sparkle" fill="currentColor" />
          {PREMIUM_SECTION_LABEL}
        </p>
      )}

      <ul className="premium-feature-panel__list">
        {PREMIUM_FEATURES.map((item, index) => {
          const isActive = isNavPathActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + index * 0.04 }}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                className={clsx(
                  "premium-feature-btn",
                  mobile && "premium-feature-btn--mobile",
                  collapsed && "premium-feature-btn--collapsed",
                  isActive && "is-active"
                )}
              >
                <Icon className="premium-feature-btn__icon" strokeWidth={1.75} />
                {!collapsed && (
                  <span className="premium-feature-btn__label">{item.label}</span>
                )}
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
