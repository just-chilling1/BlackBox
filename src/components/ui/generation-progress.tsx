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
  const [bannerPinned, setBannerPinned] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);
  const wasActiveRef = useRef(false);

  useGenerationCompleteScroll(active, scrollTargetId, scrollOnComplete);

  useEffect(() => {
    if (active) {
      setBannerPinned(true);
      setBannerDismissed(false);
      setBannerKey((key) => key + 1);
    } else if (wasActiveRef.current) {
      // Generation finished — re-show ad even if dismissed mid-run
      setBannerDismissed(false);
      setBannerKey((key) => key + 1);
    }
    wasActiveRef.current = active;
  }, [active]);

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

  const showBannerEl = showBanner && bannerPinned && !bannerDismissed;

  if (!showBannerEl && !active) return null;

  return (
    <div className="flex w-full flex-col gap-4">
      {showBannerEl ? (
        <EarningsBanner
          key={bannerKey}
          prominent
          onDismiss={() => setBannerDismissed(true)}
        />
      ) : null}
      {active ? (
        <div className="rounded-2xl border border-border-dim/40 bg-surface/60 p-3 sm:p-4">
          <div className="mb-2.5 flex items-center gap-3">
            <Loader2 size={16} className="shrink-0 animate-spin text-accent" />
            <span className="text-[13px] font-semibold text-text-primary sm:text-sm">{label}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full border border-border-dim/30 bg-page">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-accent-muted transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
