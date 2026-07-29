"use client";

import { Sparkles } from "lucide-react";

interface PremiumVideoTutorialProps {
  vimeoId: string;
  title: string;
  description: string;
  iframeTitle: string;
}

export function PremiumVideoTutorial({
  vimeoId,
  title,
  description,
  iframeTitle,
}: PremiumVideoTutorialProps) {
  return (
    <section className="glass-card overflow-hidden p-0">
      <div className="flex flex-col md:flex-row">
        <div className="relative bg-black/40 md:w-1/2">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
              className="absolute inset-0 h-full w-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              allowFullScreen
              title={iframeTitle}
            />
          </div>
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 md:w-1/2 md:p-10">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-accent" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
              Watch First
            </span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
          <p className="leading-relaxed text-text-secondary">{description}</p>
        </div>
      </div>
    </section>
  );
}
