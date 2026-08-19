# PRE-TRAINING VIDEO SCRIPT GUIDE
## The Buyer's Remorse Video + The Disconnect Video

**Purpose:** This is the complete operating manual for writing the two videos that every software product ships with, placed between purchase and the training content. It is written for an AI scriptwriter (Claude operating in Cursor) that has full access to the product's repository, docs, and marketing materials, but does NOT have this research in its head. Everything you need is in this document.

**The two deliverables this guide produces:**
1. **The Buyer's Remorse Video** — plays immediately after purchase, before anything else. Its job is emotional: kill regret, re-sell the decision, and get the buyer to take one tiny action.
2. **The Disconnect Video** — plays after the Buyer's Remorse video and before the training. Its job is cognitive: close the gap between what the buyer bought (a promise, often bought "blind") and what they now own (a mechanism they don't yet understand), including every piece of jargon the software and training will use.

**Hard requirement for every script:** minimum 10 minutes of voiceover. At a conversational narration pace of 140–150 words per minute, that means **an absolute floor of 1,600 words, with a target zone of 1,700–2,000 words**. The math and pacing rules are in Part 6.

---

# PART 0 — OPERATING INSTRUCTIONS FOR THE AI SCRIPTWRITER

Read this part before doing anything. This is your process. Do not skip steps and do not reorder them.

## 0.1 The workflow, locked

1. **Mine the repo first.** Complete the full Repo Mining Protocol in Part 3 and produce the four artifacts it requires (Product Fact Sheet, Jargon Ledger, Money Map, First Win). Do not write a single line of script before these exist.
2. **Pick the video type** you were asked to write and load its beat sheet (Part 4 for Buyer's Remorse, Part 5 for Disconnect).
3. **Draft beat by beat**, hitting each beat's word budget. Write spoken language, not written language (rules in Part 6).
4. **Run the QA rubric** for that video type (4.9 or 5.10) plus the universal checks in Part 7. Fix every failure before delivering.
5. **Output the script** with the mandatory header block (Part 6.4), word count, and estimated runtime.

## 0.2 Non-negotiable rules

- **Never invent facts.** Every claim about the product must come from the repo, docs, or marketing materials you actually read. Every number must be real. If the script needs a testimonial, a user count, an earnings figure, or a guarantee detail that you cannot find, insert a data request tag in this exact format: `[OWNER INPUT: describe exactly what is needed, e.g., "one real user result with permission to use"]`. A script with honest data request tags is correct. A script with invented proof is a failure, and in the case of earnings claims, a legal liability (see Part 5.8).
- **Never use jargon before defining it.** This applies to the scripts AND to any term the training will later use. The Disconnect video exists precisely because the buyer does not speak this language yet.
- **Hit the length floor.** Under 1,600 words is an automatic rejection. Do not pad with repetition to get there — every beat sheet in this guide produces 1,600+ words when executed honestly.
- **Write for one person.** Not "some of you," not "many customers." One buyer, addressed as "you," who purchased minutes ago and is alone with their doubt or their confusion.
- **One video, one job.** The Buyer's Remorse video does not teach mechanics. The Disconnect video does not beg for belief. When you feel the urge to blend them, stop — the boundary is the design.

## 0.3 How to use the repo access you have

You are running in Cursor with the product's repository open. That access is your unfair advantage over a human copywriter working from a briefing call. Use it: read the actual onboarding flow to find the true first action, read the actual UI strings to build the true jargon list, read the actual pricing config to state the true numbers. Part 3 tells you exactly which files to open and what to extract. When the repo and the marketing copy disagree (a promised feature that doesn't exist, a number that changed), flag it with `[OWNER INPUT: repo says X, marketing says Y — which is true?]` rather than choosing one silently.

---

# PART 1 — WHERE THESE VIDEOS SIT AND WHY THEY EXIST

## 1.1 The placement

```
Ad / VSL / sales page
        ↓
     CHECKOUT  ←— the emotional high point
        ↓
  Members area / app first login
        ↓
  VIDEO 1: Buyer's Remorse video   ←— plays first, always
        ↓
  VIDEO 2: Disconnect video        ←— plays second, always
        ↓
  Training modules → software usage → results
```

## 1.2 Why the slot between purchase and training is the highest-leverage slot in the funnel

Three verified facts define this moment:

1. **The buyer is at peak doubt.** The purchase produces a spike of excitement that collapses quickly into fear, doubt, and uncertainty — this is the documented emotional arc of a new customer, and it is why an estimated 20–70% of newly acquired customers across industries stop doing business with a company within the first 100 days (Joey Coleman's core research finding in *Never Lose a Customer Again*). Refund requests cluster here, usually before the buyer has consumed anything.
2. **The buyer is at peak ignorance.** They bought an outcome ("make money with this software," "save 20 hours a week") without understanding the mechanism. In SaaS, 40–60% of signups never return after their first session — not because the product is bad, but because they didn't experience or understand its value fast enough. In online courses, completion rates hover around 15%. Non-consumption is the single strongest predictor of refunds and churn.
3. **The buyer is at peak attention.** This is the only moment in the entire relationship when they are guaranteed to be watching. Whatever plays right now gets 100% viewership. Nothing later ever will.

So the two videos split the two problems: Video 1 attacks doubt, Video 2 attacks ignorance. In that order — because a person who still regrets the purchase cannot learn, and a person who doesn't understand the purchase cannot stay convinced. **Feel first, then understand.** That ordering is the single most important design decision in this system, and it mirrors the oldest law in direct response: people buy on emotion and justify with logic (Kennedy), so they must be *re-sold* on emotion and *re-justified* with logic — in that sequence.

## 1.3 What each video is measured on

| | Buyer's Remorse Video | Disconnect Video |
|---|---|---|
| **Primary metric** | Refund rate in the guarantee window | % of buyers who start Module 1 / reach the software's first win |
| **Secondary metric** | % who complete the video's micro-action | Support tickets asking "what does X mean" / "how does this make money" |
| **Emotional target** | Relief, pride, recommitment | Clarity, orientation, "I can see the whole map" |
| **The one belief it must install** | "Buying this was the smartest thing I've done for [goal] this year." | "I understand exactly how this makes money, and I know what every word means." |

---

# PART 2 — THE RESEARCH FOUNDATION: THE MASTERS AND WHAT TO TAKE FROM EACH

These are the people and bodies of work that define best practice for these two video types. This section is your theory. Every beat sheet in Parts 4 and 5 is built from it, and when you face a judgment call the beat sheets don't cover, resolve it by asking "what would these principles say?"

## 2.1 Leon Festinger — cognitive dissonance (the physics of buyer's remorse)

Festinger's 1957 theory of cognitive dissonance is the scientific bedrock of Video 1. When a person's actions and beliefs conflict ("I spent money" vs "I'm not sure this was wise"), they experience genuine psychological discomfort and are driven to resolve it — by seeking reassurance, by re-rationalizing the decision, or by reversing the action (refund). Post-purchase dissonance is the most studied form of this in consumer psychology, and it is strongest when the purchase was expensive, emotional, or hard to evaluate — which describes a make-money-online software purchase perfectly.

**The three takeaways that shape the script:**
1. Dissonance is *normal and predictable*, not a sign of a bad customer. The script can therefore name it out loud without risk — naming it is disarming.
2. Buyers actively look for information that supports the choice and avoid information that attacks it. Your job is to be the supporting information, delivered before they go searching (or before a skeptical spouse finds them).
3. The most valuable finding: **a buyer who experiences doubt and resolves it becomes MORE committed than a buyer who never doubted at all.** Dissonance resolution deepens loyalty. Remorse handled well is not damage control — it is an upgrade.

## 2.2 Joey Coleman — the First 100 Days and the Affirm phase

Coleman's *Never Lose a Customer Again* maps eight emotional phases of a new customer: Assess, Admit, Affirm, Activate, Acclimate, Accomplish, Adopt, Advocate. Two of them ARE our two videos:

- **Affirm** (Phase 3): the moment right after buying when euphoria flips to fear, doubt, and uncertainty. Coleman's prescription is deliberate, designed reassurance — congratulate, celebrate the decision, and counter the remorse *before it is voiced*. Most companies go silent at exactly this moment; the Buyer's Remorse video is the opposite of silence.
- **Activate / Acclimate** (Phases 4–5): energize the first real interaction and get the customer comfortable with how things actually work — expectations, process, language. That is the Disconnect video's territory: a welcome kit in video form, giving the buyer a clear roadmap so anxiety and confusion never get a foothold.

**Takeaways:** treat the first minutes of ownership as a designed experience, not an afterthought; make the transition from "prospect" to "member" feel like a ritual; and remember his framing that all business is human-to-human — the video should feel like a founder talking to one person, not a brand making an announcement.

## 2.3 Dan Kennedy — the stick strategy and writing like you talk

Kennedy, the godfather of direct response, taught that the sale is not finished at the checkout: follow-up communication that reinforces the wisdom of the purchase measurably reduces returns. In his world this was the "stick letter" — a letter that arrives with (or immediately after) the product to make the sale stick: congratulate the buyer, restate the promise, re-present the strongest proof, and give clear next-step instructions. The Buyer's Remorse video is the stick letter, evolved into video.

**Craft rules inherited from Kennedy:**
- Enter the conversation already happening in the customer's mind. Right now that conversation is "did I just waste my money?" — so the script opens there, not with a corporate welcome.
- Emotion first, logic second. People buy emotionally and justify logically; re-selling works the same way.
- Write like people talk, not like English teachers approve. Short sentences. Contractions. Rhythm. If it sounds like an essay read aloud, it fails.
- Length is fine if every line earns its place — real buyers are hungry for reassurance and information; write for the buyer, not the skeptic who already left.

## 2.4 Jason Fladlien — consumption is the product

Fladlien (Rapid Crush; the "$100 million webinar" record holder; author of *One to Many*) is the industry's leading voice on what happens *after* the buy button. His doctrine, in one line: **the refund problem is a consumption problem.** People almost never refund products they are actively using and getting results from; they refund products they never opened. So the highest-ROI marketing you can do is to the people who already bought — re-sell them on the product they just purchased, get them consuming immediately, and design "better than money-back" guarantee framings that make buyers feel they got the better end of the deal. He is also the source of the discipline (quoted approvingly in Brunson's material) of building everything around a **single point of belief**, hammered from many angles — a rule both of our videos obey: one belief per video (see the table in 1.3).

**Takeaways:** the moment after purchase is a selling moment, not a paperwork moment; the call to action of post-purchase content is always *consume something now*; and reducing refunds is done by engineering usage, never by hiding the refund policy.

## 2.5 Russell Brunson — the Epiphany Bridge, false beliefs, and "techno babble"

Brunson's *Expert Secrets* supplies the belief architecture for the Disconnect video:

- **The new opportunity:** your buyer didn't purchase an improvement to their old life; they purchased a new vehicle (freelancing with automation, digital products, whatever the software enables). New vehicles come loaded with false beliefs.
- **The three false beliefs:** about the *vehicle* ("does this model actually work?"), about *themselves* ("could someone like me actually do it?"), and about *external forces* ("do I have the time / money / market for it?"). Every buyer holds all three; the Disconnect video addresses each one explicitly (Beat 7 in Part 5).
- **The Epiphany Bridge:** the way to transfer belief is not argument, it is story — walk them through the emotional journey of how the founder discovered this opportunity, so they have the same "aha" you had. Story bypasses the resistance that direct claims trigger.
- **"Techno babble":** Brunson's name for what happens when an expert who has climbed deep into a subject talks to a newcomer — the expert speaks in insider language and the newcomer just gets confused and shuts down. His rule: convince emotionally first, and translate everything. This is the exact failure the Disconnect video is built to prevent.
- One caution to import carefully: Brunson warns that *teaching* during a sales presentation kills sales. That rule applies BEFORE purchase. AFTER purchase, teaching is precisely the job — but teach for belief and orientation (stories, analogies, maps), not for mastery. Mastery is the training's job.

## 2.6 Chip & Dan Heath — the Curse of Knowledge (why experts explain badly)

The Heaths' *Made to Stick* popularized the "curse of knowledge" (the underlying research goes back to Camerer, Loewenstein & Weber, 1989): once you know something, you cannot accurately simulate what it is like not to know it. Experts systematically overestimate their audience's baseline, compress explanations, and lean on jargon — not from laziness but because their own memory of *not knowing* has been erased. The famous tappers-and-listeners experiment captures it: people tapping out a well-known song assumed listeners would name it about half the time; listeners got it right about 2–3% of the time. The tune playing in your head is inaudible to everyone else.

**The cures, all of which are mandatory practice in the Disconnect video:**
- Define every domain term, no matter how basic it feels. If you find yourself thinking "obviously" or "everyone knows this," you are cursed — define it anyway.
- Use concrete language and analogies drawn from the *learner's* world, not the expert's.
- Break everything into small chunks; build from basics upward even when it feels like over-simplifying.
- Make the implicit explicit: say "let me back up and explain why this matters" often.
- Test explanations against a genuine novice; treat their confusion as data, not stupidity. (Your novice stand-in is defined in Part 5.2 — write for them.)

## 2.7 Frank Kern — Results in Advance

Kern's signature method: the fastest way to convince someone you can help them is to actually help them — walk them through the 3–4 biggest steps from Point A (where they are) to Point B (their goal), and get them a small, measurable first-step result quickly. Each completed step builds positive expectancy and a propulsion effect: "that worked — what's next?" This is Cialdini's commitment-and-consistency principle in motion.

**Where it lives in our system:** the Disconnect video IS a results-in-advance artifact — it hands the buyer the complete A→B map before the training asks anything of them, so the path feels attainable. And both videos end by engineering a tiny first result (the micro-action in Video 1, the first win in Video 2), because a buyer with one result in hand is propelled, not pushed.

## 2.8 SaaS onboarding science — aha moments, activation, and time-to-value

Modern product-led onboarding research supplies the operational vocabulary:

- The **aha moment** is the user's first emotional realization that the product will deliver value; **activation** is the first hands-on experience of that value. They are engineered, not hoped for.
- **Time-to-value (TTV)** is the clock from signup to that moment, and it is the control knob for retention: every step, form, or confusion between purchase and first value increases churn risk. Best-in-class self-serve products get users to the activation event within the first session; for our system, the Disconnect video must leave the buyer knowing exactly what their activation event is and hungry to reach it.
- Guided paths beat feature tours: don't showcase everything the software does — walk the one path that leads to the first win.
- Video is the right medium for this: audio-plus-visual explanation dramatically outperforms either alone for retention of instructions (John Medina's *Brain Rules* research is the standard citation: roughly 10% recall of heard-only information after three days versus ~65% when paired with relevant visuals). Write the script assuming the screen will show what the words describe, and mark those moments (Part 6.4).

## 2.9 The FTC — the legal frame for money talk

Because these products sit in the money-making-opportunity category, U.S. FTC standards on earnings claims are the compliance baseline regardless of where the audience lives. The rules that bind the scripts: atypical earnings presented as if typical are deceptive; lifestyle imagery and "quit your job" framing count as implied earnings claims; any earnings claim requires written substantiation; and omitting the costs, effort, or conditions required to achieve a result is itself a misrepresentation. Part 5.8 turns this into concrete script rules. This is not decoration — regulators have extracted seven-figure penalties from coaching and biz-opp sellers for exactly the kind of claims a hype-driven script drifts into.

## 2.10 The synthesis — ten commandments distilled from all of the above

1. The sale must be made twice: once before the money moves, once after. Video 1 is the second sale.
2. Silence after purchase is where customers die. Occupy the silence.
3. Doubt resolved is stronger than doubt never felt. Welcome the remorse; name it; beat it.
4. Consumption kills refunds. Every video ends in a consumption action, never in "enjoy!"
5. One video, one belief, many angles.
6. Feel first, understand second. Never reverse the order.
7. You are cursed with knowledge. Define everything; analogize everything; assume nothing.
8. Story transfers belief; argument triggers resistance.
9. Hand them the whole map, then get them one small win fast.
10. Every promise true, every number real, every result framed as earned — or it doesn't ship.

---

# PART 3 — REPO MINING PROTOCOL (DO THIS BEFORE WRITING A WORD)

You have the repository. A human copywriter would interview the founder for an hour; you will interrogate the codebase instead, and you will do it better. Produce the four artifacts below as a scratch document before drafting. They feed specific beats — the mapping is given with each artifact.

## 3.1 Where to look

Read, in this order of priority:
1. `README.md`, `/docs`, any `/marketing`, `/landing`, `/copy`, or `/emails` directories — the promise, positioning, and existing voice.
2. Landing page / sales page source (look for HTML/JSX pages, headline components, FAQ sections) — the exact claims the buyer saw before purchasing. **The buyer's expectations were set here; the videos must connect to this language.**
3. Onboarding code and UI strings — signup flow, first-run experience, empty states, tooltips, i18n/locale files (`en.json` and similar), component labels. This is where the true jargon lives and where the true first action is defined.
4. Pricing/config files, plan limits, feature flags — the real numbers.
5. `CHANGELOG.md`, release notes — recency proof ("this is alive and improving").
6. Support/FAQ content, canned responses — the confusions real users already hit.

## 3.2 Artifact 1: the Product Fact Sheet

A filled table. No field left blank — use `[OWNER INPUT: ...]` where the repo is silent.

| Field | What to write |
|---|---|
| Product name + one-line promise | As stated on the landing page, verbatim |
| Price paid | The actual checkout price for this buyer's tier |
| Dream customer | Who the marketing targets (experience level, situation) |
| Point A | The buyer's situation before (from sales page pain points) |
| Point B | The concrete outcome promised (from sales page) |
| The vehicle | The business model this product operates inside (e.g., freelancing on marketplaces, selling digital products) |
| The mechanism | What the software actually does, in one plain sentence |
| Unfair advantage | Why doing [vehicle] WITH this software beats doing it manually — time saved, volume gained, skill replaced |
| Core loop | The repeating 3–5 step cycle a user runs (from the app's actual flow) |
| First win / activation event | The smallest in-app action with a visible result (from onboarding code) |
| Proof inventory | Real testimonials, user counts, results found in repo/marketing — with location. If none: `[OWNER INPUT]` |
| Guarantee terms | Exact refund policy as written |
| Effort truth | What the user genuinely must do and roughly how long to first result (be honest; if unstated, flag it) |

**Feeds:** every beat in both videos; especially BR Beats 5–6 and Disconnect Beats 2–4.

## 3.3 Artifact 2: the Jargon Ledger

1. Sweep UI strings, docs, and training outlines for every domain-specific term a complete beginner would not know. Cast a wide net first — 15–30 candidates is normal. Include: platform/marketplace terms (e.g., escrow, milestone, bid), business-model terms (e.g., niche, funnel, conversion, client acquisition), and app-specific terms (feature names, statuses, anything in the nav).
2. Score each candidate: **(a)** Will the buyer meet this word in the first week? **(b)** Would a smart stranger with zero background know it? Keep terms where (a) = yes and (b) = no.
3. Rank by how early the buyer will hit the term. The top 6–10 become the Disconnect video's Jargon School (Beat 5). The rest go into a written glossary recommendation, not the video.
4. For each kept term, draft the three-part translation using the formula in Part 5.6: plain definition (≤15 words) + analogy from everyday life + why-you-care.

**Feeds:** Disconnect Beat 5, and the no-undefined-jargon rule everywhere.

## 3.4 Artifact 3: the Money Map

Answer, as a numbered chain with no gaps: **where does the user's money actually come from, and what makes each link move?** Example shape (adapt to the actual product):

1. Businesses have [problem] and post paid jobs on [platform] →
2. The platform holds the client's money and takes [X]% →
3. Freelancers win those jobs by [mechanism: proposals/bids/portfolio] →
4. The software's role: it [what it automates/improves] at step [N] →
5. User delivers the work → platform releases payment → user withdraws.

Then attach: who pays whom at each arrow, what the software changes about the weakest link, and the honest timeline/effort from the Fact Sheet. Identify the **one link the buyer most doubts** — that link gets the most airtime.

**Feeds:** Disconnect Beats 2, 3, 4, 6, 8.

## 3.5 Artifact 4: the First Win definition

From the onboarding code, define the single smallest action that produces a visible result on screen, phrased as an instruction that takes under 5 minutes ("open the app and connect your account — you'll see X appear"). If the product's real first win takes longer, find the largest sub-step that fits in 5 minutes. This becomes the micro-action in BR Beat 10 and the closing CTA of the Disconnect video.

**Test:** could a nervous beginner do it tonight, tired, on a laptop, without asking anyone for help? If not, shrink it.

## 3.6 Voice calibration

Before drafting, read any existing scripts, emails, or founder-written copy in the repo and match the voice: direct, energetic, first person, talking to one person, zero corporate tone. Default voice profile if no samples exist: a sharp friend who has done this for years, talking over coffee — confident but honest, warm but not gushing, simple words, short sentences, occasional dry humor, never hype-shouting.

---

# PART 4 — VIDEO 1: THE BUYER'S REMORSE VIDEO

## 4.1 The psychology you are operating on

The buyer clicked "buy" on a spike of hope. Within minutes to hours, the spike collapses and dissonance moves in (Part 2.1): the money is gone, the result is not here yet, and the brain starts running loss-math. The internal monologue is remarkably consistent across buyers: *"Did I just get scammed?" — "I've bought stuff like this before and never used it." — "What will [spouse/friend] say?" — "Maybe I should just refund it and keep the money."* Coleman's research (Part 2.2) says this exact window is where 20–70% of new customers are lost, mostly through silence and neglect. Festinger's research says the buyer is right now actively hunting for evidence that the purchase was smart — and avoiding evidence it wasn't. And Fladlien's doctrine says the cure is not argument but consumption: get them using the thing, and remorse starves.

So the video's strategy is: **intercept the doubt before it's voiced, name it precisely, normalize it, flood the buyer with legitimate reassurance (identity, destination, mechanism, proof), inoculate them against outside skeptics, tell the honest truth about effort, and convert the restored excitement into one immediate 5-minute action.** The buyer who finishes this video should feel *relief and pride* — and should have already touched the product.

## 4.2 How to think about this video (mental models)

- **This is the second sale.** You are selling the product to someone who already owns it — which sounds absurd until you realize the alternative: an owner who was sold once, by a page, and never again. Re-sell with the same energy as the first sale, minus the ask.
- **You are the defense attorney for a decision already made.** The prosecution (the inner critic, the skeptical spouse, the past failures) will present its case tonight. Your video gets to speak first. Speak to every charge before it's filed.
- **Doubt is fuel if you burn it.** Per Festinger, resolved doubt produces deeper commitment than no doubt. Do not tiptoe around the remorse — walk straight at it. The moment the video says the quiet thought out loud, the buyer relaxes ("this person gets it, and apparently this feeling is normal").
- **Nothing new is taught here.** No features, no jargon, no how-it-works. The second you start teaching, you've drifted into Video 2's job and diluted the emotional charge. The only "content" allowed is the map of what happens next.
- **The refund policy is a friend, mentioned once.** Hiding it breeds suspicion; leaning on it breeds refunds. One calm sentence, reframed as proof of confidence, late in the video.

## 4.3 Objectives, in priority order

1. Make the buyer feel their doubt was anticipated, understood, and normal.
2. Re-ignite the emotional state that caused the purchase (destination + identity).
3. Re-justify the decision logically (mechanism + proof) so they can defend it to others.
4. Get one micro-action completed within minutes of the video ending.
5. Set honest expectations that pre-empt the week-two "this is harder than I thought" refund.
6. Create an open loop that makes skipping the Disconnect video feel like a mistake.

## 4.4 The beat sheet (12 beats, word budgets, ~11–13 minutes)

Beat minimums sum to exactly the 1,600-word floor; honest execution lands at **1,700–1,970 words**. Never merge beats to save words; never skip one.

| # | Beat | Words | Job |
|---|---|---|---|
| 1 | Cold open: interrupt the doubt | 90–120 | Prove in 15 seconds this isn't a generic welcome |
| 2 | The congratulations that means something | 100–130 | Celebrate the decision as identity, not the transaction |
| 3 | Name the enemy: the remorse voice | 160–190 | Say their exact thoughts out loud, verbatim |
| 4 | The science beat: why brains do this | 120–150 | Normalize with mechanism; remove shame |
| 5 | Re-sell the destination: future pace | 200–240 | Sensory tour of life at Point B |
| 6 | Re-sell the decision: the vehicle & mechanism | 160–190 | Why THIS was the smart pick, in one breath |
| 7 | Proof: people like you | 140–170 | Real evidence; founder story if proof inventory is empty |
| 8 | Inoculate against the skeptics | 140–170 | Pre-arm them for the "you bought WHAT?" conversation |
| 9 | The honest path: effort & timeline | 150–180 | Anti-hype truth-telling that builds trust and stick |
| 10 | The micro-action: touch the product now | 130–160 | 5-minute commitment device from Artifact 4 |
| 11 | The map: what happens next | 100–130 | Orientation without teaching |
| 12 | Safety line + open loop to Video 2 | 110–140 | Guarantee reframe + curiosity bridge |

## 4.5 Beat-by-beat writing instructions (with example lines)

The example lines below use a stand-in product, **PitchPilot** — software that finds matching freelance jobs and writes and submits tailored proposals automatically. Replace its specifics with the real product's Fact Sheet data; keep the moves.

**Beat 1 — Cold open: interrupt the doubt.**
Do NOT open with "Hey, welcome to the program!" — that is what every abandoned course opens with, and it signals "skippable." Open inside the buyer's head, mid-thought, so they feel caught.
> "Right now — maybe not this exact second, but sometime tonight — a little voice is going to show up and ask you one question: *'Did I really just spend money on that?'* I made this video for that exact moment. So before you touch a single lesson, before you even open the software — give me ten minutes. This might be the most important video in the whole members area."
Craft notes: present tense, second person, a specific prediction (predictions that come true build enormous authority), and a reason to keep watching stated as stakes.

**Beat 2 — The congratulations that means something.**
Generic praise ("great decision!") is noise. Tie the congratulation to *identity and statistics*: most people consume free content forever and never commit; this buyer did the rare thing.
> "First — seriously — congratulations. Not for buying software. For what the buying says about you. Most people watch videos about [outcome] for years. They save posts. They 'do research.' They never put one dollar or one hour behind it. Today you did the thing the majority never does: you made a decision and backed it. That's the actual dividing line — not talent, not luck. Decisions."
Craft notes: this reframes the money spent from *cost* into *evidence about who they are* — the exact reframe they'll repeat to themselves later.

**Beat 3 — Name the enemy: the remorse voice.**
This is the beat that makes the video work. Script the inner critic verbatim — three to five specific thoughts, phrased the way a real person thinks them, including at least one uncomfortable one. Precision is the whole game: near-miss guesses feel like marketing; exact hits feel like mind-reading.
> "Now let's talk about that voice, because I know its script by heart. It says: *'You've bought things like this before and they're still sitting in your downloads folder.'* It says: *'Everybody online is a scammer, why would this be different?'* It says: *'You can't really afford to be experimenting right now.'* And its favorite, the one it saves for 2 a.m.: *'You're not the kind of person this works for.'* Sound familiar? Good. I want you to know that every single successful user of [product] heard that same voice on day one. Every one."
Craft notes: pull the specific fears from the sales page's objection/FAQ section (Artifact 1) — the objections that almost stopped the purchase are the same voices that attack after it.

**Beat 4 — The science beat.**
Explain buyer's remorse as machinery, not weakness. Keep it to plain language; one named idea maximum.
> "Here's what that voice actually is. Psychologists have studied this since the 1950s — it's called post-purchase dissonance, and it happens to almost everyone after almost every meaningful purchase. Your brain feels the money leave *today* and can't see the result yet, so it panics and starts looking for the exit. It's not a signal that you made a mistake. It's a signal that you made a *commitment* — the brain only does this math on decisions that matter. So when the voice shows up, you can smile at it: 'Ah. Right on schedule.'"
Craft notes: "right on schedule" gives them a script to use against the feeling — hand them tools, not just facts.

**Beat 5 — Re-sell the destination (future pace).**
Rebuild the emotional state that caused the purchase. Walk them through a concrete, sensory day at Point B — small, believable details beat grand ones. Pull Point B from the Fact Sheet, and keep it modest enough to be legal and credible (see 5.8: no lifestyle porn, no implied income).
> "Let me point you back at the thing you actually bought — because you didn't buy software, you bought a different Tuesday. Picture it maybe a couple of months from now. You open your laptop with coffee, and instead of staring at a job feed for two hours, PitchPilot has already been working while you slept: eleven jobs found, eleven tailored proposals sent. There are two client replies waiting. You answer them, you do work you're actually good at, and you close the laptop at a decent hour. Nobody's cheering. It's not a yacht. It's better — it's *ordinary life with the pressure dialed down*, running on a system instead of on willpower."
Craft notes: "you didn't buy X, you bought Y" is the workhorse reframe of this entire video — use it at least twice across the script.

**Beat 6 — Re-sell the decision: vehicle and mechanism.**
Now the logic layer: in three or four sentences, why this vehicle is sound and why this mechanism beats the alternatives they considered. This is the paragraph they will paraphrase to a skeptical friend, so make it quotable and hype-free.
> "And here's why picking *this* was smart, in plain terms. The demand side is real: businesses post [category] jobs on these platforms every day and pay real money to get them done — that market exists whether you show up or not. The hard part was never the work. The hard part is the boring, repetitive fight to *get* the work — searching, writing proposals, following up. That's the exact part you just automated. You didn't buy a lottery ticket. You bought back the hours that were standing between you and work people already pay for."

**Beat 7 — Proof: people like you.**
Use the Proof Inventory (Artifact 1). Best proof = one specific, modest, verifiable story of someone who resembles the buyer at Point A, told in two or three sentences. If the inventory is empty, do NOT invent — use the founder's own story as proof (the Epiphany Bridge, compressed: I was at Point A, found this mechanism, here's what changed), and insert `[OWNER INPUT: 1–2 real user results with permission]` for the upgrade.
Craft notes: modest specific proof ("landed her first two clients in week three") outperforms spectacular vague proof and keeps you compliant. Always frame results as earned, never as typical unless you have the data.

**Beat 8 — Inoculate against the skeptics.**
Tonight or this week, someone they respect may scoff. Un-prepared, that conversation ends in a refund. Prepared, it bounces off. Predict it, explain it kindly, and hand them a script.
> "One more prediction. At some point you'll mention this to someone — a partner, a friend — and you might get *the look*. Maybe a 'you bought WHAT?' Here's the thing to remember: they're not judging the software. They can't be — they've never seen it. They're protecting you with the only information they have, which is a headline about scams from 2019. So don't argue and don't over-explain. Just say: 'It's a tool that automates the worst part of freelancing. Give me a month and I'll show you instead of telling you.' Then let the results do the talking. Skeptics don't get convinced by debates. They get convinced by invoices."
Craft notes: naming the skeptic's *good intentions* keeps the buyer from feeling attacked by proxy; giving them a one-line script converts a threat into a plan.

**Beat 9 — The honest path.**
Counter-intuitive and essential: honest expectation-setting *reduces* refunds. Week-two refunds come from a gap between imagined ease and real effort — close that gap now, on your terms, and you also gain massive credibility ("finally, someone not promising magic"). State the real effort and timeline from the Fact Sheet's Effort Truth field.
> "Now the part most sellers skip, which is exactly why I won't. This works — and it's still work. The software removes the grind, not the craft: you still deliver, you still answer clients, and the first weeks are the slowest while your account and reviews warm up. If anyone promises you money with zero effort, close the tab — that person is lying to you. What I'll promise instead is this: every hour you put in here moves you forward, instead of disappearing into busywork. That's the honest trade, and it's a good one."

**Beat 10 — The micro-action.**
Convert the emotional peak into motion. One action, from Artifact 4 (First Win definition), doable in under 5 minutes, phrased as an instruction with a visible result. Explain *why now*: action is the antidote to the remorse voice (commitment and consistency — each small step makes the identity stick).
> "Before this video ends, we're going to make you a user instead of a buyer — it takes five minutes and it matters more than it sounds. Here's all you do: open PitchPilot, connect your freelance account, and pick your first job category. The moment you do, the dashboard lights up with live matching jobs — your first look at the machine running for *you*. Do it right now, while I'm still talking if you want. Buyers refund. Users don't — because users have already started."

**Beat 11 — The map.**
Orient without teaching: what exists in the members area, in what order to consume it, and roughly how long each piece takes. Three or four sentences maximum.

**Beat 12 — Safety line + open loop.**
One calm sentence reframing the guarantee as confidence, then a curiosity bridge into the Disconnect video that makes it feel unskippable.
> "And yes — you're covered by the [X-day] guarantee, exactly as promised. I mention it once so you never have to think about it again: the pressure's off, the decision has a safety net, now we build. One last thing before the training: there's a short video next that I'd honestly call the difference between people who make this work and people who stay confused. It explains, in plain language, exactly how the money flows through this system and what every strange word you're about to meet actually means. Most people skip it and then wonder why the training feels like it's in another language. Don't be most people. I'll see you there."

## 4.6 Language patterns that work / banned phrases

**Use freely:** "you didn't buy X, you bought Y" · "right on schedule" · "here's my prediction" · "let me say the quiet part out loud" · "buyers refund, users don't" · "the pressure's off" · "let the results do the talking" · rhetorical questions followed by immediate answers · second-person present tense · specific numbers from the Fact Sheet.

**Banned:** "Welcome aboard!" as an opener · "As you may know" · "revolutionary / game-changing / life-changing" · "passive income" · "guaranteed results" · "in no time" · any sentence starting with "At [Company], we…" · "don't worry" (show, don't instruct feelings) · exclamation marks more than twice in the whole script · any claim, number, or testimonial not in the Fact Sheet.

## 4.7 Worked example — continuous excerpt (Beats 1→4, PitchPilot)

This shows flow and transitions, which the isolated beat examples can't:

> Right now — maybe not this second, but sometime tonight — a little voice is going to show up with one question: *"Did I really just spend money on that?"*
>
> I made this video for that exact moment. So before you open a single lesson, give me ten minutes. This might be the most important video in the whole members area.
>
> But first — congratulations. Not for buying software. For what buying it says about you. Most people watch videos about freelancing for years. They save posts, they "do research," they never put one dollar or one focused hour behind any of it. Today you did the thing the majority never does. You decided, and you backed the decision. That's the real dividing line. Not talent. Not luck. Decisions.
>
> Now — that voice. Let's talk about it, because I know its script by heart.
>
> It says: *"You've bought things like this before, and they're still sitting in a folder somewhere."* It says: *"Everyone online is running a scam — why would this be the exception?"* It says: *"You can't really afford experiments right now."* And it saves its favorite for 2 a.m.: *"You're not the kind of person this actually works for."*
>
> Sound familiar? Good. Because here's what I need you to know: every successful user of PitchPilot heard that exact voice on day one. Every single one. The voice isn't evidence. It's just… weather.
>
> And there's a reason it shows up on schedule. Psychologists have studied this since the 1950s — it's called post-purchase dissonance. Your brain felt the money leave *today*, it can't see the result yet, so it panics and starts hunting for the exit. That's not the feeling of a mistake. That's the feeling of a *commitment* — your brain only runs this math on decisions that matter. So when the voice shows up tonight, you'll know exactly what to say: "Ah. Right on schedule."

## 4.8 Mistakes that kill this video

1. **Opening with logistics** (logins, Facebook groups, "here's how the portal works"). Logistics before emotion = instant skip.
2. **Teaching.** The moment you explain a feature, attention collapses and Video 2's material gets half-learned. Hold the line.
3. **Vague remorse.** "You might have some doubts" is a miss. Verbatim inner-monologue quotes are the hit.
4. **Over-promising to compensate.** Doubling down on hype re-triggers the scam alarm you're trying to silence. Calm confidence only.
5. **Hiding the guarantee** (reads as fear) or **repeating it** (plants the refund seed). Once, reframed, late.
6. **Ending on "good luck!"** Every ending without a completed micro-action wastes the only guaranteed-attention moment you'll ever have.
7. **Sounding like a brand.** First person singular, one narrator, a human being. "We at [Company] are thrilled" is death.

## 4.9 QA rubric — Buyer's Remorse video

Score each item pass/fail; every item must pass before delivery.

- [ ] Word count ≥1,600 (target 1,700–1,970); estimated runtime stated (words ÷ 145).
- [ ] Opens inside the buyer's head within the first two sentences; no generic welcome.
- [ ] Contains ≥3 verbatim inner-critic quotes drawn from real sales-page objections.
- [ ] Remorse explicitly normalized with a plain-language mechanism.
- [ ] Future-pace beat is sensory, modest, and free of income/lifestyle implication.
- [ ] Contains the "you didn't buy X, you bought Y" reframe at least once.
- [ ] All proof real and sourced, or tagged `[OWNER INPUT]`; zero invented evidence.
- [ ] Skeptic inoculation includes a one-line script the buyer can actually say.
- [ ] Honest-path beat states real effort and timeline; no "easy/fast/passive" language.
- [ ] Micro-action: one action, <5 minutes, visible result, phrased as an instruction.
- [ ] Guarantee mentioned exactly once, reframed as confidence.
- [ ] Ends with an open loop to the Disconnect video that states a cost of skipping it.
- [ ] Zero teaching of features, mechanics, or jargon.
- [ ] Read-aloud test passes: no sentence you'd stumble speaking; contractions throughout; ≤2 exclamation marks.

---

# PART 5 — VIDEO 2: THE DISCONNECT VIDEO

## 5.1 What "the disconnect" actually is

The buyer purchased an *outcome* off a sales page. They did not purchase — and mostly do not possess — an understanding of the *machine* that produces the outcome. That gap between what was bought and what must now be understood is the disconnect, and it has four distinct layers. The video must close all four, in this order:

1. **The model gap** — they don't know how money actually moves in this world. Who pays? Why do they pay? Why would they pay *this buyer*? Until the buyer can narrate the flow of money from a stranger's bank account to their own, the whole thing feels like a magic trick — and people don't trust magic tricks with their time.
2. **The mechanism gap** — they don't know where the software sits inside that model, or what specifically it replaces. "It automates stuff" is not understanding.
3. **The language gap** — the app and the training are full of words (escrow, milestone, niche, conversion, proposal, whatever the Jargon Ledger found) that the buyer either doesn't know or, worse, *half*-knows. Every undefined term the buyer meets is a small "this isn't for me" moment; enough of them and they quietly quit. This is the curse of knowledge playing out in production (Part 2.6): the founder and the training author can no longer hear these words as foreign.
4. **The belief gap** — even once they understand it, three doubts remain (Brunson's triad, Part 2.5): does this vehicle really work, can *I* do it, and will my circumstances allow it.

The design brief the founder gave for this video is the perfect north star, so it is quoted here as the standing instruction: explain everything **"like I'm introducing the idea of freelancing to someone totally new — explain the process and how great it is."** That is the register: a generous expert orienting a genuine beginner, with zero assumed knowledge and zero condescension.

## 5.2 How to think about this video (mental models)

- **Write for the Novice Stand-In.** Before drafting, define one imaginary viewer and keep them in the room: a smart adult, competent in ordinary life, who has *never* done this vehicle, doesn't know its words, and bought last night on hope. Every sentence is tested against them: would they follow this without pausing the video? The Heaths' research says you will systematically overestimate this person — so when in doubt, go simpler. Simpler has never lost a viewer; assumed knowledge loses them silently.
- **You are handing over a map, not conducting a class.** Results in Advance (Part 2.7): show the whole path A→B in 3–4 big landmarks so the destination feels reachable, and get them moving toward the first landmark. Depth is the training's job; the map is yours. If a beat starts feeling like a tutorial (settings, clicks, edge cases), you've crossed the line — pull back up to the map.
- **Confusion is the silent refund.** Nobody emails support saying "I don't understand what escrow means, please refund me." They just… stop opening the app, and refund on day 25 saying "it wasn't for me." Every definition in this video is refund prevention wearing a teacher's clothes.
- **Teach in the buyer's world, not yours.** Every concept gets anchored to something they already understand (analogy-first, Part 5.6). The moment you explain a new thing using another new thing, you've built a tower on air.
- **Enthusiasm is part of the information.** The brief says "explain the process *and how great it is*" — orientation here is not neutral documentation. The tone is a friend showing you around a city they love: accurate, and openly delighted that you get to live here now.
- **One belief, hammered from many angles** (Fladlien's rule): by the end, the buyer thinks "I understand exactly how this makes money, and I know what every word means." Every beat serves that sentence.

## 5.3 The teaching rules (mandatory, from Part 2.6 and onboarding science)

1. **Define before use — no exceptions.** A term may not appear in the script before its plain-language definition. This includes terms you consider trivial. Run a final pass checking every Jargon Ledger term's first appearance.
2. **Analogy-first, then precision.** Introduce each concept with an everyday comparison, THEN give the accurate definition. The analogy builds the shelf; the definition sits on it.
3. **One new concept per breath.** Never introduce two unfamiliar ideas in one sentence. If a sentence contains two Ledger terms, split it.
4. **Ladder of abstraction, top-down.** Big picture (the money model) → the players → the process → the tool → the words → the math → the first step. Never start at the bottom.
5. **Concrete beats abstract, always.** "Businesses pay strangers to fix their websites" beats "there is significant market demand." Numbers, names of platforms, real job titles.
6. **Spaced repetition by story.** After teaching the terms in isolation (Beat 5), immediately re-use every one of them inside a narrative (Beat 6). Hearing a new word twice in ten minutes — once defined, once in action — is what makes it stick.
7. **Signal the backup.** Use explicit orientation phrases liberally: "let me back up," "in plain English," "here's why that matters to you," "if that word is new, here's all it means." These phrases cost words and buy comprehension — the trade is always worth it.
8. **The screen carries half the load.** Write assuming visuals will mirror the words (diagrams of money flow, the actual app screen for each term). Mark those moments with `(SCREEN: ...)` cues — recall of instructions roughly sextuples when audio is paired with relevant visuals (Part 2.8).

## 5.4 The beat sheet (10 beats, word budgets, ~11–14 minutes)

Beat minimums sum to 1,670 — just above the floor; honest execution lands at **1,700–2,100 words**.

| # | Beat | Words | Job |
|---|---|---|---|
| 1 | The frame: why this video exists | 90–120 | Make skipping feel expensive; set the "plain language" promise |
| 2 | The one-sentence money model + master analogy | 130–160 | The whole machine in one graspable image |
| 3 | The marketplace walkthrough: who pays whom and why | 220–270 | The freelancing-explained-to-a-newbie core |
| 4 | Where the software sits: the unfair advantage | 170–210 | Before/after; what exactly got automated and why that link matters |
| 5 | Jargon School: 6–10 terms | 350–450 | Definition + analogy + why-you-care, per term |
| 6 | One deal, end to end: the story pass | 220–270 | A named character runs the whole loop, using every term |
| 7 | The three doubts | 170–210 | Vehicle / internal / external belief bridges |
| 8 | The honest math | 120–160 | Conservative, compliant unit economics |
| 9 | How to use the training | 100–130 | Consumption instructions: order, pace, implement-per-module |
| 10 | First action + close | 100–130 | Same first win as Video 1, now with full context |

## 5.5 Beat-by-beat writing instructions (with example lines)

Same stand-in product (**PitchPilot**), same rule: swap in the real Fact Sheet, Money Map, Jargon Ledger, and First Win.

**Beat 1 — The frame.**
Give the video a job title and a stake. Explicitly promise the plain-language treatment — that promise alone relaxes beginners who've been burned by jargon before.
> "Before you touch the first module, I want to hand you something the training assumes you already have: the map. In the next ten minutes I'm going to show you exactly how money moves through this whole system, where PitchPilot fits in it, and what every strange word you're about to meet actually means — in plain language, assuming you know nothing, because that's the only honest way to do it. People who watch this see the training and go 'ah, obviously.' People who skip it see the training and go 'wait, what?' Ten minutes now saves you ten hours of confusion later."

**Beat 2 — The one-sentence model + master analogy.**
Compress the entire Money Map into one sentence, then one everyday image the rest of the video can keep returning to. The master analogy must come from universal daily life (markets, taxis, restaurants, matchmaking), never from tech or business.
> "Here's the whole business in one sentence: businesses around the world have work they can't or won't do themselves, they post that work on big online job boards with money attached, and people like you claim that work, do it, and get paid. That's it. That's the machine. The easiest way to picture it: it's a giant global bulletin board in the town square. Shop owners pin up notes — 'need a logo, will pay $150,' 'need my website fixed, will pay $400' — and workers walk the board, pick the notes that match their skills, and knock on the shop door. Everything else you're about to learn is just details about that board, those notes, and how to be the person whose knock gets answered."

**Beat 3 — The marketplace walkthrough: who pays whom and why.**
Now expand the analogy into the real thing, and answer the beginner's three silent questions in order: *Who are these people paying? Why do they pay strangers on the internet? Why would they ever pick me?* This is the "introducing freelancing to someone totally new" beat — go slower than feels natural. Explain: what the platforms are (name the real ones from the Money Map), why demand exists (businesses buy skills by the task instead of hiring employees — cheaper, faster, no commitment), why trust works (the platform stands in the middle, holds the client's money, and referees disputes — which is why strangers can safely work with strangers), and how the platform earns (a percentage cut, which is why it works hard to keep both sides happy). Land on the punchline that reframes the buyer's biggest hidden fear:
> "So notice what this means: the demand is not something you have to create. Thousands of these notes go up every single day, money already attached, whether you show up or not. Your only job — the only competition in this entire game — is being the person who finds the right notes and knocks on the door well. Hold that thought, because it's exactly where your software comes in."

**Beat 4 — Where the software sits: the unfair advantage.**
Take the weakest link identified in the Money Map (for freelancing: finding jobs and writing proposals — the unpaid grind that kills most beginners) and show before/after honestly, with time numbers from the Fact Sheet.
> "Now, here's the part nobody tells beginners. The work itself was never the hard part — you either have the skill or you'll learn it in the training. The hard part is everything *before* the work: scrolling the board for hours, writing a fresh pitch for every note, hearing nothing back, and doing it all again tomorrow. Done by hand, that's easily two or three hours a day of unpaid labor — and it's exactly where most people quit. That's the link PitchPilot replaces. It reads the board around the clock, spots the notes that match you, writes a tailored knock-on-the-door message for each one, and sends it — while you sleep, work, or live your life. You didn't buy a magic money machine. You bought the tireless assistant who does the part everyone quits over, so you only show up for the part that pays."

**Beat 5 — Jargon School.**
The heart of the video. Take the top 6–10 Ledger terms in the order the buyer will meet them, and run each through the three-part formula (full formula and analogy bank in 5.6). Frame the section explicitly and generously:
> "Next, let's learn the local language — because the app and the training use maybe eight words that sound intimidating and mean simple things. Sixty seconds each, no jargon left behind."
Then, per term, this exact shape (example):
> "**Escrow.** When a client starts a job, the platform takes the client's money up front and locks it in a safe that neither of you can open alone. You do the work, the client approves it, the safe opens, and the money's released to you. Think of a referee holding both bets during a match. Why you care: it means you never do work praying a stranger will feel like paying — the money was already real, already set aside, before you typed a word."
Craft notes: keep every definition ≤15 words before the analogy; give every term its own "why you care"; and show the term on screen as it's taught `(SCREEN: the escrow badge inside the app)`.

**Beat 6 — One deal, end to end: the story pass.**
Now weld it together: follow one named character (pick a name matching the audience) through a single complete transaction, deliberately using *every* term just taught, in sequence. This is the spaced repetition that makes Jargon School permanent, and it doubles as proof-of-concept storytelling.
> "Let's watch it happen once, start to finish. Meet Sara. Tuesday morning, PitchPilot flags a note on the board: a bakery in Manchester needs a menu redesign, budget $200, posted forty minutes ago. The software has already sent a **proposal** — a short pitch built from Sara's profile and the job's exact wording. The client reads it, likes it, hits accept. The platform moves the client's $200 into **escrow** — locked in the safe. Sara does the design, uploads it as the **deliverable**, the client approves, the safe opens. The platform takes its **commission** — its cut for running the board and refereeing — and the rest lands in Sara's balance, which she **withdraws** to her bank. Total time Sara spent hunting for that job: zero minutes. That's one loop of the machine. The training teaches you to run that loop again and again, a little better each time."

**Beat 7 — The three doubts.**
Address Brunson's triad by name, each with a bridge — a fact, a story, or a reframe (never a bare "trust me"):
- *"Does this vehicle really work?"* → the demand evidence from Beat 3 plus one real proof point from the inventory (or the founder's compressed Epiphany Bridge, with `[OWNER INPUT]` tag for user proof).
- *"Can I do it?"* → point at what the system removed: the parts that required experience, confidence, and salesmanship are exactly the automated parts; what remains is learnable, and the training assumes zero background.
- *"Do my circumstances allow it?"* → the honest minimums: the real hours per week and tools required from the Fact Sheet, framed as "designed to run alongside a job/life, not instead of one."

**Beat 8 — The honest math.**
One conservative, concrete walk-through of unit economics using only real numbers (platform's actual commission, realistic job prices from the Money Map). Show the small-number version — one modest job, what the platform takes, what's left — and let the buyer do the multiplication themselves in their head. Follow every earnings-adjacent sentence with grounding (see 5.8):
> "Let's do honest math on one small job — not a highlight reel, just one job. [Real worked numbers here from the Money Map.] Results depend entirely on your effort, your skill, and your market — nothing here is a promise of income. But notice what the math is: not a mystery, not a trick. Small, understandable numbers that stack when you run the loop consistently. That's what a real business looks like at the start."

**Beat 9 — How to use the training.**
Consumption instructions, because completion is engineered (Part 2.4): the order to watch, the pace ("one module, then do the thing it teaches, before the next — implementation between modules is the whole method"), what to skip for now if anything, and where to get help when stuck.

**Beat 10 — First action + close.**
Re-issue the same First Win action from Video 1 — but now it lands differently, because the buyer understands what they're looking at. Close warm and forward:
> "If you already connected your account after the last video — perfect, open the dashboard now and look again: every line on that screen is a note on the board, money attached, waiting for a knock. If you haven't, do it now; it's five minutes. Then head to Module 1. You now know more about how this machine actually works than most people who've been freelancing for a year. Welcome to the board. Let's go get your first note."

## 5.6 The jargon translation formula + analogy bank

**The formula — every term, no exceptions:**
1. **Plain definition** — ≤15 words, no other Ledger terms inside it.
2. **Analogy** — "think of it like…" from universal everyday life.
3. **Why you care** — one sentence connecting the term to the buyer's money, time, or safety.
4. `(SCREEN: where this term appears in the app)`.

**Test for each entry:** could the Novice Stand-In re-explain the term to a friend after one listen? If not, the analogy is wrong — replace it, don't lengthen it.

**Analogy bank** (starting points — always adapt to the actual term and audience; invent new ones from the same everyday domains: markets, sports, restaurants, travel, home life):

| Term family | Analogy seed |
|---|---|
| Escrow / milestone payments | A referee holding both bets until the match ends; a safe two keys open |
| Proposal / bid | A knock on the shop door with a one-paragraph pitch — a job application that takes 5 minutes, not a resume |
| Marketplace / platform | The town-square bulletin board where paid notes get pinned |
| Niche | The one aisle of the supermarket you decide to own |
| Profile / portfolio | Your shop window — what people see before they decide to walk in |
| Commission / fees | The board owner's cut for running the square and refereeing |
| Conversion rate | Out of 100 people who see it, how many say yes |
| Funnel | A path of rooms; each room has one door forward |
| Automation / bot | An intern who never sleeps, never sulks, and does the boring part perfectly |
| API / integration | A keycard that lets one app walk into another app's building and work there |
| Dashboard | The car's instrument panel — every gauge is one fact about your business |
| Algorithm (platform ranking) | The board owner deciding whose notes get pinned at eye level |
| Client acquisition | Everything between "stranger" and "person who paid you" |
| Onboarding | The tour a new employee gets on day one, so they stop feeling lost |

## 5.7 Worked example — continuous excerpt (Beat 5 into Beat 6, PitchPilot)

> Next, let's learn the local language. The app and the training use maybe eight words that sound intimidating and mean simple things. Sixty seconds each — no jargon left behind.
>
> First: **proposal**. A proposal is just your knock on the door — a short written pitch answering one question: "why should this client pick you for this job?" Think of a job application that's one paragraph and takes five minutes, not a resume and a cover letter. Why you care: proposals are the single activity that decides whether you get work — which is exactly why it's the thing your software now writes for you. (SCREEN: a generated proposal in the app)
>
> Next: **escrow**. When a client starts a job, the platform takes their money up front and locks it in a safe that neither of you can open alone. You deliver, they approve, the safe opens, you're paid. A referee holding both bets during the match. Why you care: you will never do work hoping a stranger feels like paying — the money was set aside before you started. (SCREEN: the escrow badge on a live job)
>
> Next: **commission**. The platform's cut — a percentage of each job — its fee for running the board, holding the safe, and refereeing disputes. Like the market charging stall rent. Why you care: it's why the numbers you quote and the numbers you receive differ, and we'll do that exact math in a minute so it never surprises you. (SCREEN: fee breakdown)
>
> [ …remaining Ledger terms, same shape… ]
>
> Now let's watch every one of those words do its job in a single real loop. Meet Sara. Tuesday, 9:40 a.m., PitchPilot flags a fresh note on the board: a bakery needs its menu redesigned, budget $200, posted forty minutes ago — and the software has already sent the **proposal**…

*(The bracketed line above is a structural placeholder allowed ONLY in this guide's example — in a delivered script, every term is written out in full.)*

## 5.8 Compliance rules for money talk (binding)

Derived from FTC earnings-claim standards (Part 2.9). These override any instinct toward hype:

1. **No income promises, projections, or "you will earn" statements.** Ever.
2. **No atypical results presented without typicality context.** A best-case story must be labeled as such and paired with "results vary with effort, skill, and market."
3. **No lifestyle implication as income claim.** No quit-your-boss framing, no luxury imagery language, no "imagine never worrying about money." (Beat 5 of Video 1 stays at "ordinary life with the pressure dialed down" for exactly this reason.)
4. **Every stated number must be substantiated** — from the repo, platform documentation, or owner-supplied verified data. No number, no claim: use `[OWNER INPUT]`.
5. **Costs and conditions disclosed.** Platform fees, required effort, realistic ramp-up time appear in the same video as any money math — omitting them is itself deceptive.
6. **Words banned outright in both scripts:** guaranteed income · passive income · effortless · overnight · get rich · "people are making $X/day with this" (unless verified AND typicality-qualified) · risk-free (the guarantee may be described factually; the venture may not be called risk-free).

## 5.9 Mistakes that kill this video

1. **Starting with the software.** The tool before the model is a demo, not an orientation — the buyer still won't know why any of it matters. Model → players → process → tool. Always.
2. **The curse of knowledge leaking through.** One undefined term in Beat 3 and the beginner is doing vocabulary archaeology instead of listening. The define-before-use pass is not optional.
3. **Explaining a new thing with another new thing.** "Your proposals convert better when your niche is dialed in" — three Ledger terms, zero shelves built. Split, define, sequence.
4. **Drifting into tutorial.** Click-here, settings, edge cases — that's the training's job. The map, not the streets.
5. **Neutral documentation voice.** Accuracy without warmth reads as a manual and gets skipped. The brief demands "how great it is" — let the delight show.
6. **Hype in the math beat.** One inflated number destroys the credibility the previous eight minutes built — and creates legal exposure. Conservative numbers are more persuasive anyway: beginners trust small math.
7. **Teaching terms without the story pass.** Definitions alone evaporate in a day. The Beat 6 narrative re-use is what writes them into memory.
8. **Forgetting the screen.** A money-flow explanation with no `(SCREEN:)` cues wastes the medium's main advantage.

## 5.10 QA rubric — Disconnect video

- [ ] Word count ≥1,600 (target 1,700–2,100); estimated runtime stated (words ÷ 145).
- [ ] Beat 2 contains the full model in one sentence AND one everyday master analogy.
- [ ] The three silent beginner questions (who pays / why strangers / why me) all answered in Beat 3.
- [ ] Software introduced only AFTER the model and players are established.
- [ ] The weakest-link framing present: what exactly the software replaces and why that link kills beginners.
- [ ] 6–10 Jargon Ledger terms each get: ≤15-word definition + everyday analogy + why-you-care + `(SCREEN:)` cue.
- [ ] Zero terms used before their definition — verified by a dedicated final pass.
- [ ] Story pass (Beat 6) re-uses every taught term in a single named-character narrative.
- [ ] All three doubts (vehicle / internal / external) addressed with a bridge each.
- [ ] Money math uses only substantiated numbers, includes fees/effort/ramp-up, and carries the results-vary line.
- [ ] Zero banned words from 5.8.6; zero income promises or lifestyle implications.
- [ ] Training-consumption instructions include order + implement-between-modules pacing.
- [ ] Ends by re-issuing the First Win action and a warm hand-off to Module 1.
- [ ] The Novice Stand-In test: no sentence assumes knowledge the video hasn't built.

---

# PART 6 — UNIVERSAL SPOKEN-WORD CRAFT RULES

These apply to both scripts, every time.

## 6.1 Length and pacing math (the 10-minute floor)

Professional voiceover pacing benchmarks: relaxed narration ~120–130 words per minute; standard conversational delivery ~140–150 wpm; energetic promo reads push 160–180 wpm. These scripts are conversational with deliberate pauses, so **plan at 140–150 wpm**.

| Words | Runtime @140 | Runtime @150 |
|---|---|---|
| 1,400 | 10:00 | 9:20 |
| 1,600 | 11:26 | 10:40 |
| 1,800 | 12:51 | 12:00 |
| 2,000 | 14:17 | 13:20 |

**The rule:** because delivery pace can't be guaranteed, the floor is **1,600 words** — that keeps the video ≥10 minutes even at a brisk 150 wpm read, with pauses adding margin on top. Target 1,700–2,000. Soft ceiling ~2,300 (≈15–16 min): past that, retention losses outweigh completeness — cut the weakest 10% rather than exceed it. Compute and state estimated runtime as `word_count ÷ 145`, formatted mm:ss. Count spoken words only — `(SCREEN:)` cues, `[PAUSE]` marks, and header metadata are excluded from the count.

## 6.2 Write for the ear, not the eye

The script will be *heard once*, not read and re-read. Every rule follows from that:

- **Short sentences.** Average under 15 words; vary rhythm with occasional very short ones. Punchy fragments are legal. Like this.
- **Contractions always** (it's, you're, don't). Their absence is the #1 tell of "essay read aloud."
- **Second person, present tense** as the default gear.
- **One idea per sentence.** If a sentence needs a comma-stacked subordinate clause, it needs to be two sentences.
- **No lists rattled off.** The ear can't hold "seven things: A, B, C…" — narrate sequences as steps in time ("first… then… once that's done…").
- **Transitions are spoken, not typographic.** Headers don't exist in audio; use verbal signposts: "Now, the part nobody tells beginners…" / "Let's switch gears." / "One more prediction."
- **Repetition is a feature.** Key phrases ("right on schedule," "the board," "buyers refund, users don't") should recur deliberately — the ear needs anchors the eye doesn't.
- **Numbers rounded for speech.** "About two hundred dollars," not "$197.43" — unless the exact number IS the point (price paid, fee percentage).
- **The read-aloud test is mandatory:** perform the full script aloud (or simulate the read literally, word by word). Every stumble, every breath-buster, every accidental tongue-twister gets rewritten. If a sentence can't be said in one comfortable breath, split it.
- **Grade level:** aim the language at a smart 12-year-old — roughly 6th–7th grade readability. This is respect, not condescension: the listener is processing in real time while also feeling emotions.

## 6.3 Retention engineering

A 10+ minute talking video must *earn* each next minute:

- **The first 30 seconds decide everything.** Both beat sheets open with a pattern interrupt for this reason; never soften those openings in revision.
- **Open loops every 60–90 seconds.** Plant forward references and pay them off later: "hold that thought," "we'll do that exact math in a minute," "I'll give you the one-line script for that conversation before we're done." Track every loop you open and verify every one closes — an unclosed loop is a broken promise.
- **Predictions build authority.** Predicting the viewer's thoughts and near-future experiences ("tonight, a voice will ask you…", "someone will give you the look") — and being right — is the single fastest trust mechanism available to these scripts.
- **Re-engagement spikes** every ~2 minutes: a direct question, a "here's the part nobody tells you," a tone shift, a story start. Mark the script's minute-marks (every ~145 words) during QA and check each 2-minute span contains one.
- **Say the viewer's thoughts before they do** throughout, not just in the remorse beat — "I know what you're thinking:…" is legal any time it's accurate.
- **Never signal the ending early.** "Before I wrap up" at minute 7 gives permission to leave. The close arrives without a long runway.

## 6.4 Script formatting spec (mandatory output format)

Every delivered script starts with this header block:

```
================================================
SCRIPT: [Product Name] — [Buyer's Remorse Video | Disconnect Video]
VERSION: v1 · DATE: [date]
WORD COUNT (spoken): [n] · EST RUNTIME @145wpm: [mm:ss]
SOURCES MINED: [key repo files/docs read]
FACT SHEET / JARGON LEDGER / MONEY MAP / FIRST WIN: attached below script
OWNER INPUT NEEDED: [count] items (search "[OWNER INPUT" to locate) — or "none"
================================================
```

Body formatting:
- Beat headers as comments the narrator doesn't read: `--- BEAT 3: NAME THE ENEMY ---`
- Spoken text in plain paragraphs, one thought-block per paragraph.
- Delivery cues inline in brackets, used sparingly: `[PAUSE]` (a full beat of silence), `[SLOW]` / `[PICK UP]` (pace shifts), *italics* for single-word emphasis.
- Production cues in parentheses on their own line: `(SCREEN: dashboard with live matched jobs)` — every Jargon School term and every money-math moment gets one.
- After the script body, append the four Part 3 artifacts so the owner can verify every claim's source.
- Filename: `{product-slug}-{buyers-remorse|disconnect}-script-v{n}.md`

---

# PART 7 — FULL WORKFLOW CHECKLIST (RUN TOP TO BOTTOM, EVERY TIME)

**Phase 1 — Mine (Part 3)**
- [ ] Repo read: README, docs, marketing/landing source, onboarding flow, UI strings, pricing config, changelog, FAQ/support content.
- [ ] Product Fact Sheet complete — every field filled or `[OWNER INPUT]`-tagged.
- [ ] Jargon Ledger: candidates swept, scored, top 6–10 ranked in order-of-encounter, translations drafted.
- [ ] Money Map: numbered chain with no gaps; weakest link identified; real fees and price ranges captured.
- [ ] First Win defined; passes the tired-beginner-tonight test (<5 min, visible result, no help needed).
- [ ] Voice calibrated against existing founder copy (or default profile adopted).
- [ ] Marketing-vs-repo contradictions flagged, not silently resolved.

**Phase 2 — Draft (Part 4 or 5)**
- [ ] Correct beat sheet loaded; all beats present, in order, none merged.
- [ ] Each beat within its word budget; total in target zone (BR: 1,700–1,970 · Disconnect: 1,700–2,100; absolute floor 1,600).
- [ ] Every claim traceable to an artifact; zero invented facts, numbers, or testimonials.
- [ ] Compliance pass against 5.8 (both videos — Video 1's future-pace beat included).

**Phase 3 — QA**
- [ ] Video-specific rubric passed in full (4.9 or 5.10).
- [ ] Read-aloud pass done; ear-rules of 6.2 verified.
- [ ] Retention audit: 2-minute spans each contain a spike; all open loops closed; ending unsignaled.
- [ ] Define-before-use scan: first occurrence of every Ledger term checked (both videos — Video 1 must contain *no* Ledger terms at all).
- [ ] Word count recomputed on spoken words only; runtime stated.

**Phase 4 — Deliver (6.4)**
- [ ] Header block complete and accurate.
- [ ] Artifacts appended.
- [ ] `[OWNER INPUT]` items counted and listed in the header.
- [ ] File named per spec.

**Acceptance criteria — a script ships only if:** floor length met · rubric 100% passed · zero unverified claims · zero banned language · micro-action/First Win present · read-aloud clean. If any criterion fails, fix and re-run Phase 3; never ship with a known failure and a note.

---

# PART 8 — SOURCES & FURTHER STUDY

The research base for this guide, by pillar. If deeper study is ever needed, these are the canonical starting points:

**Buyer's remorse / post-purchase psychology**
- Leon Festinger, *A Theory of Cognitive Dissonance* (1957) — post-purchase dissonance; dissonance-resolution deepening commitment; buyers seeking consonant information.
- Joey Coleman, *Never Lose a Customer Again* (2018) — the First 100 Days; the eight phases (Assess → Advocate); the Affirm phase as designed remorse-countering; the 20–70% early-loss statistic; H2H (human-to-human) framing.
- Dan Kennedy, *The Ultimate Sales Letter* — stick strategy / post-sale reinforcement to reduce returns; "enter the conversation already occurring in the customer's mind"; emotion-then-logic; write like people talk.
- General consumer research on buyer's remorse prevalence and post-purchase communication as the counter (industry surveys commonly cite majorities of online shoppers experiencing purchase regret; post-purchase messaging as the standard mitigation).

**Consumption & post-purchase selling**
- Jason Fladlien (Rapid Crush), *One to Many* (2018) and his broader post-purchase body of work — refunds as a consumption problem; re-selling buyers after purchase; better-than-money-back guarantee design; the single-point-of-belief discipline.
- Course-industry refund research — ~15% typical completion rates; refund clustering before consumption; onboarding/engagement as the refund lever.

**Belief transfer & the disconnect**
- Russell Brunson, *Expert Secrets* (2017) — the new opportunity; the Big Domino; vehicle/internal/external false beliefs; the Epiphany Bridge; "techno babble" and emotional-before-logical persuasion.
- Frank Kern — Results in Advance: A→B step maps, first-step results, positive expectancy and propulsion; goodwill through helping before asking.
- Robert Cialdini, *Influence* — commitment and consistency (the mechanism behind micro-actions and propulsion).

**Explaining to beginners**
- Chip & Dan Heath, *Made to Stick* (2007) — the Curse of Knowledge (building on Camerer, Loewenstein & Weber, 1989, and the Stanford tappers-listeners study); the SUCCESs traits (Simple, Unexpected, Concrete, Credible, Emotional, Stories).
- Onboarding/product-led-growth literature (ProductLed, Appcues, UXCam, FullSession et al.) — aha moments vs activation; time-to-value as the churn lever; 40–60% first-session abandonment; guided single-path onboarding over feature tours.
- John Medina, *Brain Rules* — audio-plus-visual retention advantage (the basis for the `(SCREEN:)` cue discipline).

**Compliance**
- U.S. FTC — Business Opportunity Rule and the proposed Earnings Claim Rule; Notice of Penalty Offenses Concerning Money-Making Opportunities (2021); Endorsement Guides (16 CFR 255) — atypical-earnings deception, lifestyle claims as implied earnings claims, substantiation requirements, and disclosure of costs/conditions.

**Voiceover craft**
- Professional VO pacing standards — ~120–130 wpm relaxed narration, ~140–150 conversational, 160–180 energetic; runtime = words ÷ wpm; count spoken words only.

— END OF GUIDE —
