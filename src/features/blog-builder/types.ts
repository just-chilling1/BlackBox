export interface ArmedLink {
  label: string;
  url: string;
  network: "digistore" | "amazon" | "other";
}

export interface ThemeConfig {
  presetId: string;
  accentOverride?: string;
  headingFont?: string;
  bodyFont?: string;
}

export interface BlogSite {
  id: string;
  user_id: string;
  hobby: string;
  territory?: string | null;
  title: string;
  tagline: string | null;
  slug: string;
  theme: string;
  theme_config?: ThemeConfig | null;
  armed_links: ArmedLink[];
  status: "draft" | "live";
  created_at: string;
  is_template?: boolean;
  template_key?: string | null;
}

export interface BlogPost {
  id: string;
  site_id: string;
  user_id: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string | null;
  meta_description: string | null;
  image_url: string | null;
  image_alt: string | null;
  is_pillar: boolean;
  status: "draft" | "scheduled" | "live";
  publish_at: string | null;
  views: number;
  created_at: string;
}

export type ContentTier = "deploy" | "full";

export interface GeneratedPostContent {
  title: string;
  excerpt: string;
  metaDescription: string;
  html: string;
}

export type ArticleAngle =
  | "pillar-guide"
  | "best-picks"
  | "mistakes"
  | "budget"
  | "pro-tips"
  | "worth-it"
  | "beginners";

export interface ClusterTopic {
  title: string;
  slug: string;
  isPillar: boolean;
  angle?: ArticleAngle;
}

export type PostSlotStatus = "queued" | "generating" | "complete" | "error";

export interface PostSlotState {
  topic: ClusterTopic;
  status: PostSlotStatus;
  progress: number;
  post?: BlogPost;
  error?: string;
}

export interface GenerationQuota {
  limit: number | null;
  usedToday: number;
  remaining: number | null;
  unlimited?: boolean;
}

export interface NicheOption {
  value: string;
  label: string;
}

export const NICHE_OPTIONS: NicheOption[] = [
  { value: "health", label: "Health & Wellness" },
  { value: "finance", label: "Finance & Investing" },
  { value: "tech", label: "Technology" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "ecommerce", label: "E-Commerce" },
  { value: "fitness", label: "Fitness & Sports" },
  { value: "education", label: "Education & Learning" },
  { value: "realestate", label: "Real Estate" },
  { value: "travel", label: "Travel & Lifestyle" },
  { value: "food", label: "Food & Nutrition" },
  { value: "beauty", label: "Beauty & Skincare" },
  { value: "business", label: "Business & Entrepreneurship" },
  { value: "selfhelp", label: "Self-Help & Personal Development" },
  { value: "crypto", label: "Crypto & Blockchain" },
  { value: "saas", label: "SaaS & Software" },
];

export const WIZARD_STEPS = [
  { number: 1, title: "Add Your Link", description: "Save your promotional or affiliate link" },
  { number: 2, title: "Pick Your Niche", description: "Choose the niche for your money site" },
  { number: 3, title: "Choose Template", description: "Pick layout, colors, and fonts" },
  { number: 4, title: "Launch Website", description: "Generate and publish your money site" },
] as const;
