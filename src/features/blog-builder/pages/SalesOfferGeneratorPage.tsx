"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { WizardStepper } from "../components/WizardStepper";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import ArmLinksPage from "./ArmLinksPage";
import ChooseTerritoryPage from "./ChooseTerritoryPage";
import ChooseThemePage from "./ChooseThemePage";
import DeployAssetPage from "./DeployAssetPage";
import type { WizardStepNumber } from "../lib/wizard-step-props";

const STEP_COPY: Record<
  WizardStepNumber,
  { eyebrow: string; title: string; subtitle: string }
> = {
  1: {
    eyebrow: "Step 1",
    title: "Add Your Link",
    subtitle:
      'Paste any promotional or affiliate link below. It will be placed on your generated sales page. Use "Save to Links Library" if you want to reuse it later.',
  },
  2: {
    eyebrow: "Step 2",
    title: "Pick Your Niche",
    subtitle:
      "Choose one of nine niches. We'll build a questionnaire about that topic — your affiliate link appears on the final page.",
  },
  3: {
    eyebrow: "Step 3",
    title: "Choose a Template",
    subtitle:
      "Pick one of three templates, then customize the color theme and fonts for your niche questionnaire.",
  },
  4: {
    eyebrow: "Step 4",
    title: "Launch Your Offer",
    subtitle:
      "We generate niche-specific quiz questions and place your affiliate link on the final results page — then publish instantly.",
  },
};

function clampStep(value: number): WizardStepNumber {
  if (value <= 1) return 1;
  if (value >= 4) return 4;
  return value as WizardStepNumber;
}

function maxAccessibleStep(
  linksArmed: boolean,
  territoryChosen: boolean,
  themeChosen: boolean
): WizardStepNumber {
  if (themeChosen) return 4;
  if (territoryChosen) return 3;
  if (linksArmed) return 2;
  return 1;
}

type StepCompletionFlags = Partial<{
  linksArmed: boolean;
  territoryChosen: boolean;
  themeChosen: boolean;
}>;

export default function SalesOfferGeneratorPage() {
  const searchParams = useSearchParams();
  const {
    sessionLoaded,
    linksArmed,
    territoryChosen,
    themeChosen,
    wizardUiStep,
    setWizardUiStep,
    beginNewSiteGeneration,
  } = useBlogBuilder();

  useEffect(() => {
    if (!sessionLoaded) return;

    const urlStep = searchParams.get("step");
    if (urlStep) {
      const fromUrl = clampStep(Number(urlStep) || 1);
      const maxStep = maxAccessibleStep(linksArmed, territoryChosen, themeChosen);
      setWizardUiStep(fromUrl <= maxStep ? fromUrl : maxStep);
    }
  }, [
    sessionLoaded,
    searchParams,
    linksArmed,
    territoryChosen,
    themeChosen,
    setWizardUiStep,
  ]);

  const goToStep = (next: WizardStepNumber, justCompleted?: StepCompletionFlags) => {
    const maxStep = maxAccessibleStep(
      justCompleted?.linksArmed ?? linksArmed,
      justCompleted?.territoryChosen ?? territoryChosen,
      justCompleted?.themeChosen ?? themeChosen
    );
    setWizardUiStep(next <= maxStep ? next : maxStep);
  };

  const handleGenerateAnother = () => {
    beginNewSiteGeneration();
    setWizardUiStep(1);
  };

  if (!sessionLoaded) {
    return (
      <div className="wizard-shell w-full max-w-6xl mx-auto">
        <PageHeader
          eyebrow="Sales Offer Generator"
          title="Launch Your Offer"
          subtitle="Generate niche-specific quiz questions and publish your sales page."
        />
        <PageSkeleton cards={2} />
      </div>
    );
  }

  const step = wizardUiStep;
  const copy = STEP_COPY[step];

  return (
    <div className="wizard-shell w-full max-w-6xl mx-auto">
      <PageHeader
        eyebrow="Sales Offer Generator"
        title={copy.title}
        subtitle={copy.subtitle}
      />

      <WizardStepper currentStep={step} />

      {step === 1 && (
        <ArmLinksPage embedded onContinue={() => goToStep(2, { linksArmed: true })} />
      )}
      {step === 2 && (
        <ChooseTerritoryPage
          embedded
          onBack={() => goToStep(1)}
          onContinue={() => goToStep(3, { territoryChosen: true })}
        />
      )}
      {step === 3 && (
        <ChooseThemePage
          embedded
          onBack={() => goToStep(2)}
          onContinue={() => goToStep(4, { themeChosen: true })}
        />
      )}
      {step === 4 && (
        <DeployAssetPage
          embedded
          onBack={() => goToStep(3)}
          onGenerateAnother={handleGenerateAnother}
        />
      )}
    </div>
  );
}
