# NullPing Cash — launch notes

## Core promise

Paste a product URL (or name). NullPing writes a hosted affiliate money page and prepares Pinterest pins that send visitors to that page. Results show real visits and clicks only.

## Login / access

- Production members: `/login` with the email used at purchase / signup.
- Local preview: set `DEV_BYPASS_AUTH=true` in `.env.local` (non-production only).
- Password reset: `/forgot-password`.

Apply `supabase/migrations/20260819000000_nullping_assets.sql` on the Supabase project before relying on pins or visit tracking.

## Production URL

Set `NEXT_PUBLIC_APP_URL` to the live domain (for example `https://app.nullpingcash.com`). Document the live URL here after first deploy:

- Production URL: _(set after Vercel deploy)_

Public money pages are served at `/m/{slug}`.

## Known limitations

- Pinterest posting is manual for MVP (download image, copy title/description/link). Auto-publish is not required.
- Pin images are template-composited (headline typeset over a product photo or branded gradient), not AI illustrations.
- Visitor counts skip obvious bots via user-agent filtering; they are not a full analytics suite.
- Conversions, commissions, and earnings are never shown — those happen on the merchant/affiliate network, not inside NullPing.
- If `RAPIDAPI_KEY` is missing, money pages and pins still generate using local fallback copy.

## Core journey checklist

- [ ] Activate an asset from a real product URL
- [ ] Publish the money page and copy the `/m/{slug}` link
- [ ] Generate 10 pins and download one image
- [ ] Open the public page with `?pin={id}&src=pinterest`
- [ ] Click the affiliate CTA
- [ ] Confirm the visit and click appear on `/results`
