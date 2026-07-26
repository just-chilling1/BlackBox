import { Loader2 } from "lucide-react";
import { clsx } from "clsx";

interface PageLoadingProps {
  message?: string;
  className?: string;
}

export function PageLoading({ message = "Loading...", className }: PageLoadingProps) {
  return (
    <div className={clsx("page-stack w-full", className)}>
      <div className="page-loading" role="status" aria-live="polite">
        <Loader2 size={22} className="animate-spin text-promo-accent" aria-hidden />
        <p>{message}</p>
      </div>
    </div>
  );
}
