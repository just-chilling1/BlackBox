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
  ChevronDown,
  ClipboardCopy,
} from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
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
    <details className="group glass-card overflow-hidden [content-visibility:auto] [contain-intrinsic-size:auto_120px]">
      <summary className="flex cursor-pointer list-none items-start gap-3 p-4 transition-colors hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          size={16}
          className="mt-0.5 shrink-0 text-text-muted transition-transform group-open:rotate-180"
        />
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Variant {index + 1}
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-text-secondary group-open:hidden">
            {post.body}
          </p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onCopy(post);
          }}
          className={clsx(
            "shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
            isCopied
              ? "bg-accent/20 text-accent"
              : "bg-slate-100 text-text-secondary hover:bg-slate-200/70"
          )}
        >
          {isCopied ? <Check size={12} /> : <Copy size={12} />}
          {isCopied ? "Copied" : "Copy"}
        </button>
      </summary>
      <div className="border-t border-divider px-4 pb-4 pl-11">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{post.body}</p>
      </div>
    </details>
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
      <div className="page-stack max-w-4xl">
        <PageHeader
          eyebrow="Premium"
          title="Social Payouts"
          subtitle="10X bulk social posts — pick an offer, generate 10+ Facebook variants with different hooks and angles, then copy and paste."
        />
        <PageSkeleton cards={2} />
      </div>
    );
  }

  return (
    <div className="page-stack max-w-4xl">
      <PageHeader
        eyebrow="Premium"
        title="Social Payouts"
        subtitle="10X bulk social posts — pick an offer, generate 10+ Facebook variants with different hooks and angles, then copy and paste."
      />

      <section className="glass-card space-y-5 p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
            <Megaphone size={22} />
          </div>
          <div>
            <p className="font-bold text-text-primary">Bulk post generator (10X)</p>
            <p className="text-sm text-text-secondary">
              One offer → many scroll-stopping posts with your link baked in.
            </p>
          </div>
        </div>

        {offers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-accent/30 p-6 text-center">
            <FolderOpen className="mx-auto mb-2 text-text-muted" size={28} />
            <p className="text-sm text-text-secondary">
              Create an offer first, then generate social posts for it.
            </p>
            <Link href="/sales-offer-generator" className="btn-primary mt-4 inline-flex">
              Create an offer
            </Link>
          </div>
        ) : (
          <>
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
          </>
        )}

        {error && (
          <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        )}
      </section>

      {(loadingPosts || posts.length > 0) && (
        <section className="space-y-3">
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
            posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post}
                index={i}
                copiedId={copiedId}
                onCopy={handleCopy}
              />
            ))
          )}
        </section>
      )}

      <p className="text-xs text-text-muted">
        {brand.productName} Social Payouts — powered by the 10X bulk post engine.
      </p>
    </div>
  );
}
