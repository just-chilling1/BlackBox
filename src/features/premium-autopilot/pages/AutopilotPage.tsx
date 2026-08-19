"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import { clsx } from "clsx";
import { PremiumPageLayout } from "@/components/premium/PremiumPageLayout";
import { PremiumVideoTutorial } from "@/components/premium/PremiumVideoTutorial";
import { PremiumStepsSection } from "@/components/premium/PremiumStepsSection";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { AffiliateLinkField } from "@/components/premium/AffiliateLinkField";
import { SourceCard } from "@/features/premium-autopilot/components/SourceCard";
import { SourceInstructionsOverlay } from "@/features/premium-autopilot/components/SourceInstructionsOverlay";
import {
  NICHES,
  filterSourcesByNiche,
  resolveAutopilotNiche,
  SOURCES,
} from "@/features/premium-autopilot/lib/traffic-sources";
import {
  fetchLatestOffer,
  fetchAutopilotState,
  migrateLegacyCompletions,
  saveAutopilotSettings,
  setAutopilotCompletion,
} from "@/features/premium-autopilot/lib/autopilot-client";

const PAGE_SIZE = 24;
const LINK_PLACEHOLDER = "[YOUR_LINK]";

function renderSourceCopy(template: string, pageUrl: string) {
  return template.replaceAll("{LINK}", pageUrl || LINK_PLACEHOLDER);
}

export default function AutomatedProfitsPage() {
  const [selectedNiche, setSelectedNiche] = useState("All");
  const [pageUrl, setPageUrl] = useState("");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedDescId, setCopiedDescId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hydrated, setHydrated] = useState(false);
  const lastSavedUrl = useRef<string | null>(null);
  const lastSavedNiche = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [initialState, latestOffer] = await Promise.all([
        fetchAutopilotState(),
        fetchLatestOffer(),
      ]);
      const state = await migrateLegacyCompletions(initialState);
      if (cancelled) return;

      const savedUrl = state?.promotion_url?.trim() ?? "";
      if (savedUrl) {
        setPageUrl(savedUrl);
        lastSavedUrl.current = savedUrl;
      } else if (latestOffer?.promotionUrl) {
        setPageUrl(latestOffer.promotionUrl);
        lastSavedUrl.current = latestOffer.promotionUrl;
      }

      const savedNiche = resolveAutopilotNiche(state?.selected_niche);
      const hasSavedNiche = savedNiche !== "All";
      const defaultNiche = hasSavedNiche
        ? savedNiche
        : latestOffer?.niche ?? "All";
      setSelectedNiche(defaultNiche);
      if (hasSavedNiche) lastSavedNiche.current = savedNiche;

      if (state?.completed_source_ids?.length) {
        setCompleted(new Set(state.completed_source_ids));
      }
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const trimmed = pageUrl.trim();
    if (lastSavedUrl.current === trimmed) return;
    const timer = window.setTimeout(() => {
      void (async () => {
        const ok = await saveAutopilotSettings({
          promotion_url: trimmed || null,
        });
        if (ok) lastSavedUrl.current = trimmed;
      })();
    }, 500);
    return () => window.clearTimeout(timer);
  }, [pageUrl, hydrated]);

  const handleNicheChange = useCallback(
    async (niche: string) => {
      if (niche === selectedNiche) return;
      setSelectedNiche(niche);
      setVisibleCount(PAGE_SIZE);
      setExpandedId(null);
      if (!hydrated) return;
      if (lastSavedNiche.current === niche) return;
      const ok = await saveAutopilotSettings({ selected_niche: niche });
      if (ok) lastSavedNiche.current = niche;
    },
    [selectedNiche, hydrated]
  );

  const toggleCompleted = useCallback(
    async (id: string) => {
      const wasDone = completed.has(id);
      const nextDone = !wasDone;

      setCompleted((prev) => {
        const next = new Set(prev);
        if (nextDone) next.add(id);
        else next.delete(id);
        return next;
      });

      if (!hydrated) return;

      const ok = await setAutopilotCompletion(id, nextDone);
      if (!ok) {
        setCompleted((prev) => {
          const rollback = new Set(prev);
          if (wasDone) rollback.add(id);
          else rollback.delete(id);
          return rollback;
        });
      }
    },
    [completed, hydrated]
  );

  const filteredSources = useMemo(
    () => filterSourcesByNiche(selectedNiche),
    [selectedNiche]
  );

  const visibleSources = useMemo(
    () => filteredSources.slice(0, visibleCount),
    [filteredSources, visibleCount]
  );

  const completedCount = useMemo(
    () => filteredSources.filter((s) => completed.has(s.id)).length,
    [filteredSources, completed]
  );

  const progressPercent =
    filteredSources.length > 0
      ? Math.round((completedCount / filteredSources.length) * 100)
      : 0;

  const hasMore = visibleCount < filteredSources.length;
  const selectedSource =
    SOURCES.find((source) => source.id === expandedId) ?? null;

  return (
    <PremiumPageLayout
        title="Pinterest Autopilot"
      subtitle="180 practical traffic sources across 9 niches — choose the market your offer was built for and share it where it is genuinely useful."
      footer={<PremiumFooter />}
    >
      <PremiumVideoTutorial
        vimeoId="1171734563"
        iframeTitle="Automated Profits Tutorial"
        title="How to Use Automated Income"
        description="Watch this quick tutorial to learn how to share your offer responsibly across relevant traffic sources."
      />

      <PremiumStepsSection
        title="How This Works (Super Simple!)"
        steps={[
          {
            num: "1",
            title: "Pick Your Niche",
            desc: "Choose the niche your offer was built for and get 20 practical traffic sources tailored to that market.",
          },
          {
            num: "2",
            title: "Share Your Offer",
            desc: "Follow the platform rules and use the step-by-step guidance to share your offer where it directly helps the conversation.",
          },
          {
            num: "3",
            title: "Build Consistent Visibility",
            desc: "Return to the sources that work for you, contribute useful answers, and track the places you have completed.",
          },
        ]}
      />

      <div className="rounded-xl border border-[var(--np-line-pulse)] bg-pulse-100 p-5 flex items-start gap-3">
        <Lightbulb size={18} className="text-pulse-700 shrink-0 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-pulse-700">Pro Tip: </span>
          <span className="text-sm text-text-secondary">
            Start with a few sources where you can genuinely help the audience.
            Read each community&apos;s rules first, and only share your offer when
            it directly supports your answer.
          </span>
        </div>
      </div>

      <section className="flex flex-col gap-8">
        <div className="glass-card p-8 flex flex-col gap-4">
          <h3 className="text-lg font-medium text-text-primary">
            Enter Your Page URL:
          </h3>
          <AffiliateLinkField
            value={pageUrl}
            onChange={setPageUrl}
            inputId="autopilot-promotion-url"
            placeholder="https://your-page-url.com"
          />
          <p className="text-xs text-text-muted">
            This is the page you want to promote. We&apos;ll automatically insert
            it in all the submission descriptions below. Your URL and progress
            sync to your account.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => (
            <button
              key={niche}
              type="button"
              onClick={() => void handleNicheChange(niche)}
              className={clsx(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all border",
                selectedNiche === niche
                  ? "bg-grad-pulse border-[var(--np-line-pulse)] text-black"
                  : "bg-surface border-border-dim text-text-secondary hover:border-[var(--np-line-pulse)] hover:text-text-primary"
              )}
            >
              {niche}
            </button>
          ))}
        </div>

        <div className="glass-card p-6 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-text-primary">
                Your Progress:
              </h3>
              <p className="text-sm text-text-secondary">
                {completedCount} of {filteredSources.length} sources completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-medium text-pulse-700">
                {progressPercent}%
              </span>
              <p className="text-xs text-text-muted">Complete</p>
            </div>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-grad-pulse rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {visibleSources.map((source, idx) => (
            <SourceCard
              key={source.id}
              source={source}
              isDone={completed.has(source.id)}
              index={idx}
              onView={() => setExpandedId(source.id)}
              onToggleComplete={() => void toggleCompleted(source.id)}
            />
          ))}
        </div>

        {hasMore && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() =>
                setVisibleCount((n) =>
                  Math.min(n + PAGE_SIZE, filteredSources.length)
                )
              }
              className="btn-secondary px-6 py-3 text-sm"
            >
              Show more sources (
              {filteredSources.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </section>

      <SourceInstructionsOverlay
        source={selectedSource}
        isDone={selectedSource ? completed.has(selectedSource.id) : false}
        copied={
          selectedSource != null && copiedDescId === selectedSource.id
        }
        onClose={() => setExpandedId(null)}
        onToggleComplete={() => {
          if (selectedSource) void toggleCompleted(selectedSource.id);
        }}
        onCopyDescription={() => {
          if (!selectedSource) return;
          void navigator.clipboard.writeText(
            renderSourceCopy(selectedSource.description, pageUrl)
          );
          setCopiedDescId(selectedSource.id);
          window.setTimeout(() => setCopiedDescId(null), 2000);
        }}
        renderCopy={(template) => renderSourceCopy(template, pageUrl)}
      />
    </PremiumPageLayout>
  );
}
