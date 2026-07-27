"use client";

import { useState } from "react";
import { Play, Star, Video } from "lucide-react";
import { trainingContent } from "@/config/training.config";
import { trainingPremiumVideos } from "@/config/training-content.config";
import { TrainingPageLayout } from "../components/TrainingPageLayout";

function VideoPlaceholder({ title }: { title: string }) {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-page border border-dashed border-border-dim/40"
      aria-hidden
    >
      <Video size={28} className="text-text-muted/50" />
      <span className="px-4 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted">
        {title}
      </span>
      <span className="px-4 text-center text-[10px] text-text-muted/70">
        Add Vimeo ID in training.config.ts
      </span>
    </div>
  );
}

function VideoCard({
  id,
  title,
  description,
  badge,
}: {
  id: string;
  title: string;
  description: string;
  badge?: string;
}) {
  const [playing, setPlaying] = useState(false);

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
        ) : id ? (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 transition-colors hover:bg-black/40"
            aria-label={`Play ${title}`}
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/20 bg-gradient-to-br from-accent to-accent-muted text-white shadow-2xl">
              <Play className="ml-1 h-8 w-8 fill-white" />
            </span>
            <span className="text-sm font-semibold text-white drop-shadow-lg">Click to Play Video</span>
          </button>
        ) : (
          <VideoPlaceholder title={title} />
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
          {trainingContent.videos.map((video) => (
            <VideoCard key={video.title} id={video.id} title={video.title} description={video.description} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Star size={16} className="text-accent" />
          <h2 className="text-lg font-bold text-text-heading">Premium Feature Tutorials</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trainingPremiumVideos.map((video) => (
            <VideoCard
              key={video.badge}
              id={video.id}
              title={video.title}
              description={video.description}
              badge={video.badge}
            />
          ))}
        </div>
      </section>
    </TrainingPageLayout>
  );
}
