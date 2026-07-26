"use client";

import { parseSalesPageDocument } from "../lib/product-sales-page-html";

interface ProductSiteViewProps {
  html: string;
}

/** Fixes contrast on pages generated before styles were scoped to .product-sales-page-root */
const LEGACY_CONTRAST_FIXES = `
.product-sales-page-root {
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
}
.product-sales-page-root section {
  background: var(--bg);
  color: var(--text);
}
.product-sales-page-root section.alt {
  background: var(--surface);
}
.product-sales-page-root .title,
.product-sales-page-root h2,
.product-sales-page-root h3 {
  color: var(--text) !important;
}
.product-sales-page-root .label {
  color: var(--label, color-mix(in srgb, var(--accent) 35%, white)) !important;
}
.product-sales-page-root .content-item,
.product-sales-page-root .card,
.product-sales-page-root .list li,
.product-sales-page-root .faq,
.product-sales-page-root .problem-item {
  color: var(--card-text, var(--text));
}
.product-sales-page-root .content-item span:last-child,
.product-sales-page-root .faq-q,
.product-sales-page-root .card h3 {
  color: var(--card-text, var(--text));
}
.product-sales-page-root .faq-a,
.product-sales-page-root .card p {
  color: var(--card-muted, var(--muted));
}
`;

/** Renders a generated product promotion sales page (full HTML document stored on the site). */
export function ProductSiteView({ html }: ProductSiteViewProps) {
  const { styles, bodyHtml } = parseSalesPageDocument(html);

  return (
    <div className="product-sales-page-root min-h-screen isolate">
      {styles ? <style dangerouslySetInnerHTML={{ __html: styles }} /> : null}
      <style dangerouslySetInnerHTML={{ __html: LEGACY_CONTRAST_FIXES }} />
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  );
}
