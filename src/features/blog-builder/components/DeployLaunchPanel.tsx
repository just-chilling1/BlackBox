"use client";

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
    <div className="dashboard-nested-card flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brass-100">
        <Icon size={16} className="text-brass-700" />
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-text-muted">{label}</p>
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
    <section className="wizard-panel overflow-hidden p-0 animate-fade-in-up">
      <div className="space-y-6 p-6 sm:p-8">
        <div className="wizard-panel-header mb-0 border-b-0 pb-0">
          <div className="wizard-panel-icon h-12 w-12">
            <Sparkles size={22} />
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="ds-h3">
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
          <p className="text-[13px] font-medium text-text-secondary">
            {quotaRemaining} of {quotaLimit} new websites remaining today
          </p>
        )}

        {error && <p className="alert-error">{error}</p>}
      </div>

      <div className="border-t border-border-dim bg-page/60 p-6 sm:p-8">
        <button
          type="button"
          onClick={primaryAction}
          disabled={phase === "idle" && !canResume && quotaBlocked}
          className={clsx(
            "btn-primary-prominent min-h-[3.25rem] w-full whitespace-normal text-center leading-snug sm:min-h-[4rem] sm:text-base",
            (canResume || phase === "error") && "border border-[var(--bb-line-brass)]"
          )}
        >
          <PrimaryIcon size={22} />
          {primaryLabel}
          {phase === "idle" && !canResume && <ArrowRight size={22} />}
        </button>
      </div>
    </section>
  );
}
