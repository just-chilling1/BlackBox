"use client";

import Link from "next/link";
import { LucideIcon, ArrowRight, Check, Info } from "lucide-react";
import { clsx } from "clsx";
import { useWorkflowNav } from "@/context/WorkflowNavContext";
import { getDashboardStepStatuses, type DashboardStepStatus } from "@/lib/dashboard-steps";

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  minutes: string;
  href: string;
  icon: LucideIcon;
  cta: string;
}

interface HowItWorksProps {
  steps: HowItWorksStep[];
  title?: string;
  subtitle?: string;
}

function StepBadge({
  number,
  status,
}: {
  number: number;
  status: DashboardStepStatus;
}) {
  if (status === "completed") {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-700">
        <Check size={18} strokeWidth={2.5} aria-hidden />
      </div>
    );
  }

  return (
    <div
      className={clsx(
        "flex h-10 w-10 items-center justify-center rounded-full text-sm font-black",
        status === "current"
          ? "border-2 border-accent bg-accent text-text-on-accent shadow-gold"
          : "border border-border-dim bg-slate-100 text-text-muted"
      )}
    >
      {number}
    </div>
  );
}

export function HowItWorks({
  steps,
  title = "Here's how it works",
  subtitle = "Three steps to launch, promote, and earn from your offers.",
}: HowItWorksProps) {
  const { progress } = useWorkflowNav();
  const stepStatuses = getDashboardStepStatuses(progress);

  return (
    <section className="dashboard-container animate-fade-in-up">
      <div className="dashboard-section-header">
        <div className="min-w-0">
          <h2 className="ds-h2">{title}</h2>
          <p className="ds-subtitle mt-2">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = stepStatuses[index] ?? "upcoming";
          const isCurrent = status === "current";
          const isCompleted = status === "completed";
          const isUpcoming = status === "upcoming";
          const showStartHere = step.number === 1 && isCurrent;

          return (
            <div
              key={step.number}
              className={clsx(
                "dashboard-nested-card flex h-full flex-col animate-stagger-item transition-all duration-200",
                isCurrent && "border-accent/40 bg-white ring-2 ring-accent/15 shadow-gold",
                isUpcoming && "opacity-60 saturate-[0.85]",
                isCompleted && "border-emerald-500/20 bg-emerald-50/30"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center gap-2.5">
                <StepBadge number={step.number} status={status} />
                <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-text-on-accent">
                  {step.minutes}
                </span>
                {showStartHere ? (
                  <span className="ml-auto rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Start Here
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex items-center gap-2">
                <Icon
                  size={18}
                  className={clsx(
                    "shrink-0",
                    isCurrent ? "text-promo-accent" : isCompleted ? "text-emerald-600" : "text-text-muted"
                  )}
                />
                <h3 className={clsx("ds-h3", isUpcoming && "text-text-secondary")}>{step.title}</h3>
              </div>

              <p className="mt-3 flex-1 text-sm leading-relaxed text-text-secondary">{step.description}</p>

              <Link
                href={step.href}
                className={clsx(
                  "mt-5 w-full min-h-[48px]",
                  isCurrent ? "btn-primary" : "btn-secondary",
                  isUpcoming && "border-border-dim/80 bg-page text-text-secondary"
                )}
              >
                {isCompleted ? "Review" : step.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex gap-3 rounded-xl border border-accent/15 bg-accent/5 p-5 sm:p-6">
        <Info size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
        <p className="text-sm leading-relaxed text-text-secondary">
          Follow the steps above to launch your first offer. If you get stuck, use the Support card in
          the sidebar.{" "}
          <span className="text-text-muted italic">Individual results vary.</span>
        </p>
      </div>
    </section>
  );
}
