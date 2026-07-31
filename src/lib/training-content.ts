import type { LucideIcon } from "lucide-react";
import { BookOpen, Rocket } from "lucide-react";
import { trainingContent } from "@/config/training.config";
import {
  trainingCta,
  trainingPremiumVideos,
  trainingProTips,
  trainingQuickStartChecklist,
  trainingWorkflowSteps,
} from "@/config/training-content.config";
import { isFeatureEnabled } from "@/config/features.config";
import {
  getAcademyPlatformThumbnail,
  getAcademyPremiumThumbnail,
} from "@/lib/video-thumbnails";
import { vimeoPlayerUrl } from "@/lib/dashboard-content";
import { getTrainingVideoMeta, type TrainingVideoSlug } from "@/config/training-videos.config";

export type AcademyVideo = {
  slug: TrainingVideoSlug;
  id: string;
  title: string;
  description: string;
  duration?: string;
  badge?: string;
  thumbnailSrc: string | null;
  transcript: string;
};

export function getPlatformTutorialVideos(): AcademyVideo[] {
  return trainingContent.videos.map((video, index) => {
    const meta = getTrainingVideoMeta(video.slug);
    return {
      ...video,
      title: meta.title,
      transcript: meta.transcript,
      thumbnailSrc: getAcademyPlatformThumbnail(index),
    };
  });
}

export function getPremiumTutorialVideos(): AcademyVideo[] {
  return trainingPremiumVideos.map((video, index) => {
    const meta = getTrainingVideoMeta(video.slug);
    return {
      ...video,
      title: meta.title,
      transcript: meta.transcript,
      thumbnailSrc: getAcademyPremiumThumbnail(index),
    };
  });
}

export function getTrainingStartCta(): {
  href: string;
  label: string;
  icon: LucideIcon;
} {
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

export function getTrainingDashboardCta(): {
  href: string;
  label: string;
  icon: LucideIcon;
} {
  return {
    href: "/dashboard",
    label: "Watch Start Here Videos on Dashboard",
    icon: BookOpen,
  };
}

export { trainingCta, trainingProTips, trainingQuickStartChecklist, trainingWorkflowSteps, vimeoPlayerUrl };
