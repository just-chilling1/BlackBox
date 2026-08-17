"use client";

import { useCallback, useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Megaphone,
  RefreshCw,
  Twitter,
} from "lucide-react";
import { clsx } from "clsx";
import { GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";

export interface DfySalesResult {
  siteId: string;
  offerUrl: string;
  templateName: string;
  templateId: string;
  productName: string;
}

export interface DfyArticleResult {
  title: string;
  excerpt: string;
  html: string;
}

export interface DfyFacebookPost {
  id: string;
  body: string;
  imageUrl?: string | null;
}

interface DfyResultPanelProps {
  sales: DfySalesResult | null;
  article: DfyArticleResult | null;
  posts: DfyFacebookPost[];
  articleError: string;
  postsError: string;
  threadError: string;
  thread: Array<{ id: string; text: string; angle: string | null; imageUrl: string | null }>;
  isGeneratingArticle: boolean;
  isGeneratingPosts: boolean;
  isGeneratingThread: boolean;
  retryingArticle: boolean;
  retryingPosts: boolean;
  retryingThread: boolean;
  onRetryArticle: () => void;
  onRetryPosts: () => void;
  onRetryThread: () => void;
}

export function DfyResultPanel({
  sales,
  article,
  posts,
  articleError,
  postsError,
  threadError,
  thread,
  isGeneratingArticle,
  isGeneratingPosts,
  isGeneratingThread,
  retryingArticle,
  retryingPosts,
  retryingThread,
  onRetryArticle,
  onRetryPosts,
  onRetryThread,
}: DfyResultPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showArticle, setShowArticle] = useState(false);

  const copyText = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  if (!sales && !article && posts.length === 0 && !articleError && !postsError) {
    return null;
  }

  return (
    <section id={GENERATION_RESULTS_ID} className="scroll-mt-24 space-y-4">
      <h2 className="text-lg font-medium text-text-primary">Your Done-For-You kit</h2>

      {sales && (
        <article className="glass-card space-y-3 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-100 text-brass-700">
              <Globe size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-text-primary">Sales page</p>
              <p className="text-xs text-text-muted">
                Template: {sales.templateName} · {sales.productName}
              </p>
              <p className="mt-2 truncate text-sm text-text-secondary">{sales.offerUrl}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={sales.offerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <ExternalLink size={14} />
              Open live page
            </a>
            <button
              type="button"
              onClick={() => void copyText("offer-url", sales.offerUrl)}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              {copiedId === "offer-url" ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === "offer-url" ? "Copied" : "Copy URL"}
            </button>
          </div>
        </article>
      )}

      <article className="glass-card space-y-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-100 text-brass-700">
            <FileText size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">Authority article</p>
            {article ? (
              <>
                <p className="text-xs text-text-muted">{article.title}</p>
                <p className="mt-2 text-sm text-text-secondary">Copy it to your blog, Medium, or LinkedIn.</p>
              </>
            ) : articleError ? (
              <p className="mt-1 text-sm text-error">{articleError}</p>
            ) : isGeneratingArticle ? (
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-text-muted">
                <Loader2 size={14} className="animate-spin" />
                Generating your authority article…
              </p>
            ) : (
              <p className="mt-1 text-sm text-text-muted">Not generated yet.</p>
            )}
          </div>
        </div>

        {article ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowArticle((open) => !open)}
              className="btn-primary inline-flex items-center gap-2 text-sm"
            >
              <FileText size={14} />
              {showArticle ? "Hide article" : "View article"}
            </button>
            <button
              type="button"
              onClick={() => void copyText("article-html", article.html)}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              {copiedId === "article-html" ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === "article-html" ? "Copied" : "Copy HTML"}
            </button>
            <button
              type="button"
              onClick={() => void copyText(
                "article-text",
                article.html
                  .replace(/<\/p>/gi, "\n\n")
                  .replace(/<\/li>/gi, "\n")
                  .replace(/<br\s*\/?>/gi, "\n")
                  .replace(/<[^>]+>/g, "")
                  .replace(/\n{3,}/g, "\n\n")
                  .trim()
              )}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              {copiedId === "article-text" ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === "article-text" ? "Copied" : "Copy text"}
            </button>
          </div>
        ) : articleError ? (
          <button
            type="button"
            disabled={retryingArticle}
            onClick={onRetryArticle}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingArticle ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Retry article
          </button>
        ) : null}
        {article && showArticle && (
          <div
            className="recurring-article-body max-h-[560px] overflow-y-auto rounded-xl border border-divider bg-white p-5 text-text-primary"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />
        )}
      </article>

      <article className="glass-card space-y-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-100 text-brass-700">
            <Megaphone size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">Facebook posts</p>
            <p className="text-xs text-text-muted">
              {posts.length > 0
                ? `${posts.length} ready-to-copy variants`
                : postsError
                  ? postsError
                  : isGeneratingPosts
                    ? "Generating 3 Facebook posts…"
                  : "Not generated yet."}
            </p>
          </div>
        </div>
        {isGeneratingPosts && posts.length === 0 && (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Generating Facebook posts…
          </p>
        )}

        {postsError && posts.length === 0 && (
          <button
            type="button"
            disabled={retryingPosts}
            onClick={onRetryPosts}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingPosts ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Retry Facebook posts
          </button>
        )}

        {posts.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
            {posts.map((post, index) => {
              const isCopied = copiedId === post.id;
              return (
                <div
                  key={post.id}
                  className="flex flex-col gap-3 rounded-xl border border-border-dim/70 bg-canvas/40 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium uppercase tracking-wider text-brass-700">
                      Post {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => void copyText(post.id, post.body)}
                      className={clsx(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
                        isCopied
                          ? "bg-brass-200 text-brass-700"
                          : "bg-brass-100 text-text-secondary hover:bg-brass-100/70"
                      )}
                    >
                      {isCopied ? <Check size={12} /> : <Copy size={12} />}
                      {isCopied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">
                    {post.body}
                  </p>
                  {post.imageUrl && (
                    <img
                      src={post.imageUrl}
                      alt={`Facebook post ${index + 1} visual`}
                      className="mt-auto aspect-square w-full rounded-lg object-cover"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </article>

      <article className="glass-card space-y-3 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-100 text-brass-700">
            <Twitter size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">X story thread</p>
            <p className="text-xs text-text-muted">
              {thread.length > 0
                ? `${thread.length}-post story thread ready to publish`
                : threadError
                  ? threadError
                  : isGeneratingThread
                    ? "Generating your X story thread…"
                    : "Not generated yet."}
            </p>
          </div>
        </div>
        {isGeneratingThread && thread.length === 0 && (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Generating X story thread…
          </p>
        )}
        {threadError && thread.length === 0 && (
          <button
            type="button"
            disabled={retryingThread}
            onClick={onRetryThread}
            className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50"
          >
            {retryingThread ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry X thread
          </button>
        )}
        {thread.length > 0 && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => void copyText("x-thread", thread.map((post) => post.text).join("\n\n"))}
              className="btn-secondary inline-flex items-center gap-2 text-sm"
            >
              {copiedId === "x-thread" ? <Check size={14} /> : <Copy size={14} />}
              {copiedId === "x-thread" ? "Copied" : "Copy full thread"}
            </button>
            {thread.map((post, index) => (
              <div key={post.id} className="rounded-xl border border-border-dim/70 bg-canvas/40 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-[13px] font-medium uppercase tracking-wider text-brass-700">
                    {index + 1}. {post.angle || "Post"}
                  </span>
                  <button
                    type="button"
                    onClick={() => void copyText(post.id, post.text)}
                    className="ml-auto text-xs font-medium text-text-secondary hover:text-brass-700"
                  >
                    {copiedId === post.id ? "Copied" : "Copy"}
                  </button>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{post.text}</p>
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={`${post.angle || "X thread"} visual`}
                    className="mt-3 aspect-square w-full max-w-sm rounded-lg object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </article>
    </section>
  );
}
