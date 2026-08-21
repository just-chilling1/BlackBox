import type { EmailOtpType } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export type PendingAuthResult =
  | { status: "ready" }
  | { status: "error"; message: string }
  | { status: "none" };

function cleanAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("token_hash");
  url.searchParams.delete("type");
  if (url.hash.includes("access_token") || url.hash.includes("error")) {
    url.hash = "";
  }
  const next = url.search ? `${url.pathname}${url.search}` : url.pathname;
  window.history.replaceState({}, "", next);
}

/** Exchange signup / recovery tokens from the URL into a browser session. */
export async function completePendingAuthFromUrl(): Promise<PendingAuthResult> {
  const urlParams = new URLSearchParams(window.location.search);
  const urlError = urlParams.get("error");
  if (urlError) {
    return { status: "error", message: urlError };
  }

  const tokenHash = urlParams.get("token_hash");
  const type = urlParams.get("type") as EmailOtpType | null;
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    cleanAuthParamsFromUrl();
    if (error) return { status: "error", message: error.message };
    return { status: "ready" };
  }

  const code = urlParams.get("code");
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    cleanAuthParamsFromUrl();
    if (error) return { status: "error", message: error.message };
    return { status: "ready" };
  }

  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const hashError = hashParams.get("error_description");
  if (hashError) {
    return { status: "error", message: hashError.replace(/\+/g, " ") };
  }

  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
    cleanAuthParamsFromUrl();
    if (error) return { status: "error", message: error.message };
    return { status: "ready" };
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return { status: "ready" };

  return { status: "none" };
}
