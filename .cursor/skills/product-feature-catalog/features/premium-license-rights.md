# Premium License Rights

**Feature ID:** `premium-license-rights`  
**Route:** `/license-rights`

## Description

Full Turnkey Reseller & License Rights Edition. Members request activation by sending a support ticket titled **License Rights**. The page lists locked deliverables (reseller license, rebrandable assets, sales pages, support docs) until the team activates the account manually.

There is no database table and no admin UI. A successful submit stores a pending flag in localStorage per user so the page shows "Request received — awaiting team activation" on reload.

## User flow

```
/license-rights → request form (email + message)
  → POST /api/support { email, message, subject: "License Rights" }
  → Freshdesk ticket "BlackBox Cash — License Rights" (Resend fallback)
  → Pending panel (localStorage)
```

Mailto fallback uses subject `License Rights` if the API cannot send.

## APIs

Reuses the shared support endpoint — no dedicated premium API.

| Route | Purpose |
|-------|---------|
| `POST /api/support` | Optional `subject` (sanitized, max 80 chars). When present, Freshdesk subject is `{product} — {subject}` and the body includes `Request type:`. Existing callers that omit `subject` keep the default dashboard support subject. |

## Persistence

| Key | Scope |
|-----|--------|
| `{brand.storagePrefix}_license_rights_request_{userId}` | Client localStorage JSON `{ email, submittedAt }` |

Activation is manual (support team). Clearing the pending panel with "Send another request" only resets the local flag.

## Module files

```
src/features/premium-license-rights/
  pages/LicenseRightsPage.tsx
  lib/license-rights-request.ts
  lib/edition-contents.ts
src/app/license-rights/page.tsx
```

## Enable

```typescript
enabledFeatures: [..., "premium-license-rights"]
```

Nav: `{ path: "/license-rights", label: "Reseller & License Rights", icon: "FileText", feature: "premium-license-rights" }`

## Env vars

Same as support: `FRESHDESK_API_KEY`, `FRESHDESK_DOMAIN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.
