import { clsx } from "clsx";
import type { ReactNode } from "react";

type WorkflowWidth = "narrow" | "default" | "wide" | "full";

const widthClass: Record<WorkflowWidth, string> = {
  narrow: "max-w-xl",
  default: "w-full max-w-none",
  wide: "w-full max-w-none",
  full: "w-full max-w-none",
};

export function WorkflowPage({
  children,
  width = "default",
  className,
}: {
  children: ReactNode;
  width?: WorkflowWidth;
  className?: string;
}) {
  return (
    <div className={clsx("page-container mx-auto flex min-h-0 w-full flex-1 flex-col", widthClass[width], className)}>
      {children}
    </div>
  );
}
