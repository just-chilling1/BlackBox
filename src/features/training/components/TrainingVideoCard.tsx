"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import { VideoOverlay } from "@/components/ui/video-overlay";
import { vimeoPlayerUrl, type AcademyVideo } from "@/lib/training-content";

interface TrainingVideoCardProps {
  video: AcademyVideo;
  index?: number;
  priority?: boolean;
}

export function TrainingVideoCard({ video, index, priority = false }: TrainingVideoCardProps) {
  const [open, setOpen] = useState(false);
  const hasVideo = Boolean(video.id.trim());
  const stepLabel = index != null ? `${index + 1}` : null;

  const handlePlay = () => {
    if (hasVideo) setOpen(true);
  };

  return (
    <>
      <article className="glass-card flex flex-col overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_360px]">
        <div className="border-b border-border-dim/60 px-4 py-3 sm:px-5">
          <div className="flex items-start gap-3">
            {stepLabel ? (
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent-readable">
                {stepLabel}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              {video.badge ? (
                <span className="mb-1 inline-block text-[9px] font-bold uppercase tracking-widest text-accent">
                  {video.badge}
                </span>
              ) : null}
              <h3 className="text-sm font-bold text-text-heading sm:text-base">{video.title}</h3>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-4">
          <VideoThumbnail
            videoId={video.id}
            thumbnailSrc={video.thumbnailSrc}
            title={video.title}
            caption={hasVideo ? "▶ Click to Play Video" : "Video coming soon"}
            onPlay={handlePlay}
            eager={priority}
          />
        </div>

        <div className="space-y-2 px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
          <p className="text-[13px] leading-relaxed text-text-secondary">{video.description}</p>
          {video.duration ? (
            <p className="flex items-center gap-1.5 text-xs text-text-muted">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {video.duration}
            </p>
          ) : null}
        </div>
      </article>

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
