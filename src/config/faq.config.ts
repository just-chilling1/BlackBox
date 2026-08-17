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
        a: "Open Sales Offer Generator from the sidebar, add your affiliate link, and follow the guided steps. When deployment finishes you get your shareable link plus buttons to check the questionnaire page and the offer page, and the offer appears in Offers Library.",
      },
      {
        q: "Do I need my own affiliate link?",
        a: "Yes. Paste a valid affiliate or promotional URL when generating offers or cloning premium templates. That link is placed on your sales page and in generated promotion copy.",
      },
      {
        q: "What link do I share when promoting?",
        a: "Every offer gets a clean, readable URL that includes your member handle and the offer name. Copy it from the launch panel right after deployment, or anytime from the offer's page in Offers Library.",
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
        a: "X-Power Promotions turns any offer into a ready-to-post 10-post X story thread. Pick an offer, generate, then copy posts one by one or all at once and publish them to X.",
      },
      {
        q: "Do new threads replace my old ones?",
        a: "No. Every generation is saved as a new version, and older threads stay available. On the offer's page in Offers Library you can rename each version and pin your favorite so it opens first everywhere.",
      },
      {
        q: "How do I save links for reuse?",
        a: "Links save automatically when you use Save to Links Library in Sales Offer Generator, or click Create New Link in Links Library to add one with a name, tag, and description.",
      },
    ],
  },
  {
    title: "Libraries",
    items: [
      {
        q: "What is Links Library?",
        a: "Links Library stores your affiliate and promo URLs so you can reuse them across new offers without retyping. Each saved link shows which offers use it, and you can create, edit, or delete links anytime.",
      },
      {
        q: "What is Offers Library?",
        a: "Offers Library is where your generated sales pages live, with search, live/draft filters, and click counts on every card. Open an offer to see its shareable link, affiliate link, saved threads, posts, and articles in one place.",
      },
      {
        q: "Can I edit an offer after it is created?",
        a: "You can change the offer's affiliate link with the Change button on its page in Offers Library, and generate new thread versions anytime. To change the sales page itself, launch a new offer from Sales Offer Generator.",
      },
    ],
  },
  {
    title: "Premium Features",
    items: [
      {
        q: "What is Unlimited?",
        a: "Unlimited gives you access to 200 pre-made sales pages and X threads across popular niches. Add your affiliate link, pick a template, and clone a stored copy instantly.",
      },
      {
        q: "What is Guaranteed High-Ticket Payouts?",
        a: "Guaranteed High-Ticket Payouts provides ready-to-publish authority articles woven around your offer. Preview with your link included, save articles to an offer, and follow the Where to use it guide for your blog, Medium, LinkedIn, or Quora.",
      },
      {
        q: "What is Instant Income?",
        a: "Instant Income bulk-generates Facebook post variants from a single offer. Every generation is kept as a saved post set, and the built-in Facebook posting best practices show you how to post without breaking group rules.",
      },
      {
        q: "What is Cyber Protection?",
        a: "Cyber Protection is your account security overview — verification status, security checks, and a recent activity log — so you can keep your member account in good standing.",
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
