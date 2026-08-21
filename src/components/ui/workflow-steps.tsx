"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { Check } from "lucide-react";

export type WorkflowStepId = "activate" | "traffic" | "results";

const STEPS: { id: WorkflowStepId; label: string; path: () => string }[] = [
  { id: "activate", label: "Activate Asset", path: () => "/activate" },
  { id: "traffic", label: "Generate Traffic", path: () => "/traffic" },
  { id: "results", label: "Results", path: () => "/results" },
];

export function WorkflowStepsBar({
  current,
  className,
}: {
  current: WorkflowStepId;
  /** @deprecated Asset id is not used — workflow pages are top-level routes. */
  assetId?: string;
  className?: string;
}) {
  const currentIndex = STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Workflow progress" className={clsx("workflow-steps", className)}>
      <ol className="workflow-steps-list">
        {STEPS.map((step, index) => {
          const href = step.path();
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

          const canNavigate = Boolean(href);

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
