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
    <header className={clsx("flex flex-col gap-4 mb-6 sm:mb-8", className)}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          {eyebrow ? <span className="page-eyebrow">{eyebrow}</span> : null}
          <h1 className="ds-h1">{title}</h1>
          {subtitle ? <p className="ds-subtitle">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex items-center gap-3 shrink-0">{actions}</div> : null}
      </div>
    </header>
  );
}
