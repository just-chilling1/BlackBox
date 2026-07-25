"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PenLine,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { PageHeader } from "@/components/ui/page-header";
import { WizardStepper } from "../components/WizardStepper";
import { ThemePreview } from "../components/ThemePreview";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import { NICHE_OPTIONS, type ThemeConfig } from "../types";
import {
  KICKOFF_PRESET_IDS,
  THEME_PRESETS,
  ACCENT_VARIANTS,
  HEADING_FONT_OPTIONS,
  BODY_FONT_OPTIONS,
  defaultThemeConfig,
} from "../themes";

export default function ChooseThemePage() {
  const router = useRouter();
  const {
    sessionLoaded,
    linksArmed,
    territoryChosen,
    niche,
    themeConfig,
    themeChosen,
    setThemeConfig,
    chooseTheme,
    deployArmedLinks,
  } = useBlogBuilder();

  const [config, setConfig] = useState<ThemeConfig>(themeConfig ?? defaultThemeConfig());
  const [finished, setFinished] = useState(themeChosen);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sessionLoaded) return;
    if (!linksArmed) {
      router.replace("/arm-links");
    } else if (!territoryChosen) {
      router.replace("/territory");
    }
  }, [sessionLoaded, linksArmed, territoryChosen, router]);

  useEffect(() => {
    if (themeConfig) setConfig(themeConfig);
  }, [themeConfig]);

  const nicheLabel = NICHE_OPTIONS.find((n) => n.value === niche)?.label;
  const accentOptions = ACCENT_VARIANTS[config.presetId] ?? [THEME_PRESETS[config.presetId]?.colors.accent ?? "#0f766e"];

  const updateConfig = (patch: Partial<ThemeConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    setThemeConfig(next);
  };

  const handlePresetChange = (presetId: string) => {
    const preset = THEME_PRESETS[presetId];
    updateConfig({
      presetId,
      accentOverride: undefined,
      headingFont: preset?.fonts.heading,
      bodyFont: preset?.fonts.body,
    });
  };

  const handleFinish = () => {
    setLoading(true);
    chooseTheme(config);
    setFinished(true);
    setLoading(false);
    router.push("/deploy");
  };

  if (!sessionLoaded) {
    return <p className="text-text-muted text-sm animate-pulse">Loading your session...</p>;
  }

  if (finished) {
    const link = deployArmedLinks[0];
    const preset = THEME_PRESETS[config.presetId];

    return (
      <div className="page-stack w-full max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-base text-center space-y-6 py-10"
        >
          <CheckCircle2 size={48} className="text-promo-accent mx-auto" />
          <div>
            <h1 className="ds-h1 mb-2">Setup Complete</h1>
            <p className="ds-subtitle">
              Your site configuration is saved. Website generation launches in the next phase.
            </p>
          </div>

          <div className="text-left rounded-xl border border-border-dim bg-page p-4 space-y-2 text-sm">
            {link && (
              <p className="text-text-secondary">
                <span className="text-text-muted">Link:</span> {link.label}
              </p>
            )}
            {nicheLabel && (
              <p className="text-text-secondary">
                <span className="text-text-muted">Niche:</span> {nicheLabel}
              </p>
            )}
            {preset && (
              <p className="text-text-secondary">
                <span className="text-text-muted">Template:</span> {preset.name}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setFinished(false)}
              className="px-6 py-3 rounded-xl border border-border-dim text-text-secondary hover:text-text-primary"
            >
              Edit choices
            </button>
            <Link href="/deploy" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
              <Rocket size={18} />
              Launch Your Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-stack w-full max-w-5xl mx-auto">
      <div className="sticky top-0 z-20 -mx-1 mb-2 rounded-xl border border-white/[0.08] bg-page/95 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-promo-accent">
            Site Builder / Template
          </p>
          <span className="text-xs text-text-muted">Step 3 of 3</span>
        </div>
      </div>

      <PageHeader
        eyebrow="Step 3"
        title="Choose Template & Theme"
        subtitle="Pick a layout, accent color, and fonts. Preview updates live as you customize."
      />

      <WizardStepper currentStep={3} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="card-base space-y-4">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <PenLine size={20} className="text-promo-accent" />
              Layout template
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {KICKOFF_PRESET_IDS.map((id) => {
                const preset = THEME_PRESETS[id];
                const isSelected = config.presetId === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => handlePresetChange(id)}
                    className={clsx(
                      "p-4 rounded-xl border text-left transition-all",
                      isSelected
                        ? "border-promo-accent/50 bg-promo-accent/10"
                        : "border-border-dim hover:border-promo-accent/30"
                    )}
                  >
                    <p className="text-sm font-semibold text-text-primary">{preset.name}</p>
                    <p className="text-xs text-text-muted mt-1 line-clamp-2">{preset.tagline}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="card-base space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Color theme</h3>
            <div className="flex flex-wrap gap-3">
              {accentOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => updateConfig({ accentOverride: color })}
                  className={clsx(
                    "w-10 h-10 rounded-full border-2 transition-transform hover:scale-110",
                    config.accentOverride === color || (!config.accentOverride && color === accentOptions[0])
                      ? "border-white scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Accent color ${color}`}
                />
              ))}
            </div>
          </div>

          <div className="card-base space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Fonts</h3>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Heading font</label>
              <select
                value={config.headingFont ?? THEME_PRESETS[config.presetId]?.fonts.heading}
                onChange={(e) => updateConfig({ headingFont: e.target.value })}
                className="w-full rounded-xl border border-border-dim bg-page px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent/50"
              >
                {HEADING_FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1.5">Body font</label>
              <select
                value={config.bodyFont ?? THEME_PRESETS[config.presetId]?.fonts.body}
                onChange={(e) => updateConfig({ bodyFont: e.target.value })}
                className="w-full rounded-xl border border-border-dim bg-page px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent/50"
              >
                {BODY_FONT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => router.push("/territory")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border-dim text-text-secondary hover:text-text-primary"
            >
              <ArrowLeft size={18} />
              Back
            </button>
            <button
              type="button"
              onClick={handleFinish}
              disabled={loading}
              className="flex-1 btn-primary inline-flex items-center justify-center gap-2 py-3"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              Finish Setup
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:sticky lg:top-24 h-fit"
        >
          <ThemePreview config={config} nicheLabel={nicheLabel} />
        </motion.div>
      </div>
    </div>
  );
}
