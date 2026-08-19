# NullPing Cash

Beginner-focused affiliate app: choose a product, publish a hosted money page, generate Pinterest pins, and track real visitors and clicks.

## Developer setup

See [DEVELOPER-SETUP.md](./DEVELOPER-SETUP.md) and [docs/nullping/LAUNCH.md](./docs/nullping/LAUNCH.md).

## Quick start

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Core member flow:

1. `/activate` — paste a product URL
2. `/money-page/[id]` — preview, edit, publish
3. `/traffic/[id]` — generate 10 Pinterest pins
4. `/results` — real visits and affiliate clicks
