"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutTemplate,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Rocket,
  Check,
  Palette,
  Type,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { PageHeader } from "@/components/ui/page-header";
import { WizardStepBar } from "@/components/ui/wizard-step-bar";
import { PageLoading } from "@/components/ui/page-loading";
import { WizardStepper } from "../components/WizardStepper";
import { ThemePreview } from "../components/ThemePreview";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import { NICHE_OPTIONS, type ThemeConfig } from "../types";
import {
  READY_TEMPLATES,
  readyTemplateAccent,
  readyTemplateToConfig,
  findMatchingReadyTemplateId,
  getReadyTemplate,
  defaultThemeConfig,
  ACCENT_VARIANTS,
  HEADING_FONT_OPTIONS,
  BODY_FONT_OPTIONS,
} from "../themes";
import type { WizardStepProps } from "../lib/wizard-step-props";

export default function ChooseThemePage({ embedded, onContinue, onBack }: WizardStepProps = {}) {
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

  const initialConfig = themeConfig ?? defaultThemeConfig();
  const [config, setConfig] = useState<ThemeConfig>(initialConfig);
  const [selectedTemplateId, setSelectedTemplateId] = useState(() =>
    findMatchingReadyTemplateId(initialConfig)
  );
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (themeChosen) setFinished(true);
  }, [themeChosen]);

  useEffect(() => {
    if (embedded) return;
    if (!sessionLoaded) return;
    if (!linksArmed) {
      router.replace("/arm-links");
    } else if (!territoryChosen) {
      router.replace("/territory");
    }
  }, [embedded, sessionLoaded, linksArmed, territoryChosen, router]);

  useEffect(() => {
    if (themeConfig) {
      setConfig(themeConfig);
      if (themeConfig.templateId) {
        setSelectedTemplateId(themeConfig.templateId);
      }
    }
  }, [themeConfig]);

  const nicheLabel = NICHE_OPTIONS.find((n) => n.value === niche)?.label;
  const selectedTemplate = getReadyTemplate(selectedTemplateId);
  const templateDefaultAccent = readyTemplateAccent(selectedTemplate);
  const variants = ACCENT_VARIANTS[config.presetId] ?? ACCENT_VARIANTS.editorial;
  const accentOptions =
    selectedTemplateId === "conversion-dark"
      ? variants
      : [...new Set([templateDefaultAccent, ...variants])];

  useEffect(() => {
    if (selectedTemplateId !== "conversion-dark") return;
    if (config.accentOverride !== "#10b981") return;
    const next = { ...config, accentOverride: "#059669", templateId: selectedTemplateId };
    setConfig(next);
    setThemeConfig(next);
  }, [selectedTemplateId, config, setThemeConfig]);

  const updateConfig = (patch: Partial<ThemeConfig>) => {
    const next = { ...config, ...patch, templateId: selectedTemplateId };
    setConfig(next);
    setThemeConfig(next);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = getReadyTemplate(templateId);
    const next = readyTemplateToConfig(template);
    setSelectedTemplateId(templateId);
    setConfig(next);
    setThemeConfig(next);
  };

  const handleFinish = () => {
    setLoading(true);
    chooseTheme(config);
    setLoading(false);
    if (embedded && onContinue) {
      onContinue();
      return;
    }
    setFinished(true);
  };

  if (!sessionLoaded) {
    return <PageLoading message="Loading your session..." />;
  }

  if (finished && !embedded) {
    const link = deployArmedLinks[0];

    return (
      <div className="page-stack w-full max-w-2xl mx-auto">
        <WizardStepBar breadcrumb="Site Builder / Wrap-up" step={3} />

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-base space-y-6 py-10 text-center"
        >
          <CheckCircle2 size={48} className="text-promo-accent mx-auto" />
          <div>
            <h1 className="ds-h1 mb-2">Setup Complete</h1>
            <p className="ds-subtitle">
              Your questionnaire site is configured. Launch it in the next step to generate and publish.
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
            <p className="text-text-secondary">
              <span className="text-text-muted">Template:</span> {selectedTemplate.name}
            </p>
            <p className="text-text-secondary">
              <span className="text-text-muted">Style:</span> {selectedTemplate.toneLabel}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => setFinished(false)}
              className="px-6 py-3 rounded-xl border border-border-dim text-text-secondary hover:text-text-primary"
            >
              Edit choices
            </button>
            <Link href="/sales-offer-generator?step=4" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
              <Rocket size={18} />
              Launch Your Website
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={embedded ? "space-y-6" : "page-stack w-full max-w-4xl mx-auto"}>
      {!embedded && (
        <>
          <WizardStepBar breadcrumb="Site Builder / Template" step={3} />
          <PageHeader
            eyebrow="Step 3"
            title="Choose a Template"
            subtitle="Pick one of three templates, then customize the color theme and fonts for your niche questionnaire."
          />
          <WizardStepper currentStep={3} />
        </>
      )}

      <motion.div
        key={`${selectedTemplateId}-${config.accentOverride ?? ""}-${config.headingFont ?? ""}-${config.bodyFont ?? ""}`}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ThemePreview config={config} templateId={selectedTemplateId} nicheLabel={nicheLabel} />
      </motion.div>

      <div className="card-base space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
            <LayoutTemplate size={18} className="text-promo-accent" />
            Templates
          </h2>
          <span className="text-xs text-text-muted">{READY_TEMPLATES.length} options</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {READY_TEMPLATES.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const accent = readyTemplateAccent(template);
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                className={clsx(
                  "group rounded-xl border text-left transition-all overflow-hidden",
                  isSelected
                    ? "border-promo-accent/50 bg-promo-accent/10 ring-1 ring-promo-accent/30"
                    : "border-border-dim hover:border-promo-accent/25 hover:bg-white/[0.02]"
                )}
              >
                <div className="flex h-16 items-end gap-1.5 px-3 pb-2 pt-3" style={{ backgroundColor: `${accent}14` }}>
                  <div className="h-8 flex-1 rounded-md opacity-90" style={{ backgroundColor: accent }} />
                  <div className="h-5 w-1/3 rounded-md bg-white/10" />
                </div>
                <div className="p-3.5 border-t border-white/5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-text-primary">{template.name}</p>
                    {isSelected && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-promo-accent flex items-center justify-center">
                        <Check size={12} className="text-text-on-accent" />
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-promo-accent/80 mt-1.5">
                    {template.toneLabel}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-base space-y-5">
        <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
          <Palette size={18} className="text-promo-accent" />
          Customize look
        </h2>

        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">Color theme</p>
          <div className="flex flex-wrap gap-2.5">
            {accentOptions.map((color) => {
              const isActive = config.accentOverride === color;
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => updateConfig({ accentOverride: color })}
                  className={clsx(
                    "h-10 w-10 rounded-full border-2 transition-all",
                    isActive ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Accent color ${color}`}
                />
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="heading-font" className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Type size={14} />
              Heading font
            </label>
            <select
              id="heading-font"
              value={config.headingFont ?? ""}
              onChange={(e) => updateConfig({ headingFont: e.target.value })}
              className="w-full rounded-xl border border-border-dim bg-page px-4 py-3 text-sm text-text-primary focus:border-promo-accent/50 focus:outline-none"
            >
              {HEADING_FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="body-font" className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
              <Type size={14} />
              Body font
            </label>
            <select
              id="body-font"
              value={config.bodyFont ?? ""}
              onChange={(e) => updateConfig({ bodyFont: e.target.value })}
              className="w-full rounded-xl border border-border-dim bg-page px-4 py-3 text-sm text-text-primary focus:border-promo-accent/50 focus:outline-none"
            >
              {BODY_FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
        <button
          type="button"
          onClick={() => (onBack ? onBack() : router.push("/territory"))}
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
          Continue with {selectedTemplate.name}
        </button>
      </div>
    </div>
  );
}
