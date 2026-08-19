/**
 * NullPing Cash Academy content — platform tutorials, premium walkthroughs, and launch helpers.
 * Add Vimeo IDs in training.config.ts (platform) and below (premium) when videos are uploaded.
 */

import { faqSections } from "./faq.config";

export const trainingWorkflowSteps = [
  {
    step: 1,
    title: "Sales Offer Generator",
    page: "/sales-offer-generator",
    description: "Paste your affiliate link, pick a niche and template, then launch your questionnaire site.",
    tips: ["Save links to Links Library on Step 1 so you never re-paste the same URL."],
    examples: [] as string[],
  },
  {
    step: 2,
    title: "X-Power Promotions",
    page: "/promote",
    description: "Select a live offer and generate a ten-post X story thread that drives traffic to your quiz.",
    tips: ["You need at least one live offer before threads can attach."],
    examples: [] as string[],
  },
  {
    step: 3,
    title: "Links & Offers Library",
    page: "/offers",
    description: "Reuse saved URLs and open any live offer to promote, thread, or scale with premium tools.",
    tips: ["Start every promotion session from Offers Library — not old browser tabs."],
    examples: [] as string[],
  },
] as const;

export const trainingFaqSections = faqSections;

export const trainingProTips = [
  {
    title: "Launch before you optimize",
    text: "Your first offer does not need a perfect template — pick the cleanest mobile layout and publish tonight.",
  },
  {
    title: "One hub for promotion",
    text: "After launch, always open Offers Library to view your site, generate threads, or attach premium tools.",
  },
  {
    title: "Name your links clearly",
    text: 'In Links Library use labels like "Keto supplement — Digistore" instead of "link2" so scaling stays organized.',
  },
] as const;

export const trainingQuickStartChecklist = [
  "Watch the three Start Here videos on your Dashboard",
  "Complete Sales Offer Generator and publish one live offer",
  "Generate an X story thread from X-Power Promotions",
  "Save your best affiliate URLs in Links Library for reuse",
] as const;

/** Premium walkthrough slots — add Vimeo id when client provides video */
export const trainingPremiumVideos = [
  {
    id: "1215530104",
    badge: "Unlimited",
    title: "Unlimited",
    description:
      "Clone from two hundred pre-made sales pages and ten-post X threads — swap in your affiliate link in minutes.",
    duration: "5+ min",
  },
  {
    id: "1215568587",
    badge: "Guaranteed High-Ticket Payouts",
    title: "Guaranteed High-Ticket Payouts",
    description:
      "Attach long-form authority articles to any offer, preview with your link baked in, and publish for recurring traffic.",
    duration: "5+ min",
  },
  {
    id: "1215574185",
    badge: "Instant Income",
    title: "Instant Income",
    description:
      "Generate ten-plus Facebook post variants from one offer — different hooks and angles, ready to copy and paste.",
    duration: "5+ min",
  },
  {
    id: "1215579801",
    badge: "Cyber Protection",
    title: "Cyber Protection",
    description:
      "Account security dashboard — verification status, encryption checks, and activity log for peace of mind.",
    duration: "2+ min",
  },
] as const;

export const trainingContentReady = true;

export const trainingCta = {
  headline: "Ready to launch your first offer?",
  subcopy:
    "The Academy gives you the click-by-click detail — the Sales Offer Generator is where you put it into action. Paste a link and publish tonight.",
  buttonLabel: "Get Started with Sales Offer Generator",
  href: "/sales-offer-generator",
} as const;
