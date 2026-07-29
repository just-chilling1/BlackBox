"use client";

import { resolveThemeConfig, getReadyTemplate } from "../themes";
import type { ThemeConfig } from "../types";

interface ThemePreviewProps {
  config: ThemeConfig;
  templateId?: string;
  nicheLabel?: string;
  compact?: boolean;
  /** When true, emphasizes link to the selected template card below */
  linkedSelection?: boolean;
}

export function ThemePreview({
  config,
  templateId,
  nicheLabel,
  compact = false,
  linkedSelection = false,
}: ThemePreviewProps) {
  const { colors, headingFont, bodyFont } = resolveThemeConfig(config);
  const template = getReadyTemplate(templateId ?? config.templateId ?? "editorial-sage");
  const accent = colors.accent;
  const isDark = template.structureId === "conversion";
  const previewKey = templateId ?? config.templateId ?? "editorial-sage";

  return (
    <div
      key={previewKey}
      className={
        linkedSelection
          ? "theme-preview-animate overflow-hidden"
          : "overflow-hidden rounded-2xl border"
      }
      style={{
        borderColor: linkedSelection ? undefined : isDark ? "rgba(255,255,255,0.1)" : colors.border,
        backgroundColor: isDark ? "#0f0f10" : colors.bg,
        color: isDark ? "#f4f4f5" : colors.text,
      }}
    >
      <div
        className={
          compact
            ? "flex items-center justify-between gap-2 border-b px-3 py-2.5"
            : "flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        }
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : colors.border,
          backgroundColor: linkedSelection
            ? "rgba(238, 179, 16, 0.1)"
            : isDark
              ? "#18181b"
              : colors.surface,
        }}
      >
        <div className="min-w-0">
          <p
            className={
              linkedSelection
                ? compact
                  ? "text-[9px] font-bold uppercase tracking-widest text-amber-800"
                  : "page-eyebrow"
                : "text-[10px] font-bold uppercase tracking-widest opacity-60"
            }
          >
            {linkedSelection ? `Previewing: ${template.name}` : "Questionnaire preview"}
          </p>
          {!compact && (
            <p className="text-base font-bold truncate sm:text-lg" style={{ fontFamily: headingFont }}>
              {template.name}
            </p>
          )}
          {!compact && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{template.tagline}</p>
          )}
        </div>
        <span
          className={
            compact
              ? "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
              : "shrink-0 self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide sm:self-center"
          }
          style={{
            backgroundColor: linkedSelection ? "rgba(238, 179, 16, 0.2)" : `${accent}22`,
            color: linkedSelection ? "#92400e" : accent,
          }}
        >
          {template.toneLabel}
        </span>
      </div>

      <div className={compact ? "p-3" : `grid gap-4 p-4 sm:p-5 ${"lg:grid-cols-[1.2fr_1fr]"}`}>
        <QuestionnaireMock
          compact={compact}
          isDark={isDark}
          colors={colors}
          headingFont={headingFont}
          bodyFont={bodyFont}
          nicheLabel={nicheLabel}
          accent={accent}
        />

        {!compact && (
          <div className="flex flex-col justify-center gap-3 rounded-xl border border-black/5 bg-black/20 p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Site format
              </p>
              <p className="text-sm text-text-secondary">Multi-step niche questionnaire</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Final page
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">
                Personalized results + your affiliate offer as the recommended next step
              </p>
            </div>
            {nicheLabel && (
              <p className="text-xs text-text-muted">
                Tailored for <span className="text-text-primary">{nicheLabel}</span>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionnaireMock({
  compact,
  isDark,
  colors,
  headingFont,
  bodyFont,
  nicheLabel,
  accent,
}: {
  compact?: boolean;
  isDark: boolean;
  colors: { border: string; surface: string; text: string; accent: string };
  headingFont: string;
  bodyFont: string;
  nicheLabel?: string;
  accent: string;
}) {
  const cardBg = isDark ? "#18181b" : colors.surface;
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : colors.border;

  return (
    <div
      className={compact ? "rounded-lg border p-2.5 space-y-2" : "rounded-xl border p-4 space-y-3"}
      style={{ backgroundColor: cardBg, borderColor: cardBorder }}
    >
      <div
        className={
          compact
            ? "flex items-center justify-between text-[9px] font-semibold uppercase tracking-wider opacity-60"
            : "flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider opacity-60"
        }
      >
        <span>Question 2 of 5</span>
        <span style={{ color: accent }}>40%</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: `${accent}18` }}>
        <div className="h-full rounded-full w-2/5" style={{ backgroundColor: accent }} />
      </div>
      <p
        className={compact ? "text-xs font-semibold pt-0.5" : "text-sm font-semibold pt-1"}
        style={{ fontFamily: headingFont }}
      >
        {nicheLabel
          ? `What's your biggest challenge with ${nicheLabel.toLowerCase()}?`
          : "What's your biggest challenge right now?"}
      </p>
      {(compact
        ? ["Just getting started", "Too much conflicting advice"]
        : ["Just getting started", "Too much conflicting advice", "Lack of consistency"]
      ).map((opt, i) => (
        <div
          key={opt}
          className={compact ? "rounded-md border px-2 py-1.5 text-[10px]" : "rounded-lg border px-3 py-2 text-xs"}
          style={{
            fontFamily: bodyFont,
            borderColor: i === 1 ? accent : cardBorder,
            backgroundColor: i === 1 ? `${accent}12` : "transparent",
            color: isDark ? "#e4e4e7" : colors.text,
          }}
        >
          {opt}
        </div>
      ))}
      <div
        className={
          compact
            ? "rounded-md py-1.5 text-center text-[10px] font-bold text-white mt-1"
            : "rounded-lg py-2 text-center text-xs font-bold text-white mt-2"
        }
        style={{ backgroundColor: accent }}
      >
        Continue →
      </div>
    </div>
  );
}
