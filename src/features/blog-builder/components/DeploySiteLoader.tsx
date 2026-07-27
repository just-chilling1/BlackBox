"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Rocket, Sparkles } from "lucide-react";
import { AiLoadingBar } from "@/components/ui/AiLoadingBar";
import { cn } from "@/lib/utils";
import { useBlogBuilder } from "../context/BlogBuilderContext";

export type DeployLoaderPhase = "setup" | "generating" | "publishing";

const PHASES: { id: DeployLoaderPhase; label: string }[] = [
  { id: "setup", label: "Setup" },
  { id: "generating", label: "Build" },
  { id: "publishing", label: "Launch" },
];

const PHASE_INDEX: Record<DeployLoaderPhase, number> = {
  setup: 0,
  generating: 1,
  publishing: 2,
};

const PHASE_MESSAGES: Record<DeployLoaderPhase, string> = {
  setup: "Creating your questionnaire site record…",
  generating: "Writing quiz questions and building pages…",
  publishing: "Publishing your site to the web…",
};

const PHASE_TICKERS: Record<DeployLoaderPhase, string[]> = {
  setup: [
    "Reserving your site slug…",
    "Linking affiliate URLs…",
    "Scanning offer page for context…",
    "Applying your theme preset…",
  ],
  generating: [
    "Drafting niche quiz questions…",
    "Building intro and results pages…",
    "Placing affiliate offer on final page…",
    "Assembling themed layout…",
    "Polishing call-to-action copy…",
  ],
  publishing: [
    "Finalizing page assets…",
    "Marking site as live…",
    "Syncing your dashboard…",
  ],
};

/** Progress ceiling per phase — bar eases toward these while work runs. */
const PHASE_PROGRESS: Record<DeployLoaderPhase, { start: number; cap: number }> = {
  setup: { start: 8, cap: 32 },
  generating: { start: 32, cap: 88 },
  publishing: { start: 88, cap: 99 },
};

const SKELETON_BLOCKS = [
  { className: "h-14 w-full" },
  { className: "h-3 w-2/3" },
  { className: "h-10" },
  { className: "h-10" },
  { className: "h-10" },
  { className: "h-8 w-1/2 mx-auto" },
] as const;

interface DeploySiteLoaderProps {
  phase?: DeployLoaderPhase;
  className?: string;
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-0.5 pl-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="deploy-typing-dot inline-block h-1 w-1 rounded-full bg-promo-accent/80"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

function BrowserChrome() {
  return (
    <div className="mb-3 flex items-center gap-1.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="deploy-browser-dot h-2 w-2 rounded-full bg-white/10"
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}
      <div className="relative ml-2 h-2 max-w-[140px] flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        <span className="deploy-url-shimmer absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-accent/25 to-transparent" />
      </div>
    </div>
  );
}

function SkeletonBlock({ index, className, visible }: { index: number; className: string; visible: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{
        opacity: visible ? 1 : 0.15,
        y: 0,
        scale: 1,
      }}
      transition={{ delay: index * 0.12, duration: 0.45, ease: "easeOut" }}
      className={cn(
        "deploy-block relative overflow-hidden rounded-md border border-white/[0.06]",
        "bg-gradient-to-r from-accent/15 via-promo-accent/10 to-transparent",
        className,
        visible && "deploy-block--live"
      )}
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <span
        className="deploy-block-shimmer pointer-events-none absolute inset-0"
        style={{ animationDelay: `${index * 0.2}s` }}
        aria-hidden
      />
    </motion.div>
  );
}

function SkeletonPreview({ phase }: { phase: DeployLoaderPhase }) {
  const visibleBlocks =
    phase === "setup" ? 2 : phase === "generating" ? 5 : SKELETON_BLOCKS.length;

  return (
    <div className="relative space-y-2.5">
      <SkeletonBlock index={0} className={SKELETON_BLOCKS[0].className} visible={0 < visibleBlocks} />
      <SkeletonBlock index={1} className={SKELETON_BLOCKS[1].className} visible={1 < visibleBlocks} />
      <div className="grid grid-cols-3 gap-2">
        <SkeletonBlock index={2} className={SKELETON_BLOCKS[2].className} visible={2 < visibleBlocks} />
        <SkeletonBlock index={3} className={SKELETON_BLOCKS[3].className} visible={3 < visibleBlocks} />
        <SkeletonBlock index={4} className={SKELETON_BLOCKS[4].className} visible={4 < visibleBlocks} />
      </div>
      <SkeletonBlock index={5} className={SKELETON_BLOCKS[5].className} visible={5 < visibleBlocks} />

      <div
        className="deploy-scan pointer-events-none absolute inset-x-0 top-2 h-px bg-gradient-to-r from-transparent via-accent to-promo-accent opacity-90 shadow-[0_0_12px_rgba(234,179,8,0.45)]"
        aria-hidden
      />
      <div
        className="deploy-scan-glow pointer-events-none absolute inset-x-0 top-2 h-8 bg-gradient-to-b from-accent/10 to-transparent"
        aria-hidden
      />
    </div>
  );
}

function DeploySiteLoaderInner({ phase = "generating", className }: DeploySiteLoaderProps) {
  const { generationLog } = useBlogBuilder();
  const activeIndex = PHASE_INDEX[phase];
  const [tickerIndex, setTickerIndex] = useState(0);
  const [progress, setProgress] = useState(PHASE_PROGRESS[phase].start);

  const latestLog = generationLog.length > 0 ? generationLog[generationLog.length - 1] : null;
  const recentLogs = generationLog.slice(-3);

  const displayMessage = latestLog ?? PHASE_MESSAGES[phase];
  const tickerMessage = PHASE_TICKERS[phase][tickerIndex % PHASE_TICKERS[phase].length];

  const progressLabel = useMemo(() => {
    if (phase === "publishing") return "Going live";
    if (phase === "generating") return "AI building your questionnaire";
    return "Preparing site";
  }, [phase]);

  useEffect(() => {
    setProgress(PHASE_PROGRESS[phase].start);
  }, [phase]);

  useEffect(() => {
    const { cap } = PHASE_PROGRESS[phase];
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= cap) return p;
        const step = phase === "generating" ? 0.35 : 0.55;
        return Math.min(cap, p + step);
      });
    }, 120);
    return () => window.clearInterval(id);
  }, [phase]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTickerIndex((i) => i + 1);
    }, 2800);
    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "deploy-site-loader glass-card overflow-hidden border-border-dim/60 p-4 sm:p-6 contain-paint",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={displayMessage}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <motion.div
            className="deploy-rocket-wrap flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10"
            aria-hidden
          >
            <Rocket size={16} className="text-accent" />
          </motion.div>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-promo-accent">
              <Sparkles size={11} className="deploy-sparkle shrink-0" aria-hidden />
              Site Assembly
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={displayMessage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="truncate text-sm font-semibold text-text-primary"
              >
                {displayMessage}
                {!latestLog && <TypingDots />}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        <Globe size={18} className="deploy-globe shrink-0 text-text-muted/60" aria-hidden />
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-page/80 p-3 sm:p-4">
        <BrowserChrome />
        <SkeletonPreview phase={phase} />
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={`${phase}-${tickerMessage}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.3 }}
          className="mt-3 flex items-center gap-2 text-[11px] text-text-muted"
        >
          <span className="deploy-activity-pulse h-1.5 w-1.5 shrink-0 rounded-full bg-promo-accent" aria-hidden />
          <span className="truncate">{tickerMessage}</span>
        </motion.p>
      </AnimatePresence>

      {recentLogs.length > 1 && (
        <ul className="mt-2 space-y-1 border-t border-white/[0.06] pt-2" aria-label="Recent activity">
          {recentLogs.slice(0, -1).map((line, i) => (
            <motion.li
              key={`${line}-${i}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.55, height: "auto" }}
              className="truncate text-[10px] text-text-muted/80"
            >
              {line}
            </motion.li>
          ))}
        </ul>
      )}

      <ol className="mt-4 flex items-center gap-1.5 sm:gap-2" aria-label="Deployment progress">
        {PHASES.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
              <motion.span
                layout
                animate={
                  isActive
                    ? { scale: [1, 1.08, 1], boxShadow: "0 0 12px rgba(12,189,160,0.35)" }
                    : { scale: 1, boxShadow: "0 0 0 rgba(0,0,0,0)" }
                }
                transition={isActive ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300",
                  isDone && "bg-accent text-text-on-accent",
                  isActive && "bg-promo-accent/15 text-promo-accent ring-1 ring-promo-accent/40",
                  !isDone && !isActive && "bg-white/[0.06] text-text-muted"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? "✓" : index + 1}
              </motion.span>
              <span
                className={cn(
                  "hidden truncate text-[11px] font-semibold uppercase tracking-wider sm:inline",
                  isActive ? "text-text-primary" : "text-text-muted"
                )}
              >
                {step.label}
              </span>
              {index < PHASES.length - 1 && (
                <span className="relative hidden h-px flex-1 overflow-hidden sm:block" aria-hidden>
                  <span className="absolute inset-0 bg-white/[0.08]" />
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-accent/50"
                    initial={{ width: "0%" }}
                    animate={{ width: isDone ? "100%" : isActive ? "50%" : "0%" }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <AiLoadingBar
        label={progressLabel}
        progress={Math.round(progress)}
        active
        className="mt-4"
      />
    </motion.div>
  );
}

export const DeploySiteLoader = memo(DeploySiteLoaderInner);
