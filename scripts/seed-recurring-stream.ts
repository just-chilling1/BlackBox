/**
 * One-time recurring stream article seeder.
 *
 * Usage: npx tsx scripts/seed-recurring-stream.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { seedRecurringStreamArticles } from "../src/features/premium-recurring/lib/seed-articles";
import { RECURRING_STREAM_TARGET_COUNT } from "../src/features/premium-recurring/lib/catalog";

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

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing from .env.local");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing. Add it from Supabase → Project Settings → API → service_role."
    );
  }

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Seeding ${RECURRING_STREAM_TARGET_COUNT} recurring stream articles...`);
  const result = await seedRecurringStreamArticles(admin);

  if (result.skipped) {
    console.log(`Already complete (${result.total}/${RECURRING_STREAM_TARGET_COUNT}).`);
  } else {
    console.log(`Inserted ${result.inserted} articles. Total: ${result.total}/${RECURRING_STREAM_TARGET_COUNT}.`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
