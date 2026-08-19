import { clsx } from "clsx";
import type { ReactNode } from "react";

type WorkflowWidth = "narrow" | "default" | "wide";

const widthClass: Record<WorkflowWidth, string> = {
  narrow: "max-w-xl",
  default: "max-w-4xl",
  wide: "max-w-5xl",
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
    <div className={clsx("page-container mx-auto w-full", widthClass[width], className)}>
      {children}
    </div>
  );
}
