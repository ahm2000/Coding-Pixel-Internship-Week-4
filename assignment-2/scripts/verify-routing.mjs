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

await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
check('home page loads with heading', await page.locator('h1', { hasText: 'Explore' }).isVisible());

await page.waitForSelector('a[href^="/country/"]', { timeout: 15000 });
const cardCount = await page.locator('a[href^="/country/"]').count();
check('country cards rendered from a server-fetched list', cardCount > 50);

const search = page.locator('input[placeholder*="Search countries"]');
await search.fill('france');
await page.waitForURL(/[?&]q=france/i, { timeout: 5000 });
await page.waitForTimeout(500);
const filteredCount = await page.locator('a[href^="/country/"]').count();
check('search narrows results via the URL (?q=)', filteredCount >= 1 && filteredCount < cardCount);
check('France appears in filtered results', await page.locator('text=France').first().isVisible());

await search.fill('');
await page.waitForTimeout(500);
await page.locator('button', { hasText: 'Europe' }).click();
await page.waitForURL(/region=Europe/, { timeout: 5000 });
await page.waitForTimeout(500);
const europeCount = await page.locator('a[href^="/country/"]').count();
check('region filter narrows results via the URL (?region=)', europeCount > 0 && europeCount < cardCount);

await page.locator('button', { hasText: 'All regions' }).click();
await page.waitForTimeout(500);
documentRequests.length = 0;
await page.locator('a[href="/country/FRA"]').first().click();

let sawLoading = false;
for (let i = 0; i < 40 && !sawLoading; i++) {
  sawLoading = await page.locator('text=Loading country').isVisible().catch(() => false);
  if (sawLoading) break;
  await page.waitForTimeout(100);
}
check('loading.tsx appears while the detail page suspends', sawLoading);

await page.waitForSelector('h1:has-text("France")', { timeout: 10000 });
check('no document (full-page) request was triggered by the Link click', documentRequests.length === 0);

const bodyText = await page.locator('main').innerText();
check('detail page shows capital, population, region, languages', (
  bodyText.includes('Paris') &&
  /\d{1,3}(,\d{3})+/.test(bodyText) &&
  bodyText.includes('Europe') &&
  bodyText.includes('French')
));

const spainBorder = page.locator('a[href="/country/ESP"]').first();
check('border link to Spain (ESP) is present as a <Link>', await spainBorder.isVisible());
await spainBorder.click();
await page.waitForSelector('h1:has-text("Spain")', { timeout: 10000 });
check('clicking a border link navigates to that country', true);

await page.goto(baseUrl + '/country/ZZZ', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('text=Country not found', { timeout: 10000 });
check('well-formed but absent code (ZZZ) shows not-found UI', await page.locator('text=Country not found').isVisible());

await page.goto(baseUrl + '/country/x', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('text=Country not found', { timeout: 10000 });
check('malformed code (x) shows not-found UI without fetching', await page.locator('text=Country not found').isVisible());

await browser.close();

console.log(
  '\nNote: error.tsx is verified separately by temporarily pointing API_URL at an unreachable' +
  ' host in src/lib/countries.ts and reloading /country/FRA — the fetch runs server-side, so' +
  " it isn't interceptable from the browser via page.route()."
);

console.log(failures === 0 ? '\nAll checks passed.' : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
