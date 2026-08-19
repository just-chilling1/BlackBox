import { ImageResponse } from "next/og";
import { getServiceRoleClient } from "@/lib/api-auth";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function loadFont(): Promise<ArrayBuffer | undefined> {
  const file = path.join(process.cwd(), "public", "fonts", "Inter-Bold.ttf");
  try {
    const buf = await readFile(file);
    const magic = buf.subarray(0, 4).toString("ascii");
    const valid =
      magic === "\0\u0001\0\0" || magic === "OTTO" || magic === "true" || magic === "wOFF" || magic === "wOF2";
    if (!valid) return undefined;
    return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  } catch {
    return undefined;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ pinId: string }> }
) {
  const { pinId } = await context.params;
  // Service role: pin images are public download URLs; owner-only RLS would 404 them.
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return new Response("Server misconfigured", { status: 503 });
  }

  const { data: pin } = await supabase
    .from("site_pins")
    .select("id, headline, title, site_id")
    .eq("id", pinId)
    .maybeSingle();

  if (!pin) {
    return new Response("Not found", { status: 404 });
  }

  const { data: site } = await supabase
    .from("sites")
    .select("product_name, title, sales_page_json")
    .eq("id", pin.site_id)
    .maybeSingle();

  const copy = (site?.sales_page_json ?? {}) as { heroImage?: string };
  const headline = pin.headline || pin.title || "Read the review";
  const product = site?.product_name || site?.title || "";
  const download = new URL(request.url).searchParams.get("download") === "1";

  let fontData: ArrayBuffer | undefined;
  fontData = await loadFont();

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: copy.heroImage
            ? `linear-gradient(180deg, rgba(7,11,15,0.15) 0%, rgba(7,11,15,0.82) 70%), url(${copy.heroImage})`
            : "linear-gradient(165deg, #102630 0%, #070B0F 55%, #04202B 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#E6EDF3",
          padding: "72px 64px",
          fontFamily: "Inter",
        }}
      >
        <div style={{ fontSize: 28, color: "#22D3EE", marginBottom: 24, letterSpacing: 2 }}>
          NULLPING CASH
        </div>
        <div style={{ fontSize: 64, lineHeight: 1.1, fontWeight: 700, maxWidth: 880 }}>
          {headline}
        </div>
        {product ? (
          <div style={{ marginTop: 28, fontSize: 28, color: "#A7B4C2" }}>{product}</div>
        ) : null}
      </div>
    ),
    {
      width: 1000,
      height: 1500,
      fonts: fontData
        ? [{ name: "Inter", data: fontData, weight: 700, style: "normal" }]
        : undefined,
      headers: download
        ? {
            "Content-Disposition": `attachment; filename="pin-${pinId.slice(0, 8)}.png"`,
          }
        : undefined,
    }
  );

  return image;
}
