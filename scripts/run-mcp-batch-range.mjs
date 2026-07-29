/**
 * Prepare + log batch SQL reads (fs.readFileSync). Agent calls MCP execute_sql per batch.
 * Usage: node scripts/run-mcp-batch-range.mjs 02 20
 */
import { readFileSync, writeFileSync, appendFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const from = Number(process.argv[2] ?? 2);
const to = Number(process.argv[3] ?? 20);
const logPath = join(dir, "execution-log.jsonl");

if (!existsSync(logPath)) writeFileSync(logPath, "", "utf8");

const summary = [];
for (let i = from; i <= to; i++) {
  const n = String(i).padStart(2, "0");
  const sqlPath = join(dir, `${n}-insert.sql`);
  const query = readFileSync(sqlPath, "utf8");
  writeFileSync(
    join(dir, `.invoke-${n}.json`),
    JSON.stringify({ project_id: "cvkrtzmcbdymeaqznnnl", query }),
    "utf8"
  );
  summary.push({ batch: n, bytes: query.length, sqlPath });
}

writeFileSync(join(dir, ".batch-plan.json"), JSON.stringify({ from, to, batches: summary }, null, 2));
console.log(JSON.stringify({ from, to, count: summary.length }));
