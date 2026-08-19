import { clsx } from "clsx";
import { InputHTMLAttributes, forwardRef } from "react";

export type GlassInputProps = InputHTMLAttributes<HTMLInputElement>;

export const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={clsx(
          "flex h-14 w-full rounded-xl border border-border-dim bg-white px-6 py-3 text-lg",
          "text-text-primary placeholder:text-text-muted focus-visible:outline-none",
          "focus-visible:ring-2 focus-visible:ring-pulse-100 focus-visible:border-pulse-700",
          "transition-all duration-300 hover:border-[var(--np-line-pulse)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

GlassInput.displayName = "GlassInput";
