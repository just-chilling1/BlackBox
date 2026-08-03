# BlackBox Cash — Phase 1 Setup

Product slug: `blackbox-cash`  
Repo mined: `/Volumes/Transcend/Local Disk/Andrew/blackboxcash` (branch `main`, ff-only pull clean as of 2026-08-01)  
Live audit: localhost:3000 with `DEV_BYPASS_AUTH=true` — 9/11 routes pass on first viewport; dashboard CTA and promote generate button require scroll or live offer (expected).

---

## 1.1 Product Fact Sheet

| Field | Value |
|---|---|
| **Product name + promise** | **BlackBox Cash** — "Affiliate Sales & Promotions." Generate sales offers, promotion threads, and affiliate assets in one workspace. |
| **Price paid** | Not stored in repo — buyer paid whatever the live checkout charged at purchase. Scripts refer to "what you invested" without inventing a dollar figure. |
| **Dream customer** | Beginner-to-intermediate side-hustler who wants online income via affiliate marketing — has or can get a Digistore24 affiliate link, limited tech/time, motivated by dashboard copy ($1k–$5k/day scale language). |
| **Point A** | Watching make-money content, maybe bought courses before, never built a repeatable promotion system; overwhelmed by "create a funnel, write posts, build a site." |
| **Point B** | Hosted questionnaire site live, affiliate link embedded, X story thread and Facebook post variants ready to copy-paste, libraries storing links and offers for reuse — promoting without rebuilding from scratch each time. |
| **Vehicle** | Affiliate marketing: promote other people's products (Digistore24 marketplace) and earn commission on sales through your unique link. |
| **Mechanism** | BlackBox Cash AI-builds niche questionnaire sales sites, arms them with the user's affiliate URL, generates X threads and bulk social posts, and stores everything in Links Library and Offers Library. Premium modules add 200 cloned templates, 100 authority articles, 10X Facebook variants, and security/trust UI. |
| **Unfair advantage** | Collapses days of copywriting, page building, and thread drafting into guided steps + one-click generation — user only supplies the affiliate link and picks niche/template. |
| **Core loop** | Paste affiliate link → pick niche → choose template → launch questionnaire site → offer lands in Offers Library → generate X-Power Promotions thread → (optional) Social Payouts / Accelerator / Recurring Stream for scale → reuse Links Library for next offer. |
| **First win (in-app, Disconnect close)** | Complete Sales Offer Generator Step 1: paste a valid affiliate URL and click **Save to Links Library** — link appears armed for the wizard. Stronger win: finish Step 4 **Launch My Questionnaire Site** and see the live offer in **Offers Library**. |
| **Proof inventory** | No verified member testimonials in repo. FAQ and product copy only. Scripts use founder-voice proof, not invented user results. |
| **Guarantee** | **30-Day Guarantee** — full refund within 30 days, no questions asked (support.config.ts). Processing 5–7 business days. |
| **Effort truth** | User must obtain affiliate links, choose niches, launch offers, and manually post/copy promotion content to X and Facebook. First deploy takes several minutes of AI generation; promotion is ongoing. |

---

## 1.2 Branding map

| Old / internal / stale | Current user-facing name |
|---|---|
| Site Builder (breadcrumb) | **Sales Offer Generator** (sidebar) |
| Training (page title in training.config) | **Academy** (sidebar nav) |
| Recurring Wealth Stream (FAQ wording) | **Recurring Stream** (sidebar) |
| Wealth Protector (Protector page card title) | **Protector** (sidebar / page title) |
| blog-builder / article-publish (code ids) | Never spoken — use feature names above |
| core-workflow steps (Search, Radar, etc.) | **Not enabled** in this build — do not reference |
| "Multiply Your Results" (disabled global-top promo) | Use live **EarningsBanner** / **DashboardBonusAdCard** copy instead |

---

## 1.3 UI inventory (exact labels)

### Sidebar / nav (enabled features only)
- **Dashboard**
- **Sales Offer Generator**
- Generate section label: **Generate**
  - **X-Power Promotions**
- Libraries section label: **Libraries**
  - **Links Library**
  - **Offers Library**
- **Academy**
- Premium section label: **Premium Features**
  - **Accelerator**
  - **Recurring Stream**
  - **Social Payouts**
  - **Protector**
- **Support**
- Exclusive Offers block: **enabled** — Earn $400/Day Testing New Apps, Get Paid To Copy & Paste, **Fast Cash Training** (links to externalTrainingUrl)

### Dashboard (Home)
- Eyebrow: **Home**
- Title pattern: **Welcome to BlackBox Cash**, {firstName}
- Subtitle (blog-builder enabled): watch three videos, then **Sales Offer Generator**; **Academy** for deeper walkthrough.
- Section: **Start Here**
- Videos (in order):
  1. **Watch This First**
  2. **How The Money Flows**
  3. **Your 5-Minute Tour**
- Between videos 1–2 and 2–3: **DashboardBonusAdCard** (free-training upsell)
- CTAs below video track:
  - **Get Started Now with Sales Offer Generator**
  - **Know More from the Academy**
- Sidebar widgets: **Contact Support**, tips, **Premium Features**

### Sales Offer Generator wizard
| Step | Eyebrow | Title | Key buttons |
|---|---|---|---|
| 1 | Step 1 / Sales Offer Generator | **Add Your Link** | **Save to Links Library**, continue |
| 2 | Step 2 | **Pick Your Niche** | niche grid, continue |
| 3 | Step 3 | **Choose a Template** | template/theme pickers |
| 4 | Step 4 | **Launch Your Offer** / **Launch Your Questionnaire Site** | **Launch My Questionnaire Site**, **Try Deploy Again**, **Continue Deployment** |

Nine niches: Health & Wellness, Finance & Investing, Fitness & Sports, Digital Marketing, Self-Help & Personal Development, Beauty & Skincare, Education & Learning, Business & Entrepreneurship, Travel & Lifestyle.

### X-Power Promotions
- Eyebrow: **X-Power Promotions**
- Title: **Generate X story thread**
- **Select offer**, **Generate story thread** (10-post thread)
- Empty state: **Start Sales Offer Generator**

### Libraries
- **Links Library** — stored affiliate URLs
- **Offers Library** — generated sales pages; open offer, threads, promote

### Academy
- Eyebrow: **Academy**
- Page title: **Training** (header — nav still says Academy)
- Subtitle: Video tutorials and frequently asked questions
- Sections: **Platform Tutorials**, **Premium Feature Tutorials**

### Premium pages
| Route | Title | Subtitle (key phrase) |
|---|---|---|
| /accelerator | **Accelerator** | 200 pre-made sales pages + story threads |
| /recurring-wealth | **Recurring Stream** | 100 long-form authority articles |
| /social-payouts | **Social Payouts** | 10X bulk social posts |
| /protector | **Protector** | account security overview |

### Support
- **Contact Support**, **Send message**
- Success upsell: **Watch The Free Training >>**

### Loading / generation states (EarningsBanner surfaces)

| Location | Trigger | Progress copy (examples) |
|---|---|---|
| Sales Offer Generator Step 4 | Deploy | Phases: **Setup** / **Build** / **Launch** — "Writing quiz questions and building pages…", "Publishing your site to the web…" + prominent **EarningsBanner** |
| X-Power Promotions | Thread generation | **GenerationProgress** label + prominent **EarningsBanner** |
| Accelerator | Clone template | **GenerationProgress** + banner |
| Social Payouts | Bulk generate | **GenerationProgress** + banner |
| Recurring Stream | Save/preview actions | Loader states |

---

## 1.4 Free training — every offer surface

| Surface | Verbatim copy (headline / CTA) | Destination | Where it appears |
|---|---|---|---|
| **DashboardBonusAdCard** | Badge: **Free member training**. Body mentions "$1,000, $3,000, or even $5,000" and "wake up to an extra $1,000–$5,000 every single day." Highlight: "Ready to break free from financial stress…" CTA: **Yes! Show Me How To Earn $1,000–$5,000 A Day**. Urgency: **Limited access — register while it's still available** | `trainingContent.externalTrainingUrl` (currently `https://example.com/training` — replace before launch) | Dashboard **between** dashboard videos 1–2 and 2–3 |
| **EarningsBanner** (prominent) | Badge: **Free Training**. Headline: "Wake Up With An Extra **$1,000–$5,000** In Your Bank Account Tomorrow". Sub: "scale to $1,000–$5,000 every single day — without doing any extra work." CTA: **Watch The Free Training >>**. Warning: **Warning: This Will Be Taken Down Soon** | Same `externalTrainingUrl` | AI generation loaders (DeploySiteLoader, GenerationProgress) |
| **EarningsBanner** (compact) | "Multiply Your Earnings To **$1,000 – $5,000** A Day". CTA: **Click Here To Learn How** | Same URL | Compact banner variant |
| **Contact Support success** | "free training" / "$1,000–$5,000" / "scale to $1k–$5k per day". CTA: **Watch The Free Training >>**. Warning: "This may be taken down soon" | Same URL | After successful support message |
| **Exclusive Offers** (sidebar) | **Fast Cash Training** — Claim Now | Same URL | Sidebar + mobile More sheet |

**One-line spoken pitch (current banner language):**  
"Register for the free training on scaling to one thousand — even five thousand dollars a day while your offer is building — spots are limited and the page comes down soon."

**Video 01 CTA placement:** Member finishes **Watch This First**, scrolls to the **bonus card directly below** (before **How The Money Flows**), clicks **Yes! Show Me How To Earn $1,000–$5,000 A Day**.

---

## 1.5 Free-training mention map

| Video | File | Moment | Target |
|---|---|---|---|
| 01 Buyer's Remorse | 01-buyers-remorse.md | Beat 10 micro-action | Dashboard bonus card after video 1 |
| 02 Disconnect | 02-disconnect.md | Software / generation beat | EarningsBanner during AI build |
| 03 Quick Overview | 03-quick-overview.md | Close | Brief pointer to dashboard bonus card |
| 04 Sales Offer Generator | 04-sales-offer-generator.md | Step 4 deploy loading | EarningsBanner prominent |
| 05 X-Power Promotions | 05-x-power-promotions.md | Thread generation | GenerationProgress + banner |
| 06 Libraries | 06-links-offers-library.md | After first offer saved | Pause before next action — dashboard training path |
| 07 Accelerator | 07-accelerator.md | Clone generating | GenerationProgress |
| 08 Recurring Stream | 08-recurring-stream.md | Article save/generate wait | Loading pause |
| 09 Social Payouts | 09-social-payouts.md | Bulk generate | GenerationProgress |
| 10 Protector | 10-protector.md | Post–security overview pause | Dashboard bonus / free training as scale step |

---

## 1.6 Video roster

| # | Track | File | Public title | Feature(s) | Target length |
|---|---|---|---|---|---|
| 1 | Dashboard | 01-buyers-remorse.md | Watch This First | — | 10+ min (≥1,600 words) |
| 2 | Dashboard | 02-disconnect.md | How The Money Flows | — | 10+ min (≥1,600 words) |
| 3 | Dashboard | 03-quick-overview.md | Your 5-Minute Tour | whole app | 3–5 min |
| 4 | Academy | 04-sales-offer-generator.md | Sales Offer Generator | blog-builder wizard | 5+ min (≥900 words) |
| 5 | Academy | 05-x-power-promotions.md | X-Power Promotions | article-publish / promote | 5+ min |
| 6 | Academy | 06-links-offers-library.md | Links & Offers Library | vault | 5+ min |
| 7 | Academy | 07-accelerator.md | Accelerator | premium-accelerator | 5+ min |
| 8 | Academy | 08-recurring-stream.md | Recurring Stream | premium-recurring | 5+ min |
| 9 | Academy | 09-social-payouts.md | Social Payouts | premium-social | 5+ min |
| 10 | Academy | 10-protector.md | Protector | protector | 5+ min |

**Consumption order:** Dashboard 1 → 2 → 3 → Academy 4 → 5 → 6 → premium 7–10 in any order after first live offer.

---

## Jargon Ledger (top 10 — for Disconnect Beat 5)

| Term | Plain definition | Analogy | Why you care |
|---|---|---|---|
| **Affiliate link** | Your personal tracking URL for a product you promote. | A cashier code on your referral card. | You only get paid when sales use YOUR link. |
| **Commission** | Money the vendor pays you per sale. | Waiter's tip — percentage of the bill. | This IS your income from each conversion. |
| **Niche** | The topic audience you speak to. | One aisle in a supermarket you specialize in. | Better match = more clicks and sales. |
| **Digistore24** | Marketplace where vendors list products and affiliates grab links. | A mall directory with pay-per-sale stores. | Where most users source links in Step 1 instructions. |
| **Questionnaire site** | Interactive quiz funnel that ends on your offer. | A short magazine quiz that recommends one product. | BlackBox Cash builds this in Step 4. |
| **Offer** | Your hosted sales/quiz page plus its settings. | A storefront you can send traffic to. | Lives in Offers Library after launch. |
| **X story thread** | Chain of connected posts on X telling one story. | Ten billboard panels along one road. | Drives traffic from social to your offer URL. |
| **Conversion** | When a visitor buys through your funnel. | Someone paying at the register. | Commissions only happen after conversion. |
| **Links Library** | Saved affiliate URLs for reuse. | Contact list for your money links. | Stop re-pasting the same URL every time. |
| **Offers Library** | Vault of every site you launched. | Filing cabinet of live storefronts. | Hub for promote, threads, and premium tools. |

---

## Money Map

1. Vendors list digital products on **Digistore24** (or similar) with public affiliate programs.
2. Buyer discovers product through YOUR content (quiz site, X thread, Facebook post) and clicks **your affiliate link**.
3. Platform tracks the click, checkout, and holds the sale.
4. Vendor delivers product; platform pays you **commission** (typical range varies by offer — often 50–75% on digital goods; confirm per product).
5. **Weakest link for beginners:** building credible pages + promotion copy fast enough to test traffic — BlackBox Cash automates page build, quiz copy, X threads, and bulk social variants.
6. **Timeline:** first live offer in one session if user already has a link; income depends on traffic and offer — not guaranteed by software alone.

---

## First Win (Disconnect Beat 10)

**Action:** Open **Sales Offer Generator**, paste affiliate URL, click **Save to Links Library**, confirm link shows armed — then continue to **Launch My Questionnaire Site** when ready.

**Buyer's Remorse Beat 10 (override):** Free training CTA on dashboard bonus card — not the in-app wizard.

---

## Owner inputs before audio production

1. Replace `trainingContent.externalTrainingUrl` with live webinar/registration URL.
2. Add Vimeo IDs to `dashboard.config.ts` / `training.config.ts` videos.
3. Confirm checkout price and any sales-page proof for script updates.
