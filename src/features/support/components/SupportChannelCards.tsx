"use client";

import { ExternalLink, Headphones, Mail } from "lucide-react";
import { support } from "@/config/support.config";

export function SupportChannelCards() {
  const contactHref = support.contactUrl || `mailto:${support.email}`;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <a href={contactHref} className="group">
        <div className="card-base flex h-full items-center gap-4 transition-colors hover:border-accent/35 hover:bg-accent/5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/10 transition-colors group-hover:bg-accent/15">
            <Headphones className="h-6 w-6 text-accent-readable" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="ds-h4 mb-0.5">Contact Support</h3>
            <p className="text-sm text-text-muted">Send a message and we will get back to you quickly</p>
          </div>
          <ExternalLink className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-accent-readable" />
        </div>
      </a>

      <a href={`mailto:${support.email}`} className="group">
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
