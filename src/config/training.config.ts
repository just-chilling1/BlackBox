export const trainingRoutes = {
  videos: "/training",
  faq: "/training/faq",
} as const;

export const trainingContent = {
  pageTitle: "Training",
  pageSubtitle:
    "Click-by-click walkthroughs for NullPing Cash — watch in order after the Dashboard intro videos.",
  /** Used by global-top banner, sidebar promos, and modal-training */
  externalTrainingUrl: "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea",
  /** Academy platform tutorials — core NullPing workflow */
  videos: [
    {
      id: "1215373563",
      title: "Activate Your First Asset",
      description:
        "Paste a product URL or name, optionally add your affiliate link, and let NullPing build a full money page ready to publish.",
      duration: "5+ min",
    },
    {
      id: "1215508183",
      title: "Publish Your Money Page",
      description:
        "Preview the review page, pick a color theme, edit copy if you want, then publish your live affiliate money page.",
      duration: "5+ min",
    },
    {
      id: "1215513309",
      title: "Pinterest Traffic & Results",
      description:
        "Generate Pinterest pin assets that send visitors to your money page, then track real visits and clicks in Results.",
      duration: "5+ min",
    },
  ],
} as const;
