"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Loader2, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { clsx } from "clsx";
import { PageHeader } from "@/components/ui/page-header";
import { WizardStepBar } from "@/components/ui/wizard-step-bar";
import { PageLoading } from "@/components/ui/page-loading";
import { WizardStepper } from "../components/WizardStepper";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import { NICHE_OPTIONS } from "../types";
import type { WizardStepProps } from "../lib/wizard-step-props";

export default function ChooseTerritoryPage({ embedded, onContinue, onBack }: WizardStepProps = {}) {
  const router = useRouter();
  const { sessionLoaded, linksArmed, niche, chooseTerritory } = useBlogBuilder();
  const [selected, setSelected] = useState(niche);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (embedded) return;
    if (sessionLoaded && !linksArmed) {
      router.replace("/sales-offer-generator");
    }
  }, [embedded, sessionLoaded, linksArmed, router]);

  useEffect(() => {
    if (niche) setSelected(niche);
  }, [niche]);

  const handleContinue = () => {
    if (!selected) {
      setError("Please select a niche for your website.");
      return;
    }

    setError(null);
    setLoading(true);
    const label = NICHE_OPTIONS.find((n) => n.value === selected)?.label ?? selected;
    chooseTerritory(selected, label);
    if (onContinue) {
      onContinue();
    } else {
      router.push("/theme");
    }
  };

  if (!sessionLoaded) {
    return <PageLoading message="Loading your session..." />;
  }

  return (
    <div className={embedded ? "space-y-6" : "page-stack w-full max-w-4xl mx-auto"}>
      {!embedded && (
        <>
          <WizardStepBar breadcrumb="Site Builder / Niche" step={2} />
          <PageHeader
            eyebrow="Step 2"
            title="Pick Your Niche"
            subtitle="Choose one of nine niches. We'll build a questionnaire about that topic — your affiliate link appears on the final page."
          />
          <WizardStepper currentStep={2} />
        </>
      )}

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base space-y-6"
      >
        <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
          <MapPin size={20} className="text-promo-accent" />
          Select a niche
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NICHE_OPTIONS.map((option) => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setSelected(option.value);
                  setError(null);
                }}
                className={clsx(
                  "relative p-4 rounded-xl border text-left transition-all",
                  isSelected
                    ? "border-promo-accent/50 bg-promo-accent/10 ring-1 ring-promo-accent/30"
                    : "border-border-dim bg-black/[0.02] hover:border-promo-accent/30"
                )}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 text-promo-accent">
                    <Check size={16} />
                  </span>
                )}
                <p className="text-sm font-semibold text-text-primary pr-6">{option.label}</p>
              </button>
            );
          })}
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => (onBack ? onBack() : router.push("/sales-offer-generator"))}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border-dim text-text-secondary hover:text-text-primary transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            type="button"
            onClick={handleContinue}
            disabled={loading || !selected}
            className="flex-1 btn-primary inline-flex items-center justify-center gap-2 py-3"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            Continue to Template
            <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
