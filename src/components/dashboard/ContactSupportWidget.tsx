"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CheckCircle2, Headphones, Loader2, Mail } from "lucide-react";
import { getCachedClientUser } from "@/lib/auth-client-cache";
import { APP_SUPPORT_NAME, SUPPORT_EMAIL } from "@/lib/support";
import { trainingContent } from "@/config/training.config";
import { DashboardSection } from "./DashboardSection";

type FormState = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full min-w-0 rounded-lg border border-border-dim/70 bg-page/80 px-3.5 py-3 text-sm leading-normal text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all";

const embeddedFieldClass =
  "w-full min-w-0 rounded-lg border border-border-dim/70 bg-white px-3.5 py-3 text-sm leading-normal text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:shadow-[0_0_16px_rgba(238,179,16,0.12)] transition-all";

const embeddedLabelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-accent-readable";

async function parseJsonResponse(res: Response) {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as { error?: string; useMailto?: boolean; success?: boolean };
  } catch {
    return null;
  }
}

function openMailto(email: string, message: string) {
  const subject = `${APP_SUPPORT_NAME} — Support Request`;
  const body = `Please reply to: ${email}\n\n${message}`;
  window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactSupportWidget({ embedded = false }: { embedded?: boolean }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [sentViaMailto, setSentViaMailto] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const finishSuccess = (addr: string, mailto: boolean) => {
    setSubmittedEmail(addr);
    setSentViaMailto(mailto);
    setFormState("success");
  };

  const resetForm = () => {
    setFormState("idle");
    setMessage("");
    setSentViaMailto(false);
    setErrorMessage("");
  };

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setErrorMessage("");
      const trimmedEmail = email.trim();
      const trimmedMessage = message.trim();
      if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        setErrorMessage("Please enter a valid email address.");
        setFormState("error");
        return;
      }
      if (trimmedMessage.length < 10) {
        setErrorMessage("Please add a bit more detail so we can help you.");
        setFormState("error");
        return;
      }
      setFormState("submitting");
      try {
        const res = await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage }),
        });
        const data = await parseJsonResponse(res);
        if (data === null || data.useMailto) {
          openMailto(trimmedEmail, trimmedMessage);
          finishSuccess(trimmedEmail, true);
          return;
        }
        if (res.ok && data.success) {
          finishSuccess(trimmedEmail, false);
          return;
        }
        throw new Error(data.error || "Something went wrong.");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
        setFormState("error");
      }
    },
    [email, message]
  );

  if (embedded && formState === "success") {
    return (
      <div className="support-widget-card min-w-0 overflow-hidden rounded-xl border border-accent/20 bg-white p-5">
        <div className="flex flex-col items-center space-y-5">
          <div className="rounded-full border border-green-500/30 bg-green-500/10 p-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-text-heading">
            {sentViaMailto ? "Check your email app" : "Message sent"}
          </h3>
          <p className="w-full text-sm leading-relaxed text-text-secondary">
            {sentViaMailto ? (
              <>
                Your email app should open with your message ready to send. Tap{" "}
                <span className="font-semibold text-text-primary">Send</span> to deliver it — then
                we&apos;ll reply to{" "}
                <span className="break-all font-semibold text-accent-readable">{submittedEmail}</span>.
                We usually respond within about 2 hours.
              </>
            ) : (
              <>
                We&apos;ll reply to{" "}
                <span className="break-all font-semibold text-accent-readable">{submittedEmail}</span>.
                We usually respond within about 2 hours.
              </>
            )}
          </p>
          {trainingContent.externalTrainingUrl ? (
            <div className="w-full border-t border-border-dim/70 pt-5">
              <a
                href={trainingContent.externalTrainingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-accent px-4 py-3 text-center text-xs font-black uppercase text-black shadow-gold transition-all hover:brightness-105"
              >
                Watch Free Training
              </a>
            </div>
          ) : null}
          <button type="button" onClick={resetForm} className="btn-secondary w-full py-2.5">
            Send another message
          </button>
        </div>
      </div>
    );
  }

  if (!embedded && formState === "success") {
    return (
      <DashboardSection className="min-w-0 space-y-5">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-green-500/30 bg-green-500/10">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="ds-h3">{sentViaMailto ? "Check your email app" : "Message sent"}</h3>
          <p className="mt-3 w-full text-sm leading-relaxed text-text-secondary text-left">
            We&apos;ll reply to{" "}
            <span className="break-all font-semibold text-text-primary">{submittedEmail}</span>.
          </p>
        </div>
        {trainingContent.externalTrainingUrl ? (
          <div className="border-t border-border-dim/30 pt-5">
            <a
              href={trainingContent.externalTrainingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-xl bg-accent px-4 py-3 text-center text-xs font-black uppercase text-black"
            >
              Watch Free Training
            </a>
          </div>
        ) : null}
        <button type="button" onClick={resetForm} className="btn-secondary w-full min-h-[44px]">
          Send another message
        </button>
      </DashboardSection>
    );
  }

  if (embedded) {
    return (
      <div className="support-widget-card min-w-0 overflow-hidden rounded-xl border border-accent/20 bg-white p-5">
        <div className="mb-4 flex min-w-0 items-center gap-3">
          <div className="shrink-0 rounded-xl border border-accent/20 bg-accent/10 p-2.5">
            <Headphones className="h-5 w-5 text-accent-readable" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-text-heading">Contact Support</h3>
        </div>

        <div className="space-y-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            We usually reply within about 2 hours. Because of high email volume, please allow{" "}
            <span className="font-medium text-text-primary">24–48 hours</span> during busy periods.
            Your answer will go to the email you enter below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="min-w-0">
              <label htmlFor="support-email" className={embeddedLabelClass}>
                Your email
              </label>
              <input
                id="support-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={formState === "submitting"}
                className={embeddedFieldClass}
                placeholder="you@example.com"
              />
            </div>
            <div className="min-w-0">
              <label htmlFor="support-message" className={embeddedLabelClass}>
                Your message
              </label>
              <textarea
                id="support-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={formState === "submitting"}
                rows={4}
                className={`${embeddedFieldClass} min-h-[112px] resize-y`}
                placeholder="Tell us what you need help with..."
              />
            </div>
            {formState === "error" && errorMessage ? (
              <p className="text-sm text-red-500">{errorMessage}</p>
            ) : null}
            <p className="rounded-lg border border-border-dim/70 bg-page/60 px-3.5 py-3 text-xs leading-relaxed text-text-muted">
              <span className="font-semibold text-text-secondary">Please note:</span> We will reply to the
              email address you enter above. If you don&apos;t see our reply within 48 hours, check your
              spam or junk folder before reaching out again.
            </p>
            <button type="submit" disabled={formState === "submitting"} className="btn-primary w-full py-2.5">
              {formState === "submitting" ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </span>
              ) : (
                "Send message"
              )}
            </button>
          </form>

          <div className="rounded-xl border border-border-dim/60 bg-page/50 px-4 py-3.5">
            <div className="flex min-w-0 items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
              <div className="min-w-0 space-y-1">
                <p className="text-xs leading-relaxed text-text-muted">
                  If the form doesn&apos;t work, email us directly:
                </p>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="block whitespace-nowrap text-sm font-semibold leading-snug text-accent-readable hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardSection className="min-w-0 space-y-5">
      <div className="dashboard-section-header mb-0 pb-0">
        <div className="dashboard-section-icon">
          <Headphones size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="ds-h3">Contact Support</h3>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="support-email" className="mb-2 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Your email
          </label>
          <input
            id="support-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={formState === "submitting"}
            className={fieldClass}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="support-message" className="mb-2 block text-xs font-bold uppercase tracking-wide text-text-muted">
            Your message
          </label>
          <textarea
            id="support-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={formState === "submitting"}
            rows={4}
            className={`${fieldClass} min-h-[112px] resize-y`}
            placeholder="Tell us what you need help with..."
          />
        </div>
        {formState === "error" && errorMessage ? (
          <p className="text-sm text-red-400">{errorMessage}</p>
        ) : null}
        <button type="submit" disabled={formState === "submitting"} className="btn-primary w-full min-h-[48px]">
          {formState === "submitting" ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Sending...
            </span>
          ) : (
            "Send message"
          )}
        </button>
      </form>
      <div className="dashboard-nested-card flex gap-3 px-4 py-3.5">
        <Mail className="shrink-0 text-text-muted" size={16} />
        <div className="min-w-0">
          <p className="text-xs text-text-muted">If the form doesn&apos;t work, email us:</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="block whitespace-nowrap text-sm font-semibold text-accent hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </DashboardSection>
  );
}
