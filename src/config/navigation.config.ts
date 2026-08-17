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
  label: "Dashboard",
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

/** Single-page sales offer generator (all wizard steps) */
export const blogBuilderWorkflowSteps: NavItem[] = [
  { path: "/sales-offer-generator", label: "Sales Offer Generator", icon: "Rocket", feature: "blog-builder" },
];

/** Generate tools — sales pages and social promotions */
export const blogBuilderGenerateNav: NavItem[] = [
  { path: "/promote", label: "X-Power Promotions", icon: "Megaphone", feature: "article-publish" },
];

/** Saved links and generated offers */
export const blogBuilderLibrariesNav: NavItem[] = [
  { path: "/link-vault", label: "Links Library", icon: "Link2", feature: "blog-builder" },
  { path: "/offers", label: "Offers Library", icon: "FolderOpen", feature: "blog-builder" },
];

/** @deprecated Use blogBuilderGenerateNav and blogBuilderLibrariesNav */
export const blogBuilderCoreNav: NavItem[] = [
  ...blogBuilderGenerateNav,
  ...blogBuilderLibrariesNav,
];

/** @deprecated Use blogBuilderGenerateNav and blogBuilderLibrariesNav */
export const blogBuilderResourceNav: NavItem[] = blogBuilderCoreNav;

export const blogBuilderGenerateSectionLabel = "Generate";
export const blogBuilderLibrariesSectionLabel = "Libraries";

/** Footer support link — rendered above account in the sidebar */
export const supportNav: NavItem = {
  path: "/support",
  label: "Support",
  icon: "Headphones",
};

/** Core sidebar resources — academy is feature-gated */
export const coreResourceNav: NavItem[] = [
  { path: "/training", label: "Academy", icon: "GraduationCap", feature: "training" },
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
  { path: "/dfy-profit", label: "Done-For-You Profit", icon: "Wallet", feature: "premium-dfy-profit" },
  { path: "/instant", label: "Instant Income", icon: "Sparkles", feature: "premium-instant" },
  { path: "/autopilot", label: "Automated Profits", icon: "Rocket", feature: "premium-autopilot" },
  { path: "/accelerator", label: "Unlimited", icon: "Zap", feature: "premium-accelerator" },
  { path: "/recurring-wealth", label: "Guaranteed High-Ticket Payouts", icon: "Repeat", feature: "premium-recurring" },
  { path: "/social-payouts", label: "Instant Income", icon: "Globe", feature: "premium-social" },
  { path: "/protector", label: "Cyber Protection", icon: "ShieldCheck", feature: "protector" },
];

export const premiumSectionLabel = "Premium Features";

/** Primary mobile bottom tabs — first 4 visible tabs + "More" */
export const bottomNavTabs: NavItem[] = [
  homeNav,
  { path: "/sales-offer-generator", label: "Offer Generator", icon: "Rocket", feature: "blog-builder" },
];

/** Extra links for mobile "More" sheet — workflow, generate, libraries, and resources are merged in getBottomNavMoreLinks() */
export const bottomNavMoreLinks: NavItem[] = [];
