"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, GraduationCap, Headphones, Sparkles, CheckCircle2 } from "lucide-react";
import { brand } from "@/config/brand.config";
import { dashboardContent } from "@/config/dashboard.config";
import { trainingContent } from "@/config/training.config";
import { isFeatureEnabled } from "@/config/features.config";
import { getDashboardHowItWorksSteps, getDashboardQuickActions } from "@/lib/dashboard-steps";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/ui/page-header";
import { HowItWorks } from "@/components/ui/how-it-works";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { VideoOverlay } from "@/components/ui/video-overlay";
import { QuickActionCard } from "@/components/ui/quick-action-card";
import { WelcomeOfferBanner } from "@/components/ui/welcome-offer-banner";
import { ContactSupportWidget } from "@/components/dashboard/ContactSupportWidget";
import { DashboardTipsWidget } from "@/components/dashboard/DashboardTipsWidget";
import { PremiumUpgradesWidget } from "@/components/dashboard/PremiumUpgradesWidget";
import { HonestActivity } from "@/components/dashboard/HonestActivity";
import { DopamineDashboard } from "@/features/dopamine/DopamineDashboard";

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

function resolveIntroVideoId(): string {
  return dashboardContent.introVideoId || trainingContent.videos[0]?.id || "";
}

export default function DashboardPage() {
  const router = useRouter();
  const [videoOpen, setVideoOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  const introVideoId = resolveIntroVideoId();
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
    void supabase.auth.getUser().then(({ data: { user } }) => {
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
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
      <PageHeader
        eyebrow={dashboardContent.eyebrow}
        title={welcomeTitle}
        subtitle={dashboardContent.subtitle}
      />

      <WelcomeOfferBanner compact />

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="flex flex-col gap-8 xl:col-span-3">
          {introVideoId ? (
            <section className="card-base overflow-hidden border-border-dim/60 p-0!">
              <VideoThumbnail
                videoId={introVideoId}
                title={dashboardContent.introVideoTitle}
                onPlay={() => setVideoOpen(true)}
                eager
                className="rounded-none border-0"
              />
              <div className="flex flex-col gap-4 border-t border-border-dim/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-text-primary">{dashboardContent.introVideoTitle}</p>
                  <p className="mt-1 text-xs text-text-muted">{dashboardContent.introVideoSubtitle}</p>
                </div>
                <Link href="/training" className="btn-primary min-h-[48px] shrink-0">
                  Open Training Academy
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>
          ) : (
            <section className="accent-card card-base flex flex-col gap-4 border-dashed border-accent/30 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-text-primary">Start with Training Academy</p>
                <p className="mt-1 text-xs text-text-muted">
                  Add a Vimeo ID in training.config.ts to show the intro video here.
                </p>
              </div>
              <Link href="/training" className="btn-primary min-h-[48px] shrink-0">
                <GraduationCap size={18} />
                Open Academy
              </Link>
            </section>
          )}

          <HowItWorks steps={howItWorksSteps} />

          <section>
            <h2 className="ds-h2 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          </section>

          <HonestActivity />

          <section className="accent-card card-base flex flex-col gap-4 border-promo-accent/20 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-promo-accent/10 border border-promo-accent/20">
                <Headphones className="h-7 w-7 text-promo-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-heading">Need Help?</h3>
                <p className="text-sm text-text-muted">Priority support when you need it</p>
              </div>
            </div>
            <Link href="/support" className="btn-primary min-h-[48px] shrink-0">
              Contact Support
              <ArrowRight size={16} />
            </Link>
          </section>

          <p className="text-center text-xs text-text-muted italic">Individual results vary.</p>
        </div>

        <aside className="flex flex-col gap-4 xl:col-span-1">
          <ContactSupportWidget />
          <DashboardTipsWidget />
          {hasPremium ? <PremiumUpgradesWidget /> : null}
        </aside>
      </div>

      {showDevChecklist ? (
        <div className="card-base flex flex-col gap-4 border-dashed border-accent/30">
          <div className="flex items-center gap-3">
            <Sparkles className="shrink-0 text-accent" size={20} />
            <span className="font-bold text-text-primary">Developer setup checklist</span>
          </div>
          <ul className="flex flex-col gap-3">
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
          <p className="text-xs text-text-muted">
            Full handoff guide: <code className="text-accent">DEVELOPER-SETUP.md</code> in the project root.
          </p>
        </div>
      ) : null}

      {isFeatureEnabled("dopamine") ? <DopamineDashboard /> : null}

      {introVideoId ? (
        <VideoOverlay
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoUrl={`https://player.vimeo.com/video/${introVideoId}`}
          title={dashboardContent.introVideoTitle}
        />
      ) : null}
    </div>
  );
}
