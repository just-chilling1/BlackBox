/**
 * Export + insert all 200 accelerator templates in batches of 25.
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local.
 *
 * Usage: node scripts/seed-all-accelerator-batches.mjs
 */

import { spawnSync } from "node:child_process";
import { writeFileSync, unlinkSync, existsSync } from "node:fs";
import { join } from "node:path";

const BATCH = 25;
const TOTAL = 200;
const nodeDir = "C:\\Program Files\\nodejs";
const env = { ...process.env, Path: `${nodeDir};${process.env.Path ?? ""}` };

function runNode(args) {
  const result = spawnSync("node", args, { stdio: "inherit", env, shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

for (let offset = 0; offset < TOTAL; offset += BATCH) {
  const jsonPath = join("scripts", `.accelerator-batch-${offset}.json`);
  console.log(`\n=== Batch offset ${offset} (limit ${BATCH}) ===`);

  const exported = spawnSync(
    "npx",
    ["tsx", "scripts/export-accelerator-batch.ts", `--offset=${offset}`, `--limit=${BATCH}`],
    { encoding: "utf8", env, shell: true }
  );
  if (exported.status !== 0) {
    console.error(exported.stderr || "Export failed");
    process.exit(exported.status ?? 1);
  }

  writeFileSync(jsonPath, exported.stdout, "utf8");
  runNode(["scripts/insert-accelerator-from-json.mjs", jsonPath]);
  if (existsSync(jsonPath)) unlinkSync(jsonPath);
}

console.log("\nAll accelerator batches complete.");
