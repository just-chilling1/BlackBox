"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mail,
  Send,
} from "lucide-react";
import { PremiumPageLayout } from "@/components/premium/PremiumPageLayout";
import { PremiumControlCard } from "@/components/premium/PremiumControlCard";
import { PremiumStepsSection } from "@/components/premium/PremiumStepsSection";
import { PremiumFooter } from "@/components/premium/PremiumFooter";
import { PremiumErrorAlert } from "@/components/premium/PremiumErrorAlert";
import { getCachedClientUser } from "@/lib/auth-client-cache";
import { SUPPORT_EMAIL } from "@/lib/support";
import { brand } from "@/config/brand.config";
import { EDITION_CONTENTS } from "@/features/premium-license-rights/lib/edition-contents";
import {
  DEFAULT_REQUEST_MESSAGE,
  REQUEST_SUBJECT,
  clearPendingRequest,
  readPendingRequest,
  savePendingRequest,
  submitLicenseRightsRequest,
  type PendingLicenseRightsRequest,
} from "@/features/premium-license-rights/lib/license-rights-request";

type FormState = "idle" | "submitting" | "error";

const fieldClass =
  "w-full min-w-0 rounded-lg border border-border-dim/70 bg-page/80 px-3.5 py-3 text-sm leading-normal text-text-primary placeholder:text-text-muted focus:border-brass-700 focus:outline-none focus:ring-2 focus:ring-brass-100 transition-all";

const labelClass = "mb-2 block text-[13px] font-medium uppercase tracking-wide text-text-muted";

function PendingActivationPanel({
  email,
  viaMailto,
  onReset,
}: {
  email: string;
  viaMailto: boolean;
  onReset: () => void;
}) {
  return (
    <div className="support-success-panel space-y-5 p-1">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="support-success-icon">
          <CheckCircle2 className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="support-success-title">Request received</h3>
        <p className="support-success-body">
          {viaMailto ? (
            <>
              Your email app should open with subject{" "}
              <span className="font-medium text-text-heading">{REQUEST_SUBJECT}</span>. Tap{" "}
              <span className="font-medium text-text-heading">Send</span> to deliver it — then
              we&apos;ll reply to <span className="support-success-email">{email}</span>.
            </>
          ) : (
            <>
              We&apos;ll reply to <span className="support-success-email">{email}</span> when
              your reseller license is activated.
            </>
          )}{" "}
          We usually respond within about 2 hours — during busy periods, please allow 24–48 hours.
        </p>
        <p className="support-success-body">
          This edition stays locked until the team activates it. Our reply will go to{" "}
          <span className="support-success-email">{email}</span> only — check that inbox&apos;s
          spam or junk folder if you don&apos;t see it within 48 hours.
        </p>
      </div>

      <button type="button" onClick={onReset} className="support-success-secondary-btn">
        Send another request
      </button>
    </div>
  );
}

export default function LicenseRightsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(DEFAULT_REQUEST_MESSAGE);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [pending, setPending] = useState<PendingLicenseRightsRequest | null>(null);
  const [viaMailto, setViaMailto] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void getCachedClientUser().then((user) => {
      if (user?.email) setEmail(user.email);
      if (user?.id) {
        setUserId(user.id);
        setPending(readPendingRequest(user.id));
      }
      setReady(true);
    });
  }, []);

  const handleReset = () => {
    if (userId) clearPendingRequest(userId);
    setPending(null);
    setViaMailto(false);
    setFormState("idle");
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

      const result = await submitLicenseRightsRequest({
        email: trimmedEmail,
        message: trimmedMessage,
      });

      if (!result.ok) {
        setErrorMessage(result.error);
        setFormState("error");
        return;
      }

      if (userId) savePendingRequest(userId, trimmedEmail);
      setPending({ email: trimmedEmail, submittedAt: new Date().toISOString() });
      setViaMailto(result.viaMailto);
      setFormState("idle");
    },
    [email, message, userId]
  );

  return (
    <PremiumPageLayout
      title="Full Turnkey Reseller & License Rights Edition"
      subtitle={`Email support with the title "${REQUEST_SUBJECT}" so the ${brand.productName} team can activate this edition on your account.`}
      footer={<PremiumFooter />}
    >
        <PremiumControlCard
          icon={FileText}
          title="Request activation"
          description={`Tickets are sent to our support desk with the title "${REQUEST_SUBJECT}". The edition stays locked until the team activates it.`}
        >
          {!ready ? (
            <div className="h-40 animate-pulse rounded-lg bg-page/60" aria-hidden />
          ) : pending ? (
            <PendingActivationPanel
              email={pending.email}
              viaMailto={viaMailto}
              onReset={handleReset}
            />
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <div className="min-w-0">
                <label htmlFor="license-rights-email" className={labelClass}>
                  Your email
                </label>
                <input
                  id="license-rights-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={formState === "submitting"}
                  className={fieldClass}
                />
              </div>

              <div className="min-w-0">
                <label htmlFor="license-rights-message" className={labelClass}>
                  Your message
                </label>
                <textarea
                  id="license-rights-message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  disabled={formState === "submitting"}
                  rows={6}
                  className={`${fieldClass} min-h-[140px] resize-y`}
                />
                <p className="mt-2 text-xs text-text-muted">
                  Subject is set automatically to{" "}
                  <span className="font-medium text-text-secondary">{REQUEST_SUBJECT}</span>.
                </p>
              </div>

              {formState === "error" && errorMessage ? (
                <PremiumErrorAlert message={errorMessage} />
              ) : null}

              <p className="rounded-lg border border-border-dim/70 bg-page/60 px-3 py-2.5 text-xs leading-relaxed text-text-muted">
                <span className="font-medium text-text-secondary">Please note:</span> We reply to
                the email above. Check spam or junk if you don&apos;t hear back within 48 hours.
              </p>

              <button
                type="submit"
                disabled={formState === "submitting"}
                className="btn-primary min-h-[44px] w-full"
              >
                {formState === "submitting" ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Send License Rights request
                  </span>
                )}
              </button>

              <div className="dashboard-nested-card flex gap-2.5 px-3 py-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" />
                <div className="min-w-0">
                  <p className="text-xs leading-snug text-text-secondary">
                    Form not working? Copy our support email:
                  </p>
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard.writeText(SUPPORT_EMAIL)}
                    className="mt-1 block break-all text-left text-sm font-medium text-brass-700 hover:underline"
                  >
                    {SUPPORT_EMAIL}
                  </button>
                </div>
              </div>
            </form>
          )}
        </PremiumControlCard>

        <section className="glass-card p-8">
          <div className="mb-8 flex items-center gap-3">
            <Lock size={22} className="text-brass-700" />
            <h2 className="text-xl font-medium text-text-primary">Included — awaiting activation</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {EDITION_CONTENTS.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--bb-line-brass)] bg-brass-100 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-page/80 text-brass-700">
                    <Lock size={18} aria-hidden />
                  </div>
                  <span className="rounded-full border border-[var(--bb-line-brass)] bg-page/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-brass-700">
                    Awaiting activation
                  </span>
                </div>
                <h3 className="text-lg font-medium text-text-primary">{item.title}</h3>
                <p className="text-sm leading-relaxed text-text-secondary">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <PremiumStepsSection
          steps={[
            {
              num: "1",
              title: "Send the request",
              desc: `Use the form above. We file a support ticket titled "${REQUEST_SUBJECT}".`,
              icon: Send,
            },
            {
              num: "2",
              title: "Team reviews it",
              desc: "Support confirms your purchase and activates the reseller license on your account.",
              icon: FileText,
            },
            {
              num: "3",
              title: "Edition unlocks here",
              desc: "Once activated, the locked assets on this page become available to use and rebrand.",
              icon: CheckCircle2,
            },
          ]}
        />
    </PremiumPageLayout>
  );
}
