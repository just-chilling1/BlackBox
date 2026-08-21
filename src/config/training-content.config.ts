/**
 * NullPing Cash Academy content — platform tutorials, premium walkthroughs, and launch helpers.
 * Add Vimeo IDs in training.config.ts (platform) and below (premium) when videos are uploaded.
 */

import { brand } from "./brand.config";
import { faqSections } from "./faq.config";

const productName = brand.productName;

export const trainingWorkflowSteps = [
  {
    step: 1,
    title: "Activate Asset",
    page: "/activate",
    description:
      "Paste a product URL or enter a product name. NullPing scrapes the offer and builds your money page.",
    tips: ["Add your affiliate link at activate time so CTAs are ready when you publish."],
    examples: [] as string[],
  },
  {
    step: 2,
    title: "Publish Money Page",
    page: "/activate",
    description:
      "Preview the page, choose a theme, tweak copy if needed, then publish your live shareable link.",
    tips: ["Publish before generating pins — traffic should land on a live money page."],
    examples: [] as string[],
  },
  {
    step: 3,
    title: "Traffic & Results",
    page: "/results",
    description:
      "Generate Pinterest pins aimed at your money page, post them, then check Results for real visits and clicks.",
    tips: ["Results only update after real traffic — give pins time to get impressions."],
    examples: [] as string[],
  },
] as const;

export const trainingFaqSections = faqSections;

export const trainingProTips = [
  {
    title: "Publish before you polish",
    text: "Your first money page does not need perfect copy. Activate, publish, and send traffic — refine themes and wording after you see Results.",
  },
  {
    title: "Pins need a live destination",
    text: "Always publish the money page first, then generate Pinterest pins so every pin points at a working URL.",
  },
  {
    title: "Use your affiliate link",
    text: "Add your affiliate URL on activate or in the money page editor so CTA buttons can credit you when someone buys.",
  },
] as const;

export const trainingQuickStartChecklist = [
  "Watch the three Start Here videos on your Dashboard",
  "Activate your first asset and publish the money page",
  "Generate Pinterest pins and post them to drive traffic",
  "Open Results to confirm real visits and affiliate clicks",
] as const;

/** Premium walkthrough slots — titles match NullPing Cash premium nav labels */
export const trainingPremiumVideos = [
  {
    id: "1215530104",
    badge: "Asset Vault",
    title: "Asset Vault",
    description:
      "Install from two hundred ready-made money pages — swap in your affiliate link, then generate Pinterest pins.",
    duration: "5+ min",
  },
  {
    id: "1215568587",
    badge: "Authority Boosters",
    title: "Authority Boosters",
    description:
      "Use ready-to-publish authority articles with your affiliate link woven in for blogs, Medium, LinkedIn, and more.",
    duration: "5+ min",
  },
  {
    id: "1215574185",
    badge: "Pin Multiplier",
    title: "Pin Multiplier",
    description:
      "Bulk-generate social post variants from one offer — different hooks and angles, ready to copy and share.",
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
  headline: `Ready to activate your first ${productName} asset?`,
  subcopy:
    "The Academy covers every step — Activate Asset is where you put it into action. Paste a product URL and let NullPing build your money page tonight.",
  buttonLabel: "Activate your first asset",
  href: "/activate",
} as const;
