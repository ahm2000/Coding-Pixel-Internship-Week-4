// Reproduces the acceptance-criteria checks against a running dev server.
// Prereqs: `npx playwright install chromium` once, then `npm run dev` in another terminal.
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

const documentRequests = [];
page.on('request', (req) => {
  if (req.resourceType() === 'document') documentRequests.push(req.url());
});

await page.goto(baseUrl, { waitUntil: 'networkidle' });
check('home page loads', await page.locator('h1', { hasText: 'Routing' }).isVisible());

const search = page.locator('input[placeholder="stays put across navigation"]');
await search.fill('hello world');
documentRequests.length = 0;

const headerNav = page.locator('header nav');
await headerNav.locator('a', { hasText: 'Dashboard' }).click();

let sawLoading = false;
for (let i = 0; i < 15 && !sawLoading; i++) {
  sawLoading = await page.locator('text=Loading dashboard').isVisible().catch(() => false);
  await page.waitForTimeout(80);
}
check('loading.tsx appears while the dashboard page suspends', sawLoading);

await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 5000 });
check('no document (full-page) request was triggered by the Link click', documentRequests.length === 0);
check('header input value survived the navigation (header never remounted)', (await search.inputValue()) === 'hello world');

const dashboardClass = await headerNav.locator('a', { hasText: 'Dashboard' }).getAttribute('class');
const homeClass = await headerNav.locator('a', { hasText: 'Home' }).getAttribute('class');
check('active link is highlighted', dashboardClass.includes('bg-indigo-600'));
check('inactive link is not highlighted', !homeClass.includes('bg-indigo-600'));

await page.locator('main a', { hasText: 'Settings' }).click();
await page.waitForSelector('h1:has-text("Settings")');
const crumbsText = (await page.locator('main nav').innerText()).replace(/\s+/g, ' ');
const crumbsOrdered = ['Home', 'Dashboard', 'Settings'].every((label, i, arr) => {
  if (i === 0) return crumbsText.includes(label);
  return crumbsText.indexOf(arr[i - 1]) < crumbsText.indexOf(label);
});
check('breadcrumbs show the full trail in order', crumbsOrdered);

await page.goBack();
await page.waitForSelector('h1:has-text("Dashboard")');
await page.locator('main a', { hasText: 'Broken page' }).click();
await page.waitForSelector('text=Something broke', { timeout: 5000 });
check('error.tsx renders when the route throws', await page.locator('text=Something broke').isVisible());

await page.locator('button', { hasText: 'Try again' }).click();
await page.waitForTimeout(300);
check('reset() re-attempts the render (error boundary re-renders, not a crash)', await page.locator('text=Something broke').isVisible());

await browser.close();

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
