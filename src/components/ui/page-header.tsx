import { ReactNode } from "react";
import { clsx } from "clsx";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <header className={clsx("flex flex-col gap-4 mb-2 sm:mb-3", className)}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <div className="flex flex-col gap-3 min-w-0">
          {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
          <h1 className="ds-h1">{title}</h1>
          {subtitle ? <p className="ds-subtitle max-w-2xl">{subtitle}</p> : null}
        </div>
        {actions ? (
          <div className="flex w-full flex-wrap items-center gap-3 sm:gap-3 md:w-auto md:shrink-0">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}
