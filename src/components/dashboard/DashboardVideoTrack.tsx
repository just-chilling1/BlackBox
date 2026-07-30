"use client";

import Link from "next/link";
import { Headphones, Play } from "lucide-react";
import { dashboardContent } from "@/config/dashboard.config";
import {
  getDashboardAcademyCta,
  getDashboardStartCta,
  getDashboardVideos,
} from "@/lib/dashboard-content";
import { DashboardBonusAdCard } from "./DashboardBonusAdCard";
import { DashboardSection } from "./DashboardSection";
import { DashboardVideoCard } from "./DashboardVideoCard";

export function DashboardVideoTrack() {
  const videos = getDashboardVideos();
  const startCta = getDashboardStartCta();
  const academyCta = getDashboardAcademyCta();
  const StartIcon = startCta.icon;
  const AcademyIcon = academyCta.icon;

  return (
    <div className="flex min-w-0 flex-col gap-6 lg:gap-8">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10">
            <Play className="h-5 w-5 text-accent" />
          </div>
          <h2 className="ds-h2">{dashboardContent.startHereTitle}</h2>
        </div>
        {videos[0] ? <DashboardVideoCard video={videos[0]} priority /> : null}
      </section>

      <DashboardBonusAdCard />

      {videos[1] ? <DashboardVideoCard video={videos[1]} /> : null}

      <DashboardBonusAdCard />

      {videos[2] ? <DashboardVideoCard video={videos[2]} /> : null}

      <section className="flex min-w-0 flex-col gap-3">
        <Link
          href={startCta.href}
          className="btn-primary min-h-[48px] w-full px-4 text-center text-sm leading-snug sm:text-base"
        >
          <StartIcon className="h-5 w-5 shrink-0" />
          <span className="text-balance">{startCta.label}</span>
        </Link>
        <Link
          href={academyCta.href}
          className="btn-secondary min-h-[48px] w-full px-4 text-center text-sm leading-snug sm:text-base"
        >
          <AcademyIcon className="h-5 w-5 shrink-0" />
          <span className="text-balance">{academyCta.label}</span>
        </Link>
      </section>

      <DashboardSection>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10 sm:h-14 sm:w-14">
              <Headphones className="h-6 w-6 text-accent sm:h-7 sm:w-7" />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-bold text-text-heading sm:text-xl">
                {dashboardContent.needHelp.title}
              </h3>
              <p className="text-sm text-text-secondary">{dashboardContent.needHelp.subtitle}</p>
            </div>
          </div>
          <Link
            href={dashboardContent.needHelp.href}
            className="btn-primary w-full shrink-0 px-6 sm:w-auto sm:px-8"
          >
            {dashboardContent.needHelp.ctaLabel}
          </Link>
        </div>
      </DashboardSection>
    </div>
  );
}
