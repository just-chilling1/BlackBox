import { NextResponse } from "next/server";
import { getServiceRoleClient } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";
import { ACCELERATOR_TARGET_COUNT } from "@/features/premium-accelerator/lib/catalog";
import {
  countSeededAcceleratorTemplates,
  seedAcceleratorTemplates,
} from "@/features/premium-accelerator/lib/seed-vault-templates";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/**
 * Admin batch seed for Unlimited (200 money-page templates).
 * Header: x-accelerator-seed-secret: ACCELERATOR_SEED_SECRET
 * Query: ?offset=0&limit=25
 */
export async function POST(request: Request) {
  const secret = process.env.ACCELERATOR_SEED_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "ACCELERATOR_SEED_SECRET is not configured" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const provided = request.headers.get("x-accelerator-seed-secret")?.trim();
  if (!provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const ownerId = process.env.TEMPLATE_OWNER_ID?.trim();
  if (!ownerId) {
    return NextResponse.json(
      { error: "TEMPLATE_OWNER_ID is not configured" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const admin = getServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const url = new URL(request.url);
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? "0") || 0);
  const limit = Math.max(
    1,
    Math.min(50, Number(url.searchParams.get("limit") ?? "25") || 25)
  );
  const force = url.searchParams.get("force") === "1";

  const result = await seedAcceleratorTemplates({
    admin,
    ownerId,
    offset,
    limit,
    force,
  });

  return NextResponse.json(
    {
      ...result,
      target: ACCELERATOR_TARGET_COUNT,
      offset,
      limit,
    },
    { headers: NO_STORE_HEADERS }
  );
}

export async function GET(request: Request) {
  const secret = process.env.ACCELERATOR_SEED_SECRET?.trim();
  const provided = request.headers.get("x-accelerator-seed-secret")?.trim();
  if (!secret || !provided || provided !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const admin = getServiceRoleClient();
  if (!admin) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY is not configured" },
      { status: 503, headers: NO_STORE_HEADERS }
    );
  }

  const total = await countSeededAcceleratorTemplates(admin);
  return NextResponse.json(
    {
      total,
      target: ACCELERATOR_TARGET_COUNT,
      complete: total >= ACCELERATOR_TARGET_COUNT,
    },
    { headers: NO_STORE_HEADERS }
  );
}
