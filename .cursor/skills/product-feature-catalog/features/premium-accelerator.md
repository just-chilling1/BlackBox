# Premium Accelerator

**Feature ID:** `premium-accelerator`  
**Reference:** `secretmillionaire`, `aiwealth`

## Route

- `/accelerator`

## Description

Bulk-generate websites and ready-to-post content for members who purchased the accelerator upsell.

## Implementation

Copy from reference app's accelerator page + related API routes. Wire into `premiumNav` in `navigation.config.ts` (already done).

## Enable

```typescript
enabledFeatures: [..., "premium-accelerator"]
```
