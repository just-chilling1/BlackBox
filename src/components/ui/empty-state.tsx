import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionHref,
  actionLabel,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}) {
  const href = action?.href ?? actionHref;
  const label = action?.label ?? actionLabel;

  return (
    <div className={clsx("empty-state-panel", className)}>
      <div className="empty-state-icon">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="ds-h3">{title}</h3>
      <p className="max-w-md text-sm leading-relaxed text-text-secondary">{description}</p>
      {href && label ? (
        <Link href={href} className="btn-primary mt-1">
          {label}
        </Link>
      ) : null}
    </div>
  );
}
