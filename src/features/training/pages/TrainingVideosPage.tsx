"use client";

import { useState } from "react";
import { Play, Star } from "lucide-react";
import { trainingContent } from "@/config/training.config";
import { trainingPremiumVideos } from "@/config/training-content.config";
import { VideoThumbnail } from "@/components/ui/video-thumbnail";
import {
  getAcademyPlatformThumbnail,
  getAcademyPremiumThumbnail,
} from "@/lib/video-thumbnails";
import { TrainingPageLayout } from "../components/TrainingPageLayout";

function VideoCard({
  id,
  title,
  description,
  badge,
  thumbnailSrc,
}: {
  id: string;
  title: string;
  description: string;
  badge?: string;
  thumbnailSrc: string | null;
}) {
  const [playing, setPlaying] = useState(false);

  const handlePlay = () => {
    if (id) setPlaying(true);
  };

  return (
    <div className="overflow-hidden surface-inset border-border-dim/30">
      <div className="relative w-full bg-black" style={{ paddingBottom: "56.25%" }}>
        {id && playing ? (
          <iframe
            src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&autoplay=1`}
            className="absolute inset-0 h-full w-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={title}
          />
        ) : (
          <div className="absolute inset-0">
            <VideoThumbnail
              videoId={id}
              thumbnailSrc={thumbnailSrc}
              title={title}
              caption={id ? "Click to Play Video" : undefined}
              onPlay={handlePlay}
              className="h-full rounded-none border-0 shadow-none hover:shadow-none"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 p-4">
        {badge ? (
          <span className="text-[9px] font-bold uppercase tracking-widest text-accent">{badge}</span>
        ) : null}
        <h3 className="text-sm font-bold text-text-heading">{title}</h3>
        <p className="text-[12px] leading-relaxed text-text-muted">{description}</p>
      </div>
    </div>
  );
}

export default function TrainingVideosPage() {
  return (
    <TrainingPageLayout>
      <section className="mb-10 flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-text-heading">Platform Tutorials</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {trainingContent.videos.map((video, index) => (
            <VideoCard
              key={video.title}
              id={video.id}
              title={video.title}
              description={video.description}
              thumbnailSrc={getAcademyPlatformThumbnail(index)}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-text-heading">Premium Feature Tutorials</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainingPremiumVideos.map((video, index) => (
            <VideoCard
              key={video.badge}
              id={video.id}
              title={video.title}
              description={video.description}
              badge={video.badge}
              thumbnailSrc={getAcademyPremiumThumbnail(index)}
            />
          ))}
        </div>
      </section>
    </TrainingPageLayout>
  );
}
