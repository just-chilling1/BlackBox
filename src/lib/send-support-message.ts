import { APP_SUPPORT_NAME, RESEND_SENDER_EMAIL, SUPPORT_EMAIL } from "@/lib/support";

const FRESHDESK_DOMAIN = process.env.FRESHDESK_DOMAIN || "neoaifreshdesk";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

/** Single-line, bounded subject for email/ticket headers. */
function sanitizeSubject(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.replace(/[\r\n]+/g, " ").trim().slice(0, 80);
}

function ticketBody(email: string, message: string, userId: string, requestType: string) {
  const requestTypeText = requestType ? `Request type: ${requestType}\n` : "";
  const requestTypeHtml = requestType
    ? `<br><strong>Request type:</strong> ${escapeHtml(requestType)}`
    : "";

  return {
    text: `Customer email: ${email}\nSoftware: ${APP_SUPPORT_NAME}\n${requestTypeText}\nCustomer inquiry is:\n${message}\n\n---\nUser ID: ${userId}`,
    html: `<p><strong>Customer email:</strong> ${escapeHtml(email)}<br><strong>Software:</strong> ${APP_SUPPORT_NAME}${requestTypeHtml}</p><p><strong>Customer inquiry is:</strong></p><p>${escapeHtml(message)}</p><p><em>User ID: ${userId}</em></p>`,
  };
}

async function sendViaResend(
  email: string,
  message: string,
  userId: string,
  requestType: string
): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const from =
    process.env.RESEND_FROM_EMAIL || `${APP_SUPPORT_NAME} <${RESEND_SENDER_EMAIL}>`;
  const { text, html } = ticketBody(email, message, userId, requestType);
  const subject = requestType
    ? `${APP_SUPPORT_NAME} — ${requestType} from ${email}`
    : `${APP_SUPPORT_NAME} support request from ${email}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [SUPPORT_EMAIL],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[support] Resend error:", res.status, detail);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[support] Resend error:", error);
    return false;
  }
}

async function sendViaFreshdesk(
  email: string,
  message: string,
  userId: string,
  requestType: string
): Promise<boolean> {
  const apiKey = process.env.FRESHDESK_API_KEY;
  if (!apiKey) return false;

  const auth = Buffer.from(`${apiKey}:X`).toString("base64");
  const { html } = ticketBody(email, message, userId, requestType);
  const subject = requestType
    ? `${APP_SUPPORT_NAME} — ${requestType}`
    : `${APP_SUPPORT_NAME} — Dashboard Support Request`;

  try {
    const res = await fetch(`https://${FRESHDESK_DOMAIN}.freshdesk.com/api/v2/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({
        email,
        subject,
        description: html,
        priority: 2,
        status: 2,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("[support] Freshdesk error:", res.status, detail);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[support] Freshdesk error:", error);
    return false;
  }
}

/** Freshdesk ticket first, Resend email if that fails. Never opens a local mail client. */
export async function sendSupportMessage(options: {
  email: string;
  message: string;
  userId: string;
  subject?: string;
}): Promise<boolean> {
  const requestType = sanitizeSubject(options.subject);
  const viaFreshdesk = await sendViaFreshdesk(
    options.email,
    options.message,
    options.userId,
    requestType
  );
  if (viaFreshdesk) return true;
  return sendViaResend(options.email, options.message, options.userId, requestType);
}
