"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { VideoOverlay } from "@/components/ui/video-overlay";
import { dashboardContent } from "@/config/dashboard.config";
import { trainingContent } from "@/config/training.config";
import { DashboardSection } from "./DashboardSection";

function resolveIntroVideoId(): string {
  return dashboardContent.introVideoId || trainingContent.videos[0]?.id || "";
}

interface FeaturedVideoSectionProps {
  onPlayWithoutVideo?: () => void;
}

export function FeaturedVideoSection({ onPlayWithoutVideo }: FeaturedVideoSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const introVideoId = resolveIntroVideoId();

  const handlePlay = () => {
    if (introVideoId) {
      setVideoOpen(true);
      return;
    }
    onPlayWithoutVideo?.();
  };

  return (
    <>
      <DashboardSection flush>
        <div className="dashboard-section-header mb-0 border-b border-border-dim/60 px-5 py-4">
          <div className="dashboard-section-icon">
            <PlayCircle className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <h2 className="ds-h3">{dashboardContent.introVideoTitle}</h2>
            <p className="mt-1 text-sm text-text-secondary">{dashboardContent.introVideoSubtitle}</p>
          </div>
        </div>

        <VideoThumbnail
          videoId={introVideoId}
          title={dashboardContent.introVideoTitle}
          caption={`▶ ${dashboardContent.introVideoSubtitle}`}
          onPlay={handlePlay}
          eager
          className="rounded-none border-0 border-y border-border-dim/30"
        />

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-text-primary">{dashboardContent.introVideoTitle}</p>
            <p className="mt-1 text-xs text-text-muted">{dashboardContent.introVideoSubtitle}</p>
          </div>
          <Link href="/training" className="btn-primary min-h-[48px] shrink-0">
            Open Training Academy
            <ArrowRight size={16} />
          </Link>
        </div>
      </DashboardSection>

      {introVideoId ? (
        <VideoOverlay
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoUrl={`https://player.vimeo.com/video/${introVideoId}`}
          title={dashboardContent.introVideoTitle}
        />
      ) : null}
    </>
  );
}
