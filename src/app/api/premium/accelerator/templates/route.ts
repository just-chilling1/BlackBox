import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import {
  buildAcceleratorCatalog,
  getAcceleratorCardMeta,
  ACCELERATOR_TARGET_COUNT,
} from "@/features/premium-accelerator/lib/catalog";

export const dynamic = "force-dynamic";

/** List vault catalog entries (deterministic, no DB seeding). */
export async function GET(request: Request) {
  const guard = featureApiGuard("premium-accelerator");
  if (guard) return guard;

  const { user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const niche = new URL(request.url).searchParams.get("niche")?.trim() || "All";
  const catalog = buildAcceleratorCatalog().filter(
    (e) => niche === "All" || e.niche === niche
  );

  const templates = catalog.map((entry) => {
    const meta = getAcceleratorCardMeta(entry);
    return {
      id: entry.id,
      niche: entry.niche,
      productName: entry.productName,
      templateName: meta.toneLabel,
      seeded: true,
      accent: meta.accent,
      hook: meta.hook,
      toneLabel: meta.toneLabel,
      themeLabel: meta.themeLabel,
      colorTheme: entry.colorTheme,
      variationId: entry.variationId,
    };
  });

  return NextResponse.json(
    {
      templates,
      total: ACCELERATOR_TARGET_COUNT,
    },
    { headers: NO_STORE_HEADERS }
  );
}
