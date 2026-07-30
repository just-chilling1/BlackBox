"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { dashboardContent } from "@/config/dashboard.config";

const MONEY_PATTERN = /(\$[\d,]+(?:-\$[\d,]+)?|\$[\d,]+,\s*\$[\d,]+,\s*or even \$[\d,]+)/g;

function emphasizeAmounts(text: string) {
  return text.split(MONEY_PATTERN).map((part, index) =>
    part.startsWith("$") ? (
      <span key={`${part}-${index}`} className="font-semibold text-text-heading">
        {part}
      </span>
    ) : (
      part
    )
  );
}

function formatParagraph(text: string) {
  const bestPartPrefix = "The best part? ";
  if (text.startsWith(bestPartPrefix)) {
    return (
      <>
        The best part?{" "}
        <span className="font-semibold text-text-heading">
          {text.slice(bestPartPrefix.length)}
        </span>
      </>
    );
  }

  return emphasizeAmounts(text);
}

export function DashboardBonusAdCard() {
  const ad = dashboardContent.bonusAd;

  return (
    <div className="glass-card overflow-hidden">
      <div className="space-y-5 p-5">
        <div className="space-y-4 text-sm leading-relaxed text-text-secondary md:text-[15px]">
          {ad.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{formatParagraph(paragraph)}</p>
          ))}

          <p className="flex items-start gap-2 font-semibold text-text-heading">
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            <span>{ad.highlight}</span>
            <Flame className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
          </p>

          <p>{emphasizeAmounts(ad.closing)}</p>
        </div>

        <div className="flex justify-center">
          <Link
            href={ad.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-xl items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-center text-sm font-bold text-black shadow-lg transition-all hover:brightness-110 sm:w-auto"
          >
            {ad.ctaLabel}
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  );
}
