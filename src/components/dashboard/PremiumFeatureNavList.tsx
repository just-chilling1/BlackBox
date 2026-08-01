"use client";

import { WarmNavLink } from "@/components/layout/WarmNavLink";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { PREMIUM_FEATURES, PREMIUM_SECTION_LABEL } from "@/lib/premium-features";
import { isNavPathActive } from "@/lib/nav-active";

interface PremiumFeatureNavListProps {
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
  className?: string;
  highlighted?: boolean;
}

export function PremiumFeatureNavList({
  collapsed = false,
  mobile = false,
  onNavigate,
  className,
  highlighted = false,
}: PremiumFeatureNavListProps) {
  const pathname = usePathname();

  if (PREMIUM_FEATURES.length === 0) return null;

  const itemClass = (isActive: boolean) =>
    clsx(
      "premium-sidebar-item flex items-center gap-3 rounded-md font-normal transition-[background-color,border-color,box-shadow,color] duration-[160ms]",
      mobile
        ? "min-h-[52px] px-4 py-3 text-[15px]"
        : "min-h-[44px] py-3 text-[15px]",
      collapsed && !mobile ? "justify-center px-0" : mobile ? "" : "px-3",
      isActive && "is-active"
    );

  return (
    <div
      className={clsx(
        "premium-nav-section",
        highlighted && "premium-nav-section--highlighted",
        mobile ? "p-2" : collapsed ? "mt-4 p-1" : "mt-6 p-2",
        className
      )}
    >
      {!collapsed && (
        <p
          className={clsx(
            "premium-nav-section-label flex items-center gap-1.5 px-2.5 pb-2 pt-1.5",
            highlighted && "premium-nav-section-label--animated",
            mobile && "mb-0 px-2 pt-1"
          )}
        >
          <Sparkles
            className={clsx(
              "shrink-0 text-brass-300",
              highlighted && "premium-nav-sparkle",
              mobile ? "h-3.5 w-3.5" : "h-3.5 w-3.5"
            )}
            strokeWidth={1.75}
          />
          {PREMIUM_SECTION_LABEL}
        </p>
      )}

      <ul className={mobile ? "space-y-1.5" : "space-y-1"}>
        {PREMIUM_FEATURES.map((item, index) => {
          const isActive = isNavPathActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <motion.li
              key={item.href}
              initial={{ opacity: 0, x: mobile ? 0 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
            >
              <WarmNavLink
                href={item.href}
                onClick={onNavigate}
                title={collapsed && !mobile ? item.label : undefined}
                className={itemClass(isActive)}
              >
                <Icon
                  className={clsx(
                    "shrink-0 text-brass-300",
                    mobile ? "h-5 w-5" : "h-[18px] w-[18px]"
                  )}
                  strokeWidth={1.75}
                />
                {!collapsed && <span className="tracking-normal">{item.label}</span>}
              </WarmNavLink>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
