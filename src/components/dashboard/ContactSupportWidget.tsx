"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { CheckCircle2, Headphones, Loader2, Mail } from "lucide-react";
import { getCachedClientUser } from "@/lib/auth-client-cache";
import { APP_SUPPORT_NAME, FREE_TRAINING_URL, SUPPORT_EMAIL } from "@/lib/support";
import { trainingContent } from "@/config/training.config";
import { supabase } from "@/lib/supabase";
import { DashboardSection } from "./DashboardSection";

type FormState = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full min-w-0 rounded-lg border border-border-dim/70 bg-page/80 px-3.5 py-3 text-sm leading-normal text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all";

const embeddedFieldClass =
  "w-full min-w-0 rounded-lg border border-border-dim/70 bg-white px-3.5 py-3 text-sm leading-normal text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:shadow-[0_0_16px_rgba(238,179,16,0.12)] transition-all";

const embeddedLabelClass =
  "mb-2 block text-xs font-semibold uppercase tracking-wide text-accent-readable";

function trainingUpsellUrl(): string | null {
  const external = trainingContent.externalTrainingUrl?.trim();
  if (external && !external.includes("example.com")) return external;
  const free = FREE_TRAINING_URL?.trim();
  if (free && !free.includes("example.com")) return free;
  return null;
}

async function parseJsonResponse(res: Response): Promise<{
  error?: string;
  success?: boolean;
} | null> {
  const text = await res.text();
  if (!text.trim()) return {};

  try {
    return JSON.parse(text) as { error?: string; success?: boolean };
  } catch {
    return null;
  }
}

function SupportSuccessPanel({
  embedded,
  submittedEmail,
  onReset,
}: {
  embedded: boolean;
  submittedEmail: string;
  onReset: () => void;
}) {
  const upsellUrl = trainingUpsellUrl();

  const content = (
    <>
      <div className={embedded ? "flex flex-col items-center space-y-5" : "flex flex-col items-center text-center space-y-5"}>
        <div className="rounded-full border border-green-500/30 bg-green-500/10 p-3">
          <CheckCircle2 className={`h-6 w-6 ${embedded ? "text-green-500" : "text-green-400"}`} />
        </div>
        <h3
          className={
            embedded
              ? "text-base font-bold uppercase tracking-tight text-text-heading"
              : "ds-h3"
          }
        >
          Message sent
        </h3>
        <p className={`w-full text-sm leading-relaxed ${embedded ? "text-text-secondary" : "text-text-secondary text-left"}`}>
          We&apos;ll reply to{" "}
          <span className="break-all font-semibold text-accent-readable">{submittedEmail}</span>.
          We usually respond within about 2 hours — during busy periods, please allow 24–48 hours.
        </p>
        <p className={`w-full text-sm leading-relaxed ${embedded ? "text-text-muted" : "text-text-muted text-left"}`}>
          Remember: our reply will go to{" "}
          <span className="break-all font-semibold text-text-primary">{submittedEmail}</span> only — not
          another inbox you may use elsewhere. If you don&apos;t see it within 48 hours, check that
          inbox&apos;s spam or junk folder.
        </p>
      </div>

      {upsellUrl ? (
        <div className="border-t border-border-dim/70 pt-5">
          <p className="text-sm leading-relaxed text-text-secondary">
            While you wait, start with our{" "}
            <span className="font-semibold text-accent-readable">free training</span> — discover how to
            wake up with an extra{" "}
            <span className="font-semibold text-accent-readable">$1,000–$5,000</span> in your account and
            scale to $1k–$5k per day without extra grind.
          </p>
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-red-500">
            Warning: This may be taken down soon
          </p>
          <a
            href={upsellUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full rounded-lg bg-accent px-4 py-3 text-center text-xs font-black uppercase text-black shadow-gold transition-all hover:brightness-105"
          >
            Watch The Free Training &gt;&gt;
          </a>
        </div>
      ) : null}

      <button type="button" onClick={onReset} className="btn-secondary w-full min-h-[44px] py-2.5">
        Send another message
      </button>
    </>
  );

  if (embedded) {
    return (
      <div className="support-widget-card min-w-0 overflow-hidden rounded-xl border border-accent/20 bg-white p-5">
        {content}
      </div>
    );
  }

  return <DashboardSection className="min-w-0 space-y-5">{content}</DashboardSection>;
}

export function ContactSupportWidget({ embedded = false }: { embedded?: boolean }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      if (user?.email) setEmail(user.email);
    });
  }, []);

  const resetForm = () => {
    setFormState("idle");
    setMessage("");
    setErrorMessage("");
  };

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
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
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        if (session?.access_token) {
          headers.Authorization = `Bearer ${session.access_token}`;
        }

        const res = await fetch("/api/support", {
          method: "POST",
          headers,
          credentials: "same-origin",
          body: JSON.stringify({ email: trimmedEmail, message: trimmedMessage }),
        });

        const data = await parseJsonResponse(res);

        if (data === null) {
          throw new Error("Unexpected response from the server. Please try again.");
        }

        if (res.status === 401) {
          throw new Error("Your session expired. Please refresh the page and try again.");
        }

        if (res.ok && data.success) {
          setSubmittedEmail(trimmedEmail);
          setFormState("success");
          return;
        }

        throw new Error(data.error || "Something went wrong. Please try again.");
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
        setFormState("error");
      }
    },
    [email, message]
  );

  if (formState === "success") {
    return (
      <SupportSuccessPanel
        embedded={embedded}
        submittedEmail={submittedEmail}
        onReset={resetForm}
      />
    );
  }

  const formFields = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="min-w-0">
        <label
          htmlFor={embedded ? "support-email" : "dashboard-support-email"}
          className={
            embedded
              ? embeddedLabelClass
              : "mb-2 block text-xs font-bold uppercase tracking-wide text-text-muted"
          }
        >
          Your email
        </label>
        <input
          id={embedded ? "support-email" : "dashboard-support-email"}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          disabled={formState === "submitting"}
          className={embedded ? embeddedFieldClass : fieldClass}
        />
      </div>

      <div className="min-w-0">
        <label
          htmlFor={embedded ? "support-message" : "dashboard-support-message"}
          className={
            embedded
              ? embeddedLabelClass
              : "mb-2 block text-xs font-bold uppercase tracking-wide text-text-muted"
          }
        >
          Your message
        </label>
        <textarea
          id={embedded ? "support-message" : "dashboard-support-message"}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us what you need help with..."
          required
          disabled={formState === "submitting"}
          rows={4}
          className={`${embedded ? embeddedFieldClass : fieldClass} min-h-[112px] resize-y`}
        />
      </div>

      {formState === "error" && errorMessage ? (
        <p className="text-sm text-red-500">{errorMessage}</p>
      ) : null}

      <p
        className={
          embedded
            ? "rounded-lg border border-border-dim/70 bg-page/60 px-3.5 py-3 text-xs leading-relaxed text-text-muted"
            : "rounded-lg border border-border-dim/70 bg-page/60 px-3.5 py-3 text-xs leading-relaxed text-text-muted"
        }
      >
        <span className="font-semibold text-text-secondary">Please note:</span> We will reply to the
        email address you enter above. If you don&apos;t see our reply within 48 hours, check your spam
        or junk folder before reaching out again.
      </p>

      <button
        type="submit"
        disabled={formState === "submitting"}
        className={`btn-primary w-full ${embedded ? "py-2.5" : "min-h-[48px]"}`}
      >
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
  );

  const mailtoFallback = (
    <div
      className={
        embedded
          ? "rounded-xl border border-border-dim/60 bg-page/50 px-4 py-3.5"
          : "dashboard-nested-card flex gap-3 px-4 py-3.5"
      }
    >
      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-text-muted" />
      <div className="min-w-0">
        <p className="text-xs text-text-muted">
          {embedded ? "If the form doesn't work, copy our support email:" : "If the form doesn't work, copy our support email:"}
        </p>
        <button
          type="button"
          onClick={() => void navigator.clipboard.writeText(SUPPORT_EMAIL)}
          className="block break-all text-left text-sm font-semibold text-accent hover:underline"
        >
          {SUPPORT_EMAIL}
        </button>
      </div>
    </div>
  );

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
            <span className="font-medium text-text-primary">24–48 hours</span> during busy periods. Your
            answer will go to the email you enter below.
          </p>
          {formFields}
          {mailtoFallback}
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

      <p className="text-sm leading-relaxed text-text-secondary">
        We usually reply within about 2 hours. Because of high email volume, please allow{" "}
        <span className="font-medium text-text-primary">24–48 hours</span> during busy periods. Your
        answer will go to the email you enter below.
      </p>

      {formFields}
      {mailtoFallback}
    </DashboardSection>
  );
}
