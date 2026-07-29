"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

  if (prominent) {
    return (
      <div
        className={clsx(
          "relative w-full rounded-2xl border-[3px] border-accent bg-gradient-to-b from-accent/12 via-white to-accent/5",
          "px-6 py-8 sm:px-10 sm:py-10 text-center",
          "shadow-[0_0_48px_rgba(238,179,16,0.35),0_8px_32px_rgba(238,179,16,0.15)] ring-2 ring-accent/25",
          "animate-[earnings-glow_2.5s_ease-in-out_infinite]"
        )}
      >
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss offer"
          className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border-dim/50 hover:text-text-heading"
        >
          <X size={16} />
        </button>

        <span className="mb-4 inline-block rounded-full bg-red-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm">
          Free Training
        </span>

        <h3 className="mx-auto mb-4 max-w-3xl text-xl font-black uppercase leading-tight tracking-tight text-text-heading sm:text-2xl md:text-[1.75rem]">
          Wake Up With An Extra{" "}
          <span className="text-accent">$1,000–$5,000</span> In Your Bank Account Tomorrow
        </h3>

        <p className="mx-auto mb-6 max-w-2xl text-sm leading-relaxed text-text-secondary sm:text-base">
          Discover how to scale to $1,000–$5,000 every single day — without doing any extra work.
        </p>

        <a
          href={ctaUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[54px] w-full max-w-xl items-center justify-center rounded-xl bg-gradient-to-r from-accent to-[#e6a800] px-8 py-4 text-sm font-black uppercase tracking-wide text-black shadow-[0_4px_24px_rgba(238,179,16,0.45)] transition-all duration-200 hover:brightness-110 active:scale-[0.98] sm:text-base"
        >
          Watch The Free Training {">>"}
        </a>

        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-red-600 sm:text-sm">
          Warning: This Will Be Taken Down Soon
        </p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "relative w-full rounded-2xl border-2 border-accent/40 bg-gradient-to-b from-accent/[0.06] via-white to-page text-center shadow-[0_0_40px_rgba(238,179,16,0.08)] transition-all duration-300",
        isLarge ? "p-5 sm:p-6" : "p-3 sm:p-3.5"
      )}
    >
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss offer"
        className={clsx(
          "absolute flex items-center justify-center rounded-full text-text-muted transition-colors hover:bg-border-dim/50 hover:text-text-heading",
          isLarge ? "top-3 right-3 h-9 w-9" : "top-2 right-2 h-7 w-7"
        )}
      >
        <X size={isLarge ? 16 : 14} />
      </button>

      <span
        className={clsx(
          "inline-block rounded-full bg-red-600 font-black uppercase tracking-widest text-white shadow-sm",
          isLarge ? "mb-3 px-3 py-1 text-[10px]" : "mb-2 px-2 py-0.5 text-[9px]"
        )}
      >
        Free Training
      </span>

      <h3
        className={clsx(
          "font-black uppercase leading-tight text-text-heading",
          isLarge ? "mb-2 text-xl sm:text-2xl" : "mb-1.5 text-sm sm:text-base"
        )}
      >
        Multiply Your Earnings To{" "}
        <span className="text-accent">$1,000 – $5,000</span> A Day
      </h3>

      <a
        href={ctaUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent font-black uppercase tracking-wide text-black transition-all duration-200 hover:brightness-110 active:scale-[0.98] sm:w-auto",
          isLarge ? "min-h-[48px] px-8 py-3 text-sm" : "min-h-[40px] px-5 py-2 text-[11px]"
        )}
      >
        Click Here To Learn How
      </a>
    </div>
  );
}
