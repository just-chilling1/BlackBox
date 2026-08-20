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
        q: "What is Asset Vault?",
        a: "Asset Vault gives you access to 200 ready-made money pages across popular niches. Add your affiliate link, pick a page, install it instantly, then generate Pinterest pins on the Traffic step.",
      },
      {
        q: "What is One-Click Asset?",
        a: "One-Click Asset builds a full promo kit from an affiliate link and niche — a hosted sales page, story thread, authority article, and Facebook post variants you can copy and use right away.",
      },
      {
        q: "What is Pin Multiplier?",
        a: "Pin Multiplier bulk-generates multiple social post variants from one offer so you can promote the same money page with different hooks and angles without rewriting each time.",
      },
      {
        q: "What is Pinterest Autopilot?",
        a: "Pinterest Autopilot is a curated traffic-source checklist. Save your promotion URL, browse suggested places to post, copy snippets, and mark sources complete as you go.",
      },
      {
        q: "What are Authority Boosters?",
        a: "Authority Boosters are ready-to-publish authority articles. Filter by niche, weave in your affiliate link, then copy the article for your blog, Medium, LinkedIn, Quora, or similar platforms.",
      },
      {
        q: "What is Cyber Protection?",
        a: "Cyber Protection is your account security overview — verification status, security checks, and recent activity — so you can keep your member account in good standing.",
      },
      {
        q: "What is Reseller & License Rights?",
        a: "Use Reseller & License Rights to request turnkey reseller activation. Submit the form and our team reviews the request. You will see a pending status until activation is completed.",
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
