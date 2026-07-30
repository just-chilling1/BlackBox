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
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Play className="h-6 w-6 text-accent" />
          <h2 className="ds-h2">{dashboardContent.startHereTitle}</h2>
        </div>
        {videos[0] ? <DashboardVideoCard video={videos[0]} priority /> : null}
      </div>

      <DashboardBonusAdCard />

      {videos[1] ? <DashboardVideoCard video={videos[1]} /> : null}

      <DashboardBonusAdCard />

      {videos[2] ? <DashboardVideoCard video={videos[2]} /> : null}

      <div className="flex flex-col gap-3">
        <Link href={startCta.href} className="btn-primary min-h-[48px] w-full">
          <StartIcon className="h-5 w-5" />
          {startCta.label}
        </Link>
        <Link href={academyCta.href} className="btn-secondary min-h-[48px] w-full">
          <AcademyIcon className="h-5 w-5" />
          {academyCta.label}
        </Link>
      </div>

      <DashboardSection>
        <div className="flex flex-col items-stretch justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
              <Headphones className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-heading">{dashboardContent.needHelp.title}</h3>
              <p className="text-sm text-text-secondary">{dashboardContent.needHelp.subtitle}</p>
            </div>
          </div>
          <Link href={dashboardContent.needHelp.href} className="btn-primary shrink-0 px-8">
            {dashboardContent.needHelp.ctaLabel}
          </Link>
        </div>
      </DashboardSection>
    </div>
  );
}
