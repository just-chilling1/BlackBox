"use client";

import { useCallback, useState } from "react";
import { Loader2, Sparkles, Wallet } from "lucide-react";
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

type Stage = "idle" | "sales" | "article" | "posts" | "done";

const STAGE_LABELS: Record<Exclude<Stage, "idle" | "done">, string> = {
  sales: "Building your sales page with a random template…",
  article: "Writing your authority article…",
  posts: "Generating 3 Facebook posts…",
};

export default function DfyProfitPage() {
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [niche, setNiche] = useState("");
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState("");
  const [sales, setSales] = useState<DfySalesResult | null>(null);
  const [article, setArticle] = useState<DfyArticleResult | null>(null);
  const [posts, setPosts] = useState<DfyFacebookPost[]>([]);
  const [productContext, setProductContext] = useState("");
  const [productName, setProductName] = useState("");
  const [nicheLabel, setNicheLabel] = useState("");
  const [lastTemplateId, setLastTemplateId] = useState<string | undefined>();
  const [articleError, setArticleError] = useState("");
  const [postsError, setPostsError] = useState("");
  const [retryingArticle, setRetryingArticle] = useState(false);
  const [retryingPosts, setRetryingPosts] = useState(false);

  const generating = stage === "sales" || stage === "article" || stage === "posts";

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
        url: data.url as string,
        html: data.html as string,
        slug: data.slug as string,
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
    setSales(null);
    setArticle(null);
    setPosts([]);
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

  return (
    <PremiumPageLayout
      title="Done-For-You Profit"
      subtitle="Paste your affiliate link, pick a niche, and get a live sales page, authority article, and 3 Facebook posts in one run."
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
            desc: "We build a random-template sales page, an authority article, and 3 Facebook posts.",
          },
        ]}
      />

      <PremiumControlCard
        icon={Wallet}
        title="Generate your kit"
        description="One click creates a hosted sales page, a live authority article, and three Facebook posts."
      >
        <div className="space-y-2">
          <span className="block text-sm font-medium text-text-primary">Affiliate link</span>
          <AffiliateLinkField
            value={affiliateUrl}
            onChange={setAffiliateUrl}
            inputId="dfy-profit-affiliate-link"
          />
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-text-primary">Niche</span>
          <select
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="input-base w-full"
            disabled={generating}
          >
            <option value="" disabled>
              Choose a niche…
            </option>
            {NICHE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

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
          stage === "sales" || stage === "article" || stage === "posts"
            ? STAGE_LABELS[stage]
            : "Generating…"
        }
      />

      <DfyResultPanel
        sales={sales}
        article={article}
        posts={posts}
        articleError={articleError}
        postsError={postsError}
        retryingArticle={retryingArticle}
        retryingPosts={retryingPosts}
        onRetryArticle={() => void handleRetryArticle()}
        onRetryPosts={() => void handleRetryPosts()}
      />
    </PremiumPageLayout>
  );
}
