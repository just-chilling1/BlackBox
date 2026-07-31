"use client";

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";
import { clsx } from "clsx";

interface VideoTranscriptProps {
  title: string;
  transcript: string;
  className?: string;
}

export function VideoTranscript({ title, transcript, className }: VideoTranscriptProps) {
  const [open, setOpen] = useState(false);

  if (!transcript.trim()) return null;

  return (
    <div className={clsx("border-t border-border-dim/60", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-black/[0.02] sm:px-5"
      >
        <span className="flex min-w-0 items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-accent" aria-hidden />
          <span className="truncate text-sm font-semibold text-text-heading">{title} — Transcript</span>
        </span>
        <ChevronDown
          className={clsx("h-4 w-4 shrink-0 text-text-muted transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open ? (
        <div className="max-h-72 overflow-y-auto border-t border-border-dim/40 bg-slate-50/80 px-4 py-4 sm:max-h-96 sm:px-5">
          <div className="prose prose-sm max-w-none text-[13px] leading-relaxed text-text-secondary whitespace-pre-wrap">
            {transcript}
          </div>
        </div>
      ) : null}
    </div>
  );
}
