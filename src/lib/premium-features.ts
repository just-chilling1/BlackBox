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
  "/accelerator": "200 pre-made money pages — clone one, then generate pins.",
  "/dfy-profit": "One click: money page plus 10 Pinterest traffic assets.",
  "/social-payouts": "Extra Pinterest pin batches for a live money page.",
  "/autopilot": "Pinterest posting playbook tied to your live money page.",
  "/recurring-wealth": "Authority article sections that strengthen a money page.",
  "/protector": "Real account status — email, session, and recent activity.",
  "/account#license": "Request reseller license rights — our team activates the edition.",
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
