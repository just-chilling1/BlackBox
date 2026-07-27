/**
 * Convert export-accelerator-batch JSON to SQL for Supabase MCP execute_sql.
 *
 * Usage:
 *   node scripts/json-to-accelerator-sql.mjs scripts/.accelerator-batch-0.json
 */

import { readFileSync, writeFileSync } from "node:fs";

const inputPath = process.argv[2];
const outputPath = process.argv[3];
if (!inputPath) {
  console.error("Usage: node scripts/json-to-accelerator-sql.mjs <batch.json> [output.sql]");
  process.exit(1);
}

const raw = readFileSync(inputPath, "utf8").replace(/^\uFEFF/, "");
const { payloads } = JSON.parse(raw);

function dollarQuote(value, tagBase) {
  let tag = `$${tagBase}$`;
  while (value.includes(tag)) tag = `$${tagBase}_${Math.random().toString(36).slice(2, 8)}$`;
  return `${tag}${value}${tag}`;
}

const statements = [];

for (const item of payloads) {
  const s = item.site;
  const htmlTag = `html_${item.catalogId}`;
  const html = dollarQuote(s.sales_page_html, htmlTag);
  const siteJson = dollarQuote(JSON.stringify(s.sales_page_json), `json_${item.catalogId}`);
  const themeJson = dollarQuote(JSON.stringify(s.theme_config), `theme_${item.catalogId}`);

  statements.push(`
INSERT INTO public.sites (
  id, user_id, hobby, territory, title, tagline, slug, theme, theme_config,
  armed_links, status, site_type, is_template, template_key, sales_page_html, sales_page_json
)
SELECT
  '${s.id}'::uuid,
  '${s.user_id}'::uuid,
  ${dollarQuote(s.hobby, `hobby_${item.catalogId}`)},
  ${dollarQuote(s.territory, `terr_${item.catalogId}`)},
  ${dollarQuote(s.title, `title_${item.catalogId}`)},
  ${dollarQuote(s.tagline, `tag_${item.catalogId}`)},
  ${dollarQuote(s.slug, `slug_${item.catalogId}`)},
  ${dollarQuote(s.theme, `themeid_${item.catalogId}`)},
  ${themeJson}::jsonb,
  '[]'::jsonb,
  'live',
  'product',
  true,
  ${dollarQuote(s.template_key, `tkey_${item.catalogId}`)},
  ${html},
  ${siteJson}::jsonb
WHERE NOT EXISTS (
  SELECT 1 FROM public.sites WHERE template_key = ${dollarQuote(s.template_key, `tkeychk_${item.catalogId}`)}
);
`.trim());

  for (let i = 0; i < item.threads.length; i++) {
    const t = item.threads[i];
    statements.push(`
INSERT INTO public.site_x_threads (user_id, site_id, text, angle, batch_id)
VALUES (
  '${s.user_id}'::uuid,
  '${s.id}'::uuid,
  ${dollarQuote(t.text, `thread_${item.catalogId}_${i}`)},
  ${dollarQuote(t.angle, `angle_${item.catalogId}_${i}`)},
  '${t.batch_id}'::uuid
);
`.trim());
  }
}

const sql = statements.join("\n\n");
if (outputPath) {
  writeFileSync(outputPath, sql, "utf8");
} else {
  process.stdout.write(sql);
}
