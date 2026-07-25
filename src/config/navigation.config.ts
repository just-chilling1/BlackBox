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
  | "Headphones"
  | "Wifi"
  | "Activity"
  | "Wallet"
  | "Globe"
  | "Link2"
  | "FileText"
  | "MapPin"
  | "ShieldCheck"
  | "Repeat"
  | "Megaphone"
  | "Image"
  | "PenLine"
  | "FolderOpen"
  | "Send"
  | "Calculator"
  | "Users"
  | "Zap";

export interface NavItem {
  path: string;
  label: string;
  icon: NavIconName;
  feature?: FeatureId;
  /** Workflow step index for progress bar; omit for non-workflow items */
  workflowStep?: number;
  /** Requires prior workflow steps to be complete */
  requiresWorkflowStep?: number;
}

export const homeNav: NavItem = {
  path: "/dashboard",
  label: "Home",
  icon: "LayoutGrid",
};

/** Core affiliate workflow: search → analysis → radar → replies */
export const workflowSteps: NavItem[] = [
  { path: "/search", label: "Step 1: Enter Topic", icon: "Search", feature: "core-workflow", workflowStep: 1 },
  { path: "/analysis", label: "Step 2: Check Demand", icon: "Brain", feature: "core-workflow", workflowStep: 2, requiresWorkflowStep: 1 },
  { path: "/radar", label: "Step 3: Find Ads", icon: "Radar", feature: "core-workflow", workflowStep: 3, requiresWorkflowStep: 2 },
  { path: "/replies", label: "Step 4: Create Replies", icon: "MessageSquare", feature: "core-workflow", workflowStep: 4, requiresWorkflowStep: 3 },
];

/** Extraction workflow home (connect → scan dashboard) */
export const extractionWorkflowSteps: NavItem[] = [
  { path: "/dashboard", label: "Home", icon: "LayoutGrid", feature: "extraction-workflow", workflowStep: 1 },
];

/** Blog builder workflow — link → niche → theme → deploy */
export const blogBuilderWorkflowSteps: NavItem[] = [
  { path: "/arm-links", label: "Step 1: Add Your Link", icon: "Link2", feature: "blog-builder", workflowStep: 1 },
  { path: "/territory", label: "Step 2: Pick Your Niche", icon: "MapPin", feature: "blog-builder", workflowStep: 2, requiresWorkflowStep: 1 },
  { path: "/theme", label: "Step 3: Choose Template", icon: "PenLine", feature: "blog-builder", workflowStep: 3, requiresWorkflowStep: 2 },
  { path: "/deploy", label: "Step 4: Launch Website", icon: "Rocket", feature: "blog-builder", workflowStep: 4, requiresWorkflowStep: 3 },
];

export const blogBuilderResourceNav: NavItem[] = [
  { path: "/asset", label: "My Websites", icon: "Globe", feature: "blog-builder" },
  { path: "/link-vault", label: "Link Vault", icon: "FileText", feature: "blog-builder" },
];

/** Core sidebar resources — training is feature-gated; support is always on */
export const coreResourceNav: NavItem[] = [
  { path: "/training", label: "Training", icon: "GraduationCap", feature: "training" },
  { path: "/support", label: "Support", icon: "Headphones" },
];

export const resourceNav: NavItem[] = [
  { path: "/scale-training", label: "Scale Training", icon: "TrendingUp", feature: "scale-upsell" },
];

/** Legacy upgrade nav — prefer premiumNav for new products */
export const upgradeNav: NavItem[] = [
  { path: "/dfy", label: "Done-For-You", icon: "Scan", feature: "premium-dfy" },
  { path: "/instant", label: "Instant Income", icon: "Sparkles", feature: "premium-instant" },
  { path: "/autopilot", label: "Automated Profits", icon: "Rocket", feature: "premium-autopilot" },
];

/** Premium section — single source for sidebar, bottom nav, dashboard widget */
export const premiumNav: NavItem[] = [
  { path: "/dfy", label: "Done-For-You", icon: "Scan", feature: "premium-dfy" },
  { path: "/instant", label: "Instant Income", icon: "Sparkles", feature: "premium-instant" },
  { path: "/autopilot", label: "Automated Profits", icon: "Rocket", feature: "premium-autopilot" },
  { path: "/accelerator", label: "Accelerator", icon: "Rocket", feature: "premium-accelerator" },
  { path: "/recurring-wealth", label: "Recurring Wealth", icon: "Repeat", feature: "premium-recurring" },
  { path: "/social-payouts", label: "Social Payouts", icon: "Megaphone", feature: "premium-social" },
  { path: "/protector", label: "Wealth Protector", icon: "ShieldCheck", feature: "protector" },
];

export const premiumSectionLabel = "Premium Features";

/** Primary mobile bottom tabs — first 4 visible tabs + "More" */
export const bottomNavTabs: NavItem[] = [
  homeNav,
  { path: "/search", label: "Search", icon: "Search", feature: "core-workflow" },
  { path: "/radar", label: "Find Ads", icon: "Radar", feature: "core-workflow" },
  { path: "/replies", label: "Replies", icon: "MessageSquare", feature: "core-workflow" },
];

/** Links shown in mobile "More" sheet (non-tab navigation) */
export const bottomNavMoreLinks: NavItem[] = [
  { path: "/analysis", label: "Step 2: Check Demand", icon: "Brain", feature: "core-workflow" },
  { path: "/training", label: "Training", icon: "GraduationCap", feature: "training" },
  { path: "/scale-training", label: "Scale Training", icon: "TrendingUp", feature: "scale-upsell" },
  { path: "/support", label: "Support", icon: "Headphones" },
];
