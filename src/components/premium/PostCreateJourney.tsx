"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Loader2,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { useCallback, useState } from "react";
import { GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";

interface PostCreateJourneyProps {
  assetId: string;
  publicUrl: string;
  productName?: string;
  /** Show AI pin regenerate (Asset Vault) */
  showRegeneratePins?: boolean;
  pinCount?: number;
  className?: string;
  title?: string;
}

export function PostCreateJourney({
  assetId,
  publicUrl,
  productName,
  showRegeneratePins = false,
  pinCount,
  className,
  title = "Next steps",
}: PostCreateJourneyProps) {
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState("");
  const [regenOk, setRegenOk] = useState(false);

  const copyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }, [publicUrl]);

  const regeneratePins = useCallback(async () => {
    setRegenerating(true);
    setRegenError("");
    setRegenOk(false);
    try {
      const res = await fetch("/api/pins/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: assetId, regenerate: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to regenerate pins");
      setRegenOk(true);
    } catch (e) {
      setRegenError(e instanceof Error ? e.message : "Failed to regenerate pins");
    } finally {
      setRegenerating(false);
    }
  }, [assetId]);

  return (
    <section
      id={GENERATION_RESULTS_ID}
      className={`scroll-mt-24 space-y-4 rounded-2xl border border-[var(--np-line-pulse)] bg-pulse-100/10 p-5 sm:p-6 ${className ?? ""}`}
    >
      <div>
        <p className="text-sm font-medium text-text-primary">{title}</p>
        {productName ? (
          <p className="mt-1 text-xs text-text-muted">{productName} is live — finish the loop.</p>
        ) : (
          <p className="mt-1 text-xs text-text-muted">
            Edit the page, post pins, then check Results for real visits and clicks.
          </p>
        )}
      </div>

      <ol className="grid gap-3 sm:grid-cols-3">
        <li className="rounded-xl border border-[var(--np-line)] bg-[var(--np-surface)] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-pulse-700">Step 1</p>
          <p className="mt-1 text-sm font-medium text-text-primary">Review money page</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-1.5 text-xs"
            >
              <ExternalLink size={12} />
              Open
            </a>
            <Link
              href={`/money-page/${assetId}`}
              className="btn-secondary inline-flex items-center gap-1.5 text-xs"
            >
              <Pencil size={12} />
              Edit
            </Link>
          </div>
        </li>
        <li className="rounded-xl border border-[var(--np-line)] bg-[var(--np-surface)] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-pulse-700">Step 2</p>
          <p className="mt-1 text-sm font-medium text-text-primary">
            Get pins{typeof pinCount === "number" ? ` (${pinCount})` : ""}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/traffic/${assetId}`}
              className="btn-primary inline-flex items-center gap-1.5 text-xs"
            >
              <ImageIcon size={12} />
              Traffic
              <ArrowRight size={12} />
            </Link>
            {showRegeneratePins ? (
              <button
                type="button"
                disabled={regenerating}
                onClick={() => void regeneratePins()}
                className="btn-secondary inline-flex items-center gap-1.5 text-xs disabled:opacity-50"
              >
                {regenerating ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                AI pins
              </button>
            ) : null}
          </div>
          {regenOk ? (
            <p className="mt-2 text-[11px] text-success">Pins regenerated with AI.</p>
          ) : null}
          {regenError ? <p className="mt-2 text-[11px] text-danger">{regenError}</p> : null}
        </li>
        <li className="rounded-xl border border-[var(--np-line)] bg-[var(--np-surface)] p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-pulse-700">Step 3</p>
          <p className="mt-1 text-sm font-medium text-text-primary">Check Results</p>
          <div className="mt-3">
            <Link
              href="/results"
              className="btn-secondary inline-flex items-center gap-1.5 text-xs"
            >
              <Activity size={12} />
              Results
              <ArrowRight size={12} />
            </Link>
          </div>
        </li>
      </ol>

      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--np-line)] pt-4">
        <p className="truncate text-xs text-text-secondary">{publicUrl}</p>
        <button
          type="button"
          onClick={() => void copyUrl()}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-pulse-700 hover:underline"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy URL"}
        </button>
      </div>
    </section>
  );
}
