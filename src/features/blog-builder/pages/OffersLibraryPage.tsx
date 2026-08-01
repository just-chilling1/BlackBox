"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ExternalLink,
  FolderOpen,
  Globe,
  Megaphone,
  ChevronDown,
  Loader2,
  FileText,
  Repeat,
  Copy,
  Check,
} from "lucide-react";
import { ThreadCard } from "@/features/publish-kit/components/ThreadCard";
import { ThreadListSection } from "@/features/publish-kit/components/ThreadListSection";
import { FacebookPostCard } from "@/features/blog-builder/components/FacebookPostCard";
import type { SavedFacebookPost } from "@/features/blog-builder/lib/facebook-posts-vault";
import { getAppUrl } from "@/lib/brand-vars";
import { cachedClientFetch } from "@/lib/client-fetch-cache";
import { PageHeader } from "@/components/ui/page-header";
import { PageSkeleton } from "@/components/ui/page-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { getSiteTerritory } from "@/features/blog-builder/lib/site-territory";
import type { SiteVaultSummary } from "@/app/api/blog/site/route";
import type { SavedXThread } from "@/features/publish-kit/lib/x-threads-vault";
import type { SavedRecurringArticle } from "@/features/premium-recurring/lib/recurring-articles-vault";

function OfferCard({
  summary,
  siteUrl,
  threads,
  facebookPosts,
  recurringArticles,
  loadingContent,
  onExpand,
  expanded,
}: {
  summary: SiteVaultSummary;
  siteUrl: string;
  threads: SavedXThread[];
  facebookPosts: SavedFacebookPost[];
  recurringArticles: SavedRecurringArticle[];
  loadingContent: boolean;
  onExpand: () => void;
  expanded: boolean;
}) {
  const { site, xThreadCount = 0, facebookPostCount = 0, recurringArticleCount = 0 } = summary;
  const territory = getSiteTerritory(site);
  const affiliate = site.armed_links?.[0];
  const hasThreads = xThreadCount > 0;
  const hasFacebookPosts = facebookPostCount > 0;
  const hasArticles = recurringArticleCount > 0;

  return (
    <article className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={onExpand}
        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-canvas"
      >
        <div
          className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-lg ${ site.status === "live" ? "bg-brass-100 text-brass-700" : "bg-brass-100 text-brass-700" }`}
        >
          <FolderOpen size={22} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="brand-font text-lg text-text-heading">{site.title}</h3>
          {site.tagline && <p className="mt-0.5 text-sm text-text-secondary line-clamp-2">{site.tagline}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="rounded-full bg-brass-100 px-2 py-0.5 text-[13px] font-medium text-brass-700">
              {territory}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-[13px] font-medium capitalize ${ site.status === "live" ? "bg-success/20 text-success" : "bg-black/10 text-text-muted" }`}
            >
              {site.status}
            </span>
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[13px] font-medium text-text-muted">
              {hasThreads ? `${xThreadCount}-post thread saved` : "No story thread yet"}
            </span>
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[13px] font-medium text-text-muted">
              {hasFacebookPosts
                ? `${facebookPostCount} Facebook post${facebookPostCount !== 1 ? "s" : ""}`
                : "No Facebook posts yet"}
            </span>
            <span className="rounded-full bg-black/10 px-2 py-0.5 text-[13px] font-medium text-text-muted">
              {hasArticles
                ? `${recurringArticleCount} authority article${recurringArticleCount !== 1 ? "s" : ""}`
                : "No authority articles yet"}
            </span>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 text-text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border-dim px-5 py-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {siteUrl && (
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-brass-100 px-3 py-2 text-[13px] font-medium text-text-heading hover:bg-brass-100/70"
              >
                <Globe size={14} />
                View sales page
                <ExternalLink size={12} />
              </a>
            )}
            {affiliate?.url && (
              <a
                href={affiliate.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-brass-100 px-3 py-2 text-[13px] font-medium text-text-heading hover:bg-brass-100/70"
              >
                <ExternalLink size={14} />
                {affiliate.label || "Affiliate link"}
              </a>
            )}
            <Link
              href={`/promote?siteId=${encodeURIComponent(site.id)}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-grad-brass px-3 py-2 text-[13px] font-medium text-[#0B0C10] hover:brightness-110"
            >
              <Megaphone size={14} />
              {hasThreads ? "Regenerate story thread" : "Generate story thread"}
            </Link>
            <Link
              href={`/social-payouts?siteId=${encodeURIComponent(site.id)}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-brass-100 px-3 py-2 text-[13px] font-medium text-text-heading hover:bg-brass-100/70"
            >
              <Megaphone size={14} />
              {hasFacebookPosts ? "Regenerate Facebook posts" : "Generate Facebook posts"}
            </Link>
            <Link
              href="/recurring-wealth"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-dim bg-brass-100 px-3 py-2 text-[13px] font-medium text-text-heading hover:bg-brass-100/70"
            >
              <Repeat size={14} />
              {hasArticles ? "Browse authority articles" : "Add authority articles"}
            </Link>
          </div>

          {loadingContent ? (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Loader2 size={14} className="animate-spin" />
              Loading saved content...
            </div>
          ) : (
            <>
              {threads.length > 0 ? (
                <ThreadListSection title="Story thread" count={threads.length}>
                  {threads.map((thread, i) => (
                    <ThreadCard
                      key={thread.id}
                      index={i + 1}
                      label={`Post ${i + 1} · ${thread.angle || "Post"}`}
                      text={thread.text}
                      imageUrl={thread.image_url}
                      defaultOpen={i === 0}
                    />
                  ))}
                </ThreadListSection>
              ) : (
                <p className="text-sm text-text-secondary">
                  No story thread saved for this offer yet. Open X-Power Promotions to generate one.
                </p>
              )}

              {facebookPosts.length > 0 ? (
                <ThreadListSection title="Facebook posts (Social Payouts)" count={facebookPosts.length}>
                  {facebookPosts.map((post) => (
                    <FacebookPostCard key={post.id} post={post} resolvedText={post.body} />
                  ))}
                </ThreadListSection>
              ) : (
                <p className="text-sm text-text-secondary">
                  No Facebook posts saved for this offer yet. Open Social Payouts to generate bulk variants.
                </p>
              )}

              {recurringArticles.length > 0 ? (
                <SavedArticlesSection articles={recurringArticles} />
              ) : (
                <p className="text-sm text-text-secondary">
                  No authority articles saved for this offer yet. Open Recurring Stream to preview and save articles.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </article>
  );
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function SavedArticlesSection({ articles }: { articles: SavedRecurringArticle[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (article: SavedRecurringArticle) => {
    const text = `${article.title}\n\n${htmlToPlainText(article.html)}`;
    await navigator.clipboard.writeText(text);
    setCopiedId(article.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <FileText size={14} className="text-brass-700" />
        <h4 className="text-sm font-medium text-text-primary">
          Authority articles ({articles.length})
        </h4>
      </div>
      <div className="space-y-2">
        {articles.map((article) => (
          <details
            key={article.id}
            className="group rounded-xl border border-border-dim bg-page/60 overflow-hidden"
          >
            <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
              <ChevronDown
                size={14}
                className="shrink-0 text-text-muted transition-transform group-open:rotate-180"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">
                {article.title}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  void handleCopy(article);
                }}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brass-100 px-2.5 py-1 text-[13px] font-medium text-text-secondary hover:bg-brass-100/70"
              >
                {copiedId === article.id ? <Check size={12} /> : <Copy size={12} />}
                {copiedId === article.id ? "Copied" : "Copy"}
              </button>
            </summary>
            <div
              className="recurring-article-body border-t border-divider px-4 py-3 text-sm max-h-64 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: article.html }}
            />
          </details>
        ))}
      </div>
    </div>
  );
}

export default function OffersLibraryPage() {
  const [summaries, setSummaries] = useState<SiteVaultSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [threadsBySite, setThreadsBySite] = useState<Record<string, SavedXThread[]>>({});
  const [facebookPostsBySite, setFacebookPostsBySite] = useState<Record<string, SavedFacebookPost[]>>({});
  const [articlesBySite, setArticlesBySite] = useState<Record<string, SavedRecurringArticle[]>>({});
  const [loadingContentId, setLoadingContentId] = useState<string | null>(null);

  useEffect(() => {
    void cachedClientFetch<{ summaries?: SiteVaultSummary[] }>("/api/blog/site?lite=1")
      .then((data) => {
        setSummaries(Array.isArray(data.summaries) ? data.summaries : []);
      })
      .catch(() => setSummaries([]))
      .finally(() => setLoading(false));
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : getAppUrl();

  const siteUrls = useMemo(() => {
    const map: Record<string, string> = {};
    for (const summary of summaries) {
      map[summary.site.id] = `${origin}/sites/${summary.site.slug}`;
    }
    return map;
  }, [summaries, origin]);

  const loadOfferContent = async (siteId: string) => {
    if (threadsBySite[siteId] && facebookPostsBySite[siteId] && articlesBySite[siteId]) return;
    setLoadingContentId(siteId);
    try {
      const res = await fetch(`/api/blog/site?siteId=${encodeURIComponent(siteId)}`, { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.xThreads)) {
          setThreadsBySite((prev) => ({ ...prev, [siteId]: data.xThreads as SavedXThread[] }));
        }
        if (Array.isArray(data.facebookPosts)) {
          setFacebookPostsBySite((prev) => ({
            ...prev,
            [siteId]: data.facebookPosts as SavedFacebookPost[],
          }));
        }
        if (Array.isArray(data.recurringArticles)) {
          setArticlesBySite((prev) => ({
            ...prev,
            [siteId]: data.recurringArticles as SavedRecurringArticle[],
          }));
        }
      }
    } finally {
      setLoadingContentId(null);
    }
  };

  const toggleExpand = (siteId: string) => {
    if (expandedId === siteId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(siteId);
    void loadOfferContent(siteId);
  };

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader
          eyebrow="Offers library"
          title="Your generated sales offers"
          subtitle="Every launched sales page lives here with its saved X threads, Facebook posts, and authority articles."
        />
        <PageSkeleton cards={2} />
      </div>
    );
  }

  if (summaries.length === 0) {
    return (
      <div className="page-container">
        <PageHeader
          eyebrow="Offers library"
          title="Your generated sales offers"
          subtitle="Every launched sales page lives here with its saved X threads, Facebook posts, and authority articles."
        />
        <EmptyState
          icon={FolderOpen}
          title="No offers yet"
          description="Run the Sales Offer Generator to create your first sales page, then come back here to view it and its X threads."
          action={{ label: "Start Sales Offer Generator", href: "/sales-offer-generator" }}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="Offers library"
        title="Your generated sales offers"
        subtitle="Browse every sales page you launched. Expand an offer to view saved threads, Facebook posts, authority articles, or generate new content."
      />

      <div className="space-y-4">
        {summaries.map((summary) => (
          <OfferCard
            key={summary.site.id}
            summary={summary}
            siteUrl={siteUrls[summary.site.id] ?? ""}
            threads={threadsBySite[summary.site.id] ?? []}
            facebookPosts={facebookPostsBySite[summary.site.id] ?? []}
            recurringArticles={articlesBySite[summary.site.id] ?? []}
            loadingContent={loadingContentId === summary.site.id}
            expanded={expandedId === summary.site.id}
            onExpand={() => toggleExpand(summary.site.id)}
          />
        ))}
      </div>
    </div>
  );
}
