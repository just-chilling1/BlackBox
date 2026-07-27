import { NICHE_OPTIONS } from "@/features/blog-builder/types";
import type { ArticleAngle } from "@/features/blog-builder/types";
import { buildLocalArticleContent } from "@/features/blog-builder/lib/local-article-content";

export const RECURRING_STREAM_TARGET_COUNT = 100;

export interface RecurringStreamArticle {
  id: number;
  templateKey: string;
  niche: string;
  nicheKey: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string;
  metaDescription: string;
  angle: ArticleAngle;
}

const ARTICLE_ANGLES: ArticleAngle[] = [
  "pillar-guide",
  "best-picks",
  "mistakes",
  "budget",
  "pro-tips",
  "worth-it",
  "beginners",
];

const TOPIC_TEMPLATES = [
  (n: string) => `${n}: The Complete Buyer's Guide`,
  (n: string) => `Best Picks for ${n}`,
  (n: string) => `7 Mistakes to Avoid With ${n}`,
  (n: string) => `${n} on a Budget — What Actually Works`,
  (n: string) => `Pro Tips: Getting Results With ${n}`,
  (n: string) => `Is ${n} Worth It? Honest Breakdown`,
  (n: string) => `${n} for Beginners — Step by Step`,
  (n: string) => `What to Look For Before You Buy ${n}`,
  (n: string) => `Top ${n} Strategies for First-Timers`,
  (n: string) => `Common ${n} Problems and How to Fix Them`,
  (n: string) => `${n} on a Tight Budget — Smart Choices`,
  (n: string) => `Advanced ${n} Tactics That Move the Needle`,
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

/** Build 100 authority article definitions deterministically. */
export function buildRecurringStreamCatalog(): RecurringStreamArticle[] {
  const articles: RecurringStreamArticle[] = [];
  let id = 1;

  while (articles.length < RECURRING_STREAM_TARGET_COUNT) {
    for (const niche of NICHE_OPTIONS) {
      for (let t = 0; t < TOPIC_TEMPLATES.length && articles.length < RECURRING_STREAM_TARGET_COUNT; t++) {
        const title = TOPIC_TEMPLATES[t](niche.label);
        const angle = ARTICLE_ANGLES[t % ARTICLE_ANGLES.length];
        const content = buildLocalArticleContent({
          topic: title,
          territory: niche.label,
          hobby: niche.label,
          angle,
        });

        articles.push({
          id,
          templateKey: `recurring-stream-${id}`,
          niche: niche.label,
          nicheKey: niche.value,
          title: content.title,
          slug: slugify(`${niche.value}-${title}-${id}`),
          html: content.html,
          excerpt: content.excerpt,
          metaDescription: content.metaDescription,
          angle,
        });
        id++;
      }
    }
  }

  return articles.slice(0, RECURRING_STREAM_TARGET_COUNT);
}

export const RECURRING_STREAM_NICHES = NICHE_OPTIONS.map((n) => n.label);

/** Swap inline offer placeholder with member affiliate link. */
export function weaveAffiliateIntoArticle(html: string, affiliateUrl: string): string {
  const url = affiliateUrl.trim();
  if (!url) return html;
  return html
    .replace(/href="#offer"/g, `href="${url}"`)
    .replace(/\[AFFILIATE_LINK\]/g, url)
    .replace(/\[LINK\]/g, url);
}
