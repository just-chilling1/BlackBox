import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

interface ArticleRow {
  templateKey: string;
  niche: string;
  title: string;
  slug: string;
  html: string;
  excerpt: string;
  metaDescription: string;
  angle: string;
}

function dollarQuote(value: string): string {
  let tag = "$body$";
  let i = 0;
  while (value.includes(tag)) {
    tag = `$body${i}$`;
    i += 1;
  }
  return `${tag}${value}${tag}`;
}

function sqlString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

const catalog = JSON.parse(
  readFileSync(join(process.cwd(), "scripts", ".recurring-catalog.json"), "utf8")
) as ArticleRow[];

const batchSize = 5;
const outDir = join(process.cwd(), "scripts", ".recurring-sql-batches");
mkdirSync(outDir, { recursive: true });

const deleteSql = `DELETE FROM premium_article_templates WHERE template_key LIKE 'recurring-stream-%';`;
writeFileSync(join(outDir, "00-delete.sql"), deleteSql);

let batchIndex = 1;
for (let i = 0; i < catalog.length; i += batchSize) {
  const slice = catalog.slice(i, i + batchSize);
  const values = slice
    .map((article) => {
      return `(
  ${sqlString(article.templateKey)},
  ${sqlString(article.niche)},
  ${sqlString(article.title)},
  ${sqlString(article.slug)},
  ${dollarQuote(article.html)},
  ${sqlString(article.excerpt)},
  ${sqlString(article.metaDescription)},
  ${sqlString(article.angle)}
)`;
    })
    .join(",\n");

  const sql = `INSERT INTO premium_article_templates (
  template_key, niche, title, slug, html, excerpt, meta_description, angle
) VALUES
${values}
ON CONFLICT (template_key) DO UPDATE SET
  niche = EXCLUDED.niche,
  title = EXCLUDED.title,
  slug = EXCLUDED.slug,
  html = EXCLUDED.html,
  excerpt = EXCLUDED.excerpt,
  meta_description = EXCLUDED.meta_description,
  angle = EXCLUDED.angle;`;

  const file = join(outDir, `${String(batchIndex).padStart(2, "0")}-insert.sql`);
  writeFileSync(file, sql);
  batchIndex += 1;
}

console.log(`Generated ${batchIndex - 1} insert batches in ${outDir}`);
