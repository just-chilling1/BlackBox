"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { trainingContent } from "@/config/training.config";

interface EarningsBannerProps {
  onDismiss?: () => void;
  compact?: boolean;
}

export function EarningsBanner({ onDismiss, compact = false }: EarningsBannerProps) {
  const [visible, setVisible] = useState(true);
  const ctaUrl = trainingContent.externalTrainingUrl;

  if (!visible || !ctaUrl) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div
      className={clsx(
        "relative w-full rounded-2xl border-2 border-accent/50 bg-gradient-to-b from-surface to-page text-center shadow-[0_0_40px_rgba(234,179,8,0.08)] transition-all duration-300",
        compact ? "p-3 sm:p-3.5" : "p-5 sm:p-6"
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss offer"
        className={clsx(
          "absolute rounded-full flex items-center justify-center text-text-muted hover:text-text-heading hover:bg-border-dim/50 transition-colors",
          compact ? "top-2 right-2 w-7 h-7" : "top-3 right-3 w-9 h-9"
        )}
      >
        <X size={compact ? 14 : 16} />
      </button>

      <span
        className={clsx(
          "inline-block rounded-full bg-red-600 text-white font-black uppercase tracking-widest",
          compact ? "mb-2 px-2 py-0.5 text-[9px]" : "mb-3 px-3 py-1 text-[10px]"
        )}
      >
        Free Training
      </span>

      <h3
        className={clsx(
          "font-black uppercase text-text-heading leading-tight",
          compact ? "text-sm sm:text-base mb-1.5" : "text-xl sm:text-2xl mb-2"
        )}
      >
        Multiply Your Earnings To <span className="text-accent">$1,000 – $5,000</span> A Day
      </h3>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl font-black uppercase tracking-wide text-black bg-accent hover:brightness-110 active:scale-[0.98] transition-all",
          compact ? "min-h-[40px] px-5 py-2 text-[11px]" : "min-h-[48px] px-8 py-3 text-sm"
        )}
      >
        Click Here To Learn How
        <ArrowRight size={compact ? 14 : 16} />
      </a>
    </div>
  );
}
