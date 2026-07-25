/** Replace with real partner/affiliate URLs before launch */
export const PARTNER_LINK_PLACEHOLDER = "https://example.com/partner-offer";

export const offers = {
  /** Sidebar / bottom-nav exclusive offer slots */
  exclusiveOffer1: PARTNER_LINK_PLACEHOLDER,
  exclusiveOffer2: PARTNER_LINK_PLACEHOLDER,
  exclusiveOffer3: PARTNER_LINK_PLACEHOLDER,
  /** Optional partner CTA used in onboarding or training */
  partnerCta: PARTNER_LINK_PLACEHOLDER,
} as const;

export interface ExclusiveOffer {
  title: string;
  href: string;
}

/** Set true to show partner links in sidebar and mobile More sheet. */
export const exclusiveOffersEnabled = false;

/** Configurable exclusive offers shown in sidebar promos and mobile "More" sheet. */
export function getExclusiveOffers(externalTrainingUrl?: string): ExclusiveOffer[] {
  if (!exclusiveOffersEnabled) return [];
  return [
    { title: "Earn $400/Day Testing New Apps", href: offers.exclusiveOffer1 },
    { title: "Get Paid To Copy & Paste", href: offers.exclusiveOffer2 },
    {
      title: "Fast Cash Training",
      href: externalTrainingUrl || offers.exclusiveOffer3,
    },
  ];
}
