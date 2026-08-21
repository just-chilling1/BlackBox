"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import {
  Globe,
  Linkedin,
  BookOpen,
  HelpCircle,
  Rss,
  MousePointerClick,
} from "lucide-react";

const PLATFORMS = [
  {
    icon: Rss,
    name: "Your blog / site",
    steps: [
      "Copy the HTML version and paste into WordPress, Ghost, or your site editor.",
      "Keep CTAs pointing at your NullPing money page URL (?src=article).",
      "Add internal links to your money page where relevant.",
      "Publish on a schedule — one article per week builds long-term traffic.",
    ],
  },
  {
    icon: BookOpen,
    name: "Medium",
    steps: [
      "Copy the plain-text version and paste into a new Medium story.",
      "Add 3–5 relevant tags for your niche at the bottom.",
      "Keep your money page tracking link in the closing CTA.",
      "Submit to a niche publication for extra reach, or publish on your profile.",
    ],
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    steps: [
      "Use plain text for a LinkedIn article, or paste HTML into your blog CMS and link from a short LinkedIn post.",
      "Lead with the problem your audience cares about.",
      "End with a clear CTA to your money page tracking URL.",
      "Comment on related posts with a soft mention of your guide.",
    ],
  },
  {
    icon: HelpCircle,
    name: "Quora / Q&A",
    steps: [
      "Answer a high-intent question with a short summary from the article.",
      "Link once to your money page (tracking URL) — don’t spam.",
      "Use the article’s strongest section as your answer body.",
      "Update older answers when you refresh the money page.",
    ],
  },
  {
    icon: Globe,
    name: "Guest / niche sites",
    steps: [
      "Pitch the article angle to niche blogs that accept guest posts.",
      "Offer the HTML version with your money page as the resource link.",
      "Follow each site’s link and disclosure rules.",
      "Track visits in Results after the post goes live.",
    ],
  },
  {
    icon: MousePointerClick,
    name: "Primary: money page",
    steps: [
      "Prefer “Add to money page” so visitors see the authority section on /m/{slug}.",
      "Edit the live page after attaching to tweak tone.",
      "Drive Pinterest traffic to that same money page.",
      "Check Results for visits with ?src=article.",
    ],
  },
];

export function CrossPlatformGuide() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-[var(--np-line)] bg-[var(--np-surface)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-medium text-text-primary">Where to publish (optional)</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Secondary to adding a section on your money page — always use the tracking URL.
          </p>
        </div>
        <span className="text-xs font-medium text-pulse-700">{open ? "Hide" : "Show"}</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-[var(--np-line)]"
          >
            <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {PLATFORMS.map((platform) => (
                <div
                  key={platform.name}
                  className={clsx(
                    "rounded-xl border border-[var(--np-line)] bg-[var(--np-surface-field)] p-4"
                  )}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <platform.icon size={16} className="text-pulse-700" />
                    <p className="text-sm font-medium text-text-primary">{platform.name}</p>
                  </div>
                  <ol className="list-decimal space-y-1 pl-4 text-xs text-text-secondary">
                    {platform.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
