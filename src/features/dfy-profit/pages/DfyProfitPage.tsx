"use client";

import { useCallback, useState } from "react";
import { Check, Filter, Link as LinkIcon, Loader2, Sparkles } from "lucide-react";
import { clsx } from "clsx";
import { AffiliateLinkField } from "@/components/premium/AffiliateLinkField";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { PremiumWorkflowShell } from "@/components/premium/PremiumWorkflowShell";
import { GenerationProgress } from "@/components/ui/generation-progress";
import { GlassPanel } from "@/components/ui/glass-panel";
import { isValidAffiliateUrl } from "@/features/blog-builder/lib/affiliate-url";
import { NICHE_OPTIONS } from "@/features/blog-builder/types";
import {
  DfyResultPanel,
  type DfyPinResult,
  type DfySalesResult,
} from "@/features/dfy-profit/components/DfyResultPanel";

type Stage = "idle" | "sales" | "pins" | "done";

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  sales: "Building your money page…",
  pins: "Generating 10 Pinterest pins with images…",
};

export default function DfyProfitPage() {
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [linkApplied, setLinkApplied] = useState(false);
  const [niche, setNiche] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [sales, setSales] = useState<DfySalesResult | null>(null);
  const [pins, setPins] = useState<DfyPinResult[]>([]);
  const [pinsError, setPinsError] = useState("");
  const [retryingPins, setRetryingPins] = useState(false);
  const [lastTemplateId, setLastTemplateId] = useState<string | undefined>();

  const generating = stage === "sales" || stage === "pins";

  const runPinsStage = useCallback(async (siteId: string) => {
    const res = await fetch("/api/pins/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Pin generation failed");
    return (data.pins ?? []) as DfyPinResult[];
  }, []);

  const handleGenerate = async () => {
    if (!linkApplied || !isValidAffiliateUrl(affiliateUrl)) {
      setError("Apply a valid affiliate URL starting with https://");
      return;
    }
    if (!niche) {
      setError("Pick a niche first.");
      return;
    }

    setError("");
    setPinsError("");
    setSales(null);
    setPins([]);
    setStage("sales");

    let siteId = "";

    try {
      const startRes = await fetch("/api/premium/dfy-profit/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateUrl,
          niche,
          excludeTemplateId: lastTemplateId,
        }),
      });
      const startData = await startRes.json();
      if (!startRes.ok) throw new Error(startData.error || "Money page generation failed");

      siteId = startData.siteId as string;
      setLastTemplateId(startData.templateId as string);
      setSales({
        siteId,
        offerUrl: startData.offerUrl as string,
        templateName: startData.templateName as string,
        templateId: startData.templateId as string,
        productName: (startData.productName as string) || "",
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Money page generation failed");
      setStage("idle");
      return;
    }

    setStage("pins");
    try {
      const pinResults = await runPinsStage(siteId);
      setPins(pinResults);
    } catch (e) {
      setPinsError(e instanceof Error ? e.message : "Pin generation failed");
    }

    setStage("done");
  };

  const handleRetryPins = async () => {
    if (!sales?.siteId) return;
    setRetryingPins(true);
    setPinsError("");
    try {
      const result = await runPinsStage(sales.siteId);
      setPins(result);
    } catch (e) {
      setPinsError(e instanceof Error ? e.message : "Pin generation failed");
    } finally {
      setRetryingPins(false);
    }
  };

  return (
    <PremiumWorkflowShell
      title="One-Click Asset"
      subtitle="Paste your affiliate link, pick a niche, and get a live money page plus 10 Pinterest pins — same core flow as Activate."
      tip={
        <>
          Tip: Apply your link first, then generate. You&apos;ll get a hosted money page and 10 pins
          ready for Traffic.
        </>
      }
      training={{
        vimeoId: "1215530104",
        title: "One-Click Asset Training",
        description:
          "Apply your affiliate link, pick a niche, and generate a money page with 10 Pinterest pins in one run — then post from Traffic.",
        iframeTitle: "One-Click Asset training video",
      }}
    >
      <GlassPanel className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-text-primary">Generate your asset</p>
            <p className="mt-1 text-xs text-text-muted">
              One click creates a hosted money page and 10 Pinterest pins with images.
            </p>
          </div>
        </div>

        <div>
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-primary">
            <LinkIcon size={14} className="text-pulse-700" />
            Affiliate URL
          </span>
          <AffiliateLinkField
            value={affiliateUrl}
            onChange={(url) => {
              setAffiliateUrl(url);
              setLinkApplied(false);
            }}
            onApply={(url) => {
              setAffiliateUrl(url);
              setLinkApplied(true);
              setError("");
            }}
            actionMode="apply"
            inputId="dfy-profit-affiliate-link"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-medium text-text-primary">
              <Filter size={14} className="text-pulse-700" />
              Select niche
            </p>
            <p className="text-xs text-text-muted">
              {niche
                ? NICHE_OPTIONS.find((o) => o.value === niche)?.label ?? niche
                : "Choose one"}
            </p>
          </div>
          <div
            className="flex flex-wrap gap-2 rounded-xl border border-[var(--np-line)] bg-[var(--np-surface-field)] p-3"
            role="group"
            aria-label="Select niche"
          >
            {NICHE_OPTIONS.map((option) => {
              const selected = niche === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={generating}
                  onClick={() => setNiche(option.value)}
                  className={clsx("select-chip-pill", selected && "is-selected")}
                >
                  {selected ? <Check size={13} className="mr-1 inline" /> : null}
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {error ? <PremiumErrorAlert message={error} /> : null}

        <button
          type="button"
          disabled={generating || !linkApplied || !niche}
          onClick={() => void handleGenerate()}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? "Generating…" : sales ? "Generate another asset" : "Generate asset"}
        </button>
      </GlassPanel>

      <GenerationProgress
        active={generating}
        label={stage === "sales" || stage === "pins" ? STAGE_LABELS[stage] : "Generating…"}
      />

      <DfyResultPanel
        sales={sales}
        pins={pins}
        pinsError={pinsError}
        isGeneratingPins={stage === "pins" || retryingPins}
        retryingPins={retryingPins}
        onRetryPins={() => void handleRetryPins()}
      />
    </PremiumWorkflowShell>
  );
}
