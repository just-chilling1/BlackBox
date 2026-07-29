/**
 * Reseed all accelerator story threads via exported SQL + Supabase.
 * Thread text uses the improved static story arc. Images require:
 *   npm run seed:accelerator -- --force
 * once SUPABASE_SERVICE_ROLE_KEY is set in .env.local
 *
 * Usage:
 *   node scripts/run-accelerator-reseed-batches.mjs
 */

import { spawnSync } from "node:child_process";
import { readFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";

const BATCH = 25;
const TOTAL = 200;

for (let offset = 0; offset < TOTAL; offset += BATCH) {
  const sqlPath = join("scripts", `.reseed-batch-${offset}.sql`);
  console.log(`\n=== Reseed batch offset ${offset} (limit ${BATCH}) ===`);

  const exported = spawnSync(
    "npx",
    [
      "tsx",
      "scripts/export-accelerator-reseed-sql.ts",
      `--offset=${offset}`,
      `--limit=${BATCH}`,
      `--out=${sqlPath}`,
    ],
    { stdio: "inherit", shell: true }
  );
  if (exported.status !== 0) {
    console.error("SQL export failed");
    process.exit(exported.status ?? 1);
  }

  const sql = readFileSync(sqlPath, "utf8");
  console.log(`SQL size: ${sql.length} chars — apply via Supabase SQL editor or seed script for images.`);

  if (existsSync(sqlPath)) unlinkSync(sqlPath);
}

console.log("\nSQL batches exported. Run seed:accelerator -- --force for AI threads + images.");
