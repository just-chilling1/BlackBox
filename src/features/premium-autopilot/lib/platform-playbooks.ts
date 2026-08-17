import type { AutopilotNicheProfile } from "./niche-profiles";
import type { Difficulty, SourceType, TrafficSource } from "./source-types";

type PlatformPlaybook = {
  id: string;
  name: string;
  type: SourceType;
  difficulty: Difficulty;
  time: string;
  visitors: readonly [number, number];
  url: string;
  instructions: readonly string[];
};

type PlatformPlaybookTuple = readonly [
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
  PlatformPlaybook,
];

const PLATFORM_PLAYBOOKS: PlatformPlaybookTuple = [
  {
    id: "reddit",
    name: "Reddit",
    type: "Social",
    difficulty: "Medium",
    time: "10 minutes",
    visitors: [150, 800],
    url: "https://www.reddit.com/{SUBREDDIT}/",
    instructions: [
      "Read {SUBREDDIT}'s rules before posting or commenting.",
      "Answer a relevant question in detail before mentioning {LINK}.",
      "Only share {LINK} when it directly supports the discussion.",
    ],
  },
  {
    id: "quora",
    name: "Quora",
    type: "Q&A",
    difficulty: "Easy",
    time: "12 minutes",
    visitors: [100, 600],
    url: "https://www.quora.com/",
    instructions: [
      "Search for current questions about {KEYWORDS}.",
      "Write a complete, useful answer in your own words.",
      "Include {LINK} as an optional resource when it answers the question.",
    ],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    type: "Social",
    difficulty: "Easy",
    time: "15 minutes",
    visitors: [120, 750],
    url: "https://www.pinterest.com/",
    instructions: [
      "Create a board around {KEYWORDS}.",
      "Publish an original visual that explains one helpful tip.",
      "Use {LINK} as the destination only when the pin accurately represents the page.",
    ],
  },
  {
    id: "facebook-groups",
    name: "Facebook Groups",
    type: "Social",
    difficulty: "Medium",
    time: "15 minutes",
    visitors: [80, 500],
    url: "https://www.facebook.com/groups/",
    instructions: [
      "Join groups relevant to the {COMMUNITY}.",
      "Read each group's self-promotion rules before participating.",
      "Share {LINK} only after providing a useful, on-topic contribution.",
    ],
  },
  {
    id: "medium",
    name: "Medium",
    type: "Blog",
    difficulty: "Medium",
    time: "25 minutes",
    visitors: [70, 450],
    url: "https://medium.com/",
    instructions: [
      "Write an original article about {KEYWORDS}.",
      "Include useful context instead of a promotional summary.",
      "Link to {LINK} only where it gives the reader a relevant next step.",
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    type: "Video",
    difficulty: "Medium",
    time: "30 minutes",
    visitors: [90, 650],
    url: "https://www.youtube.com/",
    instructions: [
      "Create an original video that teaches one {KEYWORDS} topic.",
      "Make the title and description accurately match the video.",
      "Place {LINK} in the description only if it expands on the video.",
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    type: "Video",
    difficulty: "Medium",
    time: "20 minutes",
    visitors: [100, 700],
    url: "https://www.tiktok.com/",
    instructions: [
      "Create an original short video with one useful takeaway.",
      "Use relevant tags: {HASHTAGS}.",
      "Add {LINK} to your profile only if your account is eligible for a link.",
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    type: "Social",
    difficulty: "Medium",
    time: "20 minutes",
    visitors: [70, 500],
    url: "https://www.instagram.com/",
    instructions: [
      "Publish an original post or carousel for the {COMMUNITY}.",
      "Use relevant tags: {HASHTAGS}.",
      "Use {LINK} in your bio only when it accurately matches the post.",
    ],
  },
  {
    id: "x",
    name: "X",
    type: "Social",
    difficulty: "Easy",
    time: "10 minutes",
    visitors: [50, 350],
    url: "https://x.com/",
    instructions: [
      "Write a concise, useful point about {KEYWORDS}.",
      "Reply thoughtfully to relevant conversations instead of dropping links.",
      "Share {LINK} only when it adds context to the conversation.",
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    type: "Social",
    difficulty: "Medium",
    time: "15 minutes",
    visitors: [40, 300],
    url: "https://www.linkedin.com/",
    instructions: [
      "Share a professional insight related to {KEYWORDS}.",
      "Use a clear, factual description of the resource.",
      "Add {LINK} only where it is relevant to your professional audience.",
    ],
  },
  {
    id: "directory",
    name: "Resource Directory Search",
    type: "Directory",
    difficulty: "Easy",
    time: "15 minutes",
    visitors: [20, 150],
    url: "https://www.google.com/search?q={DIRECTORY_QUERY}",
    instructions: [
      "Search for reputable {DIRECTORY_QUERY}.",
      "Review submission requirements and avoid low-quality listing sites.",
      "Submit {LINK} with an accurate title and description when the directory allows it.",
    ],
  },
  {
    id: "blog-outreach",
    name: "Relevant Blog Outreach",
    type: "Blog",
    difficulty: "Medium",
    time: "20 minutes",
    visitors: [30, 200],
    url: "https://www.google.com/search?q={KEYWORDS}+blogs",
    instructions: [
      "Identify a current article serving the {COMMUNITY}.",
      "Offer a specific, useful addition to the author or editor.",
      "Share {LINK} only if it is genuinely useful to their readers.",
    ],
  },
];

const DEMAND_MULTIPLIERS = {
  low: 0.7,
  medium: 1,
  high: 1.5,
} as const;

export const PLATFORM_PLAYBOOK_COUNT = PLATFORM_PLAYBOOKS.length;

export function interpolateSourceText(
  template: string,
  profile: AutopilotNicheProfile,
  link = "{LINK}"
) {
  return template
    .replaceAll("{LINK}", link)
    .replaceAll("{COMMUNITY}", profile.community)
    .replaceAll("{SUBREDDIT}", profile.subreddit)
    .replaceAll("{HASHTAGS}", profile.hashtags.join(" "))
    .replaceAll("{KEYWORDS}", profile.keywords.join(", "))
    .replaceAll("{DIRECTORY_QUERY}", profile.directoryQuery)
    .replaceAll("{OFFER_ANGLE}", profile.offerAngle);
}

export function buildPlatformSources(
  profile: AutopilotNicheProfile
): TrafficSource[] {
  const multiplier = DEMAND_MULTIPLIERS[profile.demand];

  return PLATFORM_PLAYBOOKS.map((playbook) => {
    const [min, max] = playbook.visitors.map((value) =>
      Math.round(value * multiplier)
    ) as [number, number];

    return {
      id: `${profile.key}-p-${playbook.id}`,
      name: `${playbook.name} — ${profile.label}`,
      niche: profile.label,
      type: playbook.type,
      difficulty: playbook.difficulty,
      traffic: `${min}-${max} visitors/month`,
      time: playbook.time,
      url: interpolateSourceText(playbook.url, profile),
      description: interpolateSourceText(
        "I put together {OFFER_ANGLE} with useful next steps. If it is relevant to your question, you can find it here: {LINK}",
        profile
      ),
      instructions: playbook.instructions.map((instruction) =>
        interpolateSourceText(instruction, profile)
      ),
    };
  });
}
