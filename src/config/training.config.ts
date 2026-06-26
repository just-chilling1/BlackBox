import { brand } from "./brand.config";

export const trainingContent = {
  pageTitle: "Training",
  pageSubtitle: `Video guides, walkthroughs, and FAQ for ${brand.productName} — populate before launch`,
  /** Used by global-top banner, sidebar promos, and modal-training */
  externalTrainingUrl: "https://example.com/training",
  videos: [
    {
      id: "",
      title: "Video 1 title",
      description: "Add Vimeo ID and copy in training.config.ts",
    },
    {
      id: "",
      title: "Video 2 title",
      description: "Add Vimeo ID and copy in training.config.ts (optional)",
    },
  ],
} as const;
