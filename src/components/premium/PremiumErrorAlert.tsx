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
        "flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-800",
        className
      )}
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-600" aria-hidden />
      {message}
    </p>
  );
}
