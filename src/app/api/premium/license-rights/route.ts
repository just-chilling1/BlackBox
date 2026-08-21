import { NextResponse } from "next/server";
import { featureApiGuard } from "@/lib/feature-api-guard";
import { getApiUser } from "@/lib/api-auth";
import { NO_STORE_HEADERS } from "@/lib/api-cache-headers";

export const dynamic = "force-dynamic";

export async function GET() {
  const guard = featureApiGuard("premium-license-rights");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const { data, error } = await supabase
    .from("license_rights_requests")
    .select("id, email, status, created_at")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Table may not exist yet before migration — treat as no pending request.
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /does not exist|schema cache/i.test(error.message)
    ) {
      return NextResponse.json({ pending: null }, { headers: NO_STORE_HEADERS });
    }
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json(
    {
      pending: data
        ? {
            id: data.id,
            email: data.email,
            status: data.status,
            submittedAt: data.created_at,
          }
        : null,
    },
    { headers: NO_STORE_HEADERS }
  );
}

export async function POST(request: Request) {
  const guard = featureApiGuard("premium-license-rights");
  if (guard) return guard;

  const { supabase, user } = await getApiUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE_HEADERS });
  }

  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  if (message.length < 10) {
    return NextResponse.json(
      { error: "Please add a bit more detail so we can help you." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const { data, error } = await supabase
    .from("license_rights_requests")
    .insert({
      user_id: user.id,
      email,
      message,
      status: "pending",
    })
    .select("id, email, status, created_at")
    .single();

  if (error) {
    if (
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /does not exist|schema cache/i.test(error.message)
    ) {
      return NextResponse.json(
        {
          error:
            "Database setup incomplete. Run the license_rights_requests migration, then try again.",
          useMailto: true,
        },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500, headers: NO_STORE_HEADERS });
  }

  return NextResponse.json(
    {
      success: true,
      pending: {
        id: data.id,
        email: data.email,
        status: data.status,
        submittedAt: data.created_at,
      },
    },
    { headers: NO_STORE_HEADERS }
  );
}
