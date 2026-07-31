"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { clsx } from "clsx";
import { resolveVideoThumbnail } from "@/lib/video-thumbnails";

interface VideoThumbnailProps {
  videoId?: string;
  title: string;
  onPlay: () => void;
  caption?: string;
  className?: string;
  eager?: boolean;
  thumbnailSrc?: string | null;
}

export function VideoThumbnail({
  videoId = "",
  title,
  onPlay,
  caption,
  className,
  eager = false,
  thumbnailSrc,
}: VideoThumbnailProps) {
  const [imgError, setImgError] = useState(false);
  const thumbPath = resolveVideoThumbnail(videoId, thumbnailSrc);
  const showImage = thumbPath && !imgError;

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${title}`}
      className={clsx(
        "group relative w-full overflow-hidden rounded-xl border border-border-dim/40 bg-black text-left cursor-pointer transition-all duration-200 hover:border-accent/40 hover:shadow-md",
        className
      )}
    >
      <div className="relative aspect-video w-full">
        {showImage ? (
          <img
            src={thumbPath}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950" />
        )}

        <div className="video-thumb-scrim absolute inset-0" />

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#F5C518] to-[#C9970D] text-white shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105 sm:h-20 sm:w-20">
            <Play className="ml-1 h-8 w-8 fill-white sm:h-9 sm:w-9" />
          </span>
        </div>

        {caption ? (
          <p className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-4 text-center text-sm font-bold text-white drop-shadow-lg sm:text-base">
            {caption}
          </p>
        ) : null}
      </div>
    </button>
  );
}
