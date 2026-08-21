import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { loadAccountActivity } from "@/lib/account-activity";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = featureApiGuard("protector");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const accountActivity = await loadAccountActivity(supabase, user.id);
  return NextResponse.json(accountActivity, { headers: NO_STORE_HEADERS });
}
