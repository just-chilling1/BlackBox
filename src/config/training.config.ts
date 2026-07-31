export const trainingRoutes = {
  videos: "/training",
  faq: "/training/faq",
} as const;

export const trainingContent = {
  pageTitle: "Training",
  pageSubtitle:
    "Click-by-click walkthroughs for every core tool — watch in order after the Dashboard intro videos.",
  /** Used by global-top banner, sidebar promos, and modal-training */
  externalTrainingUrl: "https://example.com/training",
  /** Academy platform tutorials — videos 4–6 in the product roster */
  videos: [
    {
      slug: "sales-offer-generator",
      id: "",
      title: "Sales Offer Generator",
      description:
        "Launch a live questionnaire site with your affiliate link on the final page — four wizard steps from paste to publish.",
      duration: "5+ min",
    },
    {
      slug: "x-power-promotions",
      id: "",
      title: "X-Power Promotions",
      description:
        "Turn any live offer into a ten-post X story thread ready to copy and publish — your top-of-funnel traffic engine.",
      duration: "5+ min",
    },
    {
      slug: "links-offers-library",
      id: "",
      title: "Links & Offers Library",
      description:
        "Save affiliate URLs once, manage every launched offer from one hub — no more hunting through old browser tabs.",
      duration: "5+ min",
    },
  ],
} as const;
