/**
 * Helper: read batch SQL payloads for MCP execute_sql.
 * Usage: node scripts/execute-recurring-sql-batches.mjs [batchNum]
 * Prints JSON { project_id, query, batch } to stdout.
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const arg = process.argv[2];

function loadBatch(n) {
  const num = String(n).padStart(2, "0");
  const payloadPath = join(dir, `.payload-${num}.json`);
  if (!existsSync(payloadPath)) {
    throw new Error(`Missing payload: ${payloadPath}`);
  }
  const payload = JSON.parse(readFileSync(payloadPath, "utf8"));
  return { batch: num, ...payload };
}

if (arg === "all") {
  const batches = [];
  for (let i = 1; i <= 20; i++) {
    batches.push(loadBatch(i));
  }
  process.stdout.write(JSON.stringify(batches));
} else if (arg) {
  process.stdout.write(JSON.stringify(loadBatch(arg)));
} else {
  console.error("Usage: node scripts/execute-recurring-sql-batches.mjs <1-20|all>");
  process.exit(1);
}
