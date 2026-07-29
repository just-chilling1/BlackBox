"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Linkedin,
  BookOpen,
  MessageSquare,
  Rss,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PLATFORMS = [
  {
    icon: BookOpen,
    name: "Medium",
    steps: [
      "Copy the plain-text version and paste into a new Medium story.",
      "Add 3–5 relevant tags for your niche at the bottom.",
      "Keep your affiliate link in the closing CTA — Medium allows external links in articles.",
      "Submit to a niche publication for extra reach, or publish on your profile.",
    ],
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    steps: [
      "Use plain text for a LinkedIn article, or paste HTML into your blog CMS and link from a short LinkedIn post.",
      "Lead with a personal hook in the first two lines — they show before “see more.”",
      "End with a clear CTA and your affiliate link.",
      "Post a shorter teaser on your feed linking to the full article.",
    ],
  },
  {
    icon: Rss,
    name: "Your blog / site",
    steps: [
      "Copy the HTML version and paste into WordPress, Ghost, or your site editor.",
      "Set the meta description from the article excerpt for SEO.",
      "Add internal links to your sales page where relevant.",
      "Publish on a schedule — one article per week builds long-term traffic.",
    ],
  },
  {
    icon: MessageSquare,
    name: "Facebook & groups",
    steps: [
      "Post a 2–3 sentence teaser with the most compelling insight from the article.",
      "Put your affiliate link in the first comment (many groups prefer links in comments).",
      "Share in niche groups where long-form guides are welcome — read group rules first.",
      "Rotate angles: tips post one week, mistake-avoidance the next.",
    ],
  },
  {
    icon: Globe,
    name: "Cross-posting workflow",
    steps: [
      "Publish the full article on one platform first (Medium or your blog).",
      "Adapt the intro for LinkedIn and Facebook — don’t paste identical copy everywhere.",
      "Track which platform drives clicks and double down on what works.",
      "Saved articles stay tied to this offer in your Offers Library for easy reuse.",
    ],
  },
] as const;

export function CrossPlatformGuide() {
  const [open, setOpen] = useState(false);

  return (
    <section className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-4 p-5 text-left transition-colors hover:bg-slate-50/80 md:p-6"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-accent">
            How to use across platforms
          </p>
          <p className="mt-1 text-sm text-text-secondary">
            Each article is ready to copy. Pick a platform and follow the steps — your offer link is
            already woven in when you preview and save.
          </p>
        </div>
        <span className="mt-0.5 shrink-0 text-text-muted" aria-hidden>
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="grid gap-3 border-t border-divider px-5 pb-5 pt-4 sm:grid-cols-2 md:px-6 md:pb-6">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.name}
                  className="rounded-xl border border-border-dim/70 bg-page/60 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <platform.icon size={16} className="shrink-0 text-accent" aria-hidden />
                    <h3 className="text-sm font-bold text-text-primary">{platform.name}</h3>
                  </div>
                  <ol className="list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-text-secondary">
                    {platform.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
