"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Globe,
  LayoutTemplate,
  Link2,
  Rocket,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { clsx } from "clsx";

interface DeployLaunchPanelProps {
  nicheLabel: string;
  templateName: string;
  linkCount: number;
  quotaRemaining?: number | null;
  quotaLimit?: number | null;
  quotaUnlimited?: boolean;
  canResume?: boolean;
  resumeLabel?: string;
  error?: string | null;
  onLaunch: () => void;
  onResume: () => void;
  onRetry?: () => void;
  phase: "idle" | "error";
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Globe;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border-dim/60 bg-page/50 px-4 py-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-promo-accent/10">
        <Icon size={16} className="text-promo-accent" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">{label}</p>
        <p className="truncate text-sm font-medium text-text-primary">{value}</p>
      </div>
    </div>
  );
}

export function DeployLaunchPanel({
  nicheLabel,
  templateName,
  linkCount,
  quotaRemaining,
  quotaLimit,
  quotaUnlimited,
  canResume,
  resumeLabel,
  error,
  onLaunch,
  onResume,
  onRetry,
  phase,
}: DeployLaunchPanelProps) {
  const quotaBlocked =
    !quotaUnlimited && quotaRemaining !== null && quotaRemaining !== undefined && quotaRemaining <= 0;

  const primaryAction = phase === "error" ? onRetry : canResume ? onResume : onLaunch;
  const primaryLabel =
    phase === "error"
      ? "Try Deploy Again"
      : canResume
        ? resumeLabel || "Continue Deployment"
        : "Launch My Questionnaire Site";
  const PrimaryIcon = phase === "error" || canResume ? RotateCcw : Rocket;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-border-dim bg-surface/40"
    >
      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-promo-accent/10 ring-1 ring-promo-accent/20">
            <Sparkles size={22} className="text-promo-accent" />
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-lg font-semibold text-text-primary sm:text-xl">
              {phase === "error" ? "Deployment interrupted" : "Ready to launch"}
            </h2>
            <p className="text-sm leading-relaxed text-text-secondary">
              {phase === "error"
                ? "Something went wrong while building your site. Review the message below and try again."
                : "Your niche, template, and affiliate link are locked in. One click builds a questionnaire site with your offer on the final page."}
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <SummaryRow icon={Globe} label="Niche" value={nicheLabel} />
          <SummaryRow icon={LayoutTemplate} label="Template" value={templateName} />
          <SummaryRow
            icon={Link2}
            label="Affiliate links"
            value={`${linkCount} link${linkCount === 1 ? "" : "s"} armed`}
          />
        </div>

        {phase === "idle" && !quotaUnlimited && quotaLimit != null && quotaRemaining != null && (
          <p className="text-xs text-promo-accent/90">
            {quotaRemaining} of {quotaLimit} new websites remaining today
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300/90">
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-border-dim bg-page/40 p-6 sm:p-8">
        <motion.button
          type="button"
          onClick={primaryAction}
          disabled={phase === "idle" && !canResume && quotaBlocked}
          whileHover={{ scale: phase === "idle" && !canResume && quotaBlocked ? 1 : 1.01 }}
          whileTap={{ scale: 0.99 }}
          className={clsx(
            "flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 text-base font-bold sm:py-5 sm:text-lg",
            "text-text-on-accent transition-opacity disabled:cursor-not-allowed disabled:opacity-50",
            canResume || phase === "error"
              ? "border border-accent/40 bg-gradient-to-br from-accent to-[#b8942a] shadow-gold"
              : "bg-gradient-to-br from-promo-accent to-promo-accent/80 shadow-[0_0_40px_rgba(12,189,160,0.35)]"
          )}
        >
          <PrimaryIcon size={22} />
          {primaryLabel}
          {phase === "idle" && !canResume && <ArrowRight size={22} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
