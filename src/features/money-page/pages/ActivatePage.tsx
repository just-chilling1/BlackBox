"use client";



import { useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/ui/page-header";

import { GlassPanel } from "@/components/ui/glass-panel";

import { WorkflowPage } from "@/components/ui/workflow-page";

import { WorkflowStepsBar } from "@/components/ui/workflow-steps";



const STAGES = [

  "Analyzing product",

  "Identifying target buyers",

  "Building money page",

  "Writing product review",

  "Creating headlines",

  "Adding monetization links",

  "Preparing traffic sources",

  "Finalizing asset",

];



export default function ActivateAssetPage() {

  const router = useRouter();

  const [productUrl, setProductUrl] = useState("");

  const [productName, setProductName] = useState("");

  const [affiliateUrl, setAffiliateUrl] = useState("");

  const [error, setError] = useState("");

  const [phase, setPhase] = useState<"form" | "activating" | "ready">("form");

  const [stageIndex, setStageIndex] = useState(0);

  const [assetId, setAssetId] = useState("");



  const completedStages = useMemo(

    () => STAGES.map((_, i) => i < stageIndex),

    [stageIndex]

  );



  async function activate() {

    setError("");

    if (!productUrl.trim() && !productName.trim()) {

      setError("Paste a product URL or enter a product name.");

      return;

    }

    setPhase("activating");

    setStageIndex(0);

    const timer = window.setInterval(() => {

      setStageIndex((prev) => Math.min(prev + 1, STAGES.length - 1));

    }, 900);



    try {

      const res = await fetch("/api/assets/activate", {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({ productUrl, productName, affiliateUrl }),

      });

      const data = await res.json().catch(() => ({}));

      window.clearInterval(timer);

      if (!res.ok) {

        setPhase("form");

        setError(typeof data.error === "string" ? data.error : "Activation failed.");

        return;

      }

      setStageIndex(STAGES.length);

      setAssetId(data.assetId);

      setPhase("ready");

    } catch {

      window.clearInterval(timer);

      setPhase("form");

      setError("Something went wrong. Please try again.");

    }

  }



  if (phase === "ready") {

    return (

      <WorkflowPage width="default">

        <WorkflowStepsBar current="money-page" assetId={assetId} />

        <PageHeader

          eyebrow="Step 2"

          title="Your asset is ready"

          subtitle="NullPing built a money page for this product. Preview it, publish when you're happy, then generate Pinterest traffic."

        />

        <GlassPanel className="space-y-5 p-6">

          <div className="success-banner">

            <CheckCircle2 size={18} />

            Activation complete

          </div>

          <div className="flex flex-wrap gap-3">

            <button type="button" className="btn-primary" onClick={() => router.push(`/money-page/${assetId}`)}>

              View my asset

            </button>

            <button type="button" className="btn-secondary" onClick={() => router.push(`/traffic/${assetId}`)}>

              Generate traffic

            </button>

          </div>

        </GlassPanel>

      </WorkflowPage>

    );

  }



  if (phase === "activating") {

    return (

      <WorkflowPage width="narrow">

        <WorkflowStepsBar current="activate" />

        <PageHeader title="Activating your asset..." subtitle="Sit tight — NullPing is doing the work." />

        <GlassPanel className="space-y-3 p-6">

          {STAGES.map((label, i) => (

            <div key={label} className="flex items-center gap-3 text-sm">

              {completedStages[i] ? (

                <CheckCircle2 size={16} className="text-success" />

              ) : i === stageIndex ? (

                <Loader2 size={16} className="animate-spin text-pulse-500" />

              ) : (

                <span className="inline-flex h-4 w-4 rounded-full border border-[var(--np-line-strong)]" />

              )}

              <span className={completedStages[i] || i === stageIndex ? "text-ink" : "text-ink-5"}>{label}</span>

            </div>

          ))}

        </GlassPanel>

      </WorkflowPage>

    );

  }



  return (

    <WorkflowPage width="narrow">

      <WorkflowStepsBar current="activate" />

      <PageHeader

        eyebrow="Step 1"

        title="What do you want to promote?"

        subtitle="Paste a product URL or type the name. NullPing handles the rest — no prompts, no SEO settings."

      />

      <GlassPanel className="space-y-5 p-6">

        <div className="flex items-start gap-3 rounded-xl border border-[var(--np-line-pulse)] bg-pulse-100/40 p-4">

          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-pulse-500" />

          <p className="text-sm leading-relaxed text-ink-2">

            NullPing will scrape the product, write a full review page, and prepare it for publishing.

          </p>

        </div>

        <label className="block">

          <span className="field-label">Paste product URL</span>

          <input

            className="input-base w-full"

            value={productUrl}

            onChange={(e) => setProductUrl(e.target.value)}

            placeholder="https://"

          />

        </label>

        <div className="or-divider">or</div>

        <label className="block">

          <span className="field-label">Enter product name</span>

          <input

            className="input-base w-full"

            value={productName}

            onChange={(e) => setProductName(e.target.value)}

            placeholder="Best sleep supplement"

          />

        </label>

        <label className="block">

          <span className="field-label">Affiliate link (optional)</span>

          <input

            className="input-base w-full"

            value={affiliateUrl}

            onChange={(e) => setAffiliateUrl(e.target.value)}

            placeholder="Your affiliate URL"

          />

        </label>

        {error ? <div className="alert-banner">{error}</div> : null}

        <button type="button" className="btn-primary w-full" onClick={() => void activate()}>

          Activate asset

        </button>

      </GlassPanel>

    </WorkflowPage>

  );

}

