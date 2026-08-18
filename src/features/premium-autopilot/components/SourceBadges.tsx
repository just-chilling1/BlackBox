import { clsx } from "clsx";
import type { Difficulty, SourceType } from "@/features/premium-autopilot/lib/source-types";

const TYPE_BADGE: Record<SourceType, string> = {
  Forum: "bg-brass-100 text-brass-700 border-[var(--bb-line-brass)]",
  Social: "bg-[var(--bb-offer-green-100)] text-success border-[var(--bb-line-offer)]",
  Directory: "bg-canvas text-ink-3 border-border-dim",
  Blog: "bg-brass-100/70 text-brass-700 border-[var(--bb-line-brass)]",
  "Q&A": "bg-brass-100 text-[var(--bb-warning)] border-[var(--bb-line-brass)]",
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
          ? "border-[var(--bb-line-offer)] bg-[var(--bb-offer-green-100)] text-success"
          : "border-[var(--bb-line-brass)] bg-brass-100 text-[var(--bb-warning)]"
      )}
    >
      {difficulty}
    </span>
  );
}
