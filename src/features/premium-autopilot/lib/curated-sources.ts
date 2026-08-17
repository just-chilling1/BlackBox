import {
  AUTOPILOT_NICHE_PROFILES,
  type AutopilotNicheKey,
} from "./niche-profiles";
import type { Difficulty, SourceType, TrafficSource } from "./source-types";

type CuratedDefinition = {
  name: string;
  url: string;
  type: SourceType;
  difficulty?: Difficulty;
  traffic?: string;
  time?: string;
};

type CuratedDefinitionTuple = readonly [
  CuratedDefinition,
  CuratedDefinition,
  CuratedDefinition,
  CuratedDefinition,
  CuratedDefinition,
  CuratedDefinition,
  CuratedDefinition,
  CuratedDefinition,
];

const CURATED_DEFINITIONS = {
  health: [
    { name: "HealthUnlocked", url: "https://healthunlocked.com/", type: "Forum" },
    { name: "PatientsLikeMe", url: "https://www.patientslikeme.com/", type: "Social" },
    { name: "Wellness.com", url: "https://www.wellness.com/", type: "Directory" },
    { name: "r/Health", url: "https://www.reddit.com/r/Health/", type: "Social" },
    { name: "HealthBoards", url: "https://www.healthboards.com/", type: "Forum" },
    { name: "The Mighty", url: "https://themighty.com/", type: "Blog" },
    { name: "Everyday Health", url: "https://www.everydayhealth.com/", type: "Blog" },
    { name: "Healthline", url: "https://www.healthline.com/health/", type: "Blog" },
  ],
  finance: [
    { name: "Bogleheads", url: "https://www.bogleheads.org/forum/", type: "Forum", difficulty: "Medium" },
    { name: "r/personalfinance", url: "https://www.reddit.com/r/personalfinance/", type: "Social" },
    { name: "r/investing", url: "https://www.reddit.com/r/investing/", type: "Social", difficulty: "Medium" },
    { name: "Wall Street Oasis", url: "https://www.wallstreetoasis.com/forum", type: "Forum", difficulty: "Medium" },
    { name: "BiggerPockets", url: "https://www.biggerpockets.com/forums", type: "Forum" },
    { name: "MoneySavingExpert Forum", url: "https://forums.moneysavingexpert.com/", type: "Forum" },
    { name: "r/financialindependence", url: "https://www.reddit.com/r/financialindependence/", type: "Social", difficulty: "Medium" },
    { name: "Investopedia", url: "https://www.investopedia.com/", type: "Blog" },
  ],
  fitness: [
    { name: "Bodybuilding.com Forum", url: "https://forum.bodybuilding.com/", type: "Forum" },
    { name: "r/fitness", url: "https://www.reddit.com/r/fitness/", type: "Social", difficulty: "Medium" },
    { name: "r/bodyweightfitness", url: "https://www.reddit.com/r/bodyweightfitness/", type: "Social" },
    { name: "MyFitnessPal Community", url: "https://community.myfitnesspal.com/", type: "Forum" },
    { name: "T-Nation", url: "https://forums.t-nation.com/", type: "Forum", difficulty: "Medium" },
    { name: "Fitocracy", url: "https://www.fitocracy.com/", type: "Social" },
    { name: "Running Forum", url: "https://www.runningforums.com/", type: "Forum" },
    { name: "LetsRun", url: "https://www.letsrun.com/forum/", type: "Forum", difficulty: "Medium" },
  ],
  marketing: [
    { name: "Warrior Forum", url: "https://www.warriorforum.com/", type: "Forum", difficulty: "Medium" },
    { name: "GrowthHackers", url: "https://growthhackers.com/", type: "Social", difficulty: "Medium" },
    { name: "r/marketing", url: "https://www.reddit.com/r/marketing/", type: "Social" },
    { name: "r/SEO", url: "https://www.reddit.com/r/SEO/", type: "Social", difficulty: "Medium" },
    { name: "Digital Point", url: "https://forums.digitalpoint.com/", type: "Forum" },
    { name: "Moz Community", url: "https://moz.com/community", type: "Forum", difficulty: "Medium" },
    { name: "Indie Hackers", url: "https://www.indiehackers.com/", type: "Social" },
    { name: "Product Hunt Discussions", url: "https://www.producthunt.com/discussions", type: "Social", difficulty: "Medium" },
  ],
  selfhelp: [
    { name: "r/selfimprovement", url: "https://www.reddit.com/r/selfimprovement/", type: "Social", difficulty: "Medium" },
    { name: "r/productivity", url: "https://www.reddit.com/r/productivity/", type: "Social", difficulty: "Medium" },
    { name: "Tiny Buddha", url: "https://tinybuddha.com/", type: "Blog" },
    { name: "The Positivity Blog", url: "https://www.positivityblog.com/", type: "Blog" },
    { name: "Quora Personal Development", url: "https://www.quora.com/topic/Personal-Development", type: "Q&A" },
    { name: "7 Cups Community", url: "https://www.7cups.com/", type: "Social", difficulty: "Medium" },
    { name: "The Change Blog", url: "https://www.thechangeblog.com/", type: "Blog" },
    { name: "Mind Tools", url: "https://www.mindtools.com/", type: "Blog" },
  ],
  beauty: [
    { name: "MakeupAlley", url: "https://www.makeupalley.com/", type: "Forum" },
    { name: "r/SkincareAddiction", url: "https://www.reddit.com/r/SkincareAddiction/", type: "Social", difficulty: "Medium" },
    { name: "r/MakeupAddiction", url: "https://www.reddit.com/r/MakeupAddiction/", type: "Social", difficulty: "Medium" },
    { name: "Essential Day Spa", url: "https://www.essentialdayspa.com/forum/", type: "Forum" },
    { name: "Beautylish", url: "https://www.beautylish.com/", type: "Social" },
    { name: "PurseForum Beauty", url: "https://forum.purseblog.com/forums/the-beauty-bar.42/", type: "Forum" },
    { name: "Temptalia", url: "https://www.temptalia.com/", type: "Blog" },
    { name: "Naturally Curly", url: "https://www.naturallycurly.com/", type: "Social" },
  ],
  education: [
    { name: "r/learnprogramming", url: "https://www.reddit.com/r/learnprogramming/", type: "Social", difficulty: "Medium" },
    { name: "r/studytips", url: "https://www.reddit.com/r/studytips/", type: "Social" },
    { name: "Stack Exchange Academia", url: "https://academia.stackexchange.com/", type: "Q&A" },
    { name: "The Student Room", url: "https://www.thestudentroom.co.uk/", type: "Forum" },
    { name: "Coursera", url: "https://www.coursera.org/", type: "Directory" },
    { name: "edX", url: "https://www.edx.org/", type: "Directory" },
    { name: "Khan Academy", url: "https://www.khanacademy.org/", type: "Directory" },
    { name: "OpenLearn", url: "https://www.open.edu/openlearn/", type: "Directory" },
  ],
  business: [
    { name: "Indie Hackers", url: "https://www.indiehackers.com/", type: "Social", difficulty: "Medium" },
    { name: "r/Entrepreneur", url: "https://www.reddit.com/r/Entrepreneur/", type: "Social", difficulty: "Medium" },
    { name: "Hacker News", url: "https://news.ycombinator.com/", type: "Social", difficulty: "Medium" },
    { name: "Product Hunt", url: "https://www.producthunt.com/", type: "Directory", difficulty: "Medium" },
    { name: "Startup Grind", url: "https://www.startupgrind.com/", type: "Social" },
    { name: "Founders Network", url: "https://foundersnetwork.com/", type: "Social", difficulty: "Medium" },
    { name: "Small Business Forum", url: "https://www.smallbusinessforum.net/", type: "Forum" },
    { name: "Alignable", url: "https://www.alignable.com/", type: "Social" },
  ],
  travel: [
    { name: "FlyerTalk", url: "https://www.flyertalk.com/forum/", type: "Forum", difficulty: "Medium" },
    { name: "r/travel", url: "https://www.reddit.com/r/travel/", type: "Social", difficulty: "Medium" },
    { name: "r/solotravel", url: "https://www.reddit.com/r/solotravel/", type: "Social" },
    { name: "TripAdvisor Forums", url: "https://www.tripadvisor.com/Forums", type: "Forum" },
    { name: "Lonely Planet", url: "https://www.lonelyplanet.com/", type: "Blog" },
    { name: "Fodor's Travel Talk", url: "https://www.fodors.com/community/", type: "Forum" },
    { name: "Travel Stack Exchange", url: "https://travel.stackexchange.com/", type: "Q&A" },
    { name: "Nomadic Matt", url: "https://www.nomadicmatt.com/", type: "Blog" },
  ],
} as const satisfies Record<AutopilotNicheKey, CuratedDefinitionTuple>;

function buildCuratedSource(
  key: AutopilotNicheKey,
  definition: CuratedDefinition,
  index: number
): TrafficSource {
  const profile = AUTOPILOT_NICHE_PROFILES[key];
  return {
    id: `${key}-c${index + 1}`,
    name: definition.name,
    niche: profile.label,
    type: definition.type,
    difficulty: definition.difficulty ?? "Easy",
    traffic: definition.traffic ?? "50-300 visitors/month",
    time: definition.time ?? "10 minutes",
    url: definition.url,
    description: `I put together ${profile.offerAngle} with useful next steps. If it is relevant to your question, you can find it here: {LINK}`,
    instructions: [
      "Read the platform rules before posting or commenting.",
      `Contribute a useful, on-topic response for the ${profile.community}.`,
      "Share {LINK} only when it directly helps the reader.",
    ],
  };
}

function buildCuratedSourcesByNiche(): Record<
  AutopilotNicheKey,
  readonly TrafficSource[]
> {
  const result = {} as Record<AutopilotNicheKey, readonly TrafficSource[]>;

  for (const key of Object.keys(
    CURATED_DEFINITIONS
  ) as AutopilotNicheKey[]) {
    result[key] = CURATED_DEFINITIONS[key].map((definition, index) =>
      buildCuratedSource(key, definition, index)
    );
  }

  return result;
}

export const CURATED_SOURCES_BY_NICHE = buildCuratedSourcesByNiche();
