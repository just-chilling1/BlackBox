"use client";

import { getNavIcon } from "@/lib/nav-icons";
import { brand } from "@/config/brand.config";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  /** Hide tagline and use smaller title on narrow headers */
  compact?: boolean;
}

const SIZES = {
  sm: {
    box: "w-9 h-9 sm:w-10 sm:h-10",
    icon: 20,
    title: "text-base sm:text-[18px] lg:text-[22px]",
    tagline: "text-[9px] sm:text-[10px]",
  },
  md: {
    box: "w-10 h-10 sm:w-12 sm:h-12",
    icon: 22,
    title: "text-lg sm:text-[22px]",
    tagline: "text-[10px]",
  },
  lg: {
    box: "w-14 h-14 sm:w-16 sm:h-16",
    icon: 28,
    title: "text-xl sm:text-[28px] lg:text-[32px]",
    tagline: "text-xs sm:text-sm",
  },
};

export function BrandLogo({ size = "sm", showTagline = true, compact = false }: BrandLogoProps) {
  const s = SIZES[size];
  const Icon = getNavIcon(brand.logo.icon);

  return (
    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
      <div
        className={`${s.box} bg-accent flex items-center justify-center rounded-lg shadow-gold shrink-0`}
      >
        <Icon size={s.icon} className="text-black" />
      </div>
      <div className="flex flex-col min-w-0">
        <span
          className={`brand-font ${compact ? "text-sm sm:text-base" : s.title} text-text-primary tracking-tight leading-tight truncate`}
        >
          {brand.productName}
        </span>
        {showTagline && !compact && (
          <span className={`${s.tagline} font-bold text-text-muted mt-0.5 sm:mt-1 truncate`}>
            {brand.tagline}
          </span>
        )}
      </div>
    </div>
  );
}
