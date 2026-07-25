import type { LucideIcon } from "lucide-react";
import { premiumNav, premiumSectionLabel } from "@/config/navigation.config";
import { getNavIcon } from "@/lib/nav-icons";
import { isFeatureEnabled } from "@/config/features.config";

export interface PremiumFeature {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const PREMIUM_SECTION_LABEL = premiumSectionLabel;

/** One-line descriptions keyed by route — shown in the dashboard Premium Upgrades widget. */
const PREMIUM_DESCRIPTIONS: Record<string, string> = {
  "/dfy": "Pre-made keywords, articles, images, and leads ready to use.",
  "/instant": "Ready-made social posts with images — copy and paste.",
  "/autopilot": "Curated traffic sources checklist with promotion URL tracking.",
  "/accelerator": "Build unlimited websites and ready-to-post content.",
  "/recurring-wealth": "Offers that pay you again every month.",
  "/social-payouts": "Ready-made Facebook posts that earn you money.",
  "/protector": "Keeps your account and earnings locked down.",
};

/**
 * Single source of truth for premium nav items.
 * Used by Sidebar, BottomNav, and PremiumUpgradesWidget.
 */
export const PREMIUM_FEATURES: PremiumFeature[] = premiumNav
  .filter((item) => !item.feature || isFeatureEnabled(item.feature))
  .map((item) => ({
    href: item.path,
    label: item.label,
    description: PREMIUM_DESCRIPTIONS[item.path] ?? "Unlock more with your membership.",
    icon: getNavIcon(item.icon),
  }));
