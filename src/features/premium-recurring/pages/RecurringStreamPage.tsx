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
import { PageHeader } from "@/components/ui/page-header";
import { PageLoading } from "@/components/ui/page-loading";
import { RECURRING_STREAM_NICHES } from "@/features/premium-recurring/lib/catalog";

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
  const [ready, setReady] = useState(false);
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
        setReady(Boolean(data.ready));
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

    const payload =
      mode === "html"
        ? html
        : `${article.title}\n\n${htmlToPlainText(html)}`;

    await navigator.clipboard.writeText(payload);
    setCopiedMode(mode);
    setTimeout(() => setCopiedMode(null), 2000);
  };

  if (initialLoading && articles.length === 0) {
    return <PageLoading message="Loading Recurring Stream articles..." />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-stack max-w-6xl"
    >
      <PageHeader
        eyebrow="Premium"
        title="Recurring Stream"
        subtitle={`${seededCount} of 100 ready-to-publish authority articles — stored once, personalized with your link when you copy.`}
      />

      <section className="glass-card overflow-hidden p-0">
        <div className="border-b border-divider bg-accent/5 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent">
                <Repeat size={24} />
              </div>
              <div>
                <p className="font-bold text-text-primary">100 Authority Articles</p>
                <p className="text-sm text-text-secondary">
                  Publish on Medium, LinkedIn, or your blog — nothing regenerates on access.
                </p>
              </div>
            </div>
            {ready ? (
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                All {seededCount} ready
              </span>
            ) : (
              <span className="badge-warning">
                Seeding ({seededCount}/100)
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4 p-6 md:p-8">
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
            <p className="flex items-center gap-2 text-xs text-emerald-200/90">
              <Sparkles size={12} />
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
                className={clsx(
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                  niche === n
                    ? "bg-accent text-black"
                    : "bg-slate-100 text-text-secondary hover:bg-slate-200/70"
                )}
              >
                {n}
              </button>
            ))}
          </div>

          {error && (
            <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          )}
        </div>
      </section>

      <AnimatePresence>
        {previewArticle && articleHtml[previewArticle.id] && (
          <motion.section
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-card overflow-hidden border-accent/20"
          >
            <div className="flex items-start justify-between gap-3 border-b border-divider p-4 md:p-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  {previewArticle.niche}
                </p>
                <h3 className="mt-1 font-bold text-text-primary">{previewArticle.title}</h3>
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
              className="prose prose-invert max-h-[420px] max-w-none overflow-y-auto p-4 md:p-6 text-sm text-text-secondary"
              dangerouslySetInnerHTML={{ __html: articleHtml[previewArticle.id] }}
            />
            <div className="flex flex-wrap gap-2 border-t border-divider p-4 md:p-5">
              <button
                type="button"
                onClick={() => void copyArticle("text")}
                className="btn-primary inline-flex items-center gap-2 text-sm"
              >
                {copiedMode === "text" ? <Check size={14} /> : <Copy size={14} />}
                {copiedMode === "text" ? "Copied!" : "Copy plain text"}
              </button>
              <button
                type="button"
                onClick={() => void copyArticle("html")}
                className="inline-flex items-center gap-2 rounded-lg border border-border-dim bg-slate-100 px-4 py-2 text-sm font-semibold text-text-primary hover:bg-slate-200/70"
              >
                {copiedMode === "html" ? <Check size={14} /> : <Copy size={14} />}
                {copiedMode === "html" ? "Copied!" : "Copy HTML"}
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

      <p className="text-xs text-text-muted">
        Powered by {brand.productName}. Recurring Stream articles are seeded once — members always copy stored templates with their link.
      </p>
    </motion.div>
  );
}
