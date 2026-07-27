import { brand } from "./brand.config";

export const dashboardContent = {
  /** Vimeo video ID for the dashboard intro — set in training.config videos[0] or here */
  introVideoId: "",
  introVideoTitle: "Get Started in 3 Minutes",
  introVideoSubtitle: "Learn how to launch your first offer and start earning",
  eyebrow: "Home",
  get title() {
    return `Welcome to ${brand.productName}`;
  },
  subtitle:
    "Build sales offers, publish promotions, and manage your affiliate assets — follow the steps below to launch in minutes.",
} as const;
