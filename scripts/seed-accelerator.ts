/**
 * One-time accelerator template seeder.
 *
 * Usage:
 *   npx tsx scripts/seed-accelerator.ts
 *   npx tsx scripts/seed-accelerator.ts --offset=0 --limit=25
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   TEMPLATE_OWNER_ID
 */

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { seedAcceleratorBatch } from "../src/features/premium-accelerator/lib/seed-templates";
import { ACCELERATOR_TARGET_COUNT } from "../src/features/premium-accelerator/lib/catalog";

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

function parseArg(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const hit = process.argv.find((a) => a.startsWith(prefix));
  if (!hit) return fallback;
  const n = Number(hit.slice(prefix.length));
  return Number.isFinite(n) ? n : fallback;
}

async function main() {
  loadEnvLocal();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const ownerId = process.env.TEMPLATE_OWNER_ID?.trim();

  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing from .env.local");
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is missing. Add it from Supabase → Project Settings → API → service_role."
    );
  }
  if (!ownerId) {
    throw new Error(
      "TEMPLATE_OWNER_ID is missing. Set it to a real auth.users id that owns shared templates."
    );
  }

  const batchSize = parseArg("limit", 25);
  let offset = parseArg("offset", 0);
  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log(`Seeding accelerator templates (${ACCELERATOR_TARGET_COUNT} total)...`);

  while (offset < ACCELERATOR_TARGET_COUNT) {
    const result = await seedAcceleratorBatch(admin, offset, batchSize);
    console.log(
      `offset=${offset} seeded=${result.seeded} skipped=${result.skipped} progress=${Math.min(offset + batchSize, result.total)}/${result.total}`
    );

    if (result.complete) {
      console.log("Accelerator seed complete.");
      break;
    }

    offset += batchSize;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
