"use client";

import { Shield, Headphones, Star } from "lucide-react";
import { dopamineContent } from "@/config/dopamine.config";

const ICONS = { Shield, Headphones, Star } as const;

/**
 * Reference: horizontal trust / credibility strip for dashboard or landing sections.
 * Copy and stats live in dopamine.config.ts — rebrand per product.
 */
export function TrustBar() {
  const { items } = dopamineContent.trustBar;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 py-4 px-2 border border-border-dim/30 rounded-xl bg-[#0c0c0e]">
      {items.map((item) => {
        const Icon = ICONS[item.icon as keyof typeof ICONS] ?? Star;
        return (
          <div key={item.label} className="flex items-center gap-2 text-text-secondary text-xs font-semibold">
            <Icon size={14} className="text-accent shrink-0" />
            <span>{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
