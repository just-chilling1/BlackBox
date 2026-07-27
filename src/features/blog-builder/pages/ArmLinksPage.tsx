"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  ArrowRight,
  Save,
  Check,
  CheckCircle2,
  Zap,
  Tag,
  ChevronDown,
  ExternalLink,
  UserPlus,
  Search,
  MousePointerClick,
  Copy,
  ClipboardPaste,
} from "lucide-react";
import { GlassInput } from "@/components/ui/glass-input";
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { ErrorBanner } from "@/components/ui/error-banner";
import { WizardStepBar } from "@/components/ui/wizard-step-bar";
import { ContentReservePicker } from "../components/ContentReservePicker";
import { WizardStepper } from "../components/WizardStepper";
import { useBlogBuilder } from "../context/BlogBuilderContext";
import type { ArmedLink } from "../types";
import type { WizardStepProps } from "../lib/wizard-step-props";
import { detectLinkNetwork, isValidAffiliateUrl, normalizeAffiliateUrl } from "../lib/affiliate-url";

function warmScrapeCache(url: string) {
  void fetch("/api/blog/scrape", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  }).catch(() => {});
}

const INSTRUCTION_STEPS = [
  {
    number: 1,
    text: "Go to Digistore24.com and create a free account",
    icon: UserPlus,
    link: "https://www.digistore24.com",
    linkLabel: "Open Digistore24",
  },
  {
    number: 2,
    text: "Navigate to the Marketplace and find your product",
    icon: Search,
  },
  {
    number: 3,
    text: 'Click "Promote Now" to get your unique affiliate link',
    icon: MousePointerClick,
  },
  {
    number: 4,
    text: "Copy your affiliate link",
    icon: Copy,
  },
  {
    number: 5,
    text: 'Paste it below and click "Save to Content Reserve"',
    icon: ClipboardPaste,
  },
];

export default function ArmLinksPage({ embedded, onContinue }: WizardStepProps = {}) {
  const router = useRouter();
  const { sessionLoaded, armedLinks, saveLinksToVault, armLinks } = useBlogBuilder();

  const [linkLabel, setLinkLabel] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedVaultUrl, setSelectedVaultUrl] = useState<string | null>(null);
  const [linkSaved, setLinkSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [instructionsOpen, setInstructionsOpen] = useState(true);

  const handleSelectFromVault = (link: ArmedLink | null) => {
    if (!link) {
      setSelectedVaultUrl(null);
      setLinkUrl("");
      setLinkLabel("");
      setLinkSaved(false);
      setError(null);
      return;
    }

    setSelectedVaultUrl(link.url);
    setLinkUrl(link.url);
    setLinkLabel(link.label);
    setLinkSaved(true);
    setError(null);
    warmScrapeCache(link.url);
  };

  const clearVaultSelectionIfEdited = (nextUrl: string, nextLabel: string) => {
    if (!selectedVaultUrl) return;
    const vaultLink = armedLinks.find((l) => l.url === selectedVaultUrl);
    if (!vaultLink) {
      setSelectedVaultUrl(null);
      return;
    }
    if (
      normalizeAffiliateUrl(nextUrl) !== normalizeAffiliateUrl(vaultLink.url) ||
      nextLabel !== vaultLink.label
    ) {
      setSelectedVaultUrl(null);
    }
  };

  const handleSaveToVault = async () => {
    const url = normalizeAffiliateUrl(linkUrl);
    if (!isValidAffiliateUrl(url)) {
      setError("Please enter a valid URL starting with https://");
      return;
    }

    setError(null);
    setLoading(true);

    const newLink: ArmedLink = {
      label: linkLabel.trim() || "Promotional Offer",
      url,
      network: detectLinkNetwork(url),
    };

    const existing = armedLinks.filter((l) => l.url !== url);
    const nextLinks = [newLink, ...existing];

    try {
      await saveLinksToVault(nextLinks);
      setLinkSaved(true);
      warmScrapeCache(url);
    } catch {
      setError("Could not save to Content Reserve. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const url = normalizeAffiliateUrl(linkUrl);
    if (!isValidAffiliateUrl(url)) {
      setError("Please enter a valid affiliate link (https://...) before continuing.");
      return;
    }

    setError(null);
    setLoading(true);

    const link: ArmedLink = {
      label: linkLabel.trim() || "Promotional Offer",
      url,
      network: detectLinkNetwork(url),
    };

    try {
      armLinks([link]);
      warmScrapeCache(url);
      if (onContinue) {
        onContinue();
        setLoading(false);
      } else {
        router.push("/territory");
      }
    } catch {
      setError("Could not continue. Try again.");
      setLoading(false);
    }
  };

  if (!sessionLoaded) {
    return <PageLoading message="Loading your session..." />;
  }

  return (
    <div className={embedded ? "space-y-6" : "page-stack w-full max-w-3xl mx-auto"}>
      {!embedded && (
        <>
          <WizardStepBar breadcrumb="Site Builder / Link" step={1} />
          <PageHeader
            eyebrow="Step 1"
            title="Add Your Link"
            subtitle='Paste any promotional or affiliate link below. It will be placed on your generated website. Use "Save to Content Reserve" if you want to reuse it later.'
          />
          <WizardStepper currentStep={1} />
        </>
      )}

        <div className="glass-card mb-2 overflow-hidden border-border-dim">
          <button
            type="button"
            onClick={() => setInstructionsOpen(!instructionsOpen)}
            className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-promo-accent/10 border border-promo-accent/20 flex items-center justify-center">
                <ClipboardPaste className="w-4 h-4 text-promo-accent" />
              </div>
              <span className="text-sm font-bold text-text-primary uppercase tracking-wider">
                How to Get Your Affiliate Link
              </span>
            </div>
            <motion.div
              animate={{ rotate: instructionsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-text-muted" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {instructionsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <div className="px-5 pb-5 space-y-3">
                  {INSTRUCTION_STEPS.map((step, i) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-promo-accent/25 bg-promo-accent/10">
                        <span className="text-xs font-bold text-promo-accent">{step.number}</span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <step.icon className="h-3.5 w-3.5 shrink-0 text-promo-accent" />
                          <span className="text-sm text-slate-800">{step.text}</span>
                        </div>
                        {step.link && (
                          <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-promo-accent hover:text-promo-accent/80 transition-colors"
                          >
                            {step.linkLabel}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-promo-accent/20 bg-white p-6 md:p-8"
        >
          <div className="flex flex-col gap-5">
            <ContentReservePicker
              links={armedLinks}
              selectedUrl={selectedVaultUrl}
              onSelect={handleSelectFromVault}
            />

            <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Link Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-promo-accent pointer-events-none">
                <Tag className="w-5 h-5" />
              </div>
              <GlassInput
                type="text"
                value={linkLabel}
                onChange={(e) => {
                  const nextLabel = e.target.value;
                  setLinkLabel(nextLabel);
                  setLinkSaved(false);
                  clearVaultSelectionIfEdited(linkUrl, nextLabel);
                }}
                placeholder="e.g. My Fitness eBook, Keto Supplement, etc."
                className="h-16 pl-12 text-base tracking-wide md:text-lg"
              />
            </div>

            <label className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Paste Your Affiliate Link
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-promo-accent pointer-events-none">
                <Zap className="w-5 h-5" />
              </div>
              <GlassInput
                type="url"
                value={linkUrl}
                onChange={(e) => {
                  const nextUrl = e.target.value;
                  setLinkUrl(nextUrl);
                  setLinkSaved(false);
                  clearVaultSelectionIfEdited(nextUrl, linkLabel);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && linkUrl.trim()) void handleSaveToVault();
                }}
                placeholder="Paste Digistore24 affiliate URL here..."
                className="h-16 pl-12 text-base tracking-wide md:text-lg"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void handleSaveToVault()}
                disabled={!linkUrl.trim() || loading}
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-sm border border-promo-accent/50 text-promo-accent bg-promo-accent/10 hover:bg-promo-accent/15 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : linkSaved ? (
                  <Check size={18} />
                ) : (
                  <Save size={18} />
                )}
                {linkSaved ? "Link Saved" : "Save to Content Reserve"}
              </button>
              {linkSaved && (
                <span className="text-sm text-promo-accent flex items-center gap-1.5">
                  <CheckCircle2 size={15} />
                  Saved to your portfolio
                </span>
              )}
            </div>

            {error && <ErrorBanner message={error} />}

            <button
              type="button"
              onClick={() => void handleContinue()}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 h-14 w-full rounded-xl font-bold uppercase tracking-widest text-sm text-text-on-accent bg-promo-accent shadow-[0_0_20px_rgba(238,179,16,0.35)] hover:shadow-[0_0_30px_rgba(238,179,16,0.55)] hover:brightness-110 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
              Continue to Niche
              <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
    </div>
  );
}
