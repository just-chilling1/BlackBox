"use client";

import Link from "next/link";
import { ArrowRight, ListOrdered } from "lucide-react";
import { getTrainingDashboardCta } from "@/lib/training-content";

export function TrainingPathBanner() {
  const dashboardCta = getTrainingDashboardCta();

  return (
    <div className="glass-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
          <ListOrdered className="h-5 w-5 text-accent" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-text-heading">Recommended watch order</h2>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            Start with the three <strong className="font-semibold text-text-primary">Start Here</strong>{" "}
            videos on your Dashboard, then work through Platform Tutorials below in order. Premium
            tutorials unlock after your first live offer.
          </p>
        </div>
      </div>
      <Link
        href={dashboardCta.href}
        className="btn-secondary min-h-[44px] w-full shrink-0 px-5 text-sm sm:w-auto"
      >
        {dashboardCta.label}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
