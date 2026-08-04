"use client";

import { useState } from "react";
import { Clock, Play, Sparkles } from "lucide-react";

interface PremiumVideoTutorialProps {
  /** Leave empty to show a branded "coming soon" placeholder with the thumbnail. */
  vimeoId?: string;
  title: string;
  description: string;
  iframeTitle: string;
  /** Poster shown before the member clicks play (and while no video is uploaded). */
  thumbnailSrc?: string;
}

export function PremiumVideoTutorial({
  vimeoId = "",
  title,
  description,
  iframeTitle,
  thumbnailSrc,
}: PremiumVideoTutorialProps) {
  const [playing, setPlaying] = useState(false);
  const hasVideo = Boolean(vimeoId);

  return (
    <section className="glass-card overflow-hidden p-0">
      <div className="flex flex-col md:flex-row">
        <div className="relative bg-black/40 md:w-1/2">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            {hasVideo && playing ? (
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}?badge=0&byline=0&portrait=0&title=0&autopause=0&player_id=0&app_id=58479&dnt=1&autoplay=1`}
                className="absolute inset-0 h-full w-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                allowFullScreen
                title={iframeTitle}
              />
            ) : (
              <button
                type="button"
                onClick={() => hasVideo && setPlaying(true)}
                disabled={!hasVideo}
                aria-label={hasVideo ? `Play ${iframeTitle}` : `${iframeTitle} — coming soon`}
                className="absolute inset-0 block w-full cursor-pointer text-left disabled:cursor-default"
              >
                {thumbnailSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbnailSrc}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-2 to-ink" />
                )}
                <div className="video-thumb-scrim absolute inset-0" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-grad-brass text-white opacity-90 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-105">
                    <Play className="ml-1 h-8 w-8 fill-white" />
                  </span>
                  {hasVideo ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                      ▶ Click to Play Video
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-sm">
                      <Clock size={12} />
                      Training video coming soon
                    </span>
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2 md:p-10">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-brass-700" />
            <span className="text-[13px] font-medium uppercase tracking-[0.2em] text-brass-700">
              Watch First
            </span>
          </div>
          <h2 className="text-2xl font-medium text-text-primary">{title}</h2>
          <p className="leading-relaxed text-text-secondary">{description}</p>
        </div>
      </div>
    </section>
  );
}
