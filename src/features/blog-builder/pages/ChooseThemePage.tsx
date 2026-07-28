"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
      <div className="wizard-shell w-full max-w-2xl mx-auto">
        <WizardStepBar breadcrumb="Site Builder / Wrap-up" step={3} />

        <section className="wizard-panel animate-fade-in-up space-y-6 py-10 text-center">
          <CheckCircle2 size={48} className="mx-auto text-accent" />
          <div>
            <h1 className="ds-h1 mb-2">Setup Complete</h1>
            <p className="ds-subtitle">
              Your questionnaire site is configured. Launch it in the next step to generate and publish.
            </p>
          </div>

          <div className="surface-inset space-y-2 p-4 text-left text-sm">
            {link && (
              <p className="text-text-secondary">
                <span className="font-medium text-text-muted">Link:</span> {link.label}
              </p>
            )}
            {nicheLabel && (
              <p className="text-text-secondary">
                <span className="font-medium text-text-muted">Niche:</span> {nicheLabel}
              </p>
            )}
            <p className="text-text-secondary">
              <span className="font-medium text-text-muted">Template:</span> {selectedTemplate.name}
            </p>
            <p className="text-text-secondary">
              <span className="font-medium text-text-muted">Style:</span> {selectedTemplate.toneLabel}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => setFinished(false)} className="btn-subtle">
              Edit choices
            </button>
            <Link href="/sales-offer-generator?step=4" className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3">
              <Rocket size={18} />
              Launch Your Website
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={embedded ? "space-y-6" : "wizard-shell w-full max-w-4xl mx-auto"}>
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

      <div className="space-y-2">
        <p className="px-1 text-xs text-text-secondary">
          Updates live as you pick a template below
        </p>
        <div className="theme-preview-linked rounded-2xl overflow-hidden">
          <ThemePreview
            config={config}
            templateId={selectedTemplateId}
            nicheLabel={nicheLabel}
            linkedSelection
          />
        </div>
      </div>

      <section className="wizard-panel space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="wizard-panel-icon">
              <LayoutTemplate size={18} />
            </div>
            <div>
              <h2 className="ds-h4">Templates</h2>
              <p className="mt-0.5 text-xs text-text-muted">
                Selected: <span className="font-semibold text-amber-800">{selectedTemplate.name}</span>
              </p>
            </div>
          </div>
          <span className="text-xs font-medium text-text-muted">{READY_TEMPLATES.length} options</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {READY_TEMPLATES.map((template) => {
            const isSelected = selectedTemplateId === template.id;
            const accent = readyTemplateAccent(template);
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleTemplateSelect(template.id)}
                aria-pressed={isSelected}
                className={clsx("wizard-template-card", isSelected && "is-selected")}
              >
                <div className="flex h-16 items-end gap-1.5 px-3 pb-2 pt-3" style={{ backgroundColor: `${accent}14` }}>
                  <div className="h-8 flex-1 rounded-md opacity-90" style={{ backgroundColor: accent }} />
                  <div className="h-5 w-1/3 rounded-md bg-black/10" />
                </div>
                <div className="border-t border-border-dim/60 p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="wizard-template-card-title">{template.name}</p>
                    {isSelected && (
                      <span className="wizard-template-card-check" aria-hidden>
                        <Check size={16} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="wizard-template-card-tone">{template.toneLabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="wizard-panel space-y-5">
        <div className="flex items-center gap-3">
          <div className="wizard-panel-icon">
            <Palette size={18} />
          </div>
          <h2 className="ds-h4">Customize look</h2>
        </div>

        <div className="space-y-3">
          <p className="wizard-font-field-label">Color theme</p>
          <div className="flex flex-wrap gap-3">
            {accentOptions.map((color) => {
              const isActive = config.accentOverride === color;
              return (
                <button
                  key={color}
                  type="button"
                  title={color}
                  onClick={() => updateConfig({ accentOverride: color })}
                  className={clsx("wizard-color-swatch", isActive && "is-selected")}
                  style={{ backgroundColor: color }}
                  aria-label={`Accent color ${color}`}
                  aria-pressed={isActive}
                >
                  {isActive && (
                    <span className="wizard-color-swatch-check" aria-hidden>
                      <Check size={18} strokeWidth={3} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="heading-font" className="wizard-font-field-label flex items-center gap-1.5">
                <Type size={14} />
                Heading font
              </label>
              <span className="wizard-font-selected-badge">Selected</span>
            </div>
            <select
              id="heading-font"
              value={config.headingFont ?? ""}
              onChange={(e) => updateConfig({ headingFont: e.target.value })}
              className="input-base w-full font-medium text-text-primary"
              style={{ fontFamily: config.headingFont ?? HEADING_FONT_OPTIONS[0]?.value }}
            >
              {HEADING_FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="body-font" className="wizard-font-field-label flex items-center gap-1.5">
                <Type size={14} />
                Body font
              </label>
              <span className="wizard-font-selected-badge">Selected</span>
            </div>
            <select
              id="body-font"
              value={config.bodyFont ?? ""}
              onChange={(e) => updateConfig({ bodyFont: e.target.value })}
              className="input-base w-full font-medium text-text-primary"
              style={{ fontFamily: config.bodyFont ?? BODY_FONT_OPTIONS[0]?.value }}
            >
              {BODY_FONT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ fontFamily: opt.value }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="wizard-action-bar">
        <button
          type="button"
          onClick={() => (onBack ? onBack() : router.push("/territory"))}
          className="btn-subtle sm:min-w-[8rem]"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          type="button"
          onClick={handleFinish}
          disabled={loading}
          className="btn-primary flex-1 inline-flex items-center justify-center gap-2 py-3"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : null}
          Continue with {selectedTemplate.name}
        </button>
      </div>
    </div>
  );
}
