import {
  MONEY_PAGE_COLOR_THEMES,
  type MoneyPageColorThemeId,
} from "@/features/money-page/lib/themes";
import {
  MONEY_PAGE_VARIATIONS,
  type MoneyPageVariationId,
} from "@/features/money-page/lib/variations";
import { productPhotoFallbackUrl } from "@/features/traffic/lib/pin-images";

export const ACCELERATOR_TARGET_COUNT = 200;

/** Niches aligned with `inferNiche()` in money-page. */
export const VAULT_NICHES = [
  "sleep",
  "boxing & combat sports",
  "health & fitness",
  "beauty",
  "make money",
  "software",
  "pets",
  "education",
  "general",
] as const;

export type VaultNiche = (typeof VAULT_NICHES)[number];

interface ProductArchetype {
  name: string;
  summary: string;
}

const PRODUCTS_BY_NICHE: Record<VaultNiche, ProductArchetype[]> = {
  sleep: [
    { name: "DeepRest Sleep Support", summary: "A nightly sleep formula made for people who struggle to wind down and stay asleep." },
    { name: "NightCalm Melatonin Blend", summary: "A gentle melatonin blend designed to help you fall asleep without next-day grogginess." },
    { name: "QuietMind Sleep Gummies", summary: "Sleep gummies built around calm, routine, and a simpler bedtime habit." },
    { name: "RestLab Cooling Pillow", summary: "A cooling pillow for hot sleepers who wake up tossing and turning." },
    { name: "Somnia White Noise Device", summary: "A compact white-noise device that makes bedrooms quieter and more consistent." },
    { name: "LunaShift Sleep Mask", summary: "A soft blackout sleep mask for light sleepers and frequent travelers." },
    { name: "DreamDepth Magnesium Drink", summary: "An evening magnesium drink mix for people who want a calmer wind-down ritual." },
    { name: "PillowCore Orthopedic Support", summary: "An orthopedic pillow shaped for neck support and side-sleepers." },
    { name: "SleepSignal Blue-Light Glasses", summary: "Evening blue-light glasses for screen users who stay up too late." },
    { name: "NiteHarbor Sleep Tracker Band", summary: "A simple sleep tracker band that shows sleep stages without complicated apps." },
    { name: "CalmHarbor Lavender Spray", summary: "A lavender pillow spray for a quick pre-bed scent cue." },
    { name: "SoftReset Weighted Blanket", summary: "A mid-weight blanket for people who sleep better with gentle pressure." },
    { name: "RestRoute Bedtime Journal", summary: "A guided bedtime journal that helps clear racing thoughts before sleep." },
    { name: "NightNest Earplugs Pack", summary: "Reusable earplugs for apartments, partners who snore, and noisy streets." },
    { name: "DawnSoft Sunrise Alarm", summary: "A sunrise alarm clock that wakes you with light instead of a harsh beep." },
    { name: "SleepForge Mattress Topper", summary: "A pressure-relief mattress topper for firm beds that feel too hard." },
    { name: "StillNight Herbal Tea Kit", summary: "A caffeine-free herbal tea kit built for a consistent evening cup." },
    { name: "RestPulse Breathing Guide App", summary: "A guided breathing app with short pre-sleep sessions." },
    { name: "CloudLayer Bamboo Sheets", summary: "Breathable bamboo sheets for people who sleep hot." },
    { name: "MidnightEase CBD Softgels", summary: "CBD softgels marketed for evening calm and sleep support." },
    { name: "HarborRest Contour Pillow", summary: "A contour pillow designed to keep your neck aligned overnight." },
    { name: "SleepLane Blackout Curtains", summary: "Room-darkening curtains for bedrooms that never get fully dark." },
    { name: "QuietHour Sleep Sound Machine", summary: "A bedside sound machine with simple presets and a timer." },
  ],
  "boxing & combat sports": [
    { name: "StrikePro Training Gloves", summary: "Training gloves built for bag work, mitt drills, and beginner sparring." },
    { name: "IronGuard Hand Wraps", summary: "Supportive hand wraps that protect wrists during heavy sessions." },
    { name: "RingReady Focus Mitts", summary: "Focus mitts for coaches and partners running pad rounds." },
    { name: "ThunderBag Heavy Bag", summary: "A durable heavy bag for home gyms and garage setups." },
    { name: "CombatCore Mouthguard", summary: "A boil-and-bite mouthguard for sparring and light competition." },
    { name: "SparShield Headgear", summary: "Protective headgear for controlled sparring sessions." },
    { name: "KickForge Shin Guards", summary: "Shin guards made for kickboxing and Muay Thai pad work." },
    { name: "PadMaster Thai Pads", summary: "Thai pads for power kicks and conditioning rounds." },
    { name: "CageFit Jump Rope", summary: "A speed jump rope for warm-ups and fight-camp conditioning." },
    { name: "GrappleGrip MMA Gloves", summary: "Open-finger MMA gloves for grappling-friendly striking drills." },
    { name: "CornerKit Fight Towel Set", summary: "A simple corner kit with towels and essentials for training camps." },
    { name: "VaultGuard Groin Protector", summary: "A secure groin protector for sparring days." },
    { name: "SpeedLine Double-End Bag", summary: "A double-end bag that sharpens timing and reaction speed." },
    { name: "MatReady Wrestling Shoes", summary: "Lightweight wrestling shoes with solid mat grip." },
    { name: "ImpactWall Punch Wall Pads", summary: "Wall-mounted punch pads for small training spaces." },
    { name: "FightFuel Electrolyte Mix", summary: "An electrolyte mix for long training sessions and weight cuts." },
    { name: "RingTape Athletic Tape Pack", summary: "Athletic tape for ankles, wrists, and fight-camp taping." },
    { name: "GuardLine Abdominal Protector", summary: "An abdominal protector for hard body-shot sparring." },
    { name: "BagStand Freestanding Bag", summary: "A freestanding bag that works when you cannot hang a heavy bag." },
    { name: "ClinchGrip Training Dummy", summary: "A grappling dummy for solo clinch and ground drills." },
    { name: "StrikeTimer Round Clock", summary: "A round timer with clear intervals for bag and sparring rounds." },
    { name: "WrapWash Glove Deodorizer", summary: "A deodorizer system that keeps gloves fresher between sessions." },
    { name: "PowerPad Ankle Supports", summary: "Ankle supports for fighters who roll ankles on pivots." },
  ],
  "health & fitness": [
    { name: "LiftLab Resistance Bands", summary: "A full resistance-band set for home workouts and warm-ups." },
    { name: "CoreForge Ab Wheel Pro", summary: "An ab wheel designed for controlled core progressions." },
    { name: "PulseFit Heart Rate Monitor", summary: "A heart-rate monitor strap for zone-based training." },
    { name: "HydraBoost Electrolyte Tablets", summary: "Electrolyte tablets for sweaty workouts and long runs." },
    { name: "FormCheck Yoga Mat Plus", summary: "A thicker yoga mat with better grip for hot sessions." },
    { name: "StrongSip Protein Isolate", summary: "A clean protein isolate for post-workout recovery." },
    { name: "MobilityPro Foam Roller", summary: "A firm foam roller for tight hips, quads, and back." },
    { name: "TrailRun Compression Socks", summary: "Compression socks for runners who want less post-run swelling." },
    { name: "HomeGym Adjustable Dumbbells", summary: "Space-saving adjustable dumbbells for apartment gyms." },
    { name: "FlexLane Stretch Strap", summary: "A stretch strap that makes hamstring and shoulder work easier." },
    { name: "BurnTrack Fitness Tracker", summary: "A fitness tracker focused on steps, workouts, and recovery." },
    { name: "KettleCore Cast Iron Bell", summary: "A cast-iron kettlebell for swings, cleans, and presses." },
    { name: "RecoverWell Collagen Peptides", summary: "Collagen peptides marketed for joints and recovery." },
    { name: "SteadyPace Running Belt", summary: "A slim running belt for phone, keys, and gels." },
    { name: "PostureAlign Shoulder Brace", summary: "A soft shoulder brace for desk workers and lifters." },
    { name: "GripMax Lifting Straps", summary: "Lifting straps for heavy pulls when grip gives out first." },
    { name: "BalanceBoard Stability Trainer", summary: "A balance board for ankles, core, and rehab work." },
    { name: "VitaDaily Multivitamin Pack", summary: "A daily multivitamin pack for active adults." },
    { name: "JumpStack Plyo Box Soft", summary: "A soft plyo box for safer jump training at home." },
    { name: "ColdPlunge Mini Tub", summary: "A compact cold plunge setup for recovery routines." },
    { name: "MealPrep Macro Containers", summary: "Portion-ready containers for weekly meal prep." },
    { name: "StretchFlow Mobility App", summary: "A mobility app with short daily routines." },
    { name: "PowerBand Hip Circle Set", summary: "Hip circles for glute activation and warm-ups." },
  ],
  beauty: [
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
  "make money": [
    { name: "ProfitPath Side Hustle Course", summary: "A beginner course on launching a simple side income stream." },
    { name: "CashFlow Budget Spreadsheet", summary: "A ready-made budget spreadsheet for tracking income and expenses." },
    { name: "AffiliateStart Launch Playbook", summary: "A playbook for beginners starting affiliate marketing the right way." },
    { name: "InvoicePro Freelancer Kit", summary: "Templates and trackers for freelancers who need cleaner billing." },
    { name: "StoreCraft Dropshipping Guide", summary: "A practical guide to validating and launching a small store." },
    { name: "LeadMagnet Email Pack", summary: "Ready email sequences for building a simple lead list." },
    { name: "DividendMap Investor Checklist", summary: "A checklist for beginners researching dividend stocks carefully." },
    { name: "CryptoSafe Starter Handbook", summary: "A cautious starter handbook for crypto wallets and basic security." },
    { name: "RentRoll Property Tracker", summary: "A tracker for small landlords watching rent and expenses." },
    { name: "UpsellLab Offer Builder", summary: "A worksheet pack for writing clearer offers and pricing." },
    { name: "PassiveStack Digital Product Kit", summary: "A kit for packaging and selling a first digital product." },
    { name: "ClientClose Sales Scripts", summary: "Simple sales scripts for service sellers on calls and DMs." },
    { name: "TaxReady Self-Employed Folder", summary: "A folder system and checklist for self-employed tax prep." },
    { name: "AdSpend ROI Calculator", summary: "A calculator that shows whether ad spend is actually profitable." },
    { name: "NicheFinder Research Pack", summary: "Research templates for picking a niche before you build." },
    { name: "WealthSync Bank Dashboard", summary: "A personal finance dashboard that connects goals to weekly actions." },
    { name: "GigBoost Profile Optimizer", summary: "A checklist for improving freelance platform profiles." },
    { name: "FunnelLite Landing Page Kit", summary: "A simple landing-page kit for one clear offer." },
    { name: "CouponStack Deal Alerts", summary: "A deal-alert system for shoppers who flip coupons into cashback." },
    { name: "BrokerBasics Trading Primer", summary: "A plain-English primer on brokerage accounts and order types." },
    { name: "SaveMore Challenge Planner", summary: "A 30-day savings challenge planner with weekly check-ins." },
    { name: "ResaleReady Flip Checklist", summary: "A resale checklist for thrift flips and marketplace listings." },
    { name: "IncomeMap Goal Tracker", summary: "A visual income goal tracker for side projects." },
  ],
  software: [
    { name: "TaskFlow Project Manager", summary: "A lightweight project manager for freelancers and small teams." },
    { name: "WriteSharp AI Editor", summary: "An AI writing editor that cleans drafts without sounding robotic." },
    { name: "InboxZero Email Sorter", summary: "An email sorter that prioritizes replies and archives the rest." },
    { name: "DesignStack Template Library", summary: "A template library for social graphics and simple brand kits." },
    { name: "SecureVault Password Manager", summary: "A password manager for people tired of reusing logins." },
    { name: "MeetNote AI Recorder", summary: "A meeting recorder that turns calls into clean action notes." },
    { name: "CodePilot Snippet Manager", summary: "A snippet manager for developers who reuse common blocks." },
    { name: "CRMLite Contact Hub", summary: "A simple CRM for solopreneurs tracking leads and follow-ups." },
    { name: "ScheduleSync Calendar AI", summary: "A calendar assistant that finds open slots and reduces back-and-forth." },
    { name: "FormCraft Survey Builder", summary: "A survey builder for feedback forms and lead capture." },
    { name: "CloudBackup Auto Shield", summary: "Automatic cloud backup for important work folders." },
    { name: "AnalyticsPulse Dashboard", summary: "A dashboard that explains traffic and conversions in plain language." },
    { name: "ChatDesk Support Widget", summary: "A support chat widget with canned replies for small sites." },
    { name: "InvoiceCloud Billing App", summary: "A billing app that sends invoices and tracks paid status." },
    { name: "SEOMap Keyword Planner", summary: "A keyword planner that keeps suggestions beginner-friendly." },
    { name: "VideoCut Shorts Editor", summary: "A shorts editor that crops long videos into vertical clips." },
    { name: "TranslateHub Browser Extension", summary: "A browser extension for quick page and document translation." },
    { name: "FocusMode Distraction Blocker", summary: "A distraction blocker for deep-work blocks on desktop." },
    { name: "APIForge No-Code Connector", summary: "A no-code connector for syncing tools without writing scripts." },
    { name: "DocSign E-Signature Pack", summary: "An e-signature pack for contracts and proposals." },
    { name: "ScreenGuide Walkthrough Tool", summary: "A walkthrough tool that records product tours for customers." },
    { name: "PromptBank AI Prompt Library", summary: "A prompt library organized by job and outcome." },
    { name: "UptimeWatch Site Monitor", summary: "A site monitor that alerts you when a page goes down." },
  ],
  pets: [
    { name: "PawPure Dental Chews", summary: "Dental chews made to support cleaner teeth between brushings." },
    { name: "FetchPro Interactive Toy", summary: "An interactive fetch toy for high-energy dogs." },
    { name: "CalmCat Pheromone Diffuser", summary: "A pheromone diffuser for anxious or territorial cats." },
    { name: "TrailPaw Dog Harness", summary: "A no-pull harness for daily walks and training." },
    { name: "PetNest Orthopedic Bed", summary: "An orthopedic pet bed for older dogs and joint comfort." },
    { name: "GroomSoft Deshedding Brush", summary: "A deshedding brush that cuts down on loose fur." },
    { name: "AquaFresh Pet Water Fountain", summary: "A filtered water fountain that encourages pets to drink more." },
    { name: "TreatTrain Clicker Kit", summary: "A clicker training kit with treats and a simple guide." },
    { name: "SafeYard GPS Tracker Tag", summary: "A lightweight GPS tag for pets that like to wander." },
    { name: "KittyClean Litter System", summary: "A low-tracking litter system for cleaner floors." },
    { name: "BarkQuiet Training Device", summary: "A gentle training aid for excessive barking patterns." },
    { name: "PupShield Flea Collar", summary: "A flea and tick collar for monthly outdoor protection." },
    { name: "FeatherPlay Cat Wand Set", summary: "A wand toy set that keeps indoor cats moving." },
    { name: "TravelPet Car Seat Cover", summary: "A car seat cover that protects upholstery on pet trips." },
    { name: "BowlBalance Slow Feeder", summary: "A slow feeder that reduces gulping and mess." },
    { name: "CoatGlow Omega Oil Drops", summary: "Omega oil drops for shinier coats and healthier skin." },
    { name: "PuppyPad Training Mats", summary: "Absorbent training mats for housetraining stages." },
    { name: "ZooCare First Aid Kit", summary: "A pet first-aid kit for cuts, scrapes, and travel." },
    { name: "NightGlow LED Collar", summary: "An LED collar for evening walks and visibility." },
    { name: "ScratchStop Furniture Guard", summary: "Furniture guards that redirect scratching without drama." },
    { name: "MealMix Pet Food Scale", summary: "A portion scale for accurate pet meal measurements." },
    { name: "WarmPaw Heated Pad", summary: "A heated pad for senior pets and cold floors." },
    { name: "ParkReady Waste Bag Dispenser", summary: "A leash-clip waste bag dispenser for daily walks." },
  ],
  education: [
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
  general: [
    { name: "EverydayEase Organizer Kit", summary: "A home organizer kit for closets, drawers, and entryways." },
    { name: "TravelLite Packing Cubes", summary: "Packing cubes that keep luggage neat and lighter to pack." },
    { name: "KitchenPro Meal Prep Set", summary: "A meal-prep set with containers, labels, and portion guides." },
    { name: "HomeSafe Entry Camera", summary: "A simple entry camera for front doors and packages." },
    { name: "CleanSweep Cordless Vacuum", summary: "A cordless vacuum for quick daily cleanups." },
    { name: "GardenGrow Starter Planters", summary: "Starter planters for herbs and small balcony gardens." },
    { name: "OfficeFocus Desk Lamp", summary: "A desk lamp with warm and cool modes for long work sessions." },
    { name: "CarCare Interior Detail Kit", summary: "An interior detail kit for dashboards and seats." },
    { name: "FamilyHub Chore Board", summary: "A chore board that makes household tasks visible." },
    { name: "QuietHour Noise Cancelling Buds", summary: "Noise-cancelling earbuds for travel and open offices." },
    { name: "PowerBank Travel Charger", summary: "A high-capacity travel charger for phones and tablets." },
    { name: "SmartLock Keyless Entry", summary: "A keyless entry lock for renters and homeowners." },
    { name: "BlanketWarm Heated Throw", summary: "A heated throw for couches and cold evenings." },
    { name: "PhotoKeep Digital Frame", summary: "A digital frame that rotates family photos automatically." },
    { name: "ToolBench Home Repair Kit", summary: "A compact repair kit for common household fixes." },
    { name: "WineKeep Vacuum Stopper Set", summary: "Vacuum stoppers that keep opened bottles fresher." },
    { name: "BikeLane Portable Pump", summary: "A portable bike pump that fits in a backpack." },
    { name: "CampLite Folding Chair", summary: "A folding chair for camping, sports, and backyard use." },
    { name: "LaundryFresh Softener Sheets", summary: "Fragrance-light softener sheets for sensitive skin." },
    { name: "WallArt Modular Frames", summary: "Modular frames for building a clean gallery wall." },
    { name: "CoffeeBar Pour-Over Kit", summary: "A pour-over kit for better coffee without a machine." },
    { name: "KidCraft Activity Box", summary: "An activity box with screen-free projects for kids." },
    { name: "UmbrellaPro Windproof Compact", summary: "A compact windproof umbrella that survives storms." },
  ],
};

export interface VaultCatalogEntry {
  id: number;
  niche: VaultNiche;
  productName: string;
  productSummary: string;
  colorTheme: MoneyPageColorThemeId;
  variationId: MoneyPageVariationId;
  heroImage: string;
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
        const heroImage =
          productPhotoFallbackUrl(product.name, id * 17 + niche.length) ||
          `https://loremflickr.com/1200/675/${encodeURIComponent(niche.split(" ")[0])}/all?lock=${id}`;

        entries.push({
          id,
          niche,
          productName: product.name,
          productSummary: product.summary,
          colorTheme,
          variationId,
          heroImage,
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

export const ACCELERATOR_NICHES = [...VAULT_NICHES];
