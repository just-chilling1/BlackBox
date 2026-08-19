import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ assetId: string }> }
) {
  const guard = featureApiGuard("money-page");
  if (guard) return guard;
  const { supabase, user } = await getApiUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { assetId } = await context.params;
  const { data: site } = await supabase
    .from("sites")
    .select("sales_page_html")
    .eq("id", assetId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!site?.sales_page_html) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(site.sales_page_html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
