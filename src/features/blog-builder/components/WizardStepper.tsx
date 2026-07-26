"use client";

import { Fragment } from "react";
import { Check } from "lucide-react";
import { clsx } from "clsx";
import { WIZARD_STEPS } from "../types";

interface WizardStepperProps {
  currentStep: number;
  className?: string;
}

export function WizardStepper({ currentStep, className }: WizardStepperProps) {
  return (
    <nav aria-label="Site builder progress" className={clsx("mb-8", className)}>
      <ol className="flex w-full items-start">
        {WIZARD_STEPS.map((step, index) => {
          const isComplete = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <Fragment key={step.number}>
              <li className="flex min-w-0 flex-1 flex-col items-center px-0.5 text-center sm:px-1">
                <div
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all",
                    isActive &&
                      "bg-accent text-text-on-accent shadow-[0_0_20px_rgba(234,179,8,0.25)]",
                    isComplete && "border border-accent/30 bg-accent/20 text-accent",
                    !isComplete && !isActive && "border border-border-dim bg-surface text-text-muted"
                  )}
                  aria-current={isActive ? "step" : undefined}
                >
                  {isComplete ? <Check size={16} aria-hidden /> : step.number}
                </div>
                <p
                  className={clsx(
                    "mt-2 text-xs font-medium leading-snug sm:text-sm",
                    currentStep >= step.number ? "text-text-primary" : "text-text-muted"
                  )}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-[10px] leading-snug text-text-muted sm:text-xs">
                  {step.description}
                </p>
              </li>

              {index < WIZARD_STEPS.length - 1 && (
                <li
                  aria-hidden
                  className={clsx(
                    "mt-5 h-px w-3 shrink-0 sm:w-6 md:w-10",
                    currentStep > step.number ? "bg-accent/50" : "bg-border-dim"
                  )}
                />
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
