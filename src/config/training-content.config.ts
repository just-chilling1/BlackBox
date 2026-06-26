/**
 * SKELETON ONLY — structure without product content.
 *
 * The Training page always renders every section (videos, premium, steps, tips,
 * checklist, FAQ). Replace all exports below before launch — see DEVELOPER-SETUP.md §7.
 */

export const trainingWorkflowSteps = [
  {
    step: 1,
    title: "Step 1 title",
    page: "/search",
    description: "Step 1 description — populate in training-content.config.ts",
    tips: ["Tip — populate in training-content.config.ts"],
    examples: [] as string[],
  },
  {
    step: 2,
    title: "Step 2 title",
    page: "/analysis",
    description: "Step 2 description — populate in training-content.config.ts",
    tips: ["Tip — populate in training-content.config.ts"],
    examples: [] as string[],
  },
  {
    step: 3,
    title: "Step 3 title",
    page: "/radar",
    description: "Step 3 description — populate in training-content.config.ts",
    tips: ["Tip — populate in training-content.config.ts"],
    examples: [] as string[],
  },
  {
    step: 4,
    title: "Step 4 title",
    page: "/replies",
    description: "Step 4 description — populate in training-content.config.ts",
    tips: ["Tip — populate in training-content.config.ts"],
    examples: [] as string[],
  },
] as const;

export const trainingFaqSections = [
  {
    title: "FAQ section",
    items: [
      {
        q: "Sample question?",
        a: "Sample answer — replace with product FAQ in training-content.config.ts (DEVELOPER-SETUP.md §7).",
      },
    ],
  },
] as const;

export const trainingProTips = [
  { title: "Pro tip title", text: "Pro tip body — populate in training-content.config.ts" },
  { title: "Pro tip title", text: "Pro tip body — populate in training-content.config.ts" },
  { title: "Pro tip title", text: "Pro tip body — populate in training-content.config.ts" },
] as const;

export const trainingQuickStartChecklist = [
  "Checklist item — populate in training-content.config.ts",
  "Checklist item — populate in training-content.config.ts",
  "Checklist item — populate in training-content.config.ts",
] as const;

/** Premium walkthrough slots — add Vimeo id when client provides video */
export const trainingPremiumVideos = [
  {
    id: "",
    badge: "Premium feature 1",
    title: "Premium video title",
    description: "Description — populate in training-content.config.ts",
  },
  {
    id: "",
    badge: "Premium feature 2",
    title: "Premium video title",
    description: "Description — populate in training-content.config.ts",
  },
  {
    id: "",
    badge: "Premium feature 3",
    title: "Premium video title",
    description: "Description — populate in training-content.config.ts",
  },
] as const;

/** Set to true after DEVELOPER-SETUP.md §7 — hides skeleton banner on Training page */
export const trainingContentReady = false;

export const trainingCta = {
  headline: "CTA headline — populate in training-content.config.ts",
  subcopy: "CTA subcopy — populate before launch.",
  buttonLabel: "CTA button",
  href: "/dashboard",
} as const;

/** Shown when trainingContentReady is false */
export const trainingPageSkeletonNote =
  `Skeleton layout only — populate training.config.ts and training-content.config.ts before launch (DEVELOPER-SETUP.md §7).`;
