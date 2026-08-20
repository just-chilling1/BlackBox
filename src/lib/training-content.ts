import type { LucideIcon } from "lucide-react";
import { Rocket } from "lucide-react";
import { trainingContent } from "@/config/training.config";
import {
  trainingCta,
  trainingPremiumVideos,
  trainingProTips,
  trainingQuickStartChecklist,
  trainingWorkflowSteps,
} from "@/config/training-content.config";
import { isFeatureEnabled } from "@/config/features.config";
import { vimeoPlayerUrl } from "@/lib/dashboard-content";

export type AcademyVideo = {
  id: string;
  title: string;
  description: string;
  duration?: string;
  badge?: string;
  thumbnailSrc: string | null;
};

export function getPlatformTutorialVideos(): AcademyVideo[] {
  return trainingContent.videos.map((video) => ({
    ...video,
    thumbnailSrc: null,
  }));
}

export function getPremiumTutorialVideos(): AcademyVideo[] {
  return trainingPremiumVideos.map((video) => ({
    ...video,
    thumbnailSrc: null,
  }));
}

export function getTrainingStartCta(): {
  href: string;
  label: string;
  icon: LucideIcon;
} {
  if (isFeatureEnabled("asset-activator")) {
    return {
      href: trainingCta.href,
      label: trainingCta.buttonLabel,
      icon: Rocket,
    };
  }
  if (isFeatureEnabled("blog-builder")) {
    return {
      href: "/sales-offer-generator",
      label: "Get Started with Sales Offer Generator",
      icon: Rocket,
    };
  }
  return {
    href: trainingCta.href,
    label: trainingCta.buttonLabel,
    icon: Rocket,
  };
}

export { trainingCta, trainingProTips, trainingQuickStartChecklist, trainingWorkflowSteps, vimeoPlayerUrl };
