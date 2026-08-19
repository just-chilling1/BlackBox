import { createPublicSupabaseClient } from "@/lib/supabase-public";
import { headers } from "next/headers";

const BOT_RE = /bot|crawler|spider|crawling|preview|facebookexternalhit|slackbot|twitterbot|linkedinbot|pingdom|lighthouse/i;

export function isBotUserAgent(ua: string): boolean {
  return BOT_RE.test(ua);
}

export async function recordPublicPageVisit(params: {
  siteId: string;
  pinId?: string | null;
  source?: string | null;
}) {
  const headerList = await headers();
  const ua = headerList.get("user-agent") || "";
  if (isBotUserAgent(ua)) return;

  const country =
    headerList.get("x-vercel-ip-country") ||
    headerList.get("cf-ipcountry") ||
    null;

  const supabase = createPublicSupabaseClient();
  await supabase.rpc("record_page_visit", {
    p_site_id: params.siteId,
    p_pin_id: params.pinId || null,
    p_source: params.source || null,
    p_country: country,
  }).then(({ error }) => {
    if (error) console.warn("[visit]", error.message);
  });
}
