import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser, getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import {
  buildAcceleratorCatalog,
  ACCELERATOR_TARGET_COUNT,
} from "@/features/premium-accelerator/lib/catalog";

export const dynamic = "force-dynamic";

/** List accelerator catalog + seed status (reads DB, never regenerates). */
export async function GET(request: Request) {
  const guard = featureApiGuard("premium-accelerator");
  if (guard) return guard;

  const { supabase } = await getApiUser();
  const admin = getServiceRoleClient();

  const niche = new URL(request.url).searchParams.get("niche")?.trim() || "All";
  const catalog = buildAcceleratorCatalog().filter(
    (e) => niche === "All" || e.nicheLabel === niche
  );

  let seededKeys = new Set<string>();
  if (admin) {
    const { data } = await admin
      .from("sites")
      .select("template_key")
      .eq("is_template", true)
      .like("template_key", "accelerator-%");

    seededKeys = new Set(
      (data ?? [])
        .map((r) => (r as { template_key: string }).template_key)
        .filter(Boolean)
    );
  }

  const templates = catalog.map((entry) => ({
    id: entry.id,
    niche: entry.nicheLabel,
    productName: entry.productName,
    templateName: entry.template.name,
    seeded: seededKeys.has(`accelerator-${entry.id}`),
  }));

  const seededCount = seededKeys.size;

  return NextResponse.json(
    {
      templates,
      total: ACCELERATOR_TARGET_COUNT,
      seededCount,
      ready: seededCount >= ACCELERATOR_TARGET_COUNT,
    },
    { headers: NO_STORE_HEADERS }
  );
}
