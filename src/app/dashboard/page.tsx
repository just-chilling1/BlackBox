"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { brand } from "@/config/brand.config";
import { dashboardContent } from "@/config/dashboard.config";
import { isFeatureEnabled } from "@/config/features.config";
import { getDashboardHowItWorksSteps, getDashboardQuickActions } from "@/lib/dashboard-steps";
import { getCachedClientUser } from "@/lib/auth-client-cache";
import { HowItWorks } from "@/components/ui/how-it-works";
import { QuickActionCard } from "@/components/ui/quick-action-card";
import { FeaturedVideoSection } from "@/components/dashboard/FeaturedVideoSection";
import { ContactSupportWidget } from "@/components/dashboard/ContactSupportWidget";
import { DashboardTipsWidget } from "@/components/dashboard/DashboardTipsWidget";
import { PremiumUpgradesWidget } from "@/components/dashboard/PremiumUpgradesWidget";
import { HonestActivity } from "@/components/dashboard/HonestActivity";
import { DashboardSection } from "@/components/dashboard/DashboardSection";

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
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const howItWorksSteps = useMemo(() => getDashboardHowItWorksSteps(), []);
  const quickActions = useMemo(() => getDashboardQuickActions(), []);

  const hasPremium =
    isFeatureEnabled("premium-dfy") ||
    isFeatureEnabled("premium-instant") ||
    isFeatureEnabled("premium-autopilot") ||
    isFeatureEnabled("premium-accelerator") ||
    isFeatureEnabled("premium-recurring") ||
    isFeatureEnabled("premium-social") ||
    isFeatureEnabled("protector");

  const showDevChecklist = process.env.NODE_ENV === "development";

  useEffect(() => {
    const hash = window.location.hash;
    if (
      hash &&
      hash.includes("error=") &&
      (hash.includes("otp_expired") || hash.includes("access_denied") || hash.includes("recovery"))
    ) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const errorDesc =
        hashParams.get("error_description") || "This password reset link has expired or is invalid.";
      router.replace(`/reset-password?error=${encodeURIComponent(errorDesc.replace(/\+/g, " "))}`);
    }
  }, [router]);

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      if (!user) return;
      const metaName = user.user_metadata?.full_name as string | undefined;
      if (metaName) {
        setFirstName(metaName.split(" ")[0] ?? "");
        return;
      }
      const emailPrefix = user.email?.split("@")[0];
      if (emailPrefix) setFirstName(emailPrefix);
    });
  }, []);

  const welcomeTitle = firstName
    ? `${dashboardContent.title}, ${firstName}`
    : dashboardContent.title;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <DashboardSection as="header">
        <div className="flex flex-col gap-2 min-w-0">
          {dashboardContent.eyebrow ? <span className="page-eyebrow">{dashboardContent.eyebrow}</span> : null}
          <h1 className="ds-h1">{welcomeTitle}</h1>
          {dashboardContent.subtitle ? (
            <p className="ds-subtitle">{dashboardContent.subtitle}</p>
          ) : null}
        </div>
      </DashboardSection>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
        <div className="flex flex-col gap-6 xl:col-span-3">
          <FeaturedVideoSection onPlayWithoutVideo={() => router.push("/training")} />

          <HowItWorks steps={howItWorksSteps} />

          <DashboardSection>
            <div className="dashboard-section-header mb-0 border-b-0 pb-0">
              <div className="min-w-0">
                <h2 className="ds-h2">Quick Actions</h2>
                <p className="mt-2 text-sm text-text-secondary">
                  Jump straight into the tools you use most.
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
              {quickActions.map((action) => (
                <QuickActionCard
                  key={action.href}
                  title={action.title}
                  description={action.description}
                  icon={action.icon}
                  href={action.href}
                  buttonText={action.buttonText}
                  accent={action.accent}
                />
              ))}
            </div>
          </DashboardSection>

          {hasPremium ? <PremiumUpgradesWidget /> : null}

          <HonestActivity />

          <DashboardSection className="py-4 text-center">
            <p className="text-xs text-text-muted italic">Individual results vary.</p>
          </DashboardSection>
        </div>

        <aside className="flex flex-col gap-6 xl:col-span-1">
          <ContactSupportWidget />
          <DashboardTipsWidget />
        </aside>
      </div>

      {showDevChecklist ? (
        <DashboardSection className="border-dashed border-accent/30">
          <div className="flex items-center gap-3">
            <Sparkles className="shrink-0 text-accent" size={20} />
            <span className="font-bold text-text-primary">Developer setup checklist</span>
          </div>
          <ul className="mt-4 flex flex-col gap-3">
            {SETUP_STEPS.map((step) => (
              <li key={step.title} className="flex gap-3 text-sm">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
                <div>
                  <p className="font-medium text-text-primary">{step.title}</p>
                  <p className="leading-relaxed text-text-secondary">{step.body}</p>
                  {"href" in step && step.href ? (
                    <Link
                      href={step.href}
                      className="mt-1 inline-block text-xs font-medium text-accent hover:underline"
                    >
                      Open page →
                    </Link>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-text-muted">
            Full handoff guide: <code className="text-accent">DEVELOPER-SETUP.md</code> in the project root.
          </p>
        </DashboardSection>
      ) : null}
    </div>
  );
}
