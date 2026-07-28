import type { ArticleAngle } from "../types";

export interface GeneratedArticleContent {
  title: string;
  excerpt: string;
  metaDescription: string;
  html: string;
  wordCount: number;
}

function countWords(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function primaryKeyword(title: string, territory: string): string {
  const base = title.replace(/[^\w\s&]/g, " ").replace(/\s+/g, " ").trim();
  return base.length > 12 ? base.slice(0, 80) : territory;
}

function secondaryKeywords(territory: string, angle: ArticleAngle): string[] {
  const shared = [
    `${territory} guide`,
    `best ${territory.toLowerCase()} options`,
    `${territory.toLowerCase()} tips`,
    `${territory.toLowerCase()} for beginners`,
  ];
  const byAngle: Record<ArticleAngle, string[]> = {
    "pillar-guide": ["buyer's guide", "how to choose", "evaluation criteria"],
    "best-picks": ["top picks", "comparison", "use cases"],
    mistakes: ["common mistakes", "what to avoid", "buying errors"],
    budget: ["budget options", "value for money", "affordable choices"],
    "pro-tips": ["advanced strategies", "expert tips", "optimization"],
    "worth-it": ["pros and cons", "honest review", "is it worth it"],
    beginners: ["getting started", "step by step", "first steps"],
  };
  return [...shared, ...byAngle[angle]];
}

function buildIntroduction(params: {
  title: string;
  territory: string;
  angle: ArticleAngle;
  keyword: string;
}): string {
  const { territory, angle, keyword } = params;
  const hookByAngle: Record<ArticleAngle, string> = {
    "pillar-guide": `Choosing the right path in ${territory} can feel overwhelming when every product promises fast results. This ${keyword.toLowerCase()} cuts through the noise with practical criteria you can use today.`,
    "best-picks": `Not every ${territory.toLowerCase()} option fits every buyer. This comparison-style guide groups the strongest approaches by use case so you can match a solution to your goals without guesswork.`,
    mistakes: `Most people overspend on ${territory.toLowerCase()} because they repeat the same preventable errors. Understanding those mistakes early saves money, time, and frustration.`,
    budget: `You do not need a large budget to make progress in ${territory.toLowerCase()}. Smart prioritization often beats expensive shortcuts when you know what to fund first and what to defer.`,
    "pro-tips": `If you already understand the basics of ${territory.toLowerCase()}, small refinements often produce outsized gains. These advanced tactics focus on leverage, not hype.`,
    "worth-it": `Before you invest in ${territory.toLowerCase()}, you need an honest answer to a simple question: will this actually help someone with your goals, constraints, and timeline?`,
    beginners: `Starting with ${territory.toLowerCase()} does not require expert knowledge on day one. A clear sequence of first steps reduces confusion and helps you build momentum in your first week.`,
  };

  return `
<p>${hookByAngle[angle]}</p>
<p>In this article, you will learn how to evaluate ${territory.toLowerCase()} options with confidence, avoid common pitfalls, and choose a practical next step. We focus on evergreen advice that stays useful even as products and trends change.</p>
<p>Whether you are researching for the first time or refining an existing plan, the framework below is designed to answer real buyer questions — not filler. By the end, you will know what to prioritize, what to skip, and how to move forward with a realistic plan.</p>
<p>Our primary focus is <strong>${keyword.toLowerCase()}</strong>, with related topics such as ${secondaryKeywords(territory, angle).slice(0, 3).join(", ")} woven in where they add clarity.</p>
`.trim();
}

function buildTableOfContents(sections: string[]): string {
  const items = sections.map((s) => `<li><a href="#${s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}">${s}</a></li>`).join("\n");
  return `
<h2>Table of Contents</h2>
<nav aria-label="Table of contents">
<ol>
${items}
</ol>
</nav>
`.trim();
}

function buildMainSections(params: {
  territory: string;
  angle: ArticleAngle;
  keyword: string;
}): string {
  const { territory, angle, keyword } = params;
  const t = territory.toLowerCase();

  const evaluationSection = `
<h2 id="how-to-evaluate">How to Evaluate ${territory} Options</h2>
<p>Strong decisions in ${t} start with a short list of non-negotiables. Before comparing features or prices, define your goal, budget range, and time commitment. Those three inputs filter out most poor fits immediately.</p>
<h3>Quality markers that actually matter</h3>
<p>Look for transparent onboarding, clear refund terms, and support channels that respond within a reasonable window. In ${t}, the best providers explain trade-offs upfront instead of hiding limitations in fine print.</p>
<p>When a specific starter program aligns with beginners, we often point readers to <a href="#offer">the recommended starting option</a> because it balances clarity, support, and a realistic learning curve.</p>
<h3>Support, guarantees, and long-term value</h3>
<p>Guarantees are only meaningful when the process to use them is simple. Check whether updates, community access, or coaching are included — these details often determine whether you stick with a plan long enough to see results.</p>
<ul>
<li><strong>Clarity:</strong> Does the offer explain who it is for and who should skip it?</li>
<li><strong>Proof:</strong> Are outcomes described with realistic timelines instead of hype?</li>
<li><strong>Fit:</strong> Does the format match how you actually learn or work?</li>
<li><strong>Flexibility:</strong> Can you adjust pace if life gets busy?</li>
</ul>
`.trim();

  const checklistSection = `
<h2 id="step-by-step-checklist">${territory} Step-by-Step Checklist</h2>
<p>Use this sequence before you commit to any purchase in ${t}. It keeps research structured and prevents impulse decisions driven by marketing urgency.</p>
<ol>
<li>Write down your primary outcome and a 30-day success metric.</li>
<li>List two alternatives and compare them against the same criteria.</li>
<li>Read recent feedback from people with similar goals — not generic five-star blurbs.</li>
<li>Confirm refund terms, billing cycles, and cancellation steps in writing.</li>
<li>Choose one option, set a start date, and schedule a two-week review.</li>
</ol>
<p>This approach works because it converts abstract interest in <strong>${keyword.toLowerCase()}</strong> into a repeatable decision process you can reuse any time the market changes.</p>
`.trim();

  const mistakesSection = `
<h2 id="common-mistakes">Common ${territory} Mistakes to Avoid</h2>
<p>Most setbacks in ${t} come from predictable errors rather than bad luck. Avoiding these patterns protects your budget and shortens your path to useful results.</p>
<ul>
<li><strong>Chasing the lowest price</strong> without checking support quality or update frequency.</li>
<li><strong>Skipping the refund window review</strong> and discovering restrictive terms after purchase.</li>
<li><strong>Expecting instant outcomes</strong> when the category typically rewards consistent effort over 30–90 days.</li>
<li><strong>Collecting resources without execution</strong> — more courses rarely fix a missing weekly routine.</li>
<li><strong>Ignoring fit</strong> by choosing a popular option that does not match your schedule or skill level.</li>
</ul>
<blockquote><p><strong>Tip:</strong> A simple one-page decision sheet beats hours of unstructured browsing when evaluating ${keyword.toLowerCase()}.</p></blockquote>
`.trim();

  const angleSectionByType: Record<ArticleAngle, string> = {
    "pillar-guide": `
<h2 id="complete-overview">The Complete ${territory} Overview</h2>
<p>${territory} includes many subtopics, but successful buyers focus on fundamentals first: problem definition, solution fit, and execution plan. This section maps the landscape so you know where to spend attention.</p>
<h3>Who this guide is for</h3>
<p>This guide helps motivated beginners and intermediate buyers who want a structured framework — not hype. If you need a quick impulse purchase without research, this article will feel too detailed. That is intentional.</p>
<h3>Who should skip it</h3>
<p>If you already operate at an advanced level and only need niche-specific tactical updates, skim the checklist and FAQ sections rather than reading end-to-end.</p>
<p>For most readers, the combination of evaluation criteria, mistake prevention, and FAQ answers provides enough depth to choose confidently.</p>
`.trim(),
    "best-picks": `
<h2 id="best-picks-by-use-case">Best ${territory} Picks by Use Case</h2>
<p>Rather than declaring one universal winner, organize choices by scenario. The best pick for a tight budget differs from the best pick for faster guided implementation.</p>
<table>
<thead><tr><th>Use case</th><th>What to prioritize</th><th>Why it works</th></tr></thead>
<tbody>
<tr><td>First-time buyers</td><td>Clear onboarding + support</td><td>Reduces early confusion and drop-off</td></tr>
<tr><td>Budget-conscious</td><td>Core features without extras</td><td>Protects cash while validating fit</td></tr>
<tr><td>Time-poor professionals</td><td>Structured shortcuts</td><td>Minimizes decision fatigue each week</td></tr>
<tr><td>Long-term builders</td><td>Scalable systems</td><td>Supports compounding progress</td></tr>
</tbody>
</table>
<p>When your use case is clear, shortlist two options and run them through the checklist section before you decide.</p>
`.trim(),
    mistakes: `
<h2 id="mistake-patterns">Why These ${territory} Mistakes Keep Happening</h2>
<p>Mistakes repeat when buyers rely on urgency messaging instead of criteria. Sales pages optimize for conversion, not fit — your process must rebalance that asymmetry.</p>
<h3>How to recover quickly</h3>
<p>If you already made a suboptimal purchase, document what failed (expectations, format, support, or schedule mismatch). That note becomes your personal filter for future decisions in ${t}.</p>
<h3>Prevention systems that work</h3>
<p>Set a 24-hour cooling period for non-essential purchases, and require every option to pass the step-by-step checklist. These small rules prevent most regret purchases.</p>
`.trim(),
    budget: `
<h2 id="budget-framework">${territory} on a Budget: A Practical Framework</h2>
<p>Budget buying is not about finding the cheapest option. It is about allocating limited funds to the highest-leverage components first while avoiding expensive distractions.</p>
<h3>Spend first</h3>
<p>Fund the core capability that directly enables your primary outcome. In most ${t} scenarios, that means paying for clarity and implementation support before aesthetic upgrades or bonus modules.</p>
<h3>Save for later</h3>
<p>Defer advanced add-ons until you complete a baseline execution cycle. Many buyers upgrade too early and confuse consumption with progress.</p>
`.trim(),
    "pro-tips": `
<h2 id="advanced-tactics">Advanced ${territory} Tactics</h2>
<p>Once fundamentals are stable, advanced gains usually come from tighter feedback loops: better tracking, sharper positioning, and faster iteration cycles.</p>
<h3>Optimize your weekly review</h3>
<p>Block 20 minutes each week to review one metric, one bottleneck, and one adjustment. This habit compounds faster than constantly switching methods.</p>
<h3>Reduce context switching</h3>
<p>Most plateaus in ${t} trace back to fragmented focus. Commit to one primary approach long enough to evaluate it fairly.</p>
`.trim(),
    "worth-it": `
<h2 id="worth-it-analysis">Is ${territory} Worth It? Pros, Cons, and Verdict</h2>
<p>A balanced decision requires explicit pros and cons — not a highlight reel from the sales page.</p>
<h3>Pros</h3>
<ul>
<li>Can accelerate learning curves when the format matches your workflow</li>
<li>Provides structure that reduces guesswork for new buyers</li>
<li>Often includes templates, examples, or support that save setup time</li>
</ul>
<h3>Cons</h3>
<ul>
<li>Requires consistent execution — purchase alone does not create results</li>
<li>Quality varies widely across providers in ${t}</li>
<li>Some offers oversimplify timelines and create unrealistic expectations</li>
</ul>
<p><strong>Verdict:</strong> ${territory} is worth it when your chosen option aligns with your schedule, budget, and learning style — and you commit to a realistic 30–90 day execution window.</p>
`.trim(),
    beginners: `
<h2 id="beginner-roadmap">${territory} for Beginners: First-Week Roadmap</h2>
<p>Beginners progress fastest with a narrow plan. Avoid collecting every resource at once. Start with one path, one metric, and one weekly review ritual.</p>
<h3>Day 1–2: Define your baseline</h3>
<p>Write your goal, current constraints, and available weekly hours. This baseline prevents chasing tactics that do not fit your life.</p>
<h3>Day 3–5: Implement one core lesson</h3>
<p>Apply a single concept and capture what worked and what did not. Small validated steps beat passive reading every time.</p>
<h3>Day 6–7: Review and adjust</h3>
<p>Decide whether to continue, tweak, or switch approach. Early reviews protect you from staying on the wrong path for months.</p>
`.trim(),
  };

  return [angleSectionByType[angle], evaluationSection, checklistSection, mistakesSection].join("\n\n");
}

function buildFaqSection(territory: string, angle: ArticleAngle, keyword: string): string {
  const t = territory.toLowerCase();
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the best way to start with ${territory.toLowerCase()}?`,
      a: `Start by defining your goal and budget, then compare two or three options using the same checklist. For most beginners in ${t}, a structured starter option with clear onboarding reduces early mistakes.`,
    },
    {
      q: `How much should I budget for ${territory.toLowerCase()}?`,
      a: `Budget depends on your use case. Prioritize core value first, then add advanced features after you complete a baseline execution cycle. Avoid paying for premium extras before you validate fit.`,
    },
    {
      q: `How long before I see results?`,
      a: `Many buyers in ${t} should expect meaningful progress within 30–90 days of consistent action. Timelines vary by starting point, but overnight outcomes are rarely realistic.`,
    },
    {
      q: `What mistakes should I avoid?`,
      a: `The most common mistakes are choosing based on price alone, ignoring refund terms, and switching methods too frequently. Use a written decision checklist before purchasing.`,
    },
    {
      q: `Is ${keyword.toLowerCase()} worth it for beginners?`,
      a: `It can be, if the format matches your schedule and the provider offers clear guidance. Beginners should favor clarity and support over advanced features they will not use immediately.`,
    },
    {
      q: `How do I compare options fairly?`,
      a: `Compare options against the same criteria: fit, support, refund terms, update policy, and execution requirements. This prevents biased decisions driven by marketing urgency.`,
    },
  ];

  if (angle === "worth-it") {
    faqs.push({
      q: `Who should skip ${territory.toLowerCase()} entirely?`,
      a: `Skip it if you cannot commit weekly execution time, if your budget is unstable, or if you already have a working system that meets your goals.`,
    });
  }

  const items = faqs
    .map((item) => `<h3>${item.q}</h3>\n<p>${item.a}</p>`)
    .join("\n");

  return `
<h2 id="frequently-asked-questions">Frequently Asked Questions</h2>
${items}
`.trim();
}

function buildConclusion(territory: string, keyword: string): string {
  return `
<h2 id="conclusion">Conclusion</h2>
<p>Strong outcomes in ${territory.toLowerCase()} come from clear criteria, realistic timelines, and consistent execution — not from chasing every new offer. Use the evaluation framework, avoid the common mistakes, and review your progress on a fixed schedule.</p>
<p>If you remember one takeaway from this ${keyword.toLowerCase()}, make it this: choose fit over hype, then commit long enough to evaluate results fairly.</p>
`.trim();
}

function buildCta(territory: string): string {
  return `
<h2 id="next-steps">Next Steps</h2>
<p>Ready to move forward? Apply the checklist above to your shortlist, then start with <a href="#offer">the option we recommend for most readers in ${territory.toLowerCase()}</a>. Keep your first month focused on execution and review — that is where real progress happens.</p>
`.trim();
}

/** Build a long-form authority article (1,000+ words) for Recurring Stream templates. */
export function buildRecurringStreamArticleContent(params: {
  topic: string;
  territory: string;
  hobby: string;
  angle?: ArticleAngle;
}): GeneratedArticleContent {
  const territory = params.territory.trim() || params.hobby.trim() || "this niche";
  const angle = params.angle ?? "pillar-guide";
  const title = params.topic.trim().slice(0, 120);
  const keyword = primaryKeyword(title, territory);

  const sectionTitles = [
    angle === "best-picks" ? `Best ${territory} Picks by Use Case` : `The Complete ${territory} Overview`,
    `How to Evaluate ${territory} Options`,
    `${territory} Step-by-Step Checklist`,
    `Common ${territory} Mistakes to Avoid`,
    "Frequently Asked Questions",
    "Conclusion",
    "Next Steps",
  ];

  const intro = buildIntroduction({ title, territory, angle, keyword });
  const toc = buildTableOfContents(sectionTitles);
  const main = buildMainSections({ territory, angle, keyword });
  const faq = buildFaqSection(territory, angle, keyword);
  const conclusion = buildConclusion(territory, keyword);
  const cta = buildCta(territory);

  let html = [intro, toc, main, faq, conclusion, cta].join("\n\n");

  if (countWords(html) < 1000) {
    html += `
<h2 id="additional-guidance">Additional Guidance for ${territory}</h2>
<p>When markets shift, your decision framework matters more than any single product headline. Revisit your criteria every quarter, especially if your budget, schedule, or goals change.</p>
<p>Readers who succeed in ${territory.toLowerCase()} usually share three habits: they document decisions, review outcomes monthly, and improve one variable at a time instead of restarting from scratch.</p>
<p>Keep this article as a reference checklist for future purchases, comparisons, and planning cycles. That is how short-term research becomes long-term advantage in ${keyword.toLowerCase()}.</p>
`.trim();
  }

  const plain = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const wordCount = countWords(html);

  return {
    title,
    excerpt: plain.slice(0, 200),
    metaDescription: `${title} — expert ${territory.toLowerCase()} guide with buying criteria, FAQs, and practical next steps.`.slice(
      0,
      160
    ),
    html,
    wordCount,
  };
}

/** Wrap article body with SEO H1 for preview/export contexts. */
export function wrapArticleWithTitle(title: string, html: string): string {
  const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<h1>${safeTitle}</h1>\n${html}`;
}
