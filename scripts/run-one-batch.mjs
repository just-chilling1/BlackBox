/**
 * Execute one recurring SQL batch via Supabase MCP execute_sql.
 * Reads SQL from disk and prints JSON args for the agent MCP call.
 *
 * Usage: node scripts/run-one-batch.mjs 02
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const batch = String(process.argv[2] ?? "").padStart(2, "0");
if (!/^\d{2}$/.test(batch) || Number(batch) < 1 || Number(batch) > 20) {
  console.error("Usage: node scripts/run-one-batch.mjs <01-20>");
  process.exit(1);
}

const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const sqlPath = join(dir, `${batch}-insert.sql`);
const logPath = join(dir, ".batch-log.jsonl");

const query = readFileSync(sqlPath, "utf8");
const args = { project_id: "cvkrtzmcbdymeaqznnnl", query, batch };
const outPath = join(dir, ".current-batch.json");
writeFileSync(outPath, JSON.stringify(args), "utf8");

console.log(JSON.stringify({ batch, sqlPath, queryLen: query.length, outPath }));
