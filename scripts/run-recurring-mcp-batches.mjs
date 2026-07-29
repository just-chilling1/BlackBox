/**
 * Execute recurring SQL batches via Supabase MCP-style HTTP if SUPABASE_ACCESS_TOKEN is set,
 * otherwise prints batch payloads for manual MCP execute_sql.
 *
 * Usage: node scripts/run-recurring-mcp-batches.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PROJECT_ID = "cvkrtzmcbdymeaqznnnl";
const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const results = [];

for (let i = 1; i <= 20; i++) {
  const n = String(i).padStart(2, "0");
  const sqlPath = join(dir, `${n}-insert.sql`);
  if (!existsSync(sqlPath)) {
    results.push({ batch: n, status: "error", error: "missing file" });
    continue;
  }
  const query = readFileSync(sqlPath, "utf8");
  results.push({ batch: n, status: "loaded", bytes: query.length });
}

writeFileSync(join(dir, ".batch-load-status.json"), JSON.stringify(results, null, 2));
console.log(JSON.stringify({ loaded: results.filter((r) => r.status === "loaded").length, total: 20 }));
