/**
 * Prepare MCP invoke payloads from SQL files (fs.readFileSync).
 * Usage: node scripts/prepare-mcp-invokes.mjs [from] [to]
 */
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const from = Number(process.argv[2] ?? 2);
const to = Number(process.argv[3] ?? 20);
const logPath = join(dir, "execution-log.jsonl");

for (let i = from; i <= to; i++) {
  const n = String(i).padStart(2, "0");
  const sqlPath = join(dir, `${n}-insert.sql`);
  const query = readFileSync(sqlPath, "utf8");
  const args = { project_id: "cvkrtzmcbdymeaqznnnl", query };
  writeFileSync(join(dir, `.invoke-${n}.json`), JSON.stringify(args), "utf8");
}

console.log(JSON.stringify({ prepared: to - from + 1, from, to, logPath }));
