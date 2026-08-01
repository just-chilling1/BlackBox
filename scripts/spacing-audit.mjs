/**
 * Capture full-page screenshots of app routes for spacing audit.
 * Usage: node scripts/spacing-audit.mjs [port]
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const PORT = process.argv[2] ?? "3000";
const BASE = `http://localhost:${PORT}`;
const OUT = path.join(process.cwd(), "spacing-audit-screenshots");

const ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/dashboard",
  "/onboarding",
  "/sales-offer-generator",
  "/sales-offer-generator?step=2",
  "/sales-offer-generator?step=3",
  "/sales-offer-generator?step=4",
  "/link-vault",
  "/academy",
  "/training",
  "/training/faq",
  "/support",
  "/support/faq",
  "/protector",
  "/promote",
  "/offers",
  "/accelerator",
  "/recurring-wealth",
  "/autopilot",
  "/instant",
  "/dfy",
  "/analysis",
  "/radar",
  "/replies",
  "/scale-training",
  "/social-payouts",
  "/asset",
  "/search",
  "/brand-preview",
];

function slug(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "_") || "home";
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const results = [];

  for (const route of ROUTES) {
    const url = `${BASE}${route}`;
    const name = slug(route);
    try {
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(1500);
      const status = response?.status() ?? 0;
      const finalUrl = page.url();
      const filepath = path.join(OUT, `${name}.png`);
      await page.screenshot({ path: filepath, fullPage: true });
      results.push({ route, status, finalUrl, ok: status < 400, filepath });
      console.log(`OK  ${route} -> ${name}.png (${status})`);
    } catch (err) {
      results.push({ route, ok: false, error: String(err) });
      console.error(`FAIL ${route}: ${err.message}`);
    }
  }

  await browser.close();

  const summary = {
    capturedAt: new Date().toISOString(),
    port: PORT,
    total: ROUTES.length,
    ok: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok),
    results,
  };

  const summaryPath = path.join(OUT, "summary.json");
  await import("node:fs/promises").then((fs) =>
    fs.writeFile(summaryPath, JSON.stringify(summary, null, 2))
  );
  console.log(`\nDone: ${summary.ok}/${summary.total} screenshots in ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
