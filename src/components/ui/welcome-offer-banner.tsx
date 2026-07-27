"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { clsx } from "clsx";
import { offers } from "@/config/offers.config";

/**
 * Dismissible premium/training CTA banner — same role as sibling products' welcome offer strip.
 * Light-theme variant with left accent bar (distinct from dark glass siblings).
 */
export function WelcomeOfferBanner({ compact = false }: { compact?: boolean }) {
  const [dismissed, setDismissed] = useState(false);
  const ctaUrl = offers.partnerCta;

  if (dismissed || !ctaUrl) return null;

  return (
    <div
      className={clsx(
        "accent-card relative w-full rounded-2xl border border-accent/30 bg-gradient-to-r from-accent/5 via-white to-brand-tint text-center transition-all duration-300",
        compact ? "px-3 py-4 md:px-4 md:py-5" : "px-6 py-8 md:px-10 md:py-10"
      )}
    >
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Close banner"
        className="absolute right-2 top-2 rounded-lg p-1 text-text-muted transition-colors hover:bg-slate-100 hover:text-text-heading md:right-3 md:top-3 md:p-1.5"
      >
        <X className={clsx(compact ? "h-4 w-4" : "h-5 w-5")} />
      </button>

      <span
        className={clsx(
          "mb-3 inline-block rounded-full bg-red-600 px-3 py-1 font-black uppercase tracking-widest text-white md:mb-4",
          compact ? "text-[10px]" : "text-xs"
        )}
      >
        Limited Free Training
      </span>

      <h2
        className={clsx(
          "mx-auto font-black uppercase leading-tight text-text-heading",
          compact ? "mb-2 max-w-xl text-sm md:text-base" : "mb-3 max-w-3xl text-lg sm:text-xl md:text-2xl"
        )}
      >
        Learn How To Scale To{" "}
        <span className="text-accent">$1,000&ndash;$5,000</span> Per Day
      </h2>

      <p
        className={clsx(
          "mx-auto font-medium leading-snug text-text-secondary text-balance",
          compact ? "mb-3 max-w-lg text-xs md:text-sm" : "mb-5 max-w-2xl text-sm sm:text-base"
        )}
      >
        Fully automated income system — no tech skills required. Works in just 20 minutes per day.
      </p>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "inline-block rounded-xl bg-gradient-to-r from-accent to-promo-cta font-black uppercase text-black shadow-lg shadow-accent/20 transition-all duration-200 hover:scale-[1.03] hover:shadow-accent/30",
          compact ? "px-4 py-2 text-xs md:px-5 md:py-2.5 md:text-sm" : "px-6 py-3.5 text-sm sm:px-8 sm:py-4 sm:text-base"
        )}
      >
        Claim My Free Spot &gt;&gt;
      </a>

      {!compact && (
        <p className="mt-3 text-xs text-text-muted">100% Free — No credit card required</p>
      )}
    </div>
  );
}
