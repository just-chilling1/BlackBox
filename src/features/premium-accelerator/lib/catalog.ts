import {
  MONEY_PAGE_COLOR_THEMES,
  type MoneyPageColorThemeId,
} from "@/features/money-page/lib/themes";
import {
  MONEY_PAGE_VARIATIONS,
  type MoneyPageVariationId,
} from "@/features/money-page/lib/variations";
import {
  PREMIUM_NICHE_LABELS,
  type PremiumNicheLabel,
} from "@/lib/premium-niches";

export const ACCELERATOR_TARGET_COUNT = 200;

export type VaultNiche = PremiumNicheLabel;

export const VAULT_NICHES = PREMIUM_NICHE_LABELS;

interface ProductArchetype {
  name: string;
  summary: string;
}

/** ~22+ products per niche so the 200-page vault covers all nine niches evenly. */
const PRODUCTS_BY_NICHE: Record<VaultNiche, ProductArchetype[]> = {
  "Health & Wellness": [
    { name: "DeepRest Sleep Support", summary: "A nightly sleep formula for people who struggle to wind down and stay asleep." },
    { name: "CalmHarbor Stress Relief Blend", summary: "A daily calm blend built for busy adults who feel wired by afternoon." },
    { name: "GutEase Digestive Support", summary: "A gut-support formula for bloating, regularity, and post-meal comfort." },
    { name: "VitaDaily Multivitamin Pack", summary: "A simple daily multivitamin pack for adults who skip complicated stacks." },
    { name: "FocusClear Nootropic Capsules", summary: "A beginner-friendly focus formula for deep work without heavy stimulants." },
    { name: "JointFlex Mobility Support", summary: "A joint-support option for active adults noticing stiffness after 40." },
    { name: "ImmuneShield Daily Defense", summary: "A daily immune-support blend for cold seasons and travel weeks." },
    { name: "NightCalm Melatonin Blend", summary: "A gentle melatonin blend designed to help you fall asleep without next-day fog." },
    { name: "HydraBalance Electrolyte Mix", summary: "An electrolyte mix for hydration, energy, and recovery from busy days." },
    { name: "SoftReset Weighted Blanket", summary: "A mid-weight blanket for people who sleep better with gentle pressure." },
    { name: "QuietMind Meditation App", summary: "A short-session meditation app for beginners who cannot sit for 30 minutes." },
    { name: "DawnSoft Sunrise Alarm", summary: "A sunrise alarm that wakes you with light instead of a harsh beep." },
    { name: "RestRoute Bedtime Journal", summary: "A guided bedtime journal that helps clear racing thoughts before sleep." },
    { name: "OmegaGlow Fish Oil Softgels", summary: "Omega-3 softgels framed for heart, mood, and everyday wellness support." },
    { name: "BreathEasy Nasal Strip Pack", summary: "Nasal strips for quieter nights and easier breathing during sleep." },
    { name: "StillNight Herbal Tea Kit", summary: "A caffeine-free herbal tea kit built for a consistent evening cup." },
    { name: "PulseCheck Wellness Tracker", summary: "A simple wellness tracker for sleep, steps, and recovery trends." },
    { name: "MagnesiumNight Drink Mix", summary: "An evening magnesium drink for calmer wind-down rituals." },
    { name: "PostureAlign Desk Brace", summary: "A soft posture brace for desk workers with aching shoulders and neck." },
    { name: "CleanFuel Greens Powder", summary: "A greens powder for people who want a faster daily nutrition baseline." },
    { name: "RecoveryFoam Roller Kit", summary: "A foam-roller kit for tight hips, back, and after-work tension." },
    { name: "SleepSignal Blue-Light Glasses", summary: "Evening blue-light glasses for screen users who stay up too late." },
    { name: "HarborRest Contour Pillow", summary: "A contour pillow designed to keep your neck aligned overnight." },
  ],
  "Finance & Investing": [
    { name: "DividendMap Investor Checklist", summary: "A checklist for beginners researching dividend stocks carefully." },
    { name: "WealthSync Budget Dashboard", summary: "A personal finance dashboard that connects goals to weekly actions." },
    { name: "BrokerBasics Trading Primer", summary: "A plain-English primer on brokerage accounts and order types." },
    { name: "RetireReady Projection Planner", summary: "A retirement projection planner for mid-career savers." },
    { name: "IndexPath ETF Starter Guide", summary: "A calm guide to building a simple long-term ETF portfolio." },
    { name: "CashFlow Budget Spreadsheet", summary: "A ready-made budget spreadsheet for tracking income and expenses." },
    { name: "TaxReady Self-Employed Folder", summary: "A folder system and checklist for self-employed tax prep." },
    { name: "DebtClear Payoff Tracker", summary: "A debt payoff tracker with avalanche and snowball views." },
    { name: "EmergencyFund Challenge Planner", summary: "A 90-day emergency-fund challenge with weekly check-ins." },
    { name: "CryptoSafe Starter Handbook", summary: "A cautious starter handbook for wallets and basic crypto security." },
    { name: "RentRoll Property Tracker", summary: "A tracker for small landlords watching rent and expenses." },
    { name: "CreditLift Score Action Plan", summary: "An action plan for improving credit without shady shortcuts." },
    { name: "SaveMore Challenge Planner", summary: "A 30-day savings challenge planner with weekly milestones." },
    { name: "PortfolioPulse Rebalance Sheet", summary: "A rebalance sheet that keeps asset allocation on track." },
    { name: "FirePath Independence Calculator", summary: "A FIRE calculator that turns savings rate into a timeline." },
    { name: "BondLadder Income Explainer", summary: "A plain explainer for building a simple bond ladder." },
    { name: "InsuranceFit Coverage Checklist", summary: "A coverage checklist for life, health, and liability gaps." },
    { name: "KidsMoney Allowance System", summary: "An allowance and saving system parents can run at home." },
    { name: "NetWorth Monthly Snapshot", summary: "A monthly net-worth snapshot template for honest progress checks." },
    { name: "DividendCalendar Payout Tracker", summary: "A payout calendar for tracking dividend income by month." },
    { name: "RiskGuard Investor Journal", summary: "An investor journal for logging thesis, risk, and mistakes." },
    { name: "CollegeFund Contribution Plan", summary: "A contribution plan for college savings without guesswork." },
    { name: "InflationShield Spending Audit", summary: "A spending audit that spots inflation leaks in everyday costs." },
  ],
  "Fitness & Sports": [
    { name: "LiftLab Resistance Bands", summary: "A full resistance-band set for home workouts and warm-ups." },
    { name: "StrikePro Training Gloves", summary: "Training gloves built for bag work, mitt drills, and beginner sparring." },
    { name: "CoreForge Ab Wheel Pro", summary: "An ab wheel designed for controlled core progressions." },
    { name: "HomeGym Adjustable Dumbbells", summary: "Space-saving adjustable dumbbells for apartment gyms." },
    { name: "ThunderBag Heavy Bag", summary: "A durable heavy bag for home gyms and garage setups." },
    { name: "PulseFit Heart Rate Monitor", summary: "A heart-rate monitor strap for zone-based training." },
    { name: "FormCheck Yoga Mat Plus", summary: "A thicker yoga mat with better grip for hot sessions." },
    { name: "CageFit Jump Rope", summary: "A speed jump rope for warm-ups and fight-camp conditioning." },
    { name: "StrongSip Protein Isolate", summary: "A clean protein isolate for post-workout recovery." },
    { name: "MobilityPro Foam Roller", summary: "A firm foam roller for tight hips, quads, and back." },
    { name: "TrailRun Compression Socks", summary: "Compression socks for runners who want less post-run swelling." },
    { name: "IronGuard Hand Wraps", summary: "Supportive hand wraps that protect wrists during heavy sessions." },
    { name: "KettleCore Cast Iron Bell", summary: "A cast-iron kettlebell for swings, cleans, and presses." },
    { name: "SteadyPace Running Belt", summary: "A slim running belt for phone, keys, and gels." },
    { name: "GripMax Lifting Straps", summary: "Lifting straps for heavy pulls when grip gives out first." },
    { name: "KickForge Shin Guards", summary: "Shin guards made for kickboxing and Muay Thai pad work." },
    { name: "BalanceBoard Stability Trainer", summary: "A balance board for ankles, core, and rehab work." },
    { name: "JumpStack Plyo Box Soft", summary: "A soft plyo box for safer jump training at home." },
    { name: "FightFuel Electrolyte Mix", summary: "An electrolyte mix for long training sessions and weight cuts." },
    { name: "PowerBand Hip Circle Set", summary: "Hip circles for glute activation and warm-ups." },
    { name: "StrikeTimer Round Clock", summary: "A round timer with clear intervals for bag and sparring rounds." },
    { name: "MealPrep Macro Containers", summary: "Portion-ready containers for weekly meal prep." },
    { name: "BagStand Freestanding Bag", summary: "A freestanding bag that works when you cannot hang a heavy bag." },
  ],
  "Digital Marketing": [
    { name: "SEOMap Keyword Planner", summary: "A keyword planner that keeps SEO suggestions beginner-friendly." },
    { name: "AdSpend ROI Calculator", summary: "A calculator that shows whether ad spend is actually profitable." },
    { name: "FunnelLite Landing Page Kit", summary: "A simple landing-page kit for one clear offer." },
    { name: "LeadMagnet Email Pack", summary: "Ready email sequences for building a simple lead list." },
    { name: "SocialStack Content Calendar", summary: "A content calendar for consistent social posting without chaos." },
    { name: "AnalyticsPulse Dashboard", summary: "A dashboard that explains traffic and conversions in plain language." },
    { name: "AffiliateStart Launch Playbook", summary: "A playbook for beginners starting affiliate marketing the right way." },
    { name: "VideoCut Shorts Editor", summary: "A shorts editor that crops long videos into vertical clips." },
    { name: "PromptBank AI Prompt Library", summary: "A prompt library organized by marketing job and outcome." },
    { name: "CRMLite Contact Hub", summary: "A simple CRM for solopreneurs tracking leads and follow-ups." },
    { name: "DesignStack Template Library", summary: "A template library for social graphics and simple brand kits." },
    { name: "OfferLab Hook Swipe File", summary: "A swipe file of proven hooks for ads, pins, and posts." },
    { name: "RetargetReady Pixel Checklist", summary: "A pixel and retargeting checklist for cleaner ad setups." },
    { name: "NicheFinder Research Pack", summary: "Research templates for picking a niche before you build." },
    { name: "InboxZero Email Sorter", summary: "An email sorter that prioritizes replies and archives the rest." },
    { name: "UptimeWatch Site Monitor", summary: "A site monitor that alerts you when a money page goes down." },
    { name: "PinCraft Pinterest Scheduler", summary: "A Pinterest scheduler built for affiliate traffic workflows." },
    { name: "CopyForge Headline Tester", summary: "A headline tester that ranks angles before you spend on ads." },
    { name: "FormCraft Survey Builder", summary: "A survey builder for feedback forms and lead capture." },
    { name: "BrandKit Color System", summary: "A lightweight brand kit so every campaign looks consistent." },
    { name: "ReviewBoost Reputation Tracker", summary: "A reputation tracker for reviews, mentions, and replies." },
    { name: "LaunchPad Campaign Checklist", summary: "A campaign checklist covering creative, tracking, and budget." },
    { name: "ChatDesk Support Widget", summary: "A support chat widget with canned replies for small sites." },
  ],
  "Self-Help & Personal Development": [
    { name: "HabitForge Daily Tracker", summary: "A habit tracker that keeps streaks visible without overwhelm." },
    { name: "MindClear Morning Journal", summary: "A morning journal system for clarity before the day starts." },
    { name: "FocusMode Distraction Blocker", summary: "A distraction blocker for deep-work blocks on desktop." },
    { name: "ConfidenceLab Speaking Course", summary: "A short course on calm, clear communication under pressure." },
    { name: "Reset90 Life Audit Workbook", summary: "A 90-day life audit workbook for priorities and energy leaks." },
    { name: "RelationshipSync Conversation Cards", summary: "Conversation cards for couples who want better weekly check-ins." },
    { name: "AnxietyEase Breathing Guide", summary: "A guided breathing toolkit for stressful moments and busy weeks." },
    { name: "GoalMap Quarterly Planner", summary: "A quarterly planner that turns big goals into weekly actions." },
    { name: "BoundaryBook Assertiveness Scripts", summary: "Ready scripts for saying no without guilt." },
    { name: "DopamineDetox Weekend Plan", summary: "A practical weekend reset plan for screen-heavy habits." },
    { name: "GratitudeLoop Evening Cards", summary: "Evening gratitude cards that take under five minutes." },
    { name: "ProcrastBreak Action Timer", summary: "A timer method that makes starting hard tasks easier." },
    { name: "SelfWorth Mirror Prompts", summary: "Prompt cards for rebuilding self-talk after setbacks." },
    { name: "EnergyAudit Lifestyle Checklist", summary: "A lifestyle checklist that spots sleep, food, and stress drains." },
    { name: "MentorMind Decision Journal", summary: "A decision journal for clearer choices and fewer regrets." },
    { name: "CalmParent Conflict Toolkit", summary: "A conflict toolkit for calmer conversations at home." },
    { name: "CareerCourage Pivot Guide", summary: "A pivot guide for people ready to change direction carefully." },
    { name: "StoicDaily Reflection Pack", summary: "A daily reflection pack inspired by practical stoic habits." },
    { name: "SocialEase Networking Scripts", summary: "Networking scripts for introverts who hate forced small talk." },
    { name: "SleepMind Wind-Down Protocol", summary: "A wind-down protocol that pairs habits with better evenings." },
    { name: "PurposeMap Values Workshop", summary: "A values workshop that clarifies what matters this year." },
    { name: "ResilienceKit Bounce-Back Plan", summary: "A bounce-back plan for recovering after failed goals." },
    { name: "AttentionGuard Phone Limits Kit", summary: "A phone-limits kit for reclaiming evenings and weekends." },
  ],
  "Beauty & Skincare": [
    { name: "GlowSerum Vitamin C Drop", summary: "A vitamin C serum for dull skin and uneven tone." },
    { name: "SilkBarrier Moisturizer", summary: "A barrier-repair moisturizer for dry and sensitive skin." },
    { name: "ClearPath Retinol Night Cream", summary: "A beginner-friendly retinol cream for night routines." },
    { name: "PoreCalm Clay Mask", summary: "A clay mask that targets congestion without over-drying." },
    { name: "LashLift Growth Serum", summary: "A lash serum for people who want thicker-looking lashes." },
    { name: "RadiantSPF Daily Shield", summary: "A lightweight daily SPF that sits well under makeup." },
    { name: "ToneCorrect Dark Spot Gel", summary: "A dark-spot gel for post-acne marks and sun spots." },
    { name: "HydraMist Facial Spray", summary: "A hydrating mist for midday refresh and travel." },
    { name: "SoftFocus Primer Stick", summary: "A primer stick that blurs texture before foundation." },
    { name: "NailForge Strength Oil", summary: "A cuticle and nail oil for brittle nails." },
    { name: "ScalpRoot Growth Tonic", summary: "A scalp tonic marketed for healthier-looking hair growth." },
    { name: "CleanCanvas Makeup Remover", summary: "A gentle makeup remover that does not strip skin." },
    { name: "BrowShape Precision Kit", summary: "A brow kit with stencil and gel for cleaner arches." },
    { name: "DewDrop Hyaluronic Ampoule", summary: "A hyaluronic ampoule for dehydrated skin." },
    { name: "VelvetLip Overnight Mask", summary: "An overnight lip mask for dry, cracked lips." },
    { name: "MirrorGlow LED Face Mask", summary: "An at-home LED mask for routine skin maintenance." },
    { name: "SilkPillow Hair Care Cover", summary: "A silk pillowcase cover that reduces friction on hair and skin." },
    { name: "AcneSpot Emergency Dots", summary: "Hydrocolloid patches for overnight spot care." },
    { name: "BodySilk Firming Lotion", summary: "A firming body lotion for dry arms and legs." },
    { name: "SculptWand Facial Roller", summary: "A facial roller for morning puffiness and product absorption." },
    { name: "PureWash Gentle Cleanser", summary: "A fragrance-light cleanser for reactive skin." },
    { name: "ColorStay Brow Pomade", summary: "A brow pomade for fuller, longer-lasting definition." },
    { name: "NightRepair Peptide Cream", summary: "A peptide night cream for firmer-feeling skin." },
  ],
  "Education & Learning": [
    { name: "SkillForge Online Course Hub", summary: "A course hub for structured self-paced learning paths." },
    { name: "FocusDesk Study Planner", summary: "A study planner that breaks big goals into weekly blocks." },
    { name: "LanguageLeap Conversation Pack", summary: "A conversation pack for practicing a new language daily." },
    { name: "MathLift Tutoring Workbook", summary: "A tutoring workbook with clear worked examples." },
    { name: "EssayPro Writing Framework", summary: "A writing framework for clearer essays and reports." },
    { name: "MemoryMap Flashcard System", summary: "A spaced-repetition flashcard system for exams." },
    { name: "CodeStart Beginner Bootcamp", summary: "A beginner coding bootcamp with small weekly projects." },
    { name: "ReadSmart Speed Reading Guide", summary: "A speed-reading guide focused on comprehension, not tricks." },
    { name: "ExamReady Practice Tests", summary: "Timed practice tests with answer explanations." },
    { name: "ParentCoach Homework Toolkit", summary: "A toolkit for parents supporting homework without stress." },
    { name: "STEMLab Home Experiment Kit", summary: "A home experiment kit for kids learning science." },
    { name: "PublicSpeak Confidence Course", summary: "A short course on calm, clear public speaking." },
    { name: "HistoryTrack Timeline Cards", summary: "Timeline cards that make history sequences stick." },
    { name: "NoteCraft Digital Notebook", summary: "A digital notebook built for class notes and review." },
    { name: "CareerSwitch Resume Lab", summary: "A resume lab for people changing careers." },
    { name: "TeacherAid Lesson Templates", summary: "Lesson templates teachers can adapt in minutes." },
    { name: "MusicTheory Starter Pack", summary: "A music theory starter pack for absolute beginners." },
    { name: "DebateClub Argument Builder", summary: "An argument builder for debate clubs and critical thinking." },
    { name: "ScholarshipSearch Checklist", summary: "A scholarship search checklist with deadlines and docs." },
    { name: "CollegePrep Application Kit", summary: "An application kit covering essays, lists, and timelines." },
    { name: "Whiteboard Mini Learning Set", summary: "A mini whiteboard set for tutoring and home practice." },
    { name: "VocabBoost Word-of-Day App", summary: "A word-of-the-day app with short usage examples." },
    { name: "TutorMatch Session Scheduler", summary: "A scheduler that matches students with available tutors." },
  ],
  "Business & Entrepreneurship": [
    { name: "ProfitPath Side Hustle Course", summary: "A beginner course on launching a simple side income stream." },
    { name: "InvoicePro Freelancer Kit", summary: "Templates and trackers for freelancers who need cleaner billing." },
    { name: "UpsellLab Offer Builder", summary: "A worksheet pack for writing clearer offers and pricing." },
    { name: "PassiveStack Digital Product Kit", summary: "A kit for packaging and selling a first digital product." },
    { name: "ClientClose Sales Scripts", summary: "Simple sales scripts for service sellers on calls and DMs." },
    { name: "StoreCraft Dropshipping Guide", summary: "A practical guide to validating and launching a small store." },
    { name: "TaskFlow Project Manager", summary: "A lightweight project manager for freelancers and small teams." },
    { name: "GigBoost Profile Optimizer", summary: "A checklist for improving freelance platform profiles." },
    { name: "OpsLite SOP Template Pack", summary: "SOP templates so small teams stop reinventing processes." },
    { name: "PitchDeck Startup Outline", summary: "A pitch deck outline for early founders talking to partners." },
    { name: "CashRunway Burn Tracker", summary: "A burn-rate tracker for founders watching runway carefully." },
    { name: "HireSmart First Employee Guide", summary: "A guide for hiring your first contractor or employee." },
    { name: "BrandStory Positioning Kit", summary: "A positioning kit that clarifies who you serve and why." },
    { name: "LegalLite Contract Templates", summary: "Plain contract templates for freelancers and agencies." },
    { name: "MeetingNote AI Recorder", summary: "A meeting recorder that turns calls into clean action notes." },
    { name: "PricePower Packaging Worksheet", summary: "A packaging worksheet for tiers, bonuses, and margins." },
    { name: "CustomerLove Retention Playbook", summary: "A retention playbook for reducing churn after the first sale." },
    { name: "SupplierMap Sourcing Checklist", summary: "A sourcing checklist for product businesses and resellers." },
    { name: "DocSign E-Signature Pack", summary: "An e-signature pack for contracts and proposals." },
    { name: "ScheduleSync Calendar AI", summary: "A calendar assistant that finds open slots and reduces back-and-forth." },
    { name: "IncomeMap Goal Tracker", summary: "A visual income goal tracker for side projects and agencies." },
    { name: "LaunchWeek 7-Day Sprint", summary: "A 7-day launch sprint for shipping an offer without perfectionism." },
    { name: "SecureVault Password Manager", summary: "A password manager for founders tired of reused logins." },
  ],
  "Travel & Lifestyle": [
    { name: "TravelLite Packing Cubes", summary: "Packing cubes that keep luggage neat and lighter to pack." },
    { name: "GlobeReady Carry-On Organizer", summary: "A carry-on organizer for chargers, docs, and toiletries." },
    { name: "JetLag Reset Protocol", summary: "A jet-lag reset protocol for long-haul travelers." },
    { name: "CityWalk Noise Cancelling Buds", summary: "Noise-cancelling earbuds for flights, trains, and open offices." },
    { name: "TripBudget Daily Spend Tracker", summary: "A daily spend tracker that keeps vacations on budget." },
    { name: "WanderMap Offline Guides", summary: "Offline city guides for travelers who hate surprise roaming fees." },
    { name: "PowerBank Travel Charger", summary: "A high-capacity travel charger for phones and tablets." },
    { name: "CampLite Folding Chair", summary: "A folding chair for camping, sports, and backyard use." },
    { name: "StaySoft Travel Pillow Set", summary: "A compact travel pillow set for overnight flights and trains." },
    { name: "PhotoKeep Digital Frame", summary: "A digital frame that rotates travel and family photos automatically." },
    { name: "KitchenPro Meal Prep Set", summary: "A meal-prep set with containers, labels, and portion guides." },
    { name: "HomeSafe Entry Camera", summary: "A simple entry camera for front doors and packages while away." },
    { name: "GardenGrow Starter Planters", summary: "Starter planters for herbs and small balcony gardens." },
    { name: "UmbrellaPro Windproof Compact", summary: "A compact windproof umbrella that survives storms." },
    { name: "CoffeeBar Pour-Over Kit", summary: "A pour-over kit for better coffee at home or in Airbnbs." },
    { name: "BikeLane Portable Pump", summary: "A portable bike pump that fits in a backpack." },
    { name: "LaundryFresh Softener Sheets", summary: "Fragrance-light softener sheets for sensitive skin on the road." },
    { name: "EverydayEase Organizer Kit", summary: "A home organizer kit for closets, drawers, and entryways." },
    { name: "CarCare Interior Detail Kit", summary: "An interior detail kit for road trips and daily drives." },
    { name: "BlanketWarm Heated Throw", summary: "A heated throw for couches, cabins, and cold evenings." },
    { name: "KidCraft Activity Box", summary: "An activity box with screen-free projects for travel days." },
    { name: "OfficeFocus Desk Lamp", summary: "A desk lamp with warm and cool modes for remote work stays." },
    { name: "WallArt Modular Frames", summary: "Modular frames for building a clean gallery wall at home." },
  ],
};

export interface VaultCatalogEntry {
  id: number;
  niche: VaultNiche;
  productName: string;
  productSummary: string;
  colorTheme: MoneyPageColorThemeId;
  variationId: MoneyPageVariationId;
  heroImage?: string;
}

/** Build the 200 vault catalog entries deterministically (no AI). */
export function buildAcceleratorCatalog(): VaultCatalogEntry[] {
  const entries: VaultCatalogEntry[] = [];
  const themes = MONEY_PAGE_COLOR_THEMES.map((t) => t.id);
  const variations = MONEY_PAGE_VARIATIONS.map((v) => v.id);
  let id = 1;

  while (entries.length < ACCELERATOR_TARGET_COUNT) {
    for (const niche of VAULT_NICHES) {
      const products = PRODUCTS_BY_NICHE[niche];
      for (let i = 0; i < products.length; i++) {
        if (entries.length >= ACCELERATOR_TARGET_COUNT) break;
        const product = products[i];
        const colorTheme = themes[(id - 1) % themes.length];
        const variationId = variations[(id - 1) % variations.length];
        entries.push({
          id,
          niche,
          productName: product.name,
          productSummary: product.summary,
          colorTheme,
          variationId,
        });
        id++;
      }
    }
  }

  return entries.slice(0, ACCELERATOR_TARGET_COUNT);
}

export function acceleratorTemplateKey(catalogId: number): string {
  return `accelerator-${catalogId}`;
}

export function getAcceleratorCatalogEntry(id: number): VaultCatalogEntry | undefined {
  return buildAcceleratorCatalog().find((e) => e.id === id);
}

/** Display fields for Asset Vault gallery cards. */
export function getAcceleratorCardMeta(entry: VaultCatalogEntry): {
  accent: string;
  hook: string;
  toneLabel: string;
  themeLabel: string;
} {
  const theme = MONEY_PAGE_COLOR_THEMES.find((t) => t.id === entry.colorTheme);
  const variation = MONEY_PAGE_VARIATIONS.find((v) => v.id === entry.variationId);
  return {
    accent: theme?.swatch ?? "#14B8A6",
    hook: entry.productSummary.slice(0, 160),
    toneLabel: variation?.label ?? "Honest review",
    themeLabel: theme?.label ?? "Ocean",
  };
}

export const ACCELERATOR_NICHES = PREMIUM_NICHE_LABELS;
