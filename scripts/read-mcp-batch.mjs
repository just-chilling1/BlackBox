import { readFileSync } from "node:fs";
import { join } from "node:path";

const n = String(process.argv[2] ?? "").padStart(2, "0");
if (!/^\d{2}$/.test(n) || Number(n) < 1 || Number(n) > 20) {
  console.error("Usage: node scripts/read-mcp-batch.mjs <1-20>");
  process.exit(1);
}

const path = join(process.cwd(), "scripts", ".recurring-sql-batches", `.mcp-${n}.json`);
const args = JSON.parse(readFileSync(path, "utf8"));
process.stdout.write(JSON.stringify(args));
