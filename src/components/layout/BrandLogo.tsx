"use client";

import { clsx } from "clsx";
import { getNavIcon } from "@/lib/nav-icons";
import { brand } from "@/config/brand.config";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  compact?: boolean;
  splitTitle?: boolean;
  stacked?: boolean;
}

const SIZES = {
  sm: {
    box: "w-9 h-9 sm:w-10 sm:h-10",
    icon: 20,
    imgHeight: "h-9 sm:h-10",
    img: 40,
    title: "text-base sm:text-[18px] lg:text-[22px]",
    tagline: "text-[9px] sm:text-[10px]",
  },
  md: {
    box: "w-10 h-10 sm:w-12 sm:h-12",
    icon: 22,
    imgHeight: "h-10 sm:h-12",
    img: 48,
    title: "text-lg sm:text-[22px]",
    tagline: "text-[10px]",
  },
  lg: {
    box: "w-14 h-14 sm:w-16 sm:h-16",
    icon: 28,
    imgHeight: "h-16 sm:h-20",
    img: 80,
    title: "text-xl sm:text-[28px] lg:text-[32px]",
    tagline: "text-xs sm:text-sm",
  },
};

export function BrandLogo({
  size = "sm",
  showTagline = true,
  compact = false,
  splitTitle = false,
  stacked = false,
}: BrandLogoProps) {
  const s = SIZES[size];
  const Icon = getNavIcon(brand.logo.icon);
  const useImage = brand.logo.type === "image";

  return (
    <div
      className={clsx(
        "flex min-w-0",
        stacked ? "flex-col items-center gap-3 text-center" : "items-center",
        !stacked && (compact ? "justify-center" : "gap-2.5 sm:gap-4")
      )}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={brand.logo.src}
          alt={brand.logo.alt}
          width={s.img}
          height={s.img}
          className={`${s.imgHeight} w-auto max-w-none object-contain shrink-0`}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div
          className={`${s.box} bg-accent flex items-center justify-center rounded-lg shadow-gold shrink-0`}
        >
          <Icon size={s.icon} className="text-black" />
        </div>
      )}
      {!compact && (
        <div className={clsx("flex flex-col min-w-0", stacked && "items-center")}>
          <span
            className={clsx(
              "brand-font text-text-primary tracking-tight leading-tight truncate",
              splitTitle ? s.title : compact ? "text-sm sm:text-base" : s.title
            )}
          >
            {brand.productName}
          </span>
          {showTagline && (
            <span className={`${s.tagline} font-bold text-text-muted mt-0.5 sm:mt-1 truncate`}>
              {brand.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
