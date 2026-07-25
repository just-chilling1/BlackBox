"use client";

import { Check } from "lucide-react";
import { clsx } from "clsx";
import { WIZARD_STEPS } from "../types";

interface WizardStepperProps {
  currentStep: number;
  className?: string;
}

export function WizardStepper({ currentStep, className }: WizardStepperProps) {
  return (
    <div className={clsx("flex items-center gap-2 mb-8", className)}>
      {WIZARD_STEPS.map((step, index) => (
        <div key={step.number} className="flex items-center flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all shrink-0",
                currentStep === step.number &&
                  "bg-accent text-text-on-accent shadow-[0_0_20px_rgba(234,179,8,0.25)]",
                currentStep > step.number && "bg-accent/20 text-accent border border-accent/30",
                currentStep < step.number && "bg-surface border border-border-dim text-text-muted"
              )}
            >
              {currentStep > step.number ? <Check size={16} /> : step.number}
            </div>
            <div className="hidden sm:block min-w-0">
              <p
                className={clsx(
                  "text-sm font-medium truncate",
                  currentStep >= step.number ? "text-text-primary" : "text-text-muted"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-text-muted truncate">{step.description}</p>
            </div>
          </div>
          {index < WIZARD_STEPS.length - 1 && (
            <div
              className={clsx(
                "h-px flex-1 mx-3 transition-colors",
                currentStep > step.number ? "bg-accent/50" : "bg-border-dim"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
