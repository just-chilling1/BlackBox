import type { MoneyPageCopy } from "./types";

import { moneyPageTrackHref } from "./track-url";



function escapeHtml(value: string): string {

  return value

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/"/g, "&quot;");

}



function paragraphs(text: string): string {

  return text

    .split(/\n{2,}/)

    .map((p) => p.trim())

    .filter(Boolean)

    .map((p) => `<p>${escapeHtml(p)}</p>`)

    .join("");

}



function listItems(items: string[], className = ""): string {

  return `<ul class="${className}">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;

}



export function buildMoneyPageHtml(params: {

  siteId: string;

  productName: string;

  copy: MoneyPageCopy;

  ctaUrl: string;

}): string {

  const { siteId, productName, copy, ctaUrl } = params;

  const ctaHref = moneyPageTrackHref(siteId, ctaUrl);

  const cta = escapeHtml(copy.ctaLabel || "Check Today's Price");

  const hero = copy.heroImage

    ? `<img class="hero-img" src="${escapeHtml(copy.heroImage)}" alt="${escapeHtml(productName)}" loading="lazy" />`

    : "";



  const benefits = copy.benefits

    .map(

      (b) =>

        `<article class="benefit-card"><div class="benefit-icon" aria-hidden="true"></div><h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p></article>`

    )

    .join("");



  const faqs = copy.faqs

    .map(

      (f) =>

        `<details class="faq-item"><summary>${escapeHtml(f.question)}</summary><div class="faq-body"><p>${escapeHtml(f.answer)}</p></div></details>`

    )

    .join("");



  return `<!DOCTYPE html>

<html lang="en">

<head>

  <meta charset="utf-8" />

  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <title>${escapeHtml(copy.headline)}</title>

  <link rel="preconnect" href="https://fonts.googleapis.com" />

  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&display=swap" rel="stylesheet" />

  <style>

    :root {

      --bg: #f6f8fb;

      --bg-soft: #eef3f8;

      --ink: #0f172a;

      --muted: #475569;

      --soft: #64748b;

      --card: #ffffff;

      --line: rgba(15, 23, 42, 0.08);

      --line-strong: rgba(15, 23, 42, 0.12);

      --accent: #0891b2;

      --accent-dark: #0e7490;

      --accent-soft: rgba(8, 145, 178, 0.12);

      --success: #059669;

      --danger: #dc2626;

      --radius: 18px;

      --shadow: 0 18px 40px -24px rgba(15, 23, 42, 0.28);

      --shadow-soft: 0 10px 24px -18px rgba(15, 23, 42, 0.18);

    }

    * { box-sizing: border-box; }

    html { scroll-behavior: smooth; }

    body {

      margin: 0;

      font-family: "DM Sans", system-ui, -apple-system, sans-serif;

      background:

        radial-gradient(circle at top, rgba(8, 145, 178, 0.08), transparent 32%),

        linear-gradient(180deg, var(--bg) 0%, #ffffff 100%);

      color: var(--ink);

      line-height: 1.65;

      -webkit-font-smoothing: antialiased;

    }

    .wrap { max-width: 820px; margin: 0 auto; padding: 28px 20px 96px; }

    .hero {

      padding: 28px 24px;

      border: 1px solid var(--line);

      border-radius: calc(var(--radius) + 4px);

      background: linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%);

      box-shadow: var(--shadow);

    }

    .eyebrow {

      display: inline-flex;

      align-items: center;

      gap: 8px;

      padding: 6px 12px;

      border-radius: 999px;

      background: var(--accent-soft);

      color: var(--accent-dark);

      font-size: 12px;

      font-weight: 700;

      letter-spacing: 0.08em;

      text-transform: uppercase;

    }

    h1, h2, h3 {

      font-family: "Fraunces", Georgia, serif;

      letter-spacing: -0.03em;

      color: var(--ink);

    }

    h1 {

      margin: 18px 0 12px;

      font-size: clamp(2.2rem, 5vw, 3.35rem);

      line-height: 1.08;

      max-width: 14ch;

    }

    .sub {

      margin: 0 0 22px;

      max-width: 58ch;

      font-size: 1.125rem;

      color: var(--muted);

    }

    .hero-img {

      width: 100%;

      border-radius: var(--radius);

      margin: 8px 0 24px;

      display: block;

      border: 1px solid var(--line);

      box-shadow: var(--shadow-soft);

    }

    .trust-row {

      display: flex;

      flex-wrap: wrap;

      gap: 10px 16px;

      margin: 0 0 24px;

      padding: 0;

      list-style: none;

      color: var(--soft);

      font-size: 14px;

    }

    .trust-row li {

      display: inline-flex;

      align-items: center;

      gap: 8px;

    }

    .trust-row li::before {

      content: "";

      width: 8px;

      height: 8px;

      border-radius: 999px;

      background: var(--accent);

      box-shadow: 0 0 0 4px rgba(8, 145, 178, 0.12);

    }

    .btn {

      display: inline-flex;

      align-items: center;

      justify-content: center;

      gap: 8px;

      min-height: 52px;

      padding: 0 26px;

      border-radius: 999px;

      background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);

      color: #fff;

      text-decoration: none;

      font-weight: 700;

      font-size: 16px;

      box-shadow: 0 14px 30px -16px rgba(8, 145, 178, 0.85);

      transition: transform 0.18s ease, box-shadow 0.18s ease;

    }

    .btn:hover { transform: translateY(-1px); box-shadow: 0 18px 34px -14px rgba(8, 145, 178, 0.9); }

    section {

      margin: 44px 0;

      padding-top: 8px;

    }

    .section-head {

      display: flex;

      align-items: center;

      gap: 12px;

      margin-bottom: 18px;

    }

    .section-head h2 {

      margin: 0;

      font-size: clamp(1.5rem, 3vw, 2rem);

    }

    .section-head::before {

      content: "";

      width: 42px;

      height: 3px;

      border-radius: 999px;

      background: linear-gradient(90deg, #06b6d4, #0891b2);

      flex-shrink: 0;

    }

    .prose p { margin: 0 0 1rem; color: var(--muted); }

    .benefits-grid {

      display: grid;

      gap: 14px;

    }

    @media (min-width: 640px) {

      .benefits-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }

    }

    .benefit-card, .split-card, .faq-item {

      background: var(--card);

      border: 1px solid var(--line);

      border-radius: var(--radius);

      box-shadow: var(--shadow-soft);

    }

    .benefit-card {

      padding: 20px 20px 18px;

    }

    .benefit-icon {

      width: 36px;

      height: 36px;

      border-radius: 12px;

      margin-bottom: 14px;

      background: linear-gradient(135deg, rgba(6, 182, 212, 0.18), rgba(8, 145, 178, 0.28));

      border: 1px solid rgba(8, 145, 178, 0.15);

    }

    .benefit-card h3 {

      margin: 0 0 8px;

      font-size: 1.15rem;

    }

    .benefit-card p {

      margin: 0;

      color: var(--muted);

      font-size: 15px;

    }

    .check-list, .feature-list {

      margin: 0;

      padding: 0;

      list-style: none;

      display: grid;

      gap: 10px;

    }

    .check-list li, .feature-list li {

      position: relative;

      padding: 14px 16px 14px 44px;

      background: var(--card);

      border: 1px solid var(--line);

      border-radius: 14px;

      color: var(--muted);

    }

    .check-list li::before, .feature-list li::before {

      content: "✓";

      position: absolute;

      left: 16px;

      top: 14px;

      color: var(--success);

      font-weight: 700;

    }

    .split-grid {

      display: grid;

      gap: 14px;

    }

    @media (min-width: 720px) {

      .split-grid { grid-template-columns: 1fr 1fr; }

    }

    .split-card {

      padding: 22px 20px;

    }

    .split-card h2 {

      margin: 0 0 12px;

      font-size: 1.35rem;

    }

    .split-card ul {

      margin: 0;

      padding-left: 1.1rem;

      color: var(--muted);

    }

    .split-card--pros { border-color: rgba(5, 150, 105, 0.18); }

    .split-card--cons { border-color: rgba(220, 38, 38, 0.14); }

    .faq-item {

      padding: 0;

      overflow: hidden;

    }

    .faq-item + .faq-item { margin-top: 10px; }

    summary {

      cursor: pointer;

      list-style: none;

      padding: 16px 18px;

      font-weight: 600;

      color: var(--ink);

    }

    summary::-webkit-details-marker { display: none; }

    .faq-body {

      padding: 0 18px 16px;

      border-top: 1px solid var(--line);

    }

    .faq-body p {

      margin: 14px 0 0;

      color: var(--muted);

    }

    .cta-panel {

      padding: 28px 24px;

      border-radius: calc(var(--radius) + 2px);

      background: linear-gradient(135deg, #0f172a 0%, #164e63 100%);

      color: #f8fafc;

      box-shadow: var(--shadow);

    }

    .cta-panel h2 {

      color: #fff;

      margin: 0 0 12px;

      font-size: clamp(1.6rem, 3vw, 2.2rem);

    }

    .cta-panel p {

      margin: 0 0 20px;

      color: rgba(248, 250, 252, 0.82);

      max-width: 52ch;

    }

    footer {

      margin-top: 28px;

      padding-top: 18px;

      border-top: 1px solid var(--line);

      color: var(--soft);

      font-size: 14px;

    }

    .bar {

      position: sticky;

      bottom: 0;

      z-index: 20;

      padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));

      background: rgba(255, 255, 255, 0.92);

      backdrop-filter: blur(12px);

      border-top: 1px solid var(--line-strong);

      text-align: center;

      box-shadow: 0 -10px 30px rgba(15, 23, 42, 0.08);

    }

  </style>

</head>

<body>

  <div class="wrap">

    <header class="hero">

      <span class="eyebrow">Independent product review</span>

      <h1>${escapeHtml(copy.headline)}</h1>

      <p class="sub">${escapeHtml(copy.subheadline)}</p>

      ${hero}

      <ul class="trust-row">

        <li>Beginner-friendly breakdown</li>

        <li>Updated for today's buyers</li>

        <li>Official link below</li>

      </ul>

      <p><a class="btn" href="${ctaHref}" target="_blank" rel="noopener noreferrer nofollow sponsored">${cta}</a></p>

    </header>



    <section>

      <div class="section-head"><h2>Product introduction</h2></div>

      <div class="prose">${paragraphs(copy.productIntro)}</div>

    </section>



    <section>

      <div class="section-head"><h2>Product overview</h2></div>

      <div class="prose">${paragraphs(copy.overview)}</div>

    </section>



    <section>

      <div class="section-head"><h2>Main benefits</h2></div>

      <div class="benefits-grid">${benefits}</div>

    </section>



    <section>

      <div class="section-head"><h2>Who this is for</h2></div>

      ${listItems(copy.whoFor, "check-list")}

    </section>



    <section>

      <div class="section-head"><h2>Key features</h2></div>

      ${listItems(copy.features, "feature-list")}

    </section>



    <section>

      <div class="section-head"><h2>Pros and cons</h2></div>

      <div class="split-grid">

        <div class="split-card split-card--pros">

          <h2>Pros</h2>

          ${listItems(copy.pros)}

        </div>

        <div class="split-card split-card--cons">

          <h2>Cons</h2>

          ${listItems(copy.cons)}

        </div>

      </div>

    </section>



    <section>

      <div class="section-head"><h2>Our review</h2></div>

      <div class="prose">${paragraphs(copy.review)}</div>

    </section>



    <section>

      <div class="section-head"><h2>Frequently asked questions</h2></div>

      ${faqs}

    </section>



    <section class="cta-panel">

      <h2>Final recommendation</h2>

      <div class="prose">${paragraphs(copy.finalRecommendation)}</div>

      <p><a class="btn" href="${ctaHref}" target="_blank" rel="noopener noreferrer nofollow sponsored">${cta}</a></p>

    </section>



    <footer>

      <p>This page may use affiliate links. If you buy through them, a commission may be earned at no extra cost to you.</p>

    </footer>

  </div>

  <div class="bar"><a class="btn" href="${ctaHref}" target="_blank" rel="noopener noreferrer nofollow sponsored">${cta}</a></div>

</body>

</html>`;

}



export function rebuildMoneyPageHtml(params: {

  siteId: string;

  productName: string;

  copy: MoneyPageCopy;

  ctaUrl: string;

}): string {

  return buildMoneyPageHtml(params);

}

