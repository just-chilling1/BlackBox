const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const EMAIL = `plshots${Date.now()}@gmail.com`;
const PASS = 'ShotCapture99!';

const routes = [
  ['dashboard', '/dashboard'],
  ['offers', '/offers'],
  ['leads', '/leads'],
  ['email-builder', '/email-builder'],
  ['saved-emails', '/saved-emails'],
  ['saved-searches', '/saved-searches'],
  ['training', '/training'],
  ['dfy', '/dfy'],
  ['instant-income', '/instant-income'],
  ['autopilot', '/autopilot'],
  ['protector', '/protector'],
  ['support', '/support'],
];

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  // 1. Sign up
  await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle' });
  await page.getByPlaceholder('John Smith').fill('Robert');
  await page.getByPlaceholder('user@example.com').fill(EMAIL);
  await page.getByPlaceholder('Minimum 8 characters').fill(PASS);
  await page.getByPlaceholder('Re-enter password').fill(PASS);
  await page.getByRole('button', { name: /Initialize Account/i }).click();
  await page.waitForTimeout(5000);
  console.log('after signup:', page.url());

  // Error visible?
  const err = await page.locator('.text-red-400').textContent().catch(() => null);
  if (err) console.log('SIGNUP ERROR:', err.trim());

  // 2. Complete onboarding if we're there
  for (let i = 0; i < 15 && page.url().includes('onboarding'); i++) {
    const btn = page.getByRole('button').filter({ hasText: /activate|continue|next|start|finish|go to|let's/i }).first();
    if (await btn.count()) {
      await btn.click().catch(() => {});
      await page.waitForTimeout(3000);
    } else break;
    console.log('onboarding step', i, '->', page.url());
  }

  // Make sure we can reach the dashboard
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' }).catch(() => {});
  await page.waitForTimeout(2000);
  console.log('final:', page.url());
  if (page.url().includes('login') || page.url().includes('onboarding')) {
    console.log('NOT AUTHENTICATED - stopping');
    await browser.close();
    process.exit(1);
  }

  // 3. Capture all routes
  const outDir = path.join(__dirname, 'screenshots');
  fs.mkdirSync(outDir, { recursive: true });
  for (const [name, route] of routes) {
    try {
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle', timeout: 45000 });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(outDir, `${name}.png`) });
      console.log(`OK ${name} -> ${page.url()}`);
    } catch (e) {
      console.log(`FAIL ${name}: ${e.message.split('\n')[0]}`);
    }
  }
  // Save storage state for future captures
  await ctx.storageState({ path: path.join(__dirname, 'auth-state.json') });
  console.log('CREDS', EMAIL, PASS);
  await browser.close();
})();
