"use client";

import { resolveThemeConfig, getReadyTemplate, readyTemplateAccent } from "../themes";
import type { ThemeConfig } from "../types";

interface ThemePreviewProps {
  config: ThemeConfig;
  templateId?: string;
  nicheLabel?: string;
  compact?: boolean;
}

export function ThemePreview({ config, templateId, nicheLabel, compact = false }: ThemePreviewProps) {
  const { colors, headingFont, bodyFont } = resolveThemeConfig(config);
  const template = getReadyTemplate(templateId ?? config.templateId ?? "editorial-sage");
  const accent = readyTemplateAccent(template);

  const sampleHeadline =
    template.structureId === "magazine"
      ? "The #1 Pick This Month"
      : template.structureId === "minimal"
        ? "A clear recommendation"
        : template.structureId === "authority"
          ? "Our Expert Review"
          : template.structureId === "conversion"
            ? "Stop Waiting — Start Now"
            : template.structureId === "luxury"
              ? "Elevate Your Results"
              : "A Smarter Path Forward";

  const isDark = template.structureId === "conversion";

  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        borderColor: isDark ? "rgba(255,255,255,0.1)" : colors.border,
        backgroundColor: isDark ? "#0f0f10" : colors.bg,
        color: isDark ? "#f4f4f5" : colors.text,
      }}
    >
      <div
        className="flex flex-col gap-4 border-b px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        style={{
          borderColor: isDark ? "rgba(255,255,255,0.08)" : colors.border,
          backgroundColor: isDark ? "#18181b" : colors.surface,
        }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">Selected template</p>
          <p className="text-base font-bold truncate sm:text-lg" style={{ fontFamily: headingFont }}>
            {template.name}
          </p>
          {!compact && (
            <p className="text-xs text-text-muted mt-0.5 line-clamp-1">{template.tagline}</p>
          )}
        </div>
        <span
          className="shrink-0 self-start rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide sm:self-center"
          style={{ backgroundColor: `${accent}22`, color: accent }}
        >
          {template.toneLabel}
        </span>
      </div>

      <div className={`grid gap-4 p-4 sm:p-5 ${compact ? "" : "lg:grid-cols-[1.2fr_1fr]"}`}>
        <PreviewMock
          structureId={template.structureId}
          isDark={isDark}
          colors={colors}
          headingFont={headingFont}
          bodyFont={bodyFont}
          sampleHeadline={sampleHeadline}
          nicheLabel={nicheLabel}
        />

        {!compact && (
          <div className="flex flex-col justify-center gap-3 rounded-xl border border-white/5 bg-black/20 p-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Page structure
              </p>
              <p className="text-sm text-text-secondary">{structureLabel(template.structureId)}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-1">
                Writing style
              </p>
              <p className="text-sm text-text-secondary leading-relaxed">{template.toneLabel}</p>
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

function structureLabel(structureId: string): string {
  switch (structureId) {
    case "magazine":
      return "Bold hero + bento benefit grid";
    case "minimal":
      return "Narrow single-column reader layout";
    case "authority":
      return "Split expert review panels";
    case "conversion":
      return "Dark high-converting CTA blocks";
    case "luxury":
      return "Elegant columns with refined spacing";
    default:
      return "Classic story-driven scroll";
  }
}

function PreviewMock({
  structureId,
  isDark,
  colors,
  headingFont,
  bodyFont,
  sampleHeadline,
  nicheLabel,
}: {
  structureId: string;
  isDark: boolean;
  colors: { border: string; surface: string; text: string; accent: string; gradientFrom: string; gradientTo: string };
  headingFont: string;
  bodyFont: string;
  sampleHeadline: string;
  nicheLabel?: string;
}) {
  if (structureId === "magazine") {
    return (
      <div className="space-y-3">
        <div
          className="rounded-xl p-4"
          style={{ background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})` }}
        >
          <p className="text-lg font-bold text-white" style={{ fontFamily: headingFont }}>
            {sampleHeadline}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg p-2.5 text-[11px]"
              style={{
                backgroundColor: isDark ? "#fff" : colors.surface,
                color: isDark ? "#1c1917" : colors.text,
                border: `1px solid ${colors.border}`,
              }}
            >
              Benefit {i}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (structureId === "minimal") {
    return (
      <div className="max-w-md space-y-2 py-2">
        <p className="text-xl font-semibold" style={{ fontFamily: headingFont }}>
          {sampleHeadline}
        </p>
        <p className="text-sm opacity-70 leading-relaxed" style={{ fontFamily: bodyFont }}>
          Clean typography, generous whitespace, and a focused reading experience.
        </p>
        <span className="inline-block text-sm font-medium mt-2" style={{ color: colors.accent }}>
          View offer →
        </span>
      </div>
    );
  }

  if (structureId === "authority") {
    return (
      <div className="grid grid-cols-2 gap-3">
        {["The Issue", "Our Take"].map((label) => (
          <div key={label} className="rounded-lg border p-3" style={{ borderColor: colors.border }}>
            <p className="text-xs font-bold mb-1" style={{ color: colors.accent }}>
              {label}
            </p>
            <div className="space-y-1.5">
              <div className="h-2 rounded bg-white/10 w-full" />
              <div className="h-2 rounded bg-white/10 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (structureId === "luxury") {
    return (
      <div className="space-y-3 text-center py-2">
        <p className="text-[10px] uppercase tracking-[0.25em] opacity-60">Curated selection</p>
        <p className="text-xl font-semibold" style={{ fontFamily: headingFont }}>
          {sampleHeadline}
        </p>
        <div className="mx-auto h-px w-12 opacity-30" style={{ backgroundColor: colors.accent }} />
        <p className="text-sm opacity-70" style={{ fontFamily: bodyFont }}>
          {nicheLabel ? `${nicheLabel} · premium layout` : "Refined, aspirational presentation"}
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-5 sm:p-6"
      style={{ background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})` }}
    >
      <p className="text-lg sm:text-xl font-bold text-white mb-1.5" style={{ fontFamily: headingFont }}>
        {sampleHeadline}
      </p>
      <p className="text-sm text-white/85 mb-4" style={{ fontFamily: bodyFont }}>
        {nicheLabel ? `${nicheLabel} offer preview` : "Your generated page headline"}
      </p>
      <span className="inline-flex rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white">
        Check the offer →
      </span>
    </div>
  );
}
