# BlackBox Cash — Phase 1 Setup

**Repo:** `c:\Users\user\Desktop\blackboxcash`  
**Branch:** `main` @ `957062c` (ff-only pull: already up to date)  
**Framework:** Next.js (App Router) + Supabase auth  
**Auth bypass:** `DEV_BYPASS_AUTH=true` in `.env.local` (middleware skips auth + onboarding). *No `.env.local` present at Phase 1 start — live audit blocked until env is configured.*  
**Funnel HTML:** none provided — money claims mined from in-app banners / dashboard bonus ad / support refund policy.

---

## 1.1 Product Fact Sheet

| Field | Value |
|---|---|
| **Product name** | BlackBox Cash |
| **Tagline** | Affiliate Sales & Promotions |
| **Promise** | Build sales offers (niche questionnaire sites), publish promotions (X threads / social posts), and manage affiliate assets so visitors take a quiz → hit your affiliate offer → you earn commission. |
| **Price** | Not in repo (no funnel HTML). Do not invent. |
| **Dream customer** | Beginner affiliate marketer who wants Digistore24 (or similar) commissions without writing sales pages or promotion threads by hand. |
| **Point A → Point B** | A: “I have (or can get) an affiliate link but no page and no content.” → B: live questionnaire offer + promotion threads/posts sending traffic, with libraries keeping links/offers organized. |
| **Vehicle** | Affiliate marketing via hosted questionnaire sales pages + social promotion (X / Facebook) + traffic sources. |
| **Mechanism** | AI builds niche quiz sites with your link on the final page; AI builds 10-post X story threads and FB post variants; premium tools clone pre-made pages/articles or give traffic checklists. |
| **Unfair advantage** | One-click launch of questionnaire sites + ready-to-copy promotion kits tied to Offers Library — weakest link (writing + design + packaging) automated. |
| **Core loop** | Save affiliate link → Sales Offer Generator (4 steps) → live offer → promote (X-Power / Instant Income / Unlimited / etc.) → visitor quiz → affiliate click → commission. |
| **First win** | Launch one live questionnaire site via Sales Offer Generator (`Launch My Questionnaire Site`) and confirm the offer page opens your affiliate link. |
| **Proof** | No member testimonials in repo. Use founder/system framing only; do not invent results. |
| **Guarantee** | 30-Day Guarantee (Support refund policy): full refund within 30 days, no questions asked. |
| **Effort truth** | Member still pastes links, launches, copies posts, and publishes by hand on their own accounts. First quiet week while traffic builds is normal. |

---

## 1.2 Branding map (old / internal → current UI)

| Old / internal / route-only | Current user-facing name |
|---|---|
| blog-builder / site builder | Sales Offer Generator |
| Link Vault / `/link-vault` | Links Library |
| Offer Vault | Offers Library |
| Promote / Publish Kit | X-Power Promotions |
| Charge HQ / Home (eyebrow only) | Dashboard (nav) / Home (page eyebrow) |
| Training (nav was sometimes Training) | Academy (nav) · page title still **Training** |
| premium-accelerator | Unlimited |
| premium-recurring | Guaranteed High-Ticket Payouts |
| premium-social / premium-10x | Instant Income |
| premium-dfy-profit | Done-For-You Profit |
| premium-autopilot | Automated Profits |
| protector | Cyber Protection |
| premium-license-rights | Reseller & License Rights (nav) · page title **Full Turnkey Reseller & License Rights Edition** |
| Instant Income (video title “Automated Income”) | Page title **Automated Profits**; video title on page: “How to Use Automated Income” |

Scripts use ONLY the current user-facing column.

---

## 1.3 UI inventory (exact labels)

### Sidebar (top → bottom)
- Dashboard
- **Generate:** Sales Offer Generator · X-Power Promotions
- **Libraries:** Links Library · Offers Library
- Academy
- **Premium Features:** Done-For-You Profit · Automated Profits · Unlimited · Guaranteed High-Ticket Payouts · Instant Income · Cyber Protection · Reseller & License Rights
- **Exclusive Offers:** Earn $400/Day Testing New Apps · Get Paid To Copy & Paste · Fast Cash Training
- Support

### Dashboard (Home)
- Eyebrow: Home · Title: Welcome to BlackBox Cash
- Subtitle: Watch the three videos below in order — then jump into the Sales Offer Generator and start building. The Academy is there whenever you want a deeper walkthrough.
- **Start Here** — 3 videos interleaved with bonus ads:
  1. Watch This First
  2. *(bonus ad)*
  3. How The Money Flows
  4. *(bonus ad)*
  5. Your 5-Minute Tour
- CTAs: Get Started Now with Sales Offer Generator · Know More from the Academy
- Right rail: Contact Support · Tip · Premium Features (“Unlock the tools that drive the biggest results.”)

### Core pages — key buttons
| Page | Key CTAs |
|---|---|
| Sales Offer Generator | Save to Links Library · Continue to Niche · Continue to Template · Continue with {Template} · Launch My Questionnaire Site · Try Deploy Again · Check questionnaire page · Check offer page · Generate Another Site · View offers library |
| X-Power Promotions | Generate story thread / Generate new story thread · Copy all · Copy post · Suggest for X |
| Links Library | Create New Link · Create Link · Edit · Delete Link |
| Offers Library | View offer · Copy URL · Start Sales Offer Generator |

### Niches (9, shared)
Health & Wellness · Finance & Investing · Fitness & Sports · Digital Marketing · Self-Help & Personal Development · Beauty & Skincare · Education & Learning · Business & Entrepreneurship · Travel & Lifestyle

### Templates (SOG)
Editorial Sage · Conversion Pro · Minimal Clarity

### Academy platform tutorials (Training page)
1. Sales Offer Generator  
2. X-Power Promotions  
3. Links & Offers Library  

Premium Feature Tutorials listed on page: Unlimited · Guaranteed High-Ticket Payouts · Instant Income · Cyber Protection  
*(DFY Profit, Automated Profits, Reseller still need Academy slots in config — scripts still required per upgrade.)*

---

## 1.4 Free-training offer surfaces

| # | Component | Verbatim copy (key) | Destination | Where |
|---|---|---|---|---|
| A | DashboardBonusAdCard | Badge **Free member training** · CTA **Yes! Show Me How To Earn $1,000–$5,000 A Day** · urgency **Limited access — register while it's still available** | `https://perpetualincome365.convertri.com/7figure-everwebinar-registration#aff=DigitalAvalon&cam=membersarea` | Home, between videos (×2) |
| B | EarningsBanner prominent (GenerationTrainingAd) | Badge **Free Training** · headline **Wake Up With An Extra $1,000–$5,000 In Your Bank Account Tomorrow** · CTA **Watch The Free Training >>** · **Warning: This Will Be Taken Down Soon** | same perpetualincome URL | Under progress during SOG deploy, X-Power generate, Unlimited clone, Instant Income generate, DFY Profit generate, Recurring preview/save |
| C | EarningsBanner compact | **Multiply Your Earnings To $1,000 – $5,000 A Day** · **Click Here To Learn How** | same | non-prominent uses |
| D | Exclusive Offers → Fast Cash Training | title **Fast Cash Training** · subtitle Claim Now | Explodely URL (different offer — do NOT treat as same webinar as A/B) | Sidebar Exclusive Offers |
| E | Contact Support success | free training upsell + **Watch The Free Training >>** | perpetualincome | After support send |
| F | Video overlay withdraw ad | Account Verified / Withdraw Now | perpetualincome | After video play |

**Spoken pitch (match CURRENT banner language):** scale / wake up to one thousand — even five thousand dollars a day.  
**Scarcity:** “Warning: This Will Be Taken Down Soon” / “Limited access — register while it's still available”.  
**Video 01 CTA path:** scroll the Home **Start Here** column to the gold **Free member training** card → click **Yes! Show Me How To Earn $1,000–$5,000 A Day**. Do NOT say “banner below this video” as if it were unique under video 1 only — ads sit between the three videos. Do NOT invent a yellow “Step 2: Bonus training” button (not in this build).

---

## 1.5 Free-training mention map

Mindset videos, libraries, Automated Profits, Instant Income best-practices, Cyber Protection, and Reseller: **NONE** (no generation wait).

| Video | Moment | Notes |
|---|---|---|
| 01 Buyer's Remorse | Dashboard gold Free member training card | Track A mapped CTA |
| 02 Disconnect | Weave once when describing SOG build / progress banner | Fluid notice of Free Training banner |
| 03 Quick Overview | Once — gold Free member training card on Home | Max one |
| 04 SOG mindset | **NONE** | Belief / effort only |
| 05 Sales Offer Generator | During Launch / Setup·Build·Launch wait | Banner under progress |
| 06–09 X-Power / Libraries (mindset + libraries how-to) | **NONE** except 07 | 07: Generate story thread wait |
| 10 DFY mindset | **NONE** | |
| 11 Done-For-You Profit | During Generate kit wait | Yes |
| 12–14 Automated Profits (all three) | **NONE** | Checklist only |
| 15 Unlimited mindset | **NONE** | |
| 16 Unlimited | During clone wait | Yes |
| 17 High-Ticket mindset | **NONE** | |
| 18 Guaranteed High-Ticket Payouts | During preview/save wait | Yes |
| 19 Instant Income mindset | **NONE** | |
| 20 Instant Income best practices | **NONE** | Static cards |
| 21 Instant Income how-to | During Generate posts wait | Yes |
| 22–25 Cyber / Reseller | **NONE** | Static / form. **25 is the final Academy video** |

---

## 1.6 Video roster (Academy: mindset → how-to per tool)

**Consumption order:** Dashboard 01→02→03, then Academy in file order. Each tool starts with a **mindset** video (why it matters, mental blocks, honest effort) then the how-to / examples.

| # | Track | File | Feature(s) | Target | Ad? |
|---|---|---|---|---|---|
| 1 | Dashboard | `01-buyers-remorse.md` | — | 10+ min / ≥1600w | Home gold card |
| 2 | Dashboard | `02-disconnect.md` | — | 10+ min / ≥1600w | Once (SOG wait frame) |
| 3 | Dashboard | `03-quick-overview.md` | whole app shallow | 3–5 min | Once max |
| 4 | Academy | `04-sog-mindset.md` | Sales Offer Generator mindset | ≥900w | **No** |
| 5 | Academy | `05-sales-offer-generator.md` | SOG how-to + example | ≥900w | Yes |
| 6 | Academy | `06-x-power-mindset.md` | X-Power mindset | ≥900w | **No** |
| 7 | Academy | `07-x-power-promotions.md` | X-Power how-to + example | ≥900w | Yes |
| 8 | Academy | `08-libraries-mindset.md` | Libraries mindset | ≥900w | **No** |
| 9 | Academy | `09-links-offers-library.md` | Links + Offers how-to | ≥900w | **No** |
| 10 | Academy | `10-dfy-mindset.md` | DFY Profit mindset (1st premium) | ≥900w | **No** |
| 11 | Academy | `11-done-for-you-profit.md` | DFY how-to + example | ≥900w | Yes |
| 12 | Academy | `12-automated-profits-mindset.md` | Autopilot mindset (2nd premium) | ≥900w | **No** |
| 13 | Academy | `13-automated-profits.md` | How it works + quick example | ≥900w | **No** |
| 14 | Academy | `14-automated-profits-examples.md` | 3 different examples | ≥900w | **No** |
| 15 | Academy | `15-unlimited-mindset.md` | Unlimited mindset (3rd premium) | ≥900w | **No** |
| 16 | Academy | `16-unlimited.md` | Unlimited how-to + example | ≥900w | Yes |
| 17 | Academy | `17-high-ticket-mindset.md` | High-Ticket mindset (4th premium) | ≥900w | **No** |
| 18 | Academy | `18-guaranteed-high-ticket-payouts.md` | How-to + example | ≥900w | Yes |
| 19 | Academy | `19-instant-income-mindset.md` | Instant Income mindset (5th) | ≥900w | **No** |
| 20 | Academy | `20-instant-income-best-practices.md` | Facebook posting best practices | ≥900w | **No** |
| 21 | Academy | `21-instant-income.md` | How-to + example | ≥900w | Yes |
| 22 | Academy | `22-cyber-protection-mindset.md` | Cyber mindset (6th premium) | ≥900w | **No** |
| 23 | Academy | `23-cyber-protection.md` | How to read the page | ≥900w | **No** |
| 24 | Academy | `24-reseller-mindset.md` | Reseller mindset (7th premium) | ≥900w | **No** |
| 25 | Academy | `25-reseller-license-rights.md` | How-to (final Academy) | ≥900w | **No** |

---

## 1.7 Jargon Ledger (top terms for Disconnect)

| Term | Plain def (≤15w) | Analogy | Why you care |
|---|---|---|---|
| Affiliate link | Your unique URL that credits you when someone buys. | Your cashier barcode on a product. | No link = no commission credit. |
| Digistore24 | Popular marketplace where you get affiliate links for products. | A big mall of digital products. | Easiest starter source for a real link. |
| Niche | The topic aisle your quiz and posts stay inside. | A grocery aisle, not the whole store. | Match niche to product or the quiz feels random. |
| Questionnaire / quiz site | Short quiz page that ends by recommending your offer. | A fitting-room attendant asking questions then handing you a jacket. | This is the sales page BlackBox Cash builds. |
| Sales Offer Generator | Four-step wizard that launches that quiz site with your link. | Instant storefront builder. | Core first win. |
| Offers Library | Folder of every live offer you launched. | Filing cabinet for storefronts. | Threads, posts, articles attach here. |
| Links Library | Saved affiliate URLs with names. | Password manager, but for money links. | Paste once, reuse everywhere. |
| X story thread | Ten connected posts that tell one product story. | A comic strip ending in one ask. | Top-of-funnel traffic engine. |
| Commission | Your cut when a referred buyer purchases. | Tip jar that opens when they pay. | How you get paid. |
| Premium Features | Paid upgrades under that sidebar section. | Power tools in the garage. | Speed and volume after first offer. |

---

## 1.8 Money Map

1. Vendor sells a product (often Digistore24).  
2. You get an **affiliate link**.  
3. You launch a **questionnaire site** (Sales Offer Generator) with that link on the final page.  
4. You send people to the site via **X threads**, Facebook posts, traffic sources, etc.  
5. Visitor completes the quiz → sees the offer → clicks → buys.  
6. Platform pays you a **commission**.

**Weakest link (what beginners quit on):** writing the sales page + writing promotion posts.  
**What BlackBox Cash changes:** automates page + thread/post kits; libraries keep assets reusable.

**Honest math frame (no invented earnings):** one sale → vendor pays affiliate commission % (product-dependent) → you keep that cut. Scale = more visitors through more offers/posts. Banner numbers ($1,000–$5,000/day) may be spoken only as the **on-screen free-training pitch**, not as a typical member result.

---

## 1.9 Loading states (free-training eligible)

| Surface | Wait UI | Banner? |
|---|---|---|
| SOG Step 4 deploy | Setup / Build / Launch | Yes |
| X-Power generate | Generating 10-post thread + 3 niche images… | Yes |
| Unlimited clone | Cloning pre-made sales page… | Yes |
| Instant Income | Generating 10 scroll-stopping Facebook post variants… | Yes |
| DFY Profit | Building sales page → X thread → article → FB posts | Yes |
| Guaranteed High-Ticket | Loading/saving article preview | Yes |
| Libraries / Autopilot / Protector / License | — | No |

### On-screen numbers that scripts must honor
- X-Power: **5** generations/day · **10**-post thread · images on posts **1, 4, 7**
- Instant Income best practices: **70/30** rule · **1–2 weeks** · space posts **1–2 minutes** · under **25–50 groups/day** · Tue–Thu **8–10 AM** / lunch **12–1 PM**
- Unlimited: **200** templates · **10**-post threads
- Guaranteed High-Ticket: **100** articles · **1,000+** words · Cross-platform: **3–5** tags · **2–3** Quora answers · **one article per week**
- Automated Profits: **180** sources · **20** per niche · **9** niches
- Site quota: currently **unlimited** (do not invent daily site caps)
- Support: ~**2 hours**, allow **24–48** on busy days
- Cyber Protection: Security Score **100%** · Encryption **AES-256** · Uptime **99.9%**

---

## Live audit status

- [x] Dev server + `DEV_BYPASS_AUTH` (temp for audit; removed after)
- [x] Playwright pass on every sidebar route (labels + Home video order + bonus ads ×2)
- [x] Geometry fix applied: Dashboard **Premium Features** quick-links sit on the **right** rail (under Contact Support / Tip), not the left — scripts 07–10 corrected
- [x] Empty states verified: `/promote` → `No offers to promote yet`; `/social-payouts` → `No offers yet` (Select offer / Generate posts appear only after an offer exists — scripts already cover this)
- [x] Instant Income best-practice numbers live: 70/30, 25–50 groups, Tue–Thu windows
- [x] Audit script deleted; no code patches used

**Audit date:** 2026-08-18 · Base `http://localhost:3000`
