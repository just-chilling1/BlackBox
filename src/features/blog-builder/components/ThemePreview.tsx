"use client";

import { resolveThemeConfig } from "../themes";
import type { ThemeConfig } from "../types";

interface ThemePreviewProps {
  config: ThemeConfig;
  nicheLabel?: string;
}

export function ThemePreview({ config, nicheLabel }: ThemePreviewProps) {
  const { preset, colors, headingFont, bodyFont } = resolveThemeConfig(config);

  return (
    <div
      className="rounded-2xl border overflow-hidden shadow-lg"
      style={{ borderColor: colors.border, backgroundColor: colors.bg }}
    >
      <div
        className="px-5 py-4 border-b flex items-center justify-between gap-3"
        style={{ borderColor: colors.border, backgroundColor: colors.surface }}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.muted }}>
            Live Preview
          </p>
          <p className="text-sm font-bold" style={{ fontFamily: headingFont, color: colors.text }}>
            {nicheLabel ? `${nicheLabel} Hub` : "Your Money Site"}
          </p>
        </div>
        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: colors.accentSoft, color: colors.accent }}
        >
          {preset.name}
        </span>
      </div>

      <div className="p-5 space-y-4">
        <div
          className="rounded-xl p-4"
          style={{
            background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
          }}
        >
          <p
            className="text-lg font-bold text-white mb-1"
            style={{ fontFamily: headingFont }}
          >
            Featured guide for your niche
          </p>
          <p className="text-sm text-white/80" style={{ fontFamily: bodyFont }}>
            Your affiliate offer appears naturally in every article.
          </p>
        </div>

        <div>
          <h3
            className="text-xl font-bold mb-2"
            style={{ fontFamily: headingFont, color: colors.text }}
          >
            Sample headline
          </h3>
          <p className="text-sm leading-relaxed" style={{ fontFamily: bodyFont, color: colors.muted }}>
            This is how body text will look on your generated website. Clean typography,
            readable spacing, and your chosen accent color for links and buttons.
          </p>
          <a
            href="#"
            className="inline-block mt-3 text-sm font-semibold"
            style={{ color: colors.accent, fontFamily: bodyFont }}
            onClick={(e) => e.preventDefault()}
          >
            View recommended product →
          </a>
        </div>
      </div>
    </div>
  );
}
