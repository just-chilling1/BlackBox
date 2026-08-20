import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import {
  buildAcceleratorCatalog,
  getAcceleratorCardMeta,
  ACCELERATOR_TARGET_COUNT,
} from "@/features/premium-accelerator/lib/catalog";
import { getAcceleratorSeedStatus } from "@/features/premium-accelerator/lib/seed-status";

export const dynamic = "force-dynamic";

/** List accelerator catalog + seed status (reads DB, never regenerates). */
export async function GET(request: Request) {
  const guard = featureApiGuard("premium-accelerator");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const niche = new URL(request.url).searchParams.get("niche")?.trim() || "All";
  const catalog = buildAcceleratorCatalog().filter(
    (e) => niche === "All" || e.nicheLabel === niche
  );

  let seededKeys = new Set<string>();
  let seededCount = 0;
  let ready = false;
  let seedStatusError: string | null = null;

  try {
    const admin = getServiceRoleClient();
    const db = admin ?? supabase;
    const status = await getAcceleratorSeedStatus(db);
    seededKeys = status.seededKeys;
    seededCount = status.seededCount;
    ready = status.ready;
  } catch (e) {
    seedStatusError = e instanceof Error ? e.message : "Failed to read seed status";
  }

  const templates = catalog.map((entry) => {
    const meta = getAcceleratorCardMeta(entry);
    return {
      id: entry.id,
      niche: entry.nicheLabel,
      productName: entry.productName,
      templateName: entry.template.name,
      seeded: seededKeys.has(`accelerator-${entry.id}`),
      accent: meta.accent,
      hook: meta.hook,
      toneLabel: meta.toneLabel,
    };
  });

  return NextResponse.json(
    {
      templates,
      total: ACCELERATOR_TARGET_COUNT,
      seededCount,
      ready,
      ...(seedStatusError ? { seedStatusError } : {}),
    },
    { headers: NO_STORE_HEADERS }
  );
}
