"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { VideoOverlay } from "@/components/ui/video-overlay";
import { DashboardSection } from "./DashboardSection";
import { vimeoPlayerUrl, type DashboardVideo } from "@/lib/dashboard-content";

interface DashboardVideoCardProps {
  video: DashboardVideo;
  priority?: boolean;
}

export function DashboardVideoCard({ video, priority = false }: DashboardVideoCardProps) {
  const [open, setOpen] = useState(false);
  const hasVideo = Boolean(video.id.trim());

  const handlePlay = () => {
    if (hasVideo) setOpen(true);
  };

  return (
    <>
      <DashboardSection>
        <div className="mb-4 min-w-0">
          <h3 className="ds-h3">{video.title}</h3>
        </div>

        {hasVideo ? (
          <VideoThumbnail
            videoId={video.id}
            title={video.title}
            caption={`▶ ${video.description}`}
            onPlay={handlePlay}
            eager={priority}
          />
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-border-dim bg-page/80 px-6 text-center">
            <p className="text-sm text-text-muted">
              Add a Vimeo video ID in <code className="text-accent">dashboard.config.ts</code> or{" "}
              <code className="text-accent">training.config.ts</code>.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-3">
          <p className="text-sm leading-relaxed text-text-secondary">{video.description}</p>
          {video.duration ? (
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5" />
              {video.duration}
            </p>
          ) : null}
        </div>
      </DashboardSection>

      {hasVideo && open ? (
        <VideoOverlay
          open={open}
          onClose={() => setOpen(false)}
          videoUrl={vimeoPlayerUrl(video.id)}
          title={video.title}
        />
      ) : null}
    </>
  );
}
