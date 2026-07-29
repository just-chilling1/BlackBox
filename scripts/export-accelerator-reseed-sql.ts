/**
 * Export SQL to reseed accelerator story threads (static arc + improved copy).
 *
 * Usage:
 *   npx tsx scripts/export-accelerator-reseed-sql.ts --offset=0 --limit=25
 *   npx tsx scripts/export-accelerator-reseed-sql.ts --offset=0 --limit=25 --out=scripts/.reseed-batch-0.sql
 */

import { writeFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import {
  acceleratorTemplateKey,
  buildAcceleratorCatalog,
} from "../src/features/premium-accelerator/lib/catalog";
import { buildStaticAcceleratorXThreadSeedRows } from "../src/features/premium-accelerator/lib/x-thread-seeds";

const TEMPLATE_OWNER_ID =
  process.env.TEMPLATE_OWNER_ID?.trim() || "4d899e3a-6307-4077-96e9-21380464649c";

function parseArg(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  if (!hit) return fallback;
  const n = Number(hit.slice(prefix.length));
  return Number.isFinite(n) ? n : fallback;
}

function parseStringArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  return hit ? hit.slice(prefix.length).trim() : undefined;
}

function sqlLiteral(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

const offset = parseArg("offset", 0);
const limit = parseArg("limit", 25);
const catalog = buildAcceleratorCatalog().slice(offset, offset + limit);

const statements: string[] = ["BEGIN;"];

for (const entry of catalog) {
  const templateKey = acceleratorTemplateKey(entry.id);
  const batchId = randomUUID();
  const rows = buildStaticAcceleratorXThreadSeedRows(
    entry.productName,
    entry.nicheLabel,
    entry.nicheKey
  );

  statements.push(`
DELETE FROM site_x_threads
WHERE site_id = (
  SELECT id FROM sites
  WHERE is_template = true AND template_key = ${sqlLiteral(templateKey)}
  LIMIT 1
);`);

  for (const row of rows) {
    statements.push(`
INSERT INTO site_x_threads (user_id, site_id, text, angle, batch_id, image_url)
SELECT
  ${sqlLiteral(TEMPLATE_OWNER_ID)},
  s.id,
  ${sqlLiteral(row.text)},
  ${sqlLiteral(row.angle)},
  ${sqlLiteral(batchId)},
  NULL
FROM sites s
WHERE s.is_template = true AND s.template_key = ${sqlLiteral(templateKey)}
LIMIT 1;`);
  }
}

statements.push("COMMIT;");
const sql = statements.join("\n");
const outPath = parseStringArg("out");
if (outPath) {
  writeFileSync(outPath, sql, "utf8");
} else {
  process.stdout.write(sql);
}
