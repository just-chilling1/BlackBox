import { isFeatureEnabled, type FeatureId } from "@/config/features.config";
import {
  homeNav,
  workflowSteps,
  extractionWorkflowSteps,
  blogBuilderWorkflowSteps,
  blogBuilderCoreNav,
  blogBuilderResourceNav,
  coreResourceNav,
  resourceNav,
  upgradeNav,
  premiumNav,
  bottomNavTabs,
  bottomNavMoreLinks,
  type NavItem,
} from "@/config/navigation.config";

function filterNav(items: NavItem[]): NavItem[] {
  return items.filter((item) => !item.feature || isFeatureEnabled(item.feature));
}

export function getVisibleWorkflowSteps(): NavItem[] {
  if (isFeatureEnabled("extraction-workflow")) {
    return filterNav(extractionWorkflowSteps);
  }
  if (isFeatureEnabled("core-workflow")) {
    return filterNav(workflowSteps);
  }
  return [];
}

export function getBlogBuilderWorkflowSteps(): NavItem[] {
  return filterNav(blogBuilderWorkflowSteps);
}

export function getBlogBuilderCoreNav(): NavItem[] {
  return filterNav(blogBuilderCoreNav);
}

export function getBlogBuilderResourceNav(): NavItem[] {
  return getBlogBuilderCoreNav();
}

export function getCoreResourceNav(): NavItem[] {
  return filterNav(coreResourceNav);
}

export function getVisibleResourceNav(): NavItem[] {
  return filterNav(resourceNav);
}

export function getVisibleUpgradeNav(): NavItem[] {
  return filterNav(upgradeNav);
}

export function getVisiblePremiumNav(): NavItem[] {
  return filterNav(premiumNav);
}

export function getBottomNavTabs(): NavItem[] {
  const tabs = filterNav(bottomNavTabs);
  if (tabs.length >= 2) return tabs.slice(0, 4);
  return [homeNav, ...filterNav(coreResourceNav)].slice(0, 4);
}

export function getBottomNavMoreLinks(): NavItem[] {
  return filterNav(bottomNavMoreLinks);
}

export function isNavItemLocked(
  item: NavItem,
  workflowProgress: number
): boolean {
  if (!item.requiresWorkflowStep) return false;
  return workflowProgress < item.requiresWorkflowStep;
}

export function getWorkflowProgress(
  pathname: string,
  hasVariations: boolean,
  hasAnalysis: boolean,
  hasSelectedAds: boolean
): number {
  if (pathname === "/replies" && hasSelectedAds) return 4;
  if (pathname === "/radar" || hasSelectedAds) return 3;
  if (pathname === "/analysis" || hasAnalysis) return 2;
  if (pathname === "/search" || hasVariations) return 1;
  return 0;
}

/** Resolve which primary workflow feature is active for this product */
export function getPrimaryWorkflowFeature(): FeatureId | null {
  if (isFeatureEnabled("blog-builder")) return "blog-builder";
  if (isFeatureEnabled("extraction-workflow")) return "extraction-workflow";
  if (isFeatureEnabled("core-workflow")) return "core-workflow";
  return null;
}
