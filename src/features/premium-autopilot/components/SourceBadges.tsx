import { clsx } from "clsx";
import type { Difficulty, SourceType } from "@/features/premium-autopilot/lib/source-types";

const TYPE_BADGE: Record<SourceType, string> = {
  "Idea Pin": "bg-pulse-100 text-pulse-700 border-[var(--np-line-pulse)]",
  "Standard Pin": "bg-[var(--np-offer-green-100)] text-success border-[var(--np-line-offer)]",
  Board: "bg-canvas text-ink-3 border-border-dim",
  Search: "bg-pulse-100/70 text-pulse-700 border-[var(--np-line-pulse)]",
  Profile: "bg-pulse-100 text-[var(--np-warning)] border-[var(--np-line-pulse)]",
  Checklist: "bg-canvas text-ink-3 border-border-dim",
  Forum: "bg-pulse-100 text-pulse-700 border-[var(--np-line-pulse)]",
  Social: "bg-[var(--np-offer-green-100)] text-success border-[var(--np-line-offer)]",
  Directory: "bg-canvas text-ink-3 border-border-dim",
  Blog: "bg-pulse-100/70 text-pulse-700 border-[var(--np-line-pulse)]",
  "Q&A": "bg-pulse-100 text-[var(--np-warning)] border-[var(--np-line-pulse)]",
  Classified: "bg-canvas text-ink-3 border-border-dim",
  Video: "bg-canvas text-ink-3 border-border-dim",
};

export function SourceTypeBadge({ type }: { type: SourceType }) {
  return (
    <span
      className={clsx(
        "rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        TYPE_BADGE[type]
      )}
    >
      {type}
    </span>
  );
}

export function SourceDifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={clsx(
        "rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em]",
        difficulty === "Easy"
          ? "border-[var(--np-line-offer)] bg-[var(--np-offer-green-100)] text-success"
          : "border-[var(--np-line-pulse)] bg-pulse-100 text-[var(--np-warning)]"
      )}
    >
      {difficulty}
    </span>
  );
}
