export const trainingRoutes = {
  videos: "/training",
  faq: "/training/faq",
} as const;

export const trainingContent = {
  pageTitle: "Training",
  pageSubtitle: "Video tutorials and frequently asked questions",
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
    {
      id: "",
      title: "Video 3 title",
      description: "Add Vimeo ID and copy in training.config.ts (optional)",
    },
  ],
} as const;
