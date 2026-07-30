import type { LucideIcon } from "lucide-react";
import { BookOpen, Rocket } from "lucide-react";
import { dashboardContent } from "@/config/dashboard.config";
import { trainingContent } from "@/config/training.config";
import { isFeatureEnabled } from "@/config/features.config";
import { getDashboardHowItWorksSteps } from "@/lib/dashboard-steps";

export type DashboardVideo = {
  id: string;
  title: string;
  description: string;
  duration?: string;
};

export function getDashboardVideos(): DashboardVideo[] {
  return dashboardContent.videos.map((video, index) => ({
    ...video,
    id: video.id || trainingContent.videos[index]?.id || "",
  }));
}

export function getDashboardSubtitle(): string {
  if (isFeatureEnabled("blog-builder")) {
    return "Watch the three videos below in order — then jump into the Sales Offer Generator and start building. The Academy is there whenever you want a deeper walkthrough.";
  }
  if (isFeatureEnabled("core-workflow")) {
    return "Watch the three videos below in order — then enter your first topic and start finding ads. The Academy is there whenever you want a deeper walkthrough.";
  }
  return dashboardContent.subtitle;
}

export function getDashboardStartCta(): {
  href: string;
  label: string;
  icon: LucideIcon;
} {
  if (isFeatureEnabled("blog-builder")) {
    return {
      href: "/sales-offer-generator",
      label: "Get Started Now with Sales Offer Generator",
      icon: Rocket,
    };
  }

  const firstStep = getDashboardHowItWorksSteps()[0];
  return {
    href: firstStep.href,
    label: `Get Started Now — ${firstStep.title}`,
    icon: firstStep.icon,
  };
}

export function getDashboardAcademyCta(): {
  href: string;
  label: string;
  icon: LucideIcon;
} {
  return {
    href: "/training",
    label: "Know More from the Academy",
    icon: BookOpen,
  };
}

export function vimeoPlayerUrl(id: string): string {
  return `https://player.vimeo.com/video/${id}`;
}
