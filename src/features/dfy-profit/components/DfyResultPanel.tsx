"use client";

import { useCallback, useState } from "react";
import {
  Check,
  ClipboardCopy,
  Copy,
  ExternalLink,
  FileText,
  Globe,
  ImageIcon,
  Loader2,
  Megaphone,
  RefreshCw,
} from "lucide-react";
import { clsx } from "clsx";
import { GENERATION_RESULTS_ID } from "@/components/ui/generation-progress";
import { ThreadCard } from "@/features/publish-kit/components/ThreadCard";
import { ThreadListSection } from "@/features/publish-kit/components/ThreadListSection";

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

  const copyText = useCallback(async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  if (!sales && !article && posts.length === 0 && thread.length === 0 && !articleError && !postsError && !threadError) {
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

      <ThreadListSection title="X story thread" count={thread.length || undefined} defaultOpen={thread.length > 0}>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-100 text-lg font-semibold text-brass-700">
            X
          </span>
          <div className="min-w-0">
            <p className="text-sm text-text-secondary">
              {thread.length > 0
                ? `${thread.length}-post story thread ready to publish`
                : threadError || "Your X story thread will appear here."}
            </p>
          </div>
        </div>
        {isGeneratingThread && thread.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={14} className="animate-spin" />
            Generating X story thread…
          </p>
        ) : threadError && thread.length === 0 ? (
          <button type="button" disabled={retryingThread} onClick={onRetryThread} className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50">
            {retryingThread ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry X thread
          </button>
        ) : thread.length > 0 ? (
          <div className="space-y-3">
            <button type="button" onClick={() => void copyText("x-thread", thread.map((post) => post.text).join("\n\n"))} className="btn-secondary inline-flex items-center gap-2 text-sm">
              {copiedId === "x-thread" ? <Check size={14} /> : <ClipboardCopy size={14} />}
              {copiedId === "x-thread" ? "Copied" : "Copy all posts"}
            </button>
            <div className="space-y-2">
              {thread.map((post, index) => (
                <ThreadCard key={post.id} index={index + 1} label={`Post ${index + 1} · ${post.angle || "Post"}`} text={post.text} imageUrl={post.imageUrl} defaultOpen={index === 0} />
              ))}
            </div>
          </div>
        ) : null}
      </ThreadListSection>

      <ThreadListSection title="Authority article" count={article ? 1 : undefined} defaultOpen={Boolean(article)}>
        <div className="flex items-start gap-3">
          <FileText size={18} className="mt-0.5 shrink-0 text-brass-700" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text-primary">{article?.title || "Authority article"}</p>
            <p className="mt-1 text-sm text-text-secondary">
              {article ? "Copy it to your blog, Medium, or LinkedIn." : articleError || "Your copy-ready article will appear here."}
            </p>
          </div>
        </div>
        {isGeneratingArticle ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted"><Loader2 size={14} className="animate-spin" />Generating your authority article…</p>
        ) : articleError ? (
          <button type="button" disabled={retryingArticle} onClick={onRetryArticle} className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50">
            {retryingArticle ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry article
          </button>
        ) : article ? (
          <details open className="group overflow-hidden rounded-xl border border-border-dim bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-3 p-3 [&::-webkit-details-marker]:hidden">
              <FileText size={14} className="shrink-0 text-brass-700" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-text-primary">{article.title}</span>
              <button type="button" onClick={(event) => { event.preventDefault(); void copyText("article-html", article.html); }} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-brass-100 px-2.5 py-1 text-[13px] font-medium text-text-secondary hover:bg-brass-100/70">
                {copiedId === "article-html" ? <Check size={12} /> : <Copy size={12} />}
                {copiedId === "article-html" ? "Copied" : "Copy HTML"}
              </button>
            </summary>
            <div className="recurring-article-body max-h-[560px] overflow-y-auto border-t border-divider bg-white px-5 py-6 text-text-primary" dangerouslySetInnerHTML={{ __html: article.html }} />
            <div className="flex flex-wrap gap-2 border-t border-divider p-3">
              <button type="button" onClick={() => void copyText("article-text", article.html.replace(/<\/p>/gi, "\n\n").replace(/<\/li>/gi, "\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim())} className="btn-secondary inline-flex items-center gap-2 text-sm">
                {copiedId === "article-text" ? <Check size={14} /> : <Copy size={14} />}
                {copiedId === "article-text" ? "Copied" : "Copy text"}
              </button>
            </div>
          </details>
        ) : null}
      </ThreadListSection>

      <ThreadListSection title="Facebook posts" count={posts.length || undefined} defaultOpen={posts.length > 0}>
        <div className="flex items-start gap-3">
          <Megaphone size={18} className="mt-0.5 shrink-0 text-brass-700" />
          <p className="text-sm text-text-secondary">
            {posts.length > 0 ? `${posts.length} ready-to-copy variants` : postsError || "Your Facebook post variants will appear here."}
          </p>
        </div>
        {isGeneratingPosts && posts.length === 0 ? (
          <p className="inline-flex items-center gap-2 text-sm text-text-muted"><Loader2 size={14} className="animate-spin" />Generating 3 Facebook posts…</p>
        ) : postsError && posts.length === 0 ? (
          <button type="button" disabled={retryingPosts} onClick={onRetryPosts} className="btn-secondary inline-flex items-center gap-2 text-sm disabled:opacity-50">
            {retryingPosts ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Retry Facebook posts
          </button>
        ) : posts.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-3">
            {posts.map((post, index) => {
              const copied = copiedId === post.id;
              return (
                <article key={post.id} className="glass-card flex flex-col gap-3 p-4 transition-colors hover:border-[var(--bb-line-brass)]">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-medium uppercase tracking-wider text-brass-700">Variant {index + 1}</p>
                    <button type="button" onClick={() => void copyText(post.id, post.body)} className={clsx("inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors", copied ? "bg-brass-200 text-brass-700" : "bg-brass-100 text-text-secondary hover:bg-brass-100/70")}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-secondary">{post.body}</p>
                  {post.imageUrl ? <img src={post.imageUrl} alt={`Facebook post ${index + 1} visual`} className="mt-auto aspect-square w-full rounded-xl object-cover" /> : null}
                  {post.imageUrl ? <span className="inline-flex items-center gap-1 text-xs text-text-muted"><ImageIcon size={12} />Visual included</span> : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </ThreadListSection>
    </section>
  );
}
