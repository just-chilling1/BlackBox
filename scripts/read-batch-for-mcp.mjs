/**
 * Read batch SQL via fs.readFileSync and print MCP execute_sql args as JSON to stdout.
 * Usage: node scripts/read-batch-for-mcp.mjs 03
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const batch = String(process.argv[2] ?? "").padStart(2, "0");
const sqlPath = join(process.cwd(), "scripts", ".recurring-sql-batches", `${batch}-insert.sql`);
const query = readFileSync(sqlPath, "utf8");
process.stdout.write(
  JSON.stringify({ project_id: "cvkrtzmcbdymeaqznnnl", query, batch })
);
