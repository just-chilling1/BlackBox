import { brand } from "./brand.config";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqSection {
  title: string;
  items: FaqItem[];
}

const productName = brand.productName;

export const faqSections: FaqSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: `What is ${productName}?`,
        a: `${productName} helps you turn a product into a live affiliate money page, then drive Pinterest traffic to it. You pick what to promote — NullPing builds the page, prepares pins, and tracks visits and clicks.`,
      },
      {
        q: "What is the core workflow?",
        a: "Four steps: Activate Asset (choose a product), publish your money page, generate Pinterest pins, then check Results. Watch the Dashboard Start Here videos first, then open Activate Asset from the sidebar.",
      },
      {
        q: "Do I need tech or writing skills?",
        a: "No. Paste a product URL or type a product name. NullPing scrapes the offer, writes the review page, and prepares promotion assets. You review, publish, and share.",
      },
      {
        q: "Do I need my own affiliate link?",
        a: "Recommended. Add it when you activate an asset, or later on the money page editor. CTA buttons use that link so commissions can track correctly when someone buys.",
      },
      {
        q: "Where do I learn the click-by-click process?",
        a: "Open Academy in the sidebar for training videos and this FAQ. The Dashboard also has three intro videos under Start Here — watch those before you activate your first asset.",
      },
    ],
  },
  {
    title: "Activate & Money Pages",
    items: [
      {
        q: "How do I activate my first asset?",
        a: "Go to Activate Asset, paste a product URL or enter a product name, optionally add your affiliate link, then click Activate asset. NullPing builds a full money page you can preview and publish.",
      },
      {
        q: "What is a money page?",
        a: "A hosted affiliate review page with headline, benefits, pros and cons, FAQs, and call-to-action buttons. You can change the color theme, edit copy, regenerate, preview, and publish from the money page editor.",
      },
      {
        q: "Can I edit the page after it is created?",
        a: "Yes. Open the money page for that asset to edit copy, switch themes (Ocean, Forest, Sunset, Slate), regenerate content, update your affiliate link, or republish. Changes apply to your live page when you publish or update.",
      },
      {
        q: "What link do I share when promoting?",
        a: "After you publish, copy the live page URL from the money page screen. That is the link visitors should open — and the destination your Pinterest pins should point to.",
      },
    ],
  },
  {
    title: "Traffic & Results",
    items: [
      {
        q: "How do I get traffic to my money page?",
        a: "After publishing, open Traffic (or follow Step 3 in the workflow). NullPing prepares Pinterest pin assets aimed at your money page. Download or use the pins, then post them on Pinterest.",
      },
      {
        q: "What is Results?",
        a: "Results shows tracked visitors, affiliate clicks, and performance per asset from real activity — not simulated numbers. Use it to see which money pages are getting attention.",
      },
      {
        q: "Why am I not seeing clicks yet?",
        a: "Results only update after real visits and clicks. Publish the money page first, send traffic (for example Pinterest pins), then check Results again. Allow time for people to find and click through.",
      },
    ],
  },
  {
    title: "Premium Features",
    items: [
      {
        q: "What is Unlimited?",
        a: "Unlimited gives you access to 200 ready-made money pages across popular niches. Add your affiliate link, install a page with 10 pins, optionally regenerate AI pins, then continue to Traffic and Results.",
      },
      {
        q: "What is Done-For-You Profit?",
        a: "Done-For-You Profit builds a live sales page from your affiliate link and niche, then generates 3 Pinterest pins, an authority article, and 3 Facebook posts in one run.",
      },
      {
        q: "What is Instant Income?",
        a: "Instant Income bulk-generates Facebook post variants from a live money page. Every generation is kept as a saved post set, and the built-in Facebook posting best practices show you how to post without breaking group rules. Visits show up in Results with ?src=facebook.",
      },
      {
        q: "What is Automated Profits?",
        a: "Automated Profits is a curated checklist of 180 traffic sources across 9 niches. Pick your live money page, filter by niche, follow each source’s steps, copy the ready-made description with your tracking link, and mark sources complete. Visits show up in Results.",
      },
      {
        q: "What are Guaranteed High-Ticket Payouts?",
        a: "Guaranteed High-Ticket Payouts add long-form authority sections to your money page (primary), with optional copy for Medium, LinkedIn, or your blog. CTAs use your /m page tracking URL with ?src=article.",
      },
      {
        q: "What is Cyber Protection?",
        a: "Cyber Protection shows real account status — email confirmation, session, HTTPS, and recent money-page / pin / visit activity. Manage profile and license from Account.",
      },
      {
        q: "What is Reseller & License Rights?",
        a: "Open Account → Reseller & License Rights to request turnkey reseller activation. Submit the form and our team reviews the request. You will see a pending status until activation is completed.",
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        q: "How do I reset my password?",
        a: "Use Forgot Password on the login screen. If you are already signed in, sign out first, then request a reset link to the email on your account.",
      },
      {
        q: "How quickly does support respond?",
        a: "Our support team typically replies within two hours. Open Support from the sidebar if your question is not answered here.",
      },
      {
        q: "Is my data secure?",
        a: `${productName} uses secure authentication and encrypted connections. Never share your password, and contact support immediately if you notice unusual account activity.`,
      },
    ],
  },
];

export const faqPageCopy = {
  title: "Frequently Asked Questions",
  subtitle: `Quick answers about ${productName}, money pages, Pinterest traffic, and premium tools`,
} as const;
