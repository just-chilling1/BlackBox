import { brand } from "./brand.config";

export const ONBOARDING_PRODUCT_NAME = brand.productName;

export const ONBOARDING_BETA_QUALIFICATION_CTA_URL = "https://example.com/partner-offer";

export const ONBOARDING_DASHBOARD_ROUTE = "/dashboard";

export const ONBOARDING_META_KEY = "onboarding_completed" as const;

export const onboardingContent = {
  welcome: {
    title: "Welcome aboard",
    body: "Your account is ready. Complete this quick setup, then head to your dashboard.",
    continueCta: "Go to Dashboard",
  },
  preparing: {
    title: "Setting up your workspace",
    rows: [
      {
        label: "Account verified",
        description: "Your login and secure session are active.",
      },
      {
        label: "Profile created",
        description: "Your member profile is saved and ready to use.",
      },
      {
        label: "Workspace ready",
        description: "Dashboard, training, and support are unlocked.",
      },
    ],
    tip: "Visit Training from the sidebar anytime for guides and FAQs.",
    continueCta: "Continue",
  },
  partnerOffer: {
    enabled: true,
    badge: "OPTIONAL PARTNER OFFER",
    headline: "Exclusive Partner Opportunity",
    subcopy: `This is separate from your ${ONBOARDING_PRODUCT_NAME} membership — completely optional.`,
    infoCard: "An optional partner program you can explore at your own pace.",
    payLabel: "Potential earnings",
    payAmount: "Varies",
    cta: "Learn More >",
    qualification: {
      badge: "QUICK CHECK",
      headline: "Interested in the partner offer?",
      requirements: [
        "A phone or computer",
        "Speaks English",
        "No tech skills required",
      ],
      footer: "If this isn't for you — skip and go straight to your dashboard.",
      primaryCta: "View Partner Offer >",
      noThanksCta: "No thanks, go to dashboard →",
      finePrint: `Optional partner offer, separate from ${ONBOARDING_PRODUCT_NAME}.`,
    },
  },
} as const;
