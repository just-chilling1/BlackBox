"use client";

import { memo } from "react";
import { Globe, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

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
  setup: "Creating your product website record…",
  generating: "Writing sales copy, benefits, and FAQs…",
  publishing: "Publishing your site to the web…",
};

const BLOCKS = [
  "h-14 w-full",
  "h-3 w-2/3",
  "h-10",
  "h-10",
  "h-10",
  "h-8 w-1/2 mx-auto",
] as const;

interface DeploySiteLoaderProps {
  phase?: DeployLoaderPhase;
  className?: string;
}

function DeploySiteLoaderInner({ phase = "generating", className }: DeploySiteLoaderProps) {
  const activeIndex = PHASE_INDEX[phase];

  return (
    <div
      className={cn(
        "deploy-site-loader glass-card overflow-hidden border-border-dim/60 p-4 sm:p-6 contain-paint",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={PHASE_MESSAGES[phase]}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Rocket size={16} className="text-accent" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-promo-accent">
              Site Assembly
            </p>
            <p className="truncate text-sm font-semibold text-text-primary">{PHASE_MESSAGES[phase]}</p>
          </div>
        </div>
        <Globe size={18} className="shrink-0 text-text-muted/60" aria-hidden />
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-page/80 p-3 sm:p-4">
        <div className="mb-3 flex items-center gap-1.5" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <span className="h-2 w-2 rounded-full bg-white/10" />
          <div className="ml-2 h-2 max-w-[120px] flex-1 rounded-full bg-white/[0.06]" />
        </div>

        <div className="relative space-y-2.5">
          <div
            className={cn(
              "deploy-block rounded-md border border-white/[0.06] bg-gradient-to-r from-accent/15 via-promo-accent/10 to-transparent",
              BLOCKS[0]
            )}
          />
          <div
            className={cn(
              "deploy-block rounded-md border border-white/[0.06] bg-gradient-to-r from-accent/15 via-promo-accent/10 to-transparent",
              BLOCKS[1]
            )}
          />
          <div className="grid grid-cols-3 gap-2">
            {BLOCKS.slice(2, 5).map((size, i) => (
              <div
                key={i}
                className={cn(
                  "deploy-block rounded-md border border-white/[0.06] bg-gradient-to-r from-accent/15 via-promo-accent/10 to-transparent",
                  size
                )}
              />
            ))}
          </div>
          <div
            className={cn(
              "deploy-block rounded-md border border-white/[0.06] bg-gradient-to-r from-accent/15 via-promo-accent/10 to-transparent",
              BLOCKS[5]
            )}
          />

          <div
            className="deploy-scan pointer-events-none absolute inset-x-0 top-2 h-px bg-gradient-to-r from-transparent via-accent to-promo-accent opacity-80 shadow-[0_0_8px_rgba(234,179,8,0.35)]"
            aria-hidden
          />
        </div>
      </div>

      <ol className="mt-4 flex items-center gap-1.5 sm:gap-2" aria-label="Deployment progress">
        {PHASES.map((step, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors duration-300",
                  isDone && "bg-accent text-text-on-accent",
                  isActive && "bg-promo-accent/15 text-promo-accent ring-1 ring-promo-accent/40",
                  !isDone && !isActive && "bg-white/[0.06] text-text-muted"
                )}
                aria-current={isActive ? "step" : undefined}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  "hidden truncate text-[11px] font-semibold uppercase tracking-wider sm:inline",
                  isActive ? "text-text-primary" : "text-text-muted"
                )}
              >
                {step.label}
              </span>
              {index < PHASES.length - 1 && (
                <span
                  className={cn(
                    "hidden h-px flex-1 sm:block",
                    isDone ? "bg-accent/50" : "bg-white/[0.08]"
                  )}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>

      <div
        className="mt-4 h-1 overflow-hidden rounded-full border border-border-dim/30 bg-page"
        aria-hidden
      >
        <div className="deploy-progress-bar h-full w-1/3 rounded-full bg-gradient-to-r from-accent via-promo-accent to-accent" />
      </div>
    </div>
  );
}

export const DeploySiteLoader = memo(DeploySiteLoaderInner);
