"use client";

import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { trainingContent } from "@/config/training.config";

interface EarningsBannerProps {
  onDismiss?: () => void;
  compact?: boolean;
  /** High-visibility styling for use during AI generation */
  prominent?: boolean;
}

export function EarningsBanner({
  onDismiss,
  compact = false,
  prominent = false,
}: EarningsBannerProps) {
  const [visible, setVisible] = useState(true);
  const ctaUrl = trainingContent.externalTrainingUrl;

  if (!visible || !ctaUrl) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  const isLarge = prominent || !compact;

  return (
    <div
      className={clsx(
        "relative w-full rounded-2xl text-center transition-all duration-300",
        prominent
          ? "border-[3px] border-accent bg-gradient-to-b from-accent/15 via-white to-accent/5 shadow-[0_0_48px_rgba(238,179,16,0.35),0_8px_32px_rgba(238,179,16,0.15)] ring-2 ring-accent/25 animate-[earnings-glow_2.5s_ease-in-out_infinite]"
          : "border-2 border-accent/40 bg-gradient-to-b from-accent/[0.06] via-white to-page shadow-[0_0_40px_rgba(238,179,16,0.08)]",
        isLarge ? "p-5 sm:p-6" : "p-3 sm:p-3.5"
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss offer"
        className={clsx(
          "absolute rounded-full flex items-center justify-center text-text-muted hover:text-text-heading hover:bg-border-dim/50 transition-colors",
          isLarge ? "top-3 right-3 w-9 h-9" : "top-2 right-2 w-7 h-7"
        )}
      >
        <X size={isLarge ? 16 : 14} />
      </button>

      <span
        className={clsx(
          "inline-block rounded-full bg-red-600 text-white font-black uppercase tracking-widest shadow-sm",
          isLarge ? "mb-3 px-3 py-1 text-[10px]" : "mb-2 px-2 py-0.5 text-[9px]"
        )}
      >
        Free Training
      </span>

      <h3
        className={clsx(
          "font-black uppercase text-text-heading leading-tight",
          prominent
            ? "text-xl sm:text-2xl md:text-[1.65rem] mb-3"
            : isLarge
              ? "text-xl sm:text-2xl mb-2"
              : "text-sm sm:text-base mb-1.5"
        )}
      >
        Multiply Your Earnings To{" "}
        <span className={clsx("text-accent", prominent && "text-[1.05em]")}>
          $1,000 – $5,000
        </span>{" "}
        A Day
      </h3>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl font-black uppercase tracking-wide text-black bg-accent cursor-pointer hover:brightness-110 hover:shadow-gold active:scale-[0.98] transition-all duration-200",
          prominent
            ? "min-h-[52px] px-10 py-3.5 text-sm sm:text-base shadow-[0_4px_20px_rgba(238,179,16,0.4)]"
            : isLarge
              ? "min-h-[48px] px-8 py-3 text-sm"
              : "min-h-[40px] px-5 py-2 text-[11px]"
        )}
      >
        Click Here To Learn How
        <ArrowRight size={isLarge ? 16 : 14} />
      </a>
    </div>
  );
}
