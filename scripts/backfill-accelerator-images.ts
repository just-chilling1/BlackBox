import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

function loadEnvLocal() {
  const path = join(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    process.env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
}

async function main() {
  loadEnvLocal();
  const { createClient } = await import("@supabase/supabase-js");
  const { backfillAcceleratorTemplateImages } = await import(
    "../src/features/premium-accelerator/lib/seed-templates"
  );

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) throw new Error("Missing Supabase env");

  const admin = createClient(url, key, { auth: { persistSession: false } });
  const catalogId = Number(process.argv[2] ?? 2);
  if (process.argv.includes("--all")) {
    const { buildAcceleratorCatalog } = await import("../src/features/premium-accelerator/lib/catalog");
    const catalog = buildAcceleratorCatalog();
    let backfilled = 0;
    let skipped = 0;
    for (const entry of catalog) {
      const result = await backfillAcceleratorTemplateImages(admin, entry.id);
      if (result.backfilled) backfilled += 1;
      else skipped += 1;
      if (entry.id % 25 === 0) {
        console.log(`progress ${entry.id}/200 backfilled=${backfilled} skipped=${skipped}`);
      }
    }
    console.log("done", { backfilled, skipped });
    return;
  }

  const result = await backfillAcceleratorTemplateImages(admin, catalogId);
  console.log("backfill result:", result);
}

main().catch(console.error);
