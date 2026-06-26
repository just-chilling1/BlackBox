"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, GraduationCap, Headphones, CheckCircle2 } from "lucide-react";
import { brand } from "@/config/brand.config";
import { getVisibleWorkflowSteps } from "@/lib/features";
import { isFeatureEnabled } from "@/config/features.config";
import { DopamineDashboard } from "@/features/dopamine/DopamineDashboard";

const SETUP_STEPS = [
  {
    title: "Connect Supabase",
    body: "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then run the auth setup script (see DEVELOPER-SETUP.md).",
  },
  {
    title: "Customize branding",
    body: "Edit brand.config.ts, promos.config.ts, support.config.ts, and training.config.ts.",
  },
  {
    title: "Add client links",
    body: "Replace example URLs for ads, support, training videos, and partner offers — full table in DEVELOPER-SETUP.md.",
  },
  {
    title: "Enable product workflow",
    body: "Add core-workflow or your custom feature id to enabledFeatures in features.config.ts.",
  },
  {
    title: "Review Training page",
    body: "Add Vimeo video IDs and copy in training.config.ts. Always visible in the sidebar.",
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
  const hasWorkflow = isFeatureEnabled("core-workflow");

  return (
    <div className="flex flex-col gap-8 sm:gap-10 max-w-3xl w-full">
      <div className="flex flex-col gap-2 sm:gap-3">
        <h1 className="brand-font text-2xl sm:text-3xl lg:text-4xl text-text-primary tracking-tight">
          Welcome to {brand.productName}
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed">
          {hasWorkflow
            ? "Your workspace is ready. Use the sidebar to run the workflow, open Training, or contact Support."
            : "Skeleton is running with Training and Support in the sidebar. Enable your product workflow when branding and links are ready."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/training" className="btn-primary inline-flex items-center gap-2 px-5 sm:px-6">
          <GraduationCap size={18} />
          Training
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

      {isFeatureEnabled("dopamine") ? <DopamineDashboard /> : null}
    </div>
  );
}
