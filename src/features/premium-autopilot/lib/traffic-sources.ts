import type { TrafficSource } from "./source-types";

/**
 * Pinterest-only posting playbook for a live money page.
 * Completions persist in user_autopilot_completions (source ids are stable).
 */
export const PINTEREST_PLAYBOOK: TrafficSource[] = [
  {
    id: "pinterest-profile-seo",
    name: "Polish your Pinterest profile",
    niche: "Pinterest",
    type: "Profile",
    difficulty: "Easy",
    traffic: "Foundation",
    time: "10 min",
    url: "https://www.pinterest.com/settings/",
    description:
      "Update your profile name, bio, and website to your money page tracking URL so every visit can be attributed.",
    instructions: [
      "Open Pinterest settings → Edit profile.",
      "Set Website to your money page tracking URL (copy from the field above).",
      "Write a short bio that names the niche and a benefit — keep it human, not spammy.",
      "Add a clear profile photo and cover that match your niche.",
      "Mark this complete when your profile Website field is saved.",
    ],
  },
  {
    id: "pinterest-board-niche",
    name: "Create a niche board",
    niche: "Pinterest",
    type: "Board",
    difficulty: "Easy",
    traffic: "High intent",
    time: "8 min",
    url: "https://www.pinterest.com/",
    description:
      "Create a public board named for your niche keywords so pins have a home that ranks in search.",
    instructions: [
      "Create a new public board with a keyword-rich name (e.g. “Best Home Workout Gear 2026”).",
      "Add a board description that mentions the problem your product solves.",
      "Pin 3–5 related public pins first so the board looks active (not empty).",
      "Then pin your NullPing pin images from Traffic with your tracking link.",
      "Mark complete when the board has at least one of your money-page pins.",
    ],
  },
  {
    id: "pinterest-standard-batch",
    name: "Post 5 standard pins",
    niche: "Pinterest",
    type: "Standard Pin",
    difficulty: "Easy",
    traffic: "Core volume",
    time: "20 min",
    url: "https://www.pinterest.com/pin-creation-tool/",
    description:
      "Download 5 pin images from Traffic and publish them as standard pins pointing at your tracking URL.",
    instructions: [
      "Open Traffic for this money page and download 5 pin images.",
      "For each pin: upload the image, paste the title, paste the description.",
      "Set the destination link to the pin’s tracking URL (?pin=…&src=pinterest).",
      "Publish to your niche board — space posts if you prefer (manual is fine).",
      "Mark complete after 5 pins are live.",
    ],
  },
  {
    id: "pinterest-idea-pins",
    name: "Publish 2 Idea Pins",
    niche: "Pinterest",
    type: "Idea Pin",
    difficulty: "Medium",
    traffic: "Engagement",
    time: "25 min",
    url: "https://www.pinterest.com/",
    description:
      "Turn your money page hooks into multi-page Idea Pins that end with a link to your page.",
    instructions: [
      "Pick 2 strong headlines from your pin batch.",
      "Create an Idea Pin with 4–6 pages: problem → tip → product benefit → CTA.",
      "On the last page, add your money page tracking URL.",
      "Use on-brand colors; keep text large and readable on mobile.",
      "Mark complete when both Idea Pins are published.",
    ],
  },
  {
    id: "pinterest-keyword-search",
    name: "Mine keyword searches",
    niche: "Pinterest",
    type: "Search",
    difficulty: "Easy",
    traffic: "Discovery",
    time: "15 min",
    url: "https://www.pinterest.com/",
    description:
      "Search your niche keywords, note related searches, and align pin titles to what people already look for.",
    instructions: [
      "Search 5 niche keywords related to your product on Pinterest.",
      "Note the “Related searches” chips under the results.",
      "Update 2 pin titles/descriptions (in Traffic copy) to include those phrases naturally.",
      "Repost or create fresh pins using the improved copy.",
      "Mark complete when you’ve adjusted copy from at least 3 related searches.",
    ],
  },
  {
    id: "pinterest-group-boards",
    name: "Join 3 group boards",
    niche: "Pinterest",
    type: "Board",
    difficulty: "Medium",
    traffic: "Reach boost",
    time: "20 min",
    url: "https://www.pinterest.com/search/boards/?q=group%20board",
    description:
      "Find relevant group boards in your niche and contribute pins with your tracking link (follow each board’s rules).",
    instructions: [
      "Search for group boards in your niche (quality over spammy “pin for pin” boards).",
      "Request to join 3 boards that match your product category.",
      "Once accepted, pin 1–2 of your NullPing pins with correct tracking URLs.",
      "Never flood — follow posting limits listed in the board description.",
      "Mark complete when you’ve contributed to at least one accepted board.",
    ],
  },
  {
    id: "pinterest-seasonal-board",
    name: "Seasonal / timely board",
    niche: "Pinterest",
    type: "Board",
    difficulty: "Easy",
    traffic: "Seasonal lift",
    time: "12 min",
    url: "https://www.pinterest.com/",
    description:
      "Create a board for the current season or holiday angle and pin product-relevant creative there.",
    instructions: [
      "Name a board for the current season or upcoming holiday in your niche.",
      "Pin 3 lifestyle / tip pins plus 2 of your money-page pins.",
      "Use seasonal words in titles (without stuffing).",
      "Refresh this board monthly with 1–2 new pins.",
      "Mark complete when the seasonal board has your tracking links live.",
    ],
  },
  {
    id: "pinterest-rich-pin-check",
    name: "Rich pin / link checklist",
    niche: "Pinterest",
    type: "Checklist",
    difficulty: "Easy",
    traffic: "Trust",
    time: "10 min",
    url: "https://www.pinterest.com/",
    description:
      "Verify every pin uses your /m/{slug} tracking URL, opens the money page, and the affiliate CTA works.",
    instructions: [
      "Open one of your published pins → click through to the destination.",
      "Confirm the URL includes ?pin=…&src=pinterest (or your campaign param).",
      "Confirm the money page loads and the affiliate CTA works.",
      "Fix any pins still pointing at a bare affiliate URL instead of /m/{slug}.",
      "Mark complete when you’ve verified at least 3 live pins.",
    ],
  },
  {
    id: "pinterest-daily-habit",
    name: "7-day posting habit",
    niche: "Pinterest",
    type: "Checklist",
    difficulty: "Medium",
    traffic: "Consistency",
    time: "7 days",
    url: "https://www.pinterest.com/pin-creation-tool/",
    description:
      "Post 1–3 pins per day for a week from Traffic (use Pin Multiplier if you need more creatives).",
    instructions: [
      "Schedule a daily reminder — Pinterest rewards consistency more than one-day dumps.",
      "Each day: download 1–3 unused pins from Traffic and publish them.",
      "If you run out of creatives, open Pin Multiplier for another batch.",
      "Check Results after day 3 for early visit/click signal.",
      "Mark complete after 7 days of posting (even if some days are 1 pin).",
    ],
  },
  {
    id: "pinterest-results-loop",
    name: "Close the Results loop",
    niche: "Pinterest",
    type: "Checklist",
    difficulty: "Easy",
    traffic: "Feedback",
    time: "5 min",
    url: "/results",
    description:
      "Open Results after traffic starts — double down on pins that earn visits and clicks.",
    instructions: [
      "Open Results and find this money page.",
      "Note which days/pins coincided with visits (tracking uses pin ids).",
      "Create 5 more pins in a similar style (Pin Multiplier or Traffic regenerate).",
      "Retire weak angles that never earned a visit after a week.",
      "Mark complete when you’ve reviewed Results at least once after posting.",
    ],
  },
];

export const NICHES = ["All", "Pinterest"] as const;

export const SOURCES = PINTEREST_PLAYBOOK;

export const SOURCES_PER_NICHE = PINTEREST_PLAYBOOK.length;

export function filterSourcesByNiche(niche: string): TrafficSource[] {
  if (niche === "All" || niche === "Pinterest") return SOURCES;
  return SOURCES.filter((source) => source.niche === niche);
}

export function resolveAutopilotNiche(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized || normalized === "all") return "All";
  if (normalized === "pinterest") return "Pinterest";
  return "All";
}

/** Build tracking URL for autopilot campaigns. */
export function autopilotTrackingUrl(publicUrl: string, sourceId: string): string {
  const base = publicUrl.trim();
  if (!base) return "";
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}src=pinterest&campaign=autopilot-${encodeURIComponent(sourceId)}`;
}
