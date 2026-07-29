/**
 * Read batch SQL for MCP execute_sql.
 * Usage: node scripts/get-batch-query.mjs 02
 * Prints the raw SQL to stdout (UTF-8).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const n = String(process.argv[2] ?? "").padStart(2, "0");
const path = join(process.cwd(), "scripts", ".recurring-sql-batches", `${n}-insert.sql`);
process.stdout.write(readFileSync(path, "utf8"));
