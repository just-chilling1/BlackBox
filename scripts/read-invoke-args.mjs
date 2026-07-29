/**
 * Read invoke JSON and print MCP args for one batch (UTF-8 safe).
 * Usage: node scripts/read-invoke-args.mjs 02
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const n = String(process.argv[2] ?? "").padStart(2, "0");
const path = join(process.cwd(), "scripts", ".recurring-sql-batches", `.invoke-${n}.json`);
const args = JSON.parse(readFileSync(path, "utf8"));
process.stdout.write(JSON.stringify(args));
