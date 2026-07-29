/**
 * Read one batch SQL (fs.readFileSync) and write exec-now payload for MCP.
 * Usage: node scripts/prepare-exec-now.mjs 02
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const batch = String(process.argv[2] ?? "").padStart(2, "0");
const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const query = readFileSync(join(dir, `${batch}-insert.sql`), "utf8");
const payload = { batch, project_id: "cvkrtzmcbdymeaqznnnl", query };
writeFileSync(join(dir, ".exec-now.json"), JSON.stringify(payload), "utf8");
console.log(JSON.stringify({ batch, bytes: query.length }));
