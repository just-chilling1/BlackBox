"use client";

import { ExternalLink, Headphones, Mail, MessageCircle } from "lucide-react";
import { support, supportRoutes } from "@/config/support.config";
import { SUPPORT_PORTAL_URL } from "@/lib/support";

export function SupportChannelCards() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <a href={supportRoutes.contact} className="group">
        <div className="card-base flex h-full items-center gap-4 transition-colors hover:border-[var(--bb-line-brass)] hover:bg-brass-100">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--bb-line-brass)] bg-brass-100 transition-colors group-hover:bg-brass-100">
            <Headphones className="h-6 w-6 text-brass-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="ds-h4 mb-0.5">Contact Support</h3>
            <p className="text-sm text-text-muted">Send a message and we will get back to you quickly</p>
          </div>
          <ExternalLink className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-brass-700" />
        </div>
      </a>

      {SUPPORT_PORTAL_URL ? (
        <a href={SUPPORT_PORTAL_URL} target="_blank" rel="noopener noreferrer" className="group">
          <div className="card-base flex h-full items-center gap-4 transition-colors hover:border-[var(--bb-line-brass)] hover:bg-brass-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--bb-line-brass)] bg-brass-100 transition-colors group-hover:bg-brass-100">
              <MessageCircle className="h-6 w-6 text-brass-700" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="ds-h4 mb-0.5">Support Portal</h3>
              <p className="text-sm text-text-muted">Browse articles, submit tickets, and track responses</p>
            </div>
            <ExternalLink className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-brass-700" />
          </div>
        </a>
      ) : null}

      <a href={support.contactUrl} className="group">
        <div className="card-base flex h-full items-center gap-4 transition-colors hover:border-success/30 hover:bg-success/5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-success/20 bg-success/10 transition-colors group-hover:bg-success/15">
            <Mail className="h-6 w-6 text-success" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="ds-h4 mb-0.5">Email Support</h3>
            <p className="truncate text-sm text-text-muted">{support.email}</p>
          </div>
          <ExternalLink className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-success" />
        </div>
      </a>
    </div>
  );
}
