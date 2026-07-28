"use client";

import { useState } from "react";
import { Check, ChevronDown, Copy, ImageIcon } from "lucide-react";
import { clsx } from "clsx";

export interface ThreadCardProps {
  index: number;
  label: string;
  text: string;
  imageUrl?: string | null;
  defaultOpen?: boolean;
}

function parseTweetSegments(text: string): string[] {
  const lines = text.split("\n");
  const segments: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length) {
      segments.push(buffer.join("\n").trim());
      buffer = [];
    }
  };

  for (const line of lines) {
    if (/^\d+\//.test(line.trim())) {
      flush();
      buffer = [line];
    } else {
      buffer.push(line);
    }
  }
  flush();

  const numbered = segments.filter((s) => /^\d+\//.test(s.trim()));
  if (numbered.length >= 2) return segments.filter(Boolean);
  return [text.trim()];
}

function TweetBubble({ content, chained, isLast }: { content: string; chained?: boolean; isLast?: boolean }) {
  return (
    <div className="relative flex gap-3">
      {chained && (
        <div className="flex flex-col items-center pt-1">
          <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent ring-2 ring-accent/25" />
          {!isLast && <div className="mt-1 w-px flex-1 min-h-[12px] bg-gradient-to-b from-accent/50 to-accent/10" />}
        </div>
      )}
      <div
        className={clsx(
          "min-w-0 flex-1 rounded-2xl border px-4 py-3 text-[15px] leading-relaxed text-text-primary",
          chained
            ? "border-accent/20 bg-gradient-to-br from-white to-amber-50/40"
            : "border-slate-200/90 bg-white shadow-sm"
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}

export function ThreadCard({ index, label, text, imageUrl, defaultOpen = false }: ThreadCardProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const segments = parseTweetSegments(text);
  const isChain = segments.length > 1;
  const charCount = text.length;

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <details
      open={defaultOpen}
      className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 bg-gradient-to-r from-white via-white to-amber-50/30 px-4 py-3.5 transition-colors hover:bg-amber-50/20 [&::-webkit-details-marker]:hidden">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-xs font-black text-text-on-accent shadow-gold">
          {index}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-bold text-text-heading">{label}</p>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-text-secondary">
              {charCount} chars
            </span>
            {imageUrl && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                <ImageIcon size={10} />
                Image
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-1 text-sm text-text-secondary group-open:hidden">{text}</p>
        </div>
        <ChevronDown
          size={16}
          className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="space-y-3 border-t border-slate-100 bg-slate-50/50 px-4 py-4">
        <div className={clsx("space-y-2", isChain && "pl-0.5")}>
          {segments.map((segment, i) => (
            <TweetBubble
              key={i}
              content={segment}
              chained={isChain}
              isLast={i === segments.length - 1}
            />
          ))}
        </div>

        {imageUrl ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={`${label} promotional image`}
              className="aspect-square w-full max-w-[280px] object-cover"
            />
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => void copy("text", text)}
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-text-on-accent shadow-gold transition-all hover:brightness-110 active:scale-[0.98]"
          >
            {copiedKey === "text" ? <Check size={14} /> : <Copy size={14} />}
            {copiedKey === "text" ? "Copied" : "Copy post"}
          </button>
          {imageUrl ? (
            <button
              type="button"
              onClick={() => void copy("image", imageUrl)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:border-accent/30 hover:text-text-heading"
            >
              {copiedKey === "image" ? <Check size={14} /> : <ImageIcon size={14} />}
              {copiedKey === "image" ? "Copied URL" : "Copy image URL"}
            </button>
          ) : null}
        </div>
      </div>
    </details>
  );
}
