# Premium Social (Social Payouts)

**Feature ID:** `premium-social`  
**Reference:** `secretmillionaire`, `aiwealth`

## Route

- `/social-payouts`

## Description

Pre-made Facebook posts with images — copy and paste to promote offers.

## Implementation

Copy `SocialPayoutsPage` + `data/posts.ts` from reference. Persist optional settings via `user_premium_settings`.

## Enable

```typescript
enabledFeatures: [..., "premium-social"]
```
