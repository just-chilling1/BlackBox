"use client";

import { clsx } from "clsx";
import { getNavIcon } from "@/lib/nav-icons";
import { brand } from "@/config/brand.config";

interface BrandLogoProps {
  size?: "sm" | "md" | "sidebar" | "lg";
  showTagline?: boolean;
  compact?: boolean;
  splitTitle?: boolean;
  stacked?: boolean;
  className?: string;
}

const SIZES = {
  sm: {
    box: "w-10 h-10 sm:w-11 sm:h-11",
    icon: 20,
    imgHeight: "h-10 w-10 sm:h-11 sm:w-11",
    wordmarkHeight: "h-12 sm:h-14",
    wordmarkWidth: "",
    img: 44,
    title: "text-base sm:text-[18px]",
    tagline: "text-[13px]",
  },
  md: {
    box: "w-11 h-11 sm:w-12 sm:h-12",
    icon: 22,
    imgHeight: "h-11 w-11 sm:h-12 sm:w-12",
    wordmarkHeight: "h-14 sm:h-16",
    wordmarkWidth: "",
    img: 48,
    title: "text-lg sm:text-[22px]",
    tagline: "text-[13px]",
  },
  sidebar: {
    box: "w-12 h-12 sm:w-14 sm:h-14",
    icon: 24,
    imgHeight: "h-12 w-12 sm:h-14 sm:w-14",
    wordmarkHeight: "",
    wordmarkWidth: "w-full h-auto max-h-[5.5rem] object-contain object-left",
    img: 56,
    title: "text-lg sm:text-xl",
    tagline: "text-[13px]",
  },
  lg: {
    box: "w-14 h-14 sm:w-16 sm:h-16",
    icon: 28,
    imgHeight: "h-16 sm:h-20",
    wordmarkHeight: "h-16 sm:h-[5.25rem] md:h-24",
    wordmarkWidth: "",
    img: 80,
    title: "text-xl sm:text-[28px] lg:text-[32px]",
    tagline: "text-[13px] sm:text-[15px]",
  },
};

export function BrandLogo({
  size = "sm",
  showTagline = true,
  compact = false,
  splitTitle = false,
  stacked = false,
  className,
}: BrandLogoProps) {
  const s = SIZES[size];
  const Icon = getNavIcon(brand.logo.icon);
  const useImage = brand.logo.type === "image";
  const isWordmarkImage = useImage && brand.logo.wordmark;
  const imageSrc = useImage && compact && brand.logo.iconSrc ? brand.logo.iconSrc : brand.logo.src;

  return (
    <div
      className={clsx(
        "flex min-w-0",
        stacked ? "flex-col items-center gap-3 text-center" : "items-center",
        !stacked && (compact ? "justify-center" : "gap-2.5 sm:gap-4"),
        className
      )}
    >
      {useImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={brand.logo.alt}
          width={compact ? s.img : undefined}
          height={compact ? s.img : undefined}
          className={clsx(
            "object-contain shrink-0",
            compact
              ? clsx("w-auto", s.imgHeight)
              : isWordmarkImage && s.wordmarkWidth
                ? s.wordmarkWidth
                : clsx("w-auto", s.wordmarkHeight, isWordmarkImage ? "max-w-[min(100%,20rem)]" : "max-w-full")
          )}
          loading="eager"
          decoding="async"
        />
      ) : (
        <div
          className={`${s.box} bg-grad-brass flex items-center justify-center rounded-lg shadow-brass shrink-0`}
        >
          <Icon size={s.icon} className="text-black" />
        </div>
      )}
      {!compact && !isWordmarkImage && (
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
            <span className={`${s.tagline} font-medium text-text-muted mt-0.5 sm:mt-1 truncate`}>
              {brand.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
