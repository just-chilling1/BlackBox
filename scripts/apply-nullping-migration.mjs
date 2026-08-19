import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv(path) {
  const text = readFileSync(path, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv(resolve(process.cwd(), ".env.local"));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const sql = readFileSync(
  resolve(process.cwd(), "supabase/migrations/20260819000000_nullping_assets.sql"),
  "utf8"
);

if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function probe() {
  const checks = {};
  const { error: sitesError } = await admin.from("sites").select("id, product_name, product_url, asset_source").limit(1);
  checks.sites = sitesError
    ? { ok: false, code: sitesError.code, message: sitesError.message }
    : { ok: true };
  const { error: pinsError } = await admin.from("site_pins").select("id").limit(1);
  checks.site_pins = pinsError
    ? { ok: false, code: pinsError.code, message: pinsError.message }
    : { ok: true };
  const { error: visitsError } = await admin.from("page_visits").select("id").limit(1);
  checks.page_visits = visitsError
    ? { ok: false, code: visitsError.code, message: visitsError.message }
    : { ok: true };
  return checks;
}

async function tryPgMeta() {
  const endpoints = [`${url}/pg/query`, `${url}/pg-meta/default/query`];
  for (const endpoint of endpoints) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    const text = await res.text();
    console.log("pg-meta", endpoint, res.status, text.slice(0, 400));
    if (res.ok) return true;
  }
  return false;
}

const before = await probe();
console.log("before", JSON.stringify(before, null, 2));

const applied = await tryPgMeta();
if (!applied) {
  console.log("pg-meta unavailable; migration not applied via HTTP");
}

const after = await probe();
console.log("after", JSON.stringify(after, null, 2));

const jwt = JSON.parse(Buffer.from(anonKey.split(".")[1], "base64").toString());
const serviceJwt = JSON.parse(Buffer.from(serviceKey.split(".")[1], "base64").toString());
console.log("project_refs", { urlHost: new URL(url).host, anon: jwt.ref, service: serviceJwt.ref });
