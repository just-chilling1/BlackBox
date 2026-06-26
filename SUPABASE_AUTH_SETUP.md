# Supabase dashboard steps (manual)

Complete these in the Supabase project for your product. You can also run `npm run setup:supabase-auth` to apply most of this automatically (see [DEVELOPER-SETUP.md](./DEVELOPER-SETUP.md) Step 5).

## Redirect URLs

**Authentication → URL Configuration → Redirect URLs**

Add your app URLs (keep any existing entries for other apps on the same project):

```
https://yourdomain.com/**
http://localhost:3000/**
http://localhost:3001/**
```

Use the same domain as `NEXT_PUBLIC_APP_URL` in production.

## Reset Password email template

**Authentication → Email Templates → Reset Password**

Use `{{ .ConfirmationURL }}` in the reset link so `redirectTo` from the app controls the domain:

```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your account:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
```

The app calls `resetPasswordForEmail` with `{NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`.

## Confirm signup (if enabled)

Prefer `{{ .ConfirmationURL }}` in the confirm template as well so signups redirect to the correct domain.
