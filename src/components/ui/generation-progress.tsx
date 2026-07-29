"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { EarningsBanner } from "./earnings-banner";

export const GENERATION_RESULTS_ID = "generation-results";

export function scrollToGenerationResults(targetId = GENERATION_RESULTS_ID, attempt = 0) {
  const el = document.getElementById(targetId);
  if (!el) {
    if (attempt < 10) {
      window.setTimeout(() => scrollToGenerationResults(targetId, attempt + 1), 120);
    }
    return;
  }
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Scroll to results when `active` transitions true → false. */
export function useGenerationCompleteScroll(
  active: boolean,
  scrollTargetId?: string,
  enabled = true
) {
  const wasActive = useRef(false);
  const targetRef = useRef(scrollTargetId ?? GENERATION_RESULTS_ID);

  useEffect(() => {
    if (active && scrollTargetId) {
      targetRef.current = scrollTargetId;
    }
  }, [active, scrollTargetId]);

  useEffect(() => {
    if (!enabled) {
      wasActive.current = active;
      return;
    }

    if (wasActive.current && !active) {
      scrollToGenerationResults(targetRef.current);
    }
    wasActive.current = active;
  }, [active, enabled]);
}

interface GenerationProgressProps {
  label: string;
  active: boolean;
  showBanner?: boolean;
  scrollOnComplete?: boolean;
  scrollTargetId?: string;
}

export function GenerationProgress({
  label,
  active,
  showBanner = true,
  scrollOnComplete = true,
  scrollTargetId,
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);

  useGenerationCompleteScroll(active, scrollTargetId, scrollOnComplete);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }
    setProgress(8);
    const interval = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const step = prev < 60 ? 6 + Math.random() * 4 : 1 + Math.random() * 2;
        return Math.min(95, prev + step);
      });
    }, 280);
    return () => window.clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div className="sticky top-4 z-30 flex flex-col gap-4 w-full">
      {showBanner ? <EarningsBanner prominent /> : null}
      <div className="rounded-2xl border border-border-dim/40 bg-surface/60 p-3 sm:p-4">
        <div className="flex items-center gap-3 mb-2.5">
          <Loader2 size={16} className="animate-spin text-accent shrink-0" />
          <span className="text-[13px] sm:text-sm font-semibold text-text-primary">{label}</span>
        </div>
        <div className="h-1.5 rounded-full bg-page overflow-hidden border border-border-dim/30">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent-muted transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
