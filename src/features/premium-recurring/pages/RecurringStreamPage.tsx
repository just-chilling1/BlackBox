"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Repeat,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2,
  FileText,
  Filter,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";
import { brand } from "@/config/brand.config";
import { PageLoading } from "@/components/ui/page-loading";
import { GenerationProgress, GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { PremiumPageLayout } from "@/components/premium/PremiumPageLayout";
import { PremiumControlCard } from "@/components/premium/PremiumControlCard";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { RECURRING_STREAM_NICHES } from "@/features/premium-recurring/lib/catalog";
import { wrapArticleWithTitle } from "@/features/blog-builder/lib/authority-article-content";

interface ArticleRow {
  id: number;
  niche: string;
  title: string;
  excerpt: string | null;
  angle: string | null;
}

const PAGE_SIZE = 24;

function formatAngle(angle: string | null): string {
  if (!angle) return "Guide";
  return angle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function htmlToPlainText(html: string): string {
  return html
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

export default function RecurringStreamPage() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [seededCount, setSeededCount] = useState(0);
  const [niche, setNiche] = useState("All");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [appliedLink, setAppliedLink] = useState("");
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [articleHtml, setArticleHtml] = useState<Record<number, string>>({});
  const [loadingArticle, setLoadingArticle] = useState<number | null>(null);
  const [copiedMode, setCopiedMode] = useState<"text" | "html" | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");

  const loadArticles = useCallback(
    async (isInitial = false) => {
      if (isInitial) setInitialLoading(true);
      else setRefreshing(true);
      setError("");
      try {
        const q = niche === "All" ? "" : `?niche=${encodeURIComponent(niche)}`;
        const res = await fetch(`/api/premium/recurring-stream/articles${q}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setArticles(data.articles ?? []);
        setSeededCount(data.seededCount ?? 0);
        setPage(0);
        setPreviewId(null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [niche]
  );

  useEffect(() => {
    void loadArticles(true);
  }, [loadArticles]);

  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const paged = useMemo(
    () => articles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [articles, page]
  );

  const previewArticle = previewId != null ? articles.find((a) => a.id === previewId) : null;

  const applyAffiliateLink = () => {
    const next = affiliateLink.trim();
    if (next !== appliedLink) {
      setAppliedLink(next);
      setArticleHtml({});
      setPreviewId(null);
    }
  };

  const openPreview = async (articleId: number) => {
    if (previewId === articleId && articleHtml[articleId]) {
      setPreviewId(null);
      return;
    }
    if (!appliedLink) {
      setError("Enter your affiliate link and click Apply link before previewing.");
      return;
    }
    if (articleHtml[articleId]) {
      setPreviewId(articleId);
      setError("");
      return;
    }
    setLoadingArticle(articleId);
    setError("");
    try {
      const res = await fetch("/api/premium/recurring-stream/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, affiliateUrl: appliedLink }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load article");
      setArticleHtml((prev) => ({ ...prev, [articleId]: data.html }));
      setPreviewId(articleId);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load article");
    } finally {
      setLoadingArticle(null);
    }
  };

  const copyArticle = async (mode: "text" | "html") => {
    if (previewId == null) return;
    const html = articleHtml[previewId];
    const article = articles.find((a) => a.id === previewId);
    if (!html || !article) return;

    const exportHtml = wrapArticleWithTitle(article.title, html);
    const payload =
      mode === "html"
        ? exportHtml
        : `${article.title}\n\n${htmlToPlainText(exportHtml)}`;

    await navigator.clipboard.writeText(payload);
    setCopiedMode(mode);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  if (initialLoading && articles.length === 0) {
    return <PageLoading message="Loading Recurring Stream articles..." />;
  }

  return (
    <PremiumPageLayout
      title="Recurring Stream"
      subtitle={`${seededCount} of 100 long-form authority articles (1,000+ words each) — stored once, personalized with your link when you copy.`}
      footer={
        <PremiumFooter>
          Powered by {brand.productName}. Recurring Stream articles are seeded once — members always copy stored templates with their link.
        </PremiumFooter>
      }
    >
      <PremiumControlCard
        icon={Repeat}
        title="100 Authority Articles"
        description="SEO-ready articles with intro, sections, FAQs, and CTAs — publish on Medium, LinkedIn, or your blog."
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="block flex-1">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-text-primary">
              <LinkIcon size={14} className="text-accent" />
              Your affiliate link
            </span>
            <input
              type="url"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyAffiliateLink()}
              placeholder="https://..."
              className="input-base w-full"
            />
          </label>
          <button
            type="button"
            onClick={applyAffiliateLink}
            disabled={!affiliateLink.trim()}
            className="btn-primary shrink-0 px-5 py-2.5 text-sm disabled:opacity-40"
          >
            Apply link
          </button>
        </div>
        {appliedLink && (
          <p className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
            <Sparkles size={14} className="shrink-0 text-emerald-600" />
            Link applied — previews and copies will include your URL.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Filter size={14} className="text-text-muted" />
          {["All", ...RECURRING_STREAM_NICHES].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setNiche(n)}
              className={clsx("select-chip-pill", niche === n && "is-selected")}
            >
              {n}
            </button>
          ))}
        </div>

        {error && <PremiumErrorAlert message={error} />}
      </PremiumControlCard>

      <GenerationProgress
        active={loadingArticle !== null}
        label="Personalizing article with your affiliate link..."
      />

      <AnimatePresence>
        {previewArticle && articleHtml[previewArticle.id] && (
          <motion.section
            id={GENERATION_RESULTS_ID}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card overflow-hidden border-accent/20 scroll-mt-24"
          >
            <div className="flex items-start justify-between gap-3 border-b border-divider p-4 md:p-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {previewArticle.niche}
                </p>
                <span className="mt-2 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-text-muted">
                  {formatAngle(previewArticle.angle)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewId(null)}
                className="rounded-lg p-2 text-text-muted hover:bg-slate-100 hover:text-text-primary"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
            </div>
            <div
              className="recurring-article-body max-h-[min(70vh,720px)] max-w-none overflow-y-auto bg-white px-5 py-6 md:px-8 md:py-8"
              dangerouslySetInnerHTML={{
                __html: wrapArticleWithTitle(previewArticle.title, articleHtml[previewArticle.id]),
              }}
            />
            <div className="flex flex-wrap gap-2 border-t border-divider p-4 md:p-5">
              <button
                type="button"
                onClick={() => void copyArticle("text")}
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                {copiedMode === "text" ? <Check size={14} /> : <Copy size={14} />}
                {copiedMode === "text" ? "Copied!" : "Copy article (plain text)"}
              </button>
              <button
                type="button"
                onClick={() => void copyArticle("html")}
                className="inline-flex items-center gap-2 rounded-lg border border-border-dim bg-slate-100 px-4 py-2 text-sm font-semibold text-text-primary hover:bg-slate-200/70"
              >
                {copiedMode === "html" ? <Check size={14} /> : <Copy size={14} />}
                {copiedMode === "html" ? "Copied!" : "Copy article (HTML)"}
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div className={clsx("space-y-4", refreshing && "opacity-60 pointer-events-none")}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-text-secondary">
            {articles.length} article{articles.length !== 1 ? "s" : ""}
            {niche !== "All" ? ` in ${niche}` : ""}
          </p>
          {refreshing && (
            <span className="inline-flex items-center gap-2 text-xs text-text-muted">
              <Loader2 size={12} className="animate-spin" />
              Updating…
            </span>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((article) => (
            <article
              key={article.id}
              className={clsx(
                "glass-card flex flex-col gap-3 p-4 transition-colors hover:border-accent/20",
                previewId === article.id && "border-accent/30"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                    {article.niche}
                  </p>
                  <span className="shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[10px] text-text-muted">
                    {formatAngle(article.angle)}
                  </span>
                </div>
                <h3 className="mt-1 line-clamp-2 font-bold text-text-primary">{article.title}</h3>
                {article.excerpt && (
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-secondary">
                    {article.excerpt}
                  </p>
                )}
              </div>
              <button
                type="button"
                disabled={loadingArticle === article.id}
                onClick={() => void openPreview(article.id)}
                className="btn-primary mt-auto inline-flex items-center justify-center gap-2 text-sm disabled:opacity-40"
              >
                {loadingArticle === article.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <FileText size={14} />
                )}
                {previewId === article.id ? "Close preview" : "Preview & copy"}
              </button>
            </article>
          ))}
        </div>

        {articles.length === 0 && !initialLoading && (
          <p className="text-center text-sm text-text-muted">No articles in this niche yet.</p>
        )}

        {pageCount > 1 && (
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-border-dim px-3 py-1.5 text-sm text-text-secondary disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Prev
            </button>
            <span className="text-xs text-text-muted">
              Page {page + 1} of {pageCount}
            </span>
            <button
              type="button"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
              className="inline-flex items-center gap-1 rounded-lg border border-border-dim px-3 py-1.5 text-sm text-text-secondary disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

    </PremiumPageLayout>
  );
}
