import { ImageResponse } from "next/og";
import { getServiceRoleClient } from "@/lib/api-auth";
import { readFile } from "fs/promises";
import path from "path";
import { pinRenderBackgroundCandidates } from "@/features/traffic/lib/pin-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PIN_WIDTH = 1200;
const PIN_HEIGHT = 675;

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

function sniffMime(bytes: Uint8Array): string {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  if (bytes.length >= 4 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image/gif";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return "image/jpeg";
}

/** Fetch photo server-side and embed as data URI so Satori always has pixels. */
async function toDataImageUrl(url: string): Promise<string | null> {
  if (!url || !/^https?:\/\//i.test(url)) return null;
  if (url.startsWith("data:image/")) return url;
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(12_000),
      headers: { "User-Agent": "NullPingPinImage/1.0", Accept: "image/*,*/*" },
      redirect: "follow",
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength < 64) return null;
    const mime = sniffMime(buf);
    return `data:${mime};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export async function GET(
  request: Request,
  context: { params: Promise<{ pinId: string }> }
) {
  const { pinId } = await context.params;
  const supabase = getServiceRoleClient();
  if (!supabase) {
    return new Response("Server misconfigured", { status: 503 });
  }

  let pinQuery = await supabase
    .from("site_pins")
    .select("id, headline, title, site_id, source_image_url, idx")
    .eq("id", pinId)
    .maybeSingle();

  if (pinQuery.error) {
    pinQuery = await supabase
      .from("site_pins")
      .select("id, headline, title, site_id")
      .eq("id", pinId)
      .maybeSingle();
  }

  const pin = pinQuery.data;
  if (!pin) {
    return new Response("Not found", { status: 404 });
  }

  const { data: site } = await supabase
    .from("sites")
    .select("product_name, title, sales_page_json")
    .eq("id", pin.site_id)
    .maybeSingle();

  const copy = (site?.sales_page_json ?? {}) as {
    heroImage?: string;
    pinImages?: Record<string, string>;
  };
  const headline = pin.headline || pin.title || "Read the review";
  const product = site?.product_name || site?.title || "";
  const download = new URL(request.url).searchParams.get("download") === "1";
  const pinIdx = typeof (pin as { idx?: number }).idx === "number" ? (pin as { idx: number }).idx : 0;

  const candidateUrls = pinRenderBackgroundCandidates({
    sourceImageUrl: (pin as { source_image_url?: string | null }).source_image_url,
    pinImageUrl: copy.pinImages?.[pin.id],
    heroImage: copy.heroImage,
    productName: product,
    pinIdx,
    headline,
    width: PIN_WIDTH,
    height: PIN_HEIGHT,
  });

  let backgroundDataUrl: string | null = null;
  for (const candidate of candidateUrls) {
    backgroundDataUrl = await toDataImageUrl(candidate);
    if (backgroundDataUrl) break;
  }

  const fontData = await loadFont();

  const image = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "#E6EDF3",
          fontFamily: "Inter",
        }}
      >
        {backgroundDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={backgroundDataUrl}
            width={PIN_WIDTH}
            height={PIN_HEIGHT}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "linear-gradient(135deg, #0A1020 0%, #050508 55%, #121832 100%)",
            }}
          />
        )}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: backgroundDataUrl
              ? "linear-gradient(90deg, rgba(7,11,15,0.82) 0%, rgba(7,11,15,0.35) 55%, rgba(7,11,15,0.15) 100%)"
              : "transparent",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            width: "100%",
            height: "100%",
            padding: "48px 56px",
          }}
        >
          <div style={{ fontSize: 22, color: "#00F0FF", marginBottom: 16, letterSpacing: 2 }}>
            NULLPING CASH
          </div>
          <div style={{ fontSize: 48, lineHeight: 1.12, fontWeight: 700, maxWidth: 920 }}>
            {headline}
          </div>
          {product ? (
            <div style={{ marginTop: 18, fontSize: 24, color: "#A7B4C2" }}>{product}</div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: PIN_WIDTH,
      height: PIN_HEIGHT,
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
