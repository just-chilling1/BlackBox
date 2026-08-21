import { clsx } from "clsx";

export interface AcademySectionLink {
  id: string;
  label: string;
}

interface TrainingSectionNavProps {
  sections: AcademySectionLink[];
}

export function TrainingSectionNav({ sections }: TrainingSectionNavProps) {
  if (sections.length === 0) return null;

  return (
    <nav
      className="mb-2 flex flex-wrap gap-2"
      aria-label="Jump to Academy sections"
    >
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={clsx(
            "inline-flex min-h-[36px] items-center rounded-full border border-border-dim/40 bg-surface/40 px-4 py-1.5",
            "text-[12px] font-medium uppercase tracking-[0.12em] text-text-primary transition-colors",
            "hover:border-[var(--np-line-pulse)] hover:bg-pulse-100"
          )}
        >
          {section.label}
        </a>
      ))}
    </nav>
  );
}

interface AcademyOverviewProps {
  platformCount: number;
  premiumCount: number;
  faqCount: number;
}

export function AcademyOverview({
  platformCount,
  premiumCount,
  faqCount,
}: AcademyOverviewProps) {
  return (
    <section className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text-heading">Your learning path</p>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-text-muted">
          Watch the three Dashboard intro videos first, then follow the core tutorials in order.
          Premium walkthroughs unlock after your first live money page.
        </p>
      </div>
      <dl className="grid shrink-0 grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-xl border border-border-dim/30 bg-surface/30 px-3 py-2.5 text-center">
          <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Core
          </dt>
          <dd className="mt-1 text-lg font-medium text-pulse-700">{platformCount}</dd>
        </div>
        <div className="rounded-xl border border-border-dim/30 bg-surface/30 px-3 py-2.5 text-center">
          <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            Premium
          </dt>
          <dd className="mt-1 text-lg font-medium text-pulse-700">{premiumCount}</dd>
        </div>
        <div className="rounded-xl border border-border-dim/30 bg-surface/30 px-3 py-2.5 text-center">
          <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-text-muted">
            FAQ
          </dt>
          <dd className="mt-1 text-lg font-medium text-pulse-700">{faqCount}</dd>
        </div>
      </dl>
    </section>
  );
}
