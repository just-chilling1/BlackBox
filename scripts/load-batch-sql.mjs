/**
 * Read batch SQL via fs.readFileSync and write MCP args JSON.
 * Usage: node scripts/load-batch-sql.mjs 02
 */
import { readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { join } from "node:path";

const batch = String(process.argv[2] ?? "").padStart(2, "0");
if (!/^\d{2}$/.test(batch) || batch === "00") {
  console.error("Usage: node scripts/load-batch-sql.mjs <02-20>");
  process.exit(1);
}

const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const sqlPath = join(dir, `${batch}-insert.sql`);
const query = readFileSync(sqlPath, "utf8");
const args = { project_id: "cvkrtzmcbdymeaqznnnl", query };
const outPath = join(dir, `.call-${batch}.json`);
writeFileSync(outPath, JSON.stringify(args), "utf8");
console.log(JSON.stringify({ batch, sqlPath, bytes: query.length, outPath }));
