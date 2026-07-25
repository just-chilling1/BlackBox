"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CheckCircle2, Headphones, Loader2, Mail } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { APP_SUPPORT_NAME, SUPPORT_EMAIL } from "@/lib/support";
import { trainingContent } from "@/config/training.config";

type FormState = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full min-w-0 rounded-xl border border-border-dim/50 bg-page/80 px-3.5 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

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

export function ContactSupportWidget() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [sentViaMailto, setSentViaMailto] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const finishSuccess = (addr: string, mailto: boolean) => {
    setSubmittedEmail(addr);
    setSentViaMailto(mailto);
    setFormState("success");
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

  if (formState === "success") {
    return (
      <div className="card-base min-w-0 overflow-hidden border-accent/20 p-5 space-y-5">
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
        <button
          type="button"
          onClick={() => {
            setFormState("idle");
            setMessage("");
          }}
          className="btn-secondary w-full min-h-[44px]"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="card-base min-w-0 overflow-hidden border-accent/20 p-5 space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/20">
          <Headphones className="text-accent" size={22} />
        </div>
        <h3 className="ds-h3">Contact Support</h3>
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
      <div className="rounded-xl border border-border-dim/40 px-4 py-3.5 flex gap-3">
        <Mail className="shrink-0 text-text-muted" size={16} />
        <div className="min-w-0">
          <p className="text-xs text-text-muted">If the form doesn&apos;t work, email us:</p>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="block break-all text-sm font-semibold text-accent hover:underline">
            {SUPPORT_EMAIL}
          </a>
        </div>
      </div>
    </div>
  );
}
