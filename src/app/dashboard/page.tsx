"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, GraduationCap, Headphones, CheckCircle2 } from "lucide-react";
import { brand } from "@/config/brand.config";
import { getVisibleWorkflowSteps } from "@/lib/features";
import { isFeatureEnabled } from "@/config/features.config";
import { PageHeader } from "@/components/ui/page-header";
import { DopamineDashboard } from "@/features/dopamine/DopamineDashboard";
import { PremiumUpgradesWidget } from "@/components/dashboard/PremiumUpgradesWidget";
import { DashboardTipsWidget } from "@/components/dashboard/DashboardTipsWidget";

const SETUP_STEPS = [
  {
    title: "Connect Supabase",
    body: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then run the auth setup script (see DEVELOPER-SETUP.md).",
  },
  {
    title: "Customize branding",
    body: "Edit brand.config.ts, promos.config.ts, offers.config.ts, support.config.ts, and training.config.ts.",
  },
  {
    title: "Add client links",
    body: "Replace example URLs for ads, support, training videos, and partner offers — full table in DEVELOPER-SETUP.md.",
  },
  {
    title: "Enable product workflow",
    body: "Add your feature ids to enabledFeatures in features.config.ts (e.g. core-workflow, blog-builder, product-wizard).",
  },
  {
    title: "Review Training page",
    body: "Add Vimeo video IDs and copy in training.config.ts. Always visible when training is enabled.",
    href: "/training",
  },
  {
    title: "Review Support page",
    body: "Set support email, contact URL, and stats in support.config.ts.",
    href: "/support",
  },
] as const;

export default function DashboardPage() {
  const workflowSteps = getVisibleWorkflowSteps();
  const firstStep = workflowSteps[0];
  const hasWorkflow = workflowSteps.length > 0;
  const hasPremium = isFeatureEnabled("premium-dfy") ||
    isFeatureEnabled("premium-instant") ||
    isFeatureEnabled("premium-autopilot") ||
    isFeatureEnabled("premium-accelerator") ||
    isFeatureEnabled("premium-social") ||
    isFeatureEnabled("protector");

  const showDevChecklist = process.env.NODE_ENV === "development";

  return (
    <div className="page-stack w-full max-w-4xl">
      <PageHeader
        title={`Welcome to ${brand.productName}`}
        subtitle={
          hasWorkflow
            ? "Your workspace is ready. Use the sidebar to run the workflow, open Training, or contact Support."
            : "Skeleton is running with Training and Support in the sidebar. Enable your product workflow when branding and links are ready."
        }
      />

      <div className="flex flex-wrap gap-3">
        <Link href="/training" className="btn-primary inline-flex items-center gap-2 px-5 sm:px-6">
          <GraduationCap size={18} />
          Academy
        </Link>
        <Link
          href="/support"
          className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-lg font-semibold border border-border-dim text-text-primary hover:bg-white/5"
        >
          <Headphones size={18} />
          Support
        </Link>
        {firstStep ? (
          <Link
            href={firstStep.path}
            className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-lg font-semibold border border-accent/30 text-accent hover:bg-accent/5"
          >
            Start workflow
            <ArrowRight size={18} />
          </Link>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardTipsWidget />
        {hasPremium ? <PremiumUpgradesWidget /> : null}
      </div>

      {showDevChecklist ? (
      <div className="card-base border-dashed border-accent/30 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="text-accent shrink-0" size={20} />
          <span className="font-bold text-text-primary">Developer setup checklist</span>
        </div>
        <ul className="flex flex-col gap-3">
          {SETUP_STEPS.map((step) => (
            <li key={step.title} className="flex gap-3 text-sm">
              <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-text-primary">{step.title}</p>
                <p className="text-text-secondary leading-relaxed">{step.body}</p>
                {"href" in step && step.href ? (
                  <Link href={step.href} className="text-accent text-xs font-medium hover:underline mt-1 inline-block">
                    Open page →
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <p className="text-xs text-text-muted">
          Full handoff guide: <code className="text-accent">DEVELOPER-SETUP.md</code> in the project root.
        </p>
      </div>
      ) : null}

      {isFeatureEnabled("dopamine") ? <DopamineDashboard /> : null}
    </div>
  );
}
