"use client";

import { useCallback, useState } from "react";
import { Check, Loader2, Sparkles, Wallet } from "lucide-react";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { AffiliateLinkField } from "@/components/premium/AffiliateLinkField";
import { PremiumControlCard } from "@/components/premium/PremiumControlCard";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { PremiumPageLayout } from "@/components/premium/PremiumPageLayout";
import { PremiumStepsSection } from "@/components/premium/PremiumStepsSection";
import { GenerationProgress } from "@/components/ui/generation-progress";
import { isValidAffiliateUrl } from "@/features/blog-builder/lib/affiliate-url";
import { NICHE_OPTIONS } from "@/features/blog-builder/types";
import {
  DfyResultPanel,
  type DfyArticleResult,
  type DfyFacebookPost,
  type DfySalesResult,
} from "@/features/dfy-profit/components/DfyResultPanel";

type Stage = "idle" | "sales" | "thread" | "article" | "posts" | "done";

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  sales: "Building your sales page…",
  thread: "Writing your X story thread…",
  article: "Writing your authority article…",
  posts: "Generating Facebook posts…",
};

export default function DfyProfitPage() {
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [sales, setSales] = useState<DfySalesResult | null>(null);
  const [article, setArticle] = useState<DfyArticleResult | null>(null);
  const [posts, setPosts] = useState<DfyFacebookPost[]>([]);
  const [thread, setThread] = useState<{
    id: string;
    text: string;
    angle: string | null;
    imageUrl: string | null;
  }[]>([]);
  const [productContext, setProductContext] = useState("");
  const [productName, setProductName] = useState("");
  const [nicheLabel, setNicheLabel] = useState("");
  const [lastTemplateId, setLastTemplateId] = useState<string | undefined>();
  const [articleError, setArticleError] = useState("");
  const [postsError, setPostsError] = useState("");
  const [threadError, setThreadError] = useState("");
  const [retryingArticle, setRetryingArticle] = useState(false);
  const [retryingPosts, setRetryingPosts] = useState(false);
  const [retryingThread, setRetryingThread] = useState(false);

  const generating =
    stage === "sales" || stage === "article" || stage === "posts" || stage === "thread";

  const runArticleStage = useCallback(
    async (siteId: string, ctx: string, name: string, nicheName: string) => {
      const res = await fetch("/api/premium/dfy-profit/article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          productContext: ctx,
          productName: name,
          niche: nicheName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Article generation failed");
      return {
        title: data.title as string,
        excerpt: data.excerpt as string,
        html: data.html as string,
      } satisfies DfyArticleResult;
    },
    []
  );

  const runPostsStage = useCallback(async (siteId: string) => {
    const res = await fetch("/api/premium/dfy-profit/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Facebook post generation failed");
    return (data.posts ?? []) as DfyFacebookPost[];
  }, []);

  const runThreadStage = useCallback(async (siteId: string) => {
    const res = await fetch("/api/premium/dfy-profit/x-thread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteId }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "X thread generation failed");
    return (data.posts ?? []) as typeof thread;
  }, []);

  const handleGenerate = async () => {
    if (!isValidAffiliateUrl(affiliateUrl)) {
      setError("Enter a valid affiliate URL starting with https://");
      return;
    }
    if (!niche) {
      setError("Pick a niche first.");
      return;
    }

    setError("");
    setArticleError("");
    setPostsError("");
    setThreadError("");
    setSales(null);
    setArticle(null);
    setPosts([]);
    setThread([]);
    setStage("sales");

    let siteId = "";
    let ctx = "";
    let name = "";
    let nicheName = "";

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
      if (!startRes.ok) throw new Error(startData.error || "Sales page generation failed");

      siteId = startData.siteId as string;
      ctx = (startData.productContext as string) || "";
      name = (startData.productName as string) || "";
      nicheName = (startData.niche as string) || niche;
      setProductContext(ctx);
      setProductName(name);
      setNicheLabel(nicheName);
      setLastTemplateId(startData.templateId as string);
      setSales({
        siteId,
        offerUrl: startData.offerUrl as string,
        templateName: startData.templateName as string,
        templateId: startData.templateId as string,
        productName: name,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sales page generation failed");
      setStage("idle");
      return;
    }

    setStage("thread");
    try {
      const threadResult = await runThreadStage(siteId);
      setThread(threadResult);
    } catch (e) {
      setThreadError(e instanceof Error ? e.message : "X thread generation failed");
    }

    setStage("article");
    try {
      const articleResult = await runArticleStage(siteId, ctx, name, nicheName);
      setArticle(articleResult);
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed");
    }

    setStage("posts");
    try {
      const postsResult = await runPostsStage(siteId);
      setPosts(postsResult);
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed");
    }

    setStage("done");
  };

  const handleRetryArticle = async () => {
    if (!sales?.siteId) return;
    setRetryingArticle(true);
    setArticleError("");
    try {
      const result = await runArticleStage(
        sales.siteId,
        productContext,
        productName,
        nicheLabel
      );
      setArticle(result);
    } catch (e) {
      setArticleError(e instanceof Error ? e.message : "Article generation failed");
    } finally {
      setRetryingArticle(false);
    }
  };

  const handleRetryPosts = async () => {
    if (!sales?.siteId) return;
    setRetryingPosts(true);
    setPostsError("");
    try {
      const result = await runPostsStage(sales.siteId);
      setPosts(result);
    } catch (e) {
      setPostsError(e instanceof Error ? e.message : "Facebook post generation failed");
    } finally {
      setRetryingPosts(false);
    }
  };

  const handleRetryThread = async () => {
    if (!sales?.siteId) return;
    setRetryingThread(true);
    setThreadError("");
    try {
      const result = await runThreadStage(sales.siteId);
      setThread(result);
    } catch (e) {
      setThreadError(e instanceof Error ? e.message : "X thread generation failed");
    } finally {
      setRetryingThread(false);
    }
  };

  return (
    <PremiumPageLayout
      title="One-Click Asset"
      subtitle="Paste your affiliate link, pick a niche, and get a live money page plus supporting assets in one run."
      footer={
        <PremiumFooter>
          Powered by {brand.productName}. Kits also appear in your Offers Library.
        </PremiumFooter>
      }
    >
      <PremiumStepsSection
        steps={[
          {
            num: "1",
            title: "Add your link",
            desc: "Paste an affiliate URL or pick one from your Links Library.",
          },
          {
            num: "2",
            title: "Pick a niche",
            desc: "Choose the niche so copy, layout tone, and posts stay on-brand.",
          },
          {
            num: "3",
            title: "Generate your kit",
            desc: "We build a random-template sales page, an authority article, and Facebook posts.",
          },
        ]}
      />

      <PremiumControlCard
        icon={Wallet}
        title="Generate your kit"
        description="One click creates a hosted sales page, copy-ready authority article, Facebook posts, and an X story thread."
      >
        <div className="space-y-2">
          <span className="block text-sm font-medium text-text-primary">Affiliate link</span>
          <AffiliateLinkField
            value={affiliateUrl}
            onChange={setAffiliateUrl}
            inputId="dfy-profit-affiliate-link"
          />
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium text-text-primary">2. Niche</legend>
          <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--np-line-pulse)] bg-canvas/60 p-3">
            {NICHE_OPTIONS.map((option) => {
              const selected = niche === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={generating}
                  onClick={() => setNiche(option.value)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-[999px] border px-4 py-2.5 text-[13px] font-medium transition-all duration-200 disabled:opacity-50 disabled:hover:translate-y-0",
                    selected
                      ? "border-[var(--np-line-pulse)] bg-grad-pulse text-black shadow-[0_0_18px_rgba(203,161,53,0.24)]"
                      : "border-border-dim bg-surface text-text-secondary hover:-translate-y-0.5 hover:border-[var(--np-line-pulse)] hover:bg-pulse-100/60 hover:text-text-primary hover:shadow-sm"
                  )}
                >
                  {selected && <Check size={13} />}
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {error && <PremiumErrorAlert message={error} />}

        <button
          type="button"
          disabled={generating}
          onClick={() => void handleGenerate()}
          className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
        >
          {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? "Generating…" : sales ? "Generate another kit" : "Generate kit"}
        </button>
      </PremiumControlCard>

      <GenerationProgress
        active={generating}
        label={
          stage === "sales" || stage === "thread" || stage === "article" || stage === "posts"
            ? STAGE_LABELS[stage]
            : "Generating…"
        }
      />

      <DfyResultPanel
        sales={sales}
        article={article}
        posts={posts}
        thread={thread}
        articleError={articleError}
        postsError={postsError}
        threadError={threadError}
        isGeneratingThread={stage === "thread"}
        isGeneratingArticle={stage === "article"}
        isGeneratingPosts={stage === "posts"}
        retryingArticle={retryingArticle}
        retryingPosts={retryingPosts}
        retryingThread={retryingThread}
        onRetryArticle={() => void handleRetryArticle()}
        onRetryPosts={() => void handleRetryPosts()}
        onRetryThread={() => void handleRetryThread()}
      />
    </PremiumPageLayout>
  );
}
