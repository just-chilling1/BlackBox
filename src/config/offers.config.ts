import { trainingContent } from "./training.config";

/** Replace with real partner/affiliate URLs before launch */
export const PARTNER_LINK_PLACEHOLDER = "https://example.com/partner-offer";

export const offers = {
  /** Sidebar / bottom-nav exclusive offer slots */
  exclusiveOffer1: "https://getrobinhod.com/fe-e?affid=digitalavalon",
  exclusiveOffer2: "https://thedigitalavalon.a.explodely.com/?fid=G7BYO9W&aff=digitalavalon",
  exclusiveOffer3: "https://thedigitalavalon.a.explodely.com/?fid=5SRWJGZ&aff=digitalavalon",
  /** Withdraw / account-verified ad under video overlays */
  videoWithdrawUrl: "https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea",
} as const;

export interface ExclusiveOffer {
  title: string;
  href: string;
  subtitle?: string;
}

/** Set true to show partner links in sidebar and mobile More sheet. */
export const exclusiveOffersEnabled = true;

/** Single source of truth for sidebar + mobile exclusive offers. */
export function getExclusiveOffers(externalTrainingUrl?: string): ExclusiveOffer[] {
  if (!exclusiveOffersEnabled) return [];
  const trainingUrl =
    externalTrainingUrl?.trim() ||
    trainingContent.externalTrainingUrl?.trim() ||
    offers.exclusiveOffer3;
  return [
    {
      title: "Earn $400/Day Testing New Apps",
      href: offers.exclusiveOffer1,
      subtitle: "Claim Now",
    },
    {
      title: "Get Paid To Copy & Paste",
      href: offers.exclusiveOffer2,
      subtitle: "Claim Now",
    },
    {
      title: "Fast Cash Training",
      href: trainingUrl,
      subtitle: "Claim Now",
    },
  ];
}
