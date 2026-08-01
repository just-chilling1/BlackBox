"use client";

import { ExternalLink, PlayCircle } from "lucide-react";
import { clsx } from "clsx";
import type { ExclusiveOffer } from "@/config/offers.config";

interface ExclusiveOffersNavSectionProps {
  offers: ExclusiveOffer[];
  collapsed?: boolean;
  mobile?: boolean;
  className?: string;
}

export function ExclusiveOffersNavSection({
  offers,
  collapsed = false,
  mobile = false,
  className,
}: ExclusiveOffersNavSectionProps) {
  if (offers.length === 0 || collapsed) return null;

  return (
    <div
      className={clsx(
        "exclusive-offers-nav-section",
        mobile ? "p-2" : "mt-4 p-3",
        className
      )}
    >
      <p className="exclusive-offers-nav-section-label px-1">Exclusive Offers</p>
      <div className={mobile ? "space-y-1.5" : "space-y-0.5"}>
        {offers.map((offer) => (
          <a
            key={offer.href + offer.title}
            href={offer.href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx(
              "exclusive-offers-nav-item flex items-center gap-2 rounded-md text-[13px] font-normal text-ink-2 transition-[background-color,color] duration-[160ms] hover:text-brass-700",
              mobile ? "min-h-[52px] px-4 py-3 text-[15px]" : "px-3 py-2"
            )}
          >
            <PlayCircle className="h-4 w-4 shrink-0 text-brass-700" strokeWidth={1.75} />
            <span className="flex-1">{offer.title}</span>
            <ExternalLink className="h-3 w-3 shrink-0 text-ink-6" strokeWidth={1.75} />
          </a>
        ))}
      </div>
    </div>
  );
}
