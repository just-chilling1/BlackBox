/**
 * Prepare batch SQL for agent MCP execute_sql call.
 * Reads via fs.readFileSync, writes .mcp-next.json for CallMcpTool.
 * Usage: node scripts/prepare-mcp-next.mjs 03
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const batch = String(process.argv[2] ?? "").padStart(2, "0");
const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const sqlPath = join(dir, `${batch}-insert.sql`);
const query = readFileSync(sqlPath, "utf8");
const payload = { project_id: "cvkrtzmcbdymeaqznnnl", query, batch };
writeFileSync(join(dir, ".mcp-next.json"), JSON.stringify(payload), "utf8");
console.log(JSON.stringify({ batch, bytes: query.length, sqlPath }));
