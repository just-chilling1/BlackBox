import type { FeatureId } from "./features.config";

export type NavIconName =
  | "LayoutGrid"
  | "Search"
  | "Brain"
  | "Radar"
  | "MessageSquare"
  | "GraduationCap"
  | "TrendingUp"
  | "Scan"
  | "Sparkles"
  | "Rocket"
  | "Headphones";

export interface NavItem {
  path: string;
  label: string;
  icon: NavIconName;
  feature?: FeatureId;
  /** Workflow step index (1-4) for progress bar; omit for non-workflow items */
  workflowStep?: number;
  /** Requires prior workflow steps to be complete (core-workflow only) */
  requiresWorkflowStep?: number;
}

export const homeNav: NavItem = {
  path: "/dashboard",
  label: "Home",
  icon: "LayoutGrid",
};

export const workflowSteps: NavItem[] = [
  { path: "/search", label: "Step 1: Enter Topic", icon: "Search", feature: "core-workflow", workflowStep: 1 },
  { path: "/analysis", label: "Step 2: Check Demand", icon: "Brain", feature: "core-workflow", workflowStep: 2, requiresWorkflowStep: 1 },
  { path: "/radar", label: "Step 3: Find Ads", icon: "Radar", feature: "core-workflow", workflowStep: 3, requiresWorkflowStep: 2 },
  { path: "/replies", label: "Step 4: Create Replies", icon: "MessageSquare", feature: "core-workflow", workflowStep: 4, requiresWorkflowStep: 3 },
];

/** Core sidebar resources — training is feature-gated; support is always on */
export const coreResourceNav: NavItem[] = [
  { path: "/training", label: "Training", icon: "GraduationCap", feature: "training" },
  { path: "/support", label: "Support", icon: "Headphones" },
];

export const resourceNav: NavItem[] = [
  { path: "/scale-training", label: "Scale Training", icon: "TrendingUp", feature: "scale-upsell" },
];

export const upgradeNav: NavItem[] = [
  { path: "/dfy", label: "Done-For-You", icon: "Scan", feature: "premium-dfy" },
  { path: "/instant", label: "Instant Income", icon: "Sparkles", feature: "premium-instant" },
  { path: "/autopilot", label: "Automated Profits", icon: "Rocket", feature: "premium-autopilot" },
];

export const premiumSectionLabel = "Premium Features";
