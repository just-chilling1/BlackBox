"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GlassPanel } from "@/components/ui/glass-panel";
import { WorkflowPage } from "@/components/ui/workflow-page";
import { WorkflowStepsBar } from "@/components/ui/workflow-steps";
import { AiLoadingBar } from "@/components/ui/AiLoadingBar";

const STAGES = [
  "Analyzing product",
  "Identifying target buyers",
  "Building money page",
  "Writing product review",
  "Creating headlines",
  "Adding monetization links",
  "Preparing traffic sources",
  "Finalizing asset",
] as const;

function ActivateStageList({ stageIndex }: { stageIndex: number }) {
  const reduceMotion = useReducedMotion();

  return (
    <ul className="activate-stage-list" role="list" aria-label="Activation progress">
      {STAGES.map((label, i) => {
        const done = i < stageIndex;
        const active = i === stageIndex && stageIndex < STAGES.length;
        const pending = !done && !active;

        return (
          <motion.li
            key={label}
            layout={!reduceMotion}
            className={[
              "activate-stage-row",
              done ? "is-done" : "",
              active ? "is-active" : "",
              pending ? "is-pending" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            initial={reduceMotion ? false : { opacity: 0.55, y: 4 }}
            animate={{
              opacity: pending ? 0.55 : 1,
              y: 0,
              scale: active && !reduceMotion ? 1.01 : 1,
            }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.2, 0, 0, 1] }}
          >
            <span className="activate-stage-icon" aria-hidden>
              <AnimatePresence mode="wait" initial={false}>
                {done ? (
                  <motion.span
                    key="done"
                    className="activate-stage-check"
                    initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  >
                    <CheckCircle2 size={18} strokeWidth={2.25} />
                  </motion.span>
                ) : active ? (
                  <motion.span
                    key="active"
                    className="activate-stage-spinner"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="activate-stage-ring" />
                    <Loader2 size={16} className="activate-stage-loader" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="pending"
                    className="activate-stage-dot"
                    initial={false}
                    animate={{ opacity: 1 }}
                  />
                )}
              </AnimatePresence>
            </span>
            <span className="activate-stage-label">{label}</span>
          </motion.li>
        );
      })}
    </ul>
  );
}

export default function ActivateAssetPage() {
  const router = useRouter();
  const [productUrl, setProductUrl] = useState("");
  const [productName, setProductName] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"form" | "activating" | "ready">("form");
  const [stageIndex, setStageIndex] = useState(0);
  const [assetId, setAssetId] = useState("");

  const progressPct = useMemo(() => {
    if (stageIndex >= STAGES.length) return 100;
    return Math.min(96, Math.round(((stageIndex + 0.35) / STAGES.length) * 100));
  }, [stageIndex]);

  const currentLabel =
    stageIndex >= STAGES.length ? "Finalizing asset" : STAGES[Math.min(stageIndex, STAGES.length - 1)];

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
      <WorkflowPage width="full">
        <WorkflowStepsBar current="money-page" assetId={assetId} />
        <PageHeader
          eyebrow="Step 2"
          title="Your asset is ready"
          subtitle="NullPing built a money page for this product. Preview it, publish when you're happy, then generate Pinterest traffic."
        />
        <GlassPanel className="space-y-5 p-6 sm:p-8">
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
      <WorkflowPage width="full">
        <WorkflowStepsBar current="activate" />
        <PageHeader title="Activating your asset..." subtitle="Sit tight — NullPing is doing the work." />
        <GlassPanel className="activate-progress-panel space-y-5 p-6 sm:p-8">
          <AiLoadingBar label={currentLabel} progress={progressPct} active eta="Working…" />
          <ActivateStageList stageIndex={stageIndex} />
        </GlassPanel>
      </WorkflowPage>
    );
  }

  return (
    <WorkflowPage width="full">
      <WorkflowStepsBar current="activate" />
      <PageHeader
        eyebrow="Step 1"
        title="What do you want to promote?"
        subtitle="Paste a product URL or type the name. NullPing handles the rest — no prompts, no SEO settings."
      />
      <GlassPanel className="space-y-6 p-6 sm:p-8 lg:p-10">
        <div className="flex items-start gap-3 rounded-xl border border-[var(--np-line-pulse)] bg-pulse-100/40 p-4 sm:p-5">
          <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-pulse-500" />
          <p className="text-sm leading-relaxed text-ink-2 sm:text-[15px]">
            NullPing will scrape the product, write a full review page, and prepare it for publishing.
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <label className="block">
            <span className="field-label">Paste product URL</span>
            <input
              className="input-base w-full"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              placeholder="https://"
            />
          </label>
          <label className="block">
            <span className="field-label">Enter product name</span>
            <input
              className="input-base w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Best sleep supplement"
            />
          </label>
        </div>
        <div className="or-divider lg:hidden">or</div>
        <p className="hidden text-center text-[13px] font-medium uppercase tracking-[0.14em] text-ink-5 lg:block">
          Use a URL, a product name, or both
        </p>
        <label className="block max-w-3xl">
          <span className="field-label">Affiliate link (optional)</span>
          <input
            className="input-base w-full"
            value={affiliateUrl}
            onChange={(e) => setAffiliateUrl(e.target.value)}
            placeholder="Your affiliate URL"
          />
        </label>
        {error ? <div className="alert-banner">{error}</div> : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="button" className="btn-primary sm:min-w-[14rem]" onClick={() => void activate()}>
            Activate asset
          </button>
        </div>
      </GlassPanel>
    </WorkflowPage>
  );
}
