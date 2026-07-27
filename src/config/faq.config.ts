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
        a: `${productName} helps you create affiliate sales pages, promotion threads, and reusable marketing assets in one workspace. Generate an offer, save your links, and promote across social channels without rebuilding everything from scratch.`,
      },
      {
        q: "How do I create my first sales offer?",
        a: 'Open Sales Offer Generator from the sidebar, paste your affiliate link, and follow the guided steps. When deployment finishes, your offer appears in Offers Library with matching X threads ready in X-Power Promotions.',
      },
      {
        q: "Do I need my own affiliate link?",
        a: "Yes. Paste a valid affiliate or promotional URL when generating offers or cloning premium templates. That link is placed on your sales page and in generated promotion copy.",
      },
    ],
  },
  {
    title: "Generate",
    items: [
      {
        q: "What is the Sales Offer Generator?",
        a: "It is the all-in-one workflow for building a hosted sales page from your affiliate link. You choose your territory and theme, then deploy a ready-to-share offer.",
      },
      {
        q: "What is X-Power Promotions?",
        a: "X-Power Promotions creates ready-to-post social threads for your offers. Pick an offer from Offers Library and generate batches of posts you can copy and publish.",
      },
      {
        q: "How do I save links for reuse?",
        a: 'Links save automatically when you add them in Sales Offer Generator, or you can add them directly in Links Library with a name, tag, and description.',
      },
    ],
  },
  {
    title: "Libraries",
    items: [
      {
        q: "What is Links Library?",
        a: "Links Library stores your affiliate and promo URLs so you can reuse them across new offers without retyping the same link every time.",
      },
      {
        q: "What is Offers Library?",
        a: "Offers Library is where your generated sales pages live. Open any offer to view its page, manage threads, or jump into X-Power Promotions.",
      },
      {
        q: "Can I edit an offer after it is created?",
        a: "You can regenerate promotion threads and reuse stored links. To change the underlying sales page, create a new offer from Sales Offer Generator with your updated link or settings.",
      },
    ],
  },
  {
    title: "Premium Features",
    items: [
      {
        q: "What is Accelerator?",
        a: "Accelerator gives you access to 200 pre-made sales pages and X threads across popular niches. Add your affiliate link, pick a template, and clone a stored copy instantly.",
      },
      {
        q: "What is Recurring Wealth Stream?",
        a: "Recurring Wealth Stream provides ready-to-publish authority articles you can deploy to build long-term traffic and recurring affiliate income.",
      },
      {
        q: "What are Social Payouts?",
        a: "Social Payouts bulk-generates many Facebook post variants from a single offer so you can scale promotion without writing each post manually.",
      },
      {
        q: "What is Wealth Protector?",
        a: "Wealth Protector helps you review account security signals and verification status so you can keep your member account in good standing.",
      },
    ],
  },
  {
    title: "Account & Support",
    items: [
      {
        q: "How do I reset my password?",
        a: 'Use Forgot Password on the login screen. If you are already signed in, sign out first, then request a reset link to the email on your account.',
      },
      {
        q: "How quickly does support respond?",
        a: "Our support team typically replies within two hours. Use the Contact Support tab if your question is not answered here.",
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
  subtitle: `Quick answers about ${productName}, your offers, and premium tools`,
} as const;
