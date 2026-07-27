"use client";

import { PremiumFeatureNavList } from "@/components/dashboard/PremiumFeatureNavList";
import { PREMIUM_FEATURES } from "@/lib/premium-features";

export function PremiumUpgradesWidget() {
  if (PREMIUM_FEATURES.length === 0) return null;

  return (
    <div className="w-full">
      <PremiumFeatureNavList />
    </div>
  );
}
