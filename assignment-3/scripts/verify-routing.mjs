// Reproduces the acceptance-criteria checks against a running dev server.
// Prereqs: `npx playwright install chromium` once, a .env.local with
// API_BASE_URL and NEXT_PUBLIC_SITE_NAME set (see .env.example), then
// `npm run dev` in another terminal.
// Run: node scripts/verify-routing.mjs [baseUrl]

import { chromium } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:3000';
let failures = 0;

const check = (label, condition) => {
  console.log(`${condition ? 'PASS' : 'FAIL'} - ${label}`);
  if (!condition) failures += 1;
};

const browser = await chromium.launch();
const page = await browser.newPage();

// 1. Route handler responds with JSON derived from env, not hard-coded
const apiRes = await page.request.get(baseUrl + '/api/config');
const apiBody = await apiRes.json();
check('GET /api/config returns 200', apiRes.status() === 200);
check('response has status:"ok"', apiBody.status === 'ok');
check('apiBaseUrl is a non-empty string read from env', typeof apiBody.apiBaseUrl === 'string' && apiBody.apiBaseUrl.length > 0);

await page.goto(baseUrl + '/', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('h1');
check('home page loads', await page.locator('h1', { hasText: 'Beta access signup' }).isVisible());

// 2. Env boundary demo: NEXT_PUBLIC_* visible client-side, plain server var is not
// (revealed post-mount, deliberately, to avoid a server/client hydration mismatch -
// see the comment in src/components/EnvBoundaryDemo.tsx)
await page.waitForFunction(() => !document.querySelector('dl')?.innerText.includes('checking...'), { timeout: 5000 });
const dlRow = (label) => page.locator('dl > div', { has: page.locator('dt', { hasText: label }) }).locator('dd');
check('NEXT_PUBLIC_SITE_NAME is defined in the browser', (await dlRow('NEXT_PUBLIC_SITE_NAME').innerText()) !== 'undefined');
check('API_BASE_URL is undefined in the browser', (await dlRow('API_BASE_URL').innerText()) === 'undefined');

// 3. Route handler check button, driven from the browser
await page.locator('button', { hasText: 'GET /api/config' }).click();
await page.waitForSelector('pre', { timeout: 5000 });
const preText = await page.locator('pre').innerText();
check('button-triggered fetch shows the same env-derived JSON', preText.includes(apiBody.apiBaseUrl));

// 4. Invalid submit: empty name, bad email, underage
await page.locator('#name').fill('');
await page.locator('#email').fill('not-an-email');
await page.locator('#age').fill('10');
await page.locator('button[type="submit"]').click();
await page.waitForSelector('#email-error', { timeout: 5000 });
check('invalid email shows a field error', (await page.locator('#email-error').innerText()).length > 0);
check('underage shows a field error', await page.locator('#age-error').isVisible());
check('entered values are preserved after a failed submit', (await page.locator('#age').inputValue()) === '10');
check('error banner shows a clear message', await page.locator('div.text-rose-700', { hasText: 'Please fix the errors below' }).isVisible());

// 5. Valid submit: success confirmation, fields clear
await page.locator('#name').fill('Ada Lovelace');
await page.locator('#email').fill('ada@example.com');
await page.locator('#age').fill('30');
await page.locator('button[type="submit"]').click();
await page.waitForSelector('div.text-emerald-700', { timeout: 5000 });
check('valid submit shows a visible success confirmation', await page.locator('div.text-emerald-700', { hasText: "You're on the list" }).isVisible());
await page.waitForTimeout(200);
check('form fields clear after a successful submit', (await page.locator('#name').inputValue()) === '');

await browser.close();

console.log(
  '\nNote: the 500-on-missing-config path is verified separately - temporarily remove' +
  ' API_BASE_URL from .env.local, restart the dev server, and GET /api/config returns' +
  ' 500 with a JSON error body instead of crashing.'
);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
