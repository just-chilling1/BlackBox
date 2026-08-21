import fs from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
}

const SUPPORT_EMAIL = "NullPingProfit@neoai.freshdesk.com";
const APP_SUPPORT_NAME = "NullPing Cash";
const RESEND_SENDER =
  process.env.RESEND_FROM_EMAIL || `${APP_SUPPORT_NAME} <support@reliteagency.com>`;

async function testFreshdesk() {
  const key = process.env.FRESHDESK_API_KEY;
  if (!key) return { ok: false, reason: "FRESHDESK_API_KEY not set" };

  const domain = process.env.FRESHDESK_DOMAIN || "neoaifreshdesk";
  const auth = Buffer.from(`${key}:X`).toString("base64");
  const res = await fetch(`https://${domain}.freshdesk.com/api/v2/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
    body: JSON.stringify({
      email: "test@example.com",
      subject: `${APP_SUPPORT_NAME} — API test`,
      description: "<p>Automated support API verification test — please ignore/delete.</p>",
      priority: 2,
      status: 2,
    }),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 400) };
}

async function testResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, reason: "RESEND_API_KEY not set" };

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: RESEND_SENDER,
      to: [SUPPORT_EMAIL],
      reply_to: "test@example.com",
      subject: `${APP_SUPPORT_NAME} support request from test@example.com`,
      text: "Automated support API verification test — please ignore.",
    }),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 400) };
}

console.log("Env:", {
  freshdesk: Boolean(process.env.FRESHDESK_API_KEY),
  resend: Boolean(process.env.RESEND_API_KEY),
  from: RESEND_SENDER,
});
console.log("Freshdesk:", await testFreshdesk());
console.log("Resend:", await testResend());
