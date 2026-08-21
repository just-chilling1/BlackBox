"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export type WorkflowStepId = "activate" | "money-page" | "results";

const STEPS: { id: WorkflowStepId; label: string; path: (assetId?: string) => string | null }[] = [
  { id: "activate", label: "Activate", path: () => "/activate" },
  { id: "money-page", label: "Money page", path: (id) => (id ? `/money-page/${id}` : null) },
  { id: "results", label: "Results", path: () => "/results" },
];

export function WorkflowStepsBar({
  current,
  assetId,
  className,
}: {
  current: WorkflowStepId;
  assetId?: string;
  className?: string;
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Workflow progress" className={clsx("workflow-steps", className)}>
      <ol className="workflow-steps-list">
        {STEPS.map((step, index) => {
          const href = step.path(assetId);
          const done = index < currentIndex;
          const active = step.id === current;
          const upcoming = index > currentIndex;

          const content = (
            <>
              <span
                className={clsx(
                  "workflow-step-dot",
                  done && "workflow-step-dot--done",
                  active && "workflow-step-dot--active",
                  upcoming && "workflow-step-dot--upcoming"
                )}
              >
                {done ? <Check size={12} strokeWidth={2.5} /> : index + 1}
              </span>
              <span className="workflow-step-label">{step.label}</span>
            </>
          );

          // Results is always reachable (no asset id required).
          const canNavigate = Boolean(href) && (!upcoming || step.id === "results");

          return (
            <li key={step.id} className={clsx("workflow-step", active && "workflow-step--active")}>
              {canNavigate && href ? (
                <Link href={href} className="workflow-step-link">
                  {content}
                </Link>
              ) : (
                <span className="workflow-step-link workflow-step-link--disabled">{content}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
