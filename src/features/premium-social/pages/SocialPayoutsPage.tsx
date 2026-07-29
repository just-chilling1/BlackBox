"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Megaphone,
  Copy,
  Check,
  Loader2,
  Sparkles,
  FolderOpen,
  ClipboardCopy,
} from "lucide-react";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { GenerationProgress, GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { PremiumPageLayout } from "@/components/premium/PremiumPageLayout";
import { PremiumControlCard } from "@/components/premium/PremiumControlCard";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import type { SiteVaultSummary } from "@/app/api/blog/site/route";

const SITE_STORAGE_KEY = `${brand.storagePrefix}_social_payouts_site`;

interface SavedPost {
  id: string;
  body: string;
}

interface PostCardProps {
  post: SavedPost;
  index: number;
  copiedId: string | null;
  onCopy: (post: SavedPost) => void;
}

const PostCard = memo(function PostCard({ post, index, copiedId, onCopy }: PostCardProps) {
  const isCopied = copiedId === post.id;

  return (
    <article className="glass-card flex flex-col gap-3 p-4 transition-colors hover:border-accent/20 [content-visibility:auto] [contain-intrinsic-size:auto_180px]">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
          Variant {index + 1}
        </p>
        <button
          type="button"
          onClick={() => onCopy(post)}
          className={clsx(
            "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            isCopied
              ? "bg-accent/20 text-accent"
              : "bg-slate-100 text-text-secondary hover:bg-slate-200/70"
          )}
        >
          {isCopied ? <Check size={12} /> : <Copy size={12} />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{post.body}</p>
    </article>
  );
});

function offerLabel(summary: SiteVaultSummary): string {
  const title = summary.site.title || getSiteTerritory(summary.site);
  if (summary.facebookPostCount > 0) {
    return `${title} (${summary.facebookPostCount} posts)`;
  }
  return title;
}

export default function SocialPayoutsPage() {
  const searchParams = useSearchParams();
  const initialSiteId = searchParams.get("siteId");

  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState<SiteVaultSummary[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState("");
  const [postsBySite, setPostsBySite] = useState<Record<string, SavedPost[]>>({});
  const [generating, setGenerating] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [error, setError] = useState("");

  const posts = postsBySite[selectedSiteId] ?? [];

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/blog/site?lite=1", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load offers");
        const list = Array.isArray(data.summaries) ? (data.summaries as SiteVaultSummary[]) : [];
        setOffers(list);

        if (list.length === 0) return;

        const fromUrl =
          initialSiteId && list.some((o) => o.site.id === initialSiteId) ? initialSiteId : null;
        let fromStorage: string | null = null;
        try {
          fromStorage = localStorage.getItem(SITE_STORAGE_KEY);
        } catch {
          /* ignore */
        }

        const preferred =
          fromUrl ??
          (fromStorage && list.some((o) => o.site.id === fromStorage) ? fromStorage : null) ??
          list[0].site.id;

        setSelectedSiteId(preferred);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load offers");
      } finally {
        setLoading(false);
      }
    })();
  }, [initialSiteId]);

  useEffect(() => {
    if (!selectedSiteId) return;
    try {
      localStorage.setItem(SITE_STORAGE_KEY, selectedSiteId);
    } catch {
      /* ignore */
    }
  }, [selectedSiteId]);

  const loadPosts = useCallback(async (siteId: string) => {
    if (!siteId) return;

    const summary = offers.find((o) => o.site.id === siteId);
    if (summary?.facebookPostCount === 0) {
      setPostsBySite((prev) => ({ ...prev, [siteId]: [] }));
      return;
    }

    setLoadingPosts(true);
    try {
      const res = await fetch(`/api/premium/social-payouts?siteId=${encodeURIComponent(siteId)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (res.ok) {
        setPostsBySite((prev) => ({ ...prev, [siteId]: data.posts ?? [] }));
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingPosts(false);
    }
  }, [offers]);

  useEffect(() => {
    if (!selectedSiteId || offers.length === 0) return;
    if (Object.prototype.hasOwnProperty.call(postsBySite, selectedSiteId)) return;
    void loadPosts(selectedSiteId);
  }, [selectedSiteId, offers.length, loadPosts, postsBySite]);

  const selectedOffer = useMemo(
    () => offers.find((o) => o.site.id === selectedSiteId),
    [offers, selectedSiteId]
  );

  const hasExistingPosts = (selectedOffer?.facebookPostCount ?? 0) > 0 || posts.length > 0;

  const handleGenerate = async () => {
    if (!selectedSiteId) {
      setError("Select an offer first.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/premium/social-payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: selectedSiteId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      const nextPosts = data.posts ?? [];
      setPostsBySite((prev) => ({ ...prev, [selectedSiteId]: nextPosts }));
      setOffers((prev) =>
        prev.map((o) =>
          o.site.id === selectedSiteId
            ? { ...o, facebookPostCount: nextPosts.length }
            : o
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = useCallback(async (post: SavedPost) => {
    try {
      await navigator.clipboard.writeText(post.body);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const handleCopyAll = async () => {
    if (posts.length === 0) return;
    try {
      const text = posts.map((post, i) => `Variant ${i + 1}\n${post.body}`).join("\n\n---\n\n");
      await navigator.clipboard.writeText(text);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <PremiumPageLayout
        title="Social Payouts"
        subtitle="10X bulk social posts — pick an offer, generate 10+ Facebook variants with different hooks and angles, then copy and paste."
        animate={false}
      >
        <PageSkeleton cards={2} />
      </PremiumPageLayout>
    );
  }

  return (
    <PremiumPageLayout
      title="Social Payouts"
      subtitle="10X bulk social posts — pick an offer, generate 10+ Facebook variants with different hooks and angles, then copy and paste."
      footer={
        <PremiumFooter>
          Powered by {brand.productName}. Social Payouts uses the 10X bulk post engine.
        </PremiumFooter>
      }
    >
      {offers.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No offers yet"
          description="Create an offer first, then generate social posts for it."
          action={{ label: "Create an offer", href: "/sales-offer-generator" }}
        />
      ) : (
        <PremiumControlCard
          icon={Megaphone}
          title="Bulk post generator (10X)"
          description="One offer → many scroll-stopping posts with your link baked in."
        >
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-text-primary">Select offer</span>
            <select
              value={selectedSiteId}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              className="input-base w-full"
            >
              {offers.map((o) => (
                <option key={o.site.id} value={o.site.id}>
                  {offerLabel(o)}
                </option>
              ))}
            </select>
          </label>

          {selectedOffer && (
            <p className="text-xs text-text-muted">
              Niche: {getSiteTerritory(selectedOffer.site)}
              {selectedOffer.site.armed_links?.[0]?.url
                ? " · Link armed"
                : " · Add a link in Links Library for best results"}
              {selectedOffer.facebookPostCount > 0
                ? ` · ${selectedOffer.facebookPostCount} saved posts`
                : ""}
            </p>
          )}

          {error && <PremiumErrorAlert message={error} />}

          <button
            type="button"
            disabled={generating || !selectedSiteId}
            onClick={() => void handleGenerate()}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-50"
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            {generating
              ? "Generating 10 posts…"
              : hasExistingPosts
                ? "Regenerate 10X posts"
                : "Generate 10X posts"}
          </button>
        </PremiumControlCard>
      )}

      <GenerationProgress
        active={generating}
        label="Generating 10 scroll-stopping Facebook post variants..."
      />

      {(loadingPosts || posts.length > 0) && (
        <section id={GENERATION_RESULTS_ID} className="scroll-mt-24 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-text-primary">
              {loadingPosts && posts.length === 0
                ? "Loading posts…"
                : `${posts.length} post${posts.length !== 1 ? "s" : ""} ready`}
            </h2>
            {posts.length > 0 && (
              <button
                type="button"
                onClick={() => void handleCopyAll()}
                className="inline-flex items-center gap-2 text-sm font-semibold text-accent"
              >
                {copiedAll ? <Check size={14} /> : <ClipboardCopy size={14} />}
                {copiedAll ? "All copied!" : "Copy all"}
              </button>
            )}
          </div>

          {loadingPosts && posts.length === 0 ? (
            <div className="flex items-center gap-2 rounded-xl border border-divider bg-slate-50 px-4 py-6 text-sm text-text-muted">
              <Loader2 size={16} className="animate-spin" />
              Loading saved posts…
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {posts.map((post, i) => (
                <PostCard
                  key={post.id}
                  post={post}
                  index={i}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                />
              ))}
            </div>
          )}
        </section>
      )}
    </PremiumPageLayout>
  );
}
