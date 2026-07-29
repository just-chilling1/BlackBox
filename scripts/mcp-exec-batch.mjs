/**
 * Execute one recurring SQL batch file via Supabase MCP HTTP (requires Cursor auth).
 * Fallback: writes payload for agent MCP execute_sql.
 *
 * Usage: node scripts/mcp-exec-batch.mjs 01
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const batch = process.argv[2];
if (!batch) {
  console.error("Usage: node scripts/mcp-exec-batch.mjs <01-20>");
  process.exit(1);
}

const n = String(batch).padStart(2, "0");
const dir = join(process.cwd(), "scripts", ".recurring-sql-batches");
const args = JSON.parse(readFileSync(join(dir, `.mcp-${n}.json`), "utf8"));

const body = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: {
    name: "execute_sql",
    arguments: {
      project_id: args.project_id,
      query: args.query,
    },
  },
};

const url = `https://mcp.supabase.com/mcp?project_ref=${args.project_id}`;

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  writeFileSync(join(dir, `.result-${n}.json`), text, "utf8");
  console.log(JSON.stringify({ batch: n, status: res.status, ok: res.ok, bytes: text.length }));
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err);
  writeFileSync(join(dir, `.result-${n}.json`), JSON.stringify({ error: msg }), "utf8");
  console.log(JSON.stringify({ batch: n, status: "error", error: msg }));
  process.exit(1);
}
