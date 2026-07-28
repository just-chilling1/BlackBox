"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { toEmbedUrl } from "@/lib/video-thumbnails";

interface VideoOverlayProps {
  open: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

export function VideoOverlay({ open, onClose, videoUrl, title }: VideoOverlayProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close video"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="relative z-10 flex h-[100dvh] w-full max-w-5xl flex-col overflow-hidden border border-border-dim bg-white shadow-2xl sm:h-[min(92dvh,56rem)] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border-dim bg-surface px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5">
          <h2 className="truncate pr-2 text-sm font-bold text-text-heading sm:text-base">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-text-heading active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 bg-black">
          <iframe
            src={toEmbedUrl(videoUrl)}
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            allowFullScreen
            title={title}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
