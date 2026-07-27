/**
 * Insert exported accelerator batch JSON into Supabase.
 *
 * Usage:
 *   node scripts/insert-accelerator-from-json.mjs scripts/.accelerator-batch-0.json
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/insert-accelerator-from-json.mjs <batch.json>");
  process.exit(1);
}

loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const admin = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { payloads } = JSON.parse(readFileSync(inputPath, "utf8").replace(/^\uFEFF/, ""));

let inserted = 0;
let skipped = 0;

for (const item of payloads) {
  const { data: existing } = await admin
    .from("sites")
    .select("id")
    .eq("is_template", true)
    .eq("template_key", item.site.template_key)
    .maybeSingle();

  if (existing) {
    skipped++;
    continue;
  }

  const { data: site, error: siteErr } = await admin.from("sites").insert(item.site).select().single();
  if (siteErr) {
    console.error(`Failed ${item.site.template_key}:`, siteErr.message);
    process.exit(1);
  }

  const threadRows = item.threads.map((t) => ({
    user_id: item.site.user_id,
    site_id: site.id,
    text: t.text,
    angle: t.angle,
    batch_id: t.batch_id,
  }));

  const { error: threadErr } = await admin.from("site_x_threads").insert(threadRows);
  if (threadErr) {
    console.error(`Threads failed ${item.site.template_key}:`, threadErr.message);
    process.exit(1);
  }

  inserted++;
  console.log(`Inserted ${item.site.template_key} (${item.site.territory})`);
}

console.log(`Done. inserted=${inserted} skipped=${skipped}`);
