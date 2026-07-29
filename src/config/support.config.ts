export const supportRoutes = {
  contact: "/support",
  faq: "/support/faq",
} as const;

export const support = {
  email: "support@example.com",
  /** mailto: or https:// helpdesk / ticketing URL */
  contactUrl: "mailto:support@example.com",
  helpCenterUrl: "",
  headline: "Need Help?",
  pageTitle: "Support",
  pageSubtitle: "Our support team is here for you 24/7",
  subcopy: "Our support team is here for you 24/7",
  ctaLabel: "Contact Support",
  floatingWidget: {
    label: "Get Support",
    panelTitle: "We're here to help",
    panelSubtitle: "Send us a message — we typically reply within 2 hours",
    ariaLabel: "Open support panel",
  },
  stats: [
    { icon: "clock", label: "Avg response", highlight: "under 2 hours", highlightClass: "text-success" },
    { icon: "star", label: "4.9/5 support rating" },
    { icon: "shield", label: "98% satisfaction rate" },
  ],
  refundPolicy: {
    title: "Refund Policy",
    subtitle: "Satisfaction guarantee terms",
    items: [
      {
        title: "30-Day Guarantee",
        body: "Full refund available within 30 days of purchase. No questions asked.",
      },
      {
        title: "Request Procedure",
        body: "Email our support team with your account email and purchase date. We will confirm receipt and begin processing.",
      },
      {
        title: "Processing Timeline",
        body: "Refunds are typically processed within 5–7 business days. You will receive confirmation once complete.",
      },
    ],
  },
} as const;
