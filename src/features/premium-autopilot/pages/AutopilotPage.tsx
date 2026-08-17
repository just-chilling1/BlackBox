"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Users,
  Clock,
  ExternalLink,
  Lightbulb,
  Clipboard,
  Copy,
} from "lucide-react";
import { clsx } from "clsx";
import { PremiumPageLayout } from "@/components/premium/PremiumPageLayout";
import { PremiumVideoTutorial } from "@/components/premium/PremiumVideoTutorial";
import { PremiumStepsSection } from "@/components/premium/PremiumStepsSection";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { AffiliateLinkField } from "@/components/premium/AffiliateLinkField";
import {
  NICHES,
  filterSourcesByNiche,
  type SourceType,
} from "@/features/premium-autopilot/lib/traffic-sources";
import {
  fetchAutopilotState,
  migrateLegacyCompletions,
  saveAutopilotSettings,
  setAutopilotCompletion,
} from "@/features/premium-autopilot/lib/autopilot-client";

const PAGE_SIZE = 24;

const typeBadgeColor: Record<SourceType, string> = {
  Forum: "bg-brass-100 text-brass-700 border-[var(--bb-line-brass)]",
  Social: "bg-success/15 text-success border-success/25",
  Directory: "bg-blue-500/15 text-blue-400 border-blue-500/25",
  Blog: "bg-purple-500/15 text-purple-400 border-purple-500/25",
  "Q&A": "bg-[var(--bb-warning)]/15 text-[var(--bb-warning)] border-[var(--bb-warning)]/25",
  Classified: "bg-pink-500/15 text-pink-400 border-pink-500/25",
  Video: "bg-red-500/15 text-red-400 border-red-500/25",
};

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
      let state = await fetchAutopilotState();
      state = await migrateLegacyCompletions(state);
      if (cancelled) return;

      if (state?.promotion_url) {
        setPageUrl(state.promotion_url);
        lastSavedUrl.current = state.promotion_url;
      }
      if (state?.selected_niche) {
        setSelectedNiche(state.selected_niche);
        lastSavedNiche.current = state.selected_niche;
      }
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

  return (
    <PremiumPageLayout
      title="Automated Profits"
      subtitle="100+ free traffic sources — submit your link once and get ongoing traffic automatically. Members have generated over 2.8 million visitors using these sources."
      footer={<PremiumFooter />}
    >
      <PremiumVideoTutorial
        vimeoId="1171734563"
        iframeTitle="Automated Profits Tutorial"
        title="How to Use Automated Income"
        description="Watch this quick tutorial to learn how to submit your link to these 100+ traffic sources and get automated traffic forever!"
      />

      <PremiumStepsSection
        title="How This Works (Super Simple!)"
        steps={[
          {
            num: "1",
            title: "Pick Your Niche",
            desc: "Choose your niche below and get 100+ traffic sources specifically for your market.",
          },
          {
            num: "2",
            title: "Submit Your Link",
            desc: "Follow the simple step-by-step instructions to submit your link to each site. Takes 5-15 minutes per site.",
          },
          {
            num: "3",
            title: "Get Automatic Traffic",
            desc: "Once submitted, these sites send you traffic automatically. No daily work needed!",
          },
        ]}
      />

      <div className="rounded-xl border border-[var(--bb-line-brass)] bg-brass-100 p-5 flex items-start gap-3">
        <Lightbulb size={18} className="text-brass-700 shrink-0 mt-0.5" />
        <div>
          <span className="text-sm font-medium text-brass-700">Pro Tip: </span>
          <span className="text-sm text-text-secondary">
            Set aside 2-3 hours and submit to as many sources as possible. The
            more you submit to, the more automatic traffic you get. Most members
            submit to 50+ sources in their first week!
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
                  ? "bg-grad-brass border-[var(--bb-line-brass)] text-black"
                  : "bg-surface border-border-dim text-text-secondary hover:border-[var(--bb-line-brass)] hover:text-text-primary"
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
              <span className="text-2xl font-medium text-brass-700">
                {progressPercent}%
              </span>
              <p className="text-xs text-text-muted">Complete</p>
            </div>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-grad-brass rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visibleSources.map((source, idx) => {
            const isExpanded = expandedId === source.id;
            const isDone = completed.has(source.id);

            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(idx * 0.03, 0.8) }}
                className={clsx(
                  "bg-surface border rounded-xl overflow-hidden transition-all",
                  isDone
                    ? "border-[var(--bb-line-brass)] bg-brass-100"
                    : "border-border-dim hover:border-[var(--bb-line-brass)]"
                )}
              >
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={clsx(
                        "text-[13px] font-medium px-2 py-0.5 rounded border uppercase tracking-wider",
                        typeBadgeColor[source.type]
                      )}
                    >
                      {source.type}
                    </span>
                    <span
                      className={clsx(
                        "text-[13px] font-medium px-2 py-0.5 rounded border uppercase tracking-wider",
                        source.difficulty === "Easy"
                          ? "bg-success/15 text-success border-success/25"
                          : "bg-yellow-500/15 text-yellow-400 border-yellow-500/25"
                      )}
                    >
                      {source.difficulty}
                    </span>
                    {isDone && (
                      <span className="text-[13px] font-medium px-2 py-0.5 rounded bg-brass-200 text-brass-700 border border-[var(--bb-line-brass)] uppercase tracking-wider ml-auto">
                        Done
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-medium text-text-primary">
                    {source.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs text-text-muted">
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-brass-700" />
                      <span>Traffic: {source.traffic}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-brass-700" />
                      <span>Time: {source.time}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : source.id)
                    }
                    className="w-full btn-primary py-3 text-sm mt-1"
                  >
                    <ExternalLink size={14} />
                    <span>
                      {isExpanded ? "Hide Instructions" : "View Instructions"}
                    </span>
                  </button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 flex flex-col gap-4 border-t border-border-dim pt-4">
                        <div className="flex flex-col gap-2.5">
                          {source.instructions.map((step, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2.5 text-sm text-text-secondary"
                            >
                              <span className="text-brass-700 font-medium shrink-0 mt-0.5">
                                {i + 1}.
                              </span>
                              <span>
                                {pageUrl
                                  ? step.replace(
                                      /your (page )?(URL|link|page url)/gi,
                                      pageUrl
                                    )
                                  : step}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-brass-700">
                            <Clipboard size={14} />
                            <span>Use This Description When Submitting:</span>
                          </div>
                          <div className="bg-black/30 border border-border-dim rounded-lg p-3 flex items-center justify-between gap-3">
                            <p className="text-sm text-text-secondary flex-1 break-all">
                              {source.description.replace(
                                "{LINK}",
                                pageUrl || "[YOUR_LINK]"
                              )}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                void navigator.clipboard.writeText(
                                  source.description.replace(
                                    "{LINK}",
                                    pageUrl || "[YOUR_LINK]"
                                  )
                                );
                                setCopiedDescId(source.id);
                                window.setTimeout(
                                  () => setCopiedDescId(null),
                                  2000
                                );
                              }}
                              className={clsx(
                                "shrink-0 px-3 py-1.5 rounded-lg text-[13px] font-medium flex items-center gap-1.5 transition-all",
                                copiedDescId === source.id
                                  ? "bg-grad-brass text-black"
                                  : "bg-surface border border-border-dim text-text-secondary hover:border-[var(--bb-line-brass)]"
                              )}
                            >
                              {copiedDescId === source.id ? (
                                <CheckCircle2 size={12} />
                              ) : (
                                <Copy size={12} />
                              )}
                              <span>
                                {copiedDescId === source.id
                                  ? "Copied!"
                                  : "Copy Description"}
                              </span>
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary py-2.5 text-xs flex-1"
                          >
                            <ExternalLink size={13} />
                            <span>Open {source.name}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => void toggleCompleted(source.id)}
                            className={clsx(
                              "py-2.5 px-4 rounded-lg text-[13px] font-medium flex items-center gap-2 transition-all",
                              isDone
                                ? "bg-grad-brass text-black"
                                : "bg-surface border border-border-dim text-text-secondary hover:border-[var(--bb-line-brass)]"
                            )}
                          >
                            <CheckCircle2 size={13} />
                            <span>{isDone ? "Completed" : "Mark Done"}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
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
    </PremiumPageLayout>
  );
}
