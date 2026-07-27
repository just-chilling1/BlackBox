import Link from "next/link";
import { LucideIcon, ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export interface HowItWorksStep {
  number: number;
  title: string;
  description: string;
  minutes: string;
  href: string;
  icon: LucideIcon;
  cta: string;
}

interface HowItWorksProps {
  steps: HowItWorksStep[];
  title?: string;
  subtitle?: string;
}

export function HowItWorks({
  steps,
  title = "Here's how it works",
  subtitle = "Three steps to launch, promote, and earn from your offers.",
}: HowItWorksProps) {
  return (
    <section className="dashboard-container animate-fade-in-up">
      <div className="dashboard-section-header">
        <div className="min-w-0">
          <h2 className="ds-h2">{title}</h2>
          <p className="ds-subtitle mt-2">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="dashboard-nested-card flex h-full flex-col gap-4 animate-stagger-item"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/25 bg-accent/10 text-sm font-black text-accent">
                  {step.number}
                </div>
                <span className="rounded-full border border-accent/20 bg-accent/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
                  {step.minutes}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Icon size={18} className="shrink-0 text-promo-accent" />
                <h3 className="ds-h3">{step.title}</h3>
              </div>

              <p className="flex-1 text-sm leading-relaxed text-text-secondary">{step.description}</p>

              <Link href={step.href} className="btn-primary mt-auto w-full min-h-[48px]">
                {step.cta}
                <ArrowRight size={16} />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="dashboard-nested-card mt-5 p-4 sm:p-5">
        <p className="text-sm leading-relaxed text-text-secondary">
          Follow the steps above to launch your first offer. If you get stuck, use the Support card in
          the sidebar.{" "}
          <span className="text-text-muted italic">Individual results vary.</span>
        </p>
      </div>
    </section>
  );
}
