"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { dashboardContent } from "@/config/dashboard.config";
import { DashboardSection } from "./DashboardSection";

export function DashboardBonusAdCard() {
  const ad = dashboardContent.bonusAd;

  return (
    <DashboardSection className="overflow-hidden">
      <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
        {ad.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}

        <p className="flex items-start gap-2 font-semibold text-text-heading">
          <Flame className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          <span>{ad.highlight}</span>
          <Flame className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        </p>

        <p>{ad.closing}</p>
      </div>

      <div className="mt-5 flex justify-center sm:justify-start">
        <Link
          href={ad.ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full sm:w-auto"
        >
          {ad.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </DashboardSection>
  );
}
