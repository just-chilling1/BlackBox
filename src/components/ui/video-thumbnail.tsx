"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { clsx } from "clsx";
import { getVideoThumbnailById } from "@/lib/video-thumbnails";

interface VideoThumbnailProps {
  videoId: string;
  title: string;
  onPlay: () => void;
  className?: string;
  eager?: boolean;
}

export function VideoThumbnail({ videoId, title, onPlay, className, eager = false }: VideoThumbnailProps) {
  const [imgError, setImgError] = useState(false);
  const thumbPath = videoId ? getVideoThumbnailById(videoId) : null;

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${title}`}
      className={clsx(
        "group relative w-full overflow-hidden rounded-xl border border-border-dim/60 bg-gradient-to-br from-slate-100 via-white to-indigo-50/80 text-left transition-all duration-300 hover:border-accent/40 hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-video w-full">
        {thumbPath && !imgError ? (
          <img
            src={thumbPath}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-white to-brand-tint" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-slate-900/10 to-transparent" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:scale-105 group-hover:border-accent/50 group-hover:bg-accent/20 sm:h-16 sm:w-16">
            <Play size={24} className="ml-1 fill-white text-white" />
          </div>
        </div>
      </div>
    </button>
  );
}
