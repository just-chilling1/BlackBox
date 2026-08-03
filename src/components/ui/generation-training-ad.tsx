"use client";

import { useEffect, useRef, useState } from "react";
import { EarningsBanner } from "./earnings-banner";

interface UseGenerationTrainingAdOptions {
  /** Keep the ad visible on completed/success views even if generation did not run in this session. */
  showWhenComplete?: boolean;
}

export function useGenerationTrainingAd(
  active: boolean,
  options: UseGenerationTrainingAdOptions = {}
) {
  const { showWhenComplete = false } = options;
  const [pinned, setPinned] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [bannerKey, setBannerKey] = useState(0);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (showWhenComplete) {
      setPinned(true);
    }
  }, [showWhenComplete]);

  useEffect(() => {
    if (active) {
      setPinned(true);
      setCompleted(false);
      setDismissed(false);
      setBannerKey((key) => key + 1);
    } else if (wasActiveRef.current) {
      setCompleted(true);
      setDismissed(false);
      setBannerKey((key) => key + 1);
    }
    wasActiveRef.current = active;
  }, [active]);

  const showBanner = pinned && !dismissed && (active || completed || showWhenComplete);

  const resetBanner = () => {
    setPinned(false);
    setDismissed(false);
    setCompleted(false);
  };

  return {
    showBanner,
    bannerKey,
    dismissBanner: () => setDismissed(true),
    resetBanner,
  };
}

interface GenerationTrainingAdProps {
  show: boolean;
  bannerKey: number;
  onDismiss: () => void;
}

export function GenerationTrainingAd({
  show,
  bannerKey,
  onDismiss,
}: GenerationTrainingAdProps) {
  if (!show) return null;

  return (
    <EarningsBanner key={bannerKey} prominent onDismiss={onDismiss} />
  );
}
