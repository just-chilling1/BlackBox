"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { dashboardContent } from "@/config/dashboard.config";
import { DashboardSection } from "./DashboardSection";

export function DashboardBonusAdCard() {
  const ad = dashboardContent.bonusAd;

  return (
    <DashboardSection className="overflow-hidden">
      <div className="space-y-3 text-sm leading-relaxed text-text-secondary sm:space-y-4">
        {ad.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}

        <div className="rounded-xl border border-accent/20 bg-accent/5 px-3.5 py-3 sm:px-4">
          <p className="flex items-start gap-2 font-semibold text-text-heading">
            <Flame className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <span>{ad.highlight}</span>
          </p>
        </div>

        <p>{ad.closing}</p>
      </div>

      <Link
        href={ad.ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary mt-5 w-full text-center text-sm leading-snug sm:text-base"
      >
        <span className="text-balance">{ad.ctaLabel}</span>
        <ArrowRight className="h-4 w-4 shrink-0" />
      </Link>
    </DashboardSection>
  );
}
