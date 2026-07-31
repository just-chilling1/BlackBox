"use client";

import Link from "next/link";
import { CheckCircle2, Lightbulb, Play, Star } from "lucide-react";
import {
  getPlatformTutorialVideos,
  getPremiumTutorialVideos,
  trainingProTips,
  trainingQuickStartChecklist,
  trainingWorkflowSteps,
} from "@/lib/training-content";
import { TrainingPageLayout } from "../components/TrainingPageLayout";
import { TrainingVideoCard } from "../components/TrainingVideoCard";
import { TrainingPathBanner } from "../components/TrainingPathBanner";
import { TrainingCtaSection } from "../components/TrainingCtaSection";

export default function TrainingVideosPage() {
  const platformVideos = getPlatformTutorialVideos();
  const premiumVideos = getPremiumTutorialVideos();

  return (
    <TrainingPageLayout>
      <div className="flex flex-col gap-8 lg:gap-10">
        <TrainingPathBanner />

        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <Play className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-heading">Platform Tutorials</h2>
              <p className="text-sm text-text-muted">Core workflow — watch in order after Dashboard intro videos</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {platformVideos.map((video, index) => (
              <TrainingVideoCard key={video.title} video={video} index={index} priority={index === 0} />
            ))}
          </div>
        </section>

        <section className="glass-card p-5 sm:p-6">
          <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-text-muted">Quick reference</h3>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trainingWorkflowSteps.map((step) => (
              <li key={step.step} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent-readable">
                  {step.step}
                </span>
                <div className="min-w-0">
                  <Link
                    href={step.page}
                    className="text-sm font-semibold text-text-heading transition-colors hover:text-accent-readable"
                  >
                    {step.title}
                  </Link>
                  <p className="mt-1 text-xs leading-relaxed text-text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
              <Star className="h-5 w-5 text-accent" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-heading">Premium Feature Tutorials</h2>
              <p className="text-sm text-text-muted">Scale after your first live offer — watch in any order</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
            {premiumVideos.map((video) => (
              <TrainingVideoCard key={video.badge} video={video} />
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              <h3 className="text-base font-bold text-text-heading">Launch checklist</h3>
            </div>
            <ul className="mt-4 space-y-3">
              {trainingQuickStartChecklist.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-text-secondary">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="glass-card p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-accent" />
              <h3 className="text-base font-bold text-text-heading">Pro tips</h3>
            </div>
            <ul className="mt-4 space-y-4">
              {trainingProTips.map((tip) => (
                <li key={tip.title}>
                  <p className="text-sm font-semibold text-text-heading">{tip.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{tip.text}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <TrainingCtaSection />
      </div>
    </TrainingPageLayout>
  );
}
