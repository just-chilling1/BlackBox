/**
 * Append batch result to execution-log.jsonl
 * Usage: node scripts/log-batch-result.mjs 02 success ""
 *        node scripts/log-batch-result.mjs 02 error "message"
 */
import { appendFileSync } from "node:fs";
import { join } from "node:path";

const batch = String(process.argv[2] ?? "").padStart(2, "0");
const status = process.argv[3] ?? "unknown";
const error = process.argv[4] ?? "";
const entry = {
  batch,
  status,
  error: error || undefined,
  ts: new Date().toISOString(),
};
appendFileSync(
  join(process.cwd(), "scripts", ".recurring-sql-batches", "execution-log.jsonl"),
  JSON.stringify(entry) + "\n",
  "utf8"
);
console.log(JSON.stringify(entry));
