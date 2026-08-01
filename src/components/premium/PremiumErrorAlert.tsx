import { AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface PremiumErrorAlertProps {
  message: string;
  className?: string;
}

export function PremiumErrorAlert({ message, className }: PremiumErrorAlertProps) {
  return (
    <p
      role="alert"
      className={clsx(
        "flex items-start gap-2 rounded-lg border border-[var(--bb-danger)]/20 bg-[var(--bb-danger)]/10 px-3 py-2.5 text-sm font-medium text-[var(--bb-danger)]",
        className
      )}
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-[var(--bb-danger)]" aria-hidden />
      {message}
    </p>
  );
}
