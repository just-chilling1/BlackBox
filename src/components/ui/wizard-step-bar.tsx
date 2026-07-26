import { clsx } from "clsx";

interface WizardStepBarProps {
  breadcrumb: string;
  step: number;
  total?: number;
  className?: string;
}

export function WizardStepBar({ breadcrumb, step, total = 4, className }: WizardStepBarProps) {
  return (
    <div
      className={clsx(
        "sticky top-0 z-20 -mx-1 mb-2 rounded-xl border border-white/[0.08] bg-page/95 px-4 py-3 backdrop-blur-xl",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-promo-accent truncate">
          {breadcrumb}
        </p>
        <span className="text-xs text-text-muted shrink-0">
          Step {step} of {total}
        </span>
      </div>
    </div>
  );
}
