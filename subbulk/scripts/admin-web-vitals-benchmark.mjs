import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import {stdin as input, stdout as output} from 'node:process';
import {pathToFileURL} from 'node:url';

const DEFAULT_ROUTES = [
  {
    key: 'analytics',
    path: '/analytics',
    readyText: 'Subscription health',
    interactionLabel: 'navigate-to-subscriptions',
    interaction: async (page) => {
      await clickNavLink(page, 'Subscriptions');
      await page.waitForFunction(
        () => document.body.innerText.includes('Subscription list'),
        {timeout: 15000},
      );
    },
  },
  {
    key: 'subscriptions',
    path: '/subscriptions',
    readyText: 'Subscription list',
    interactionLabel: 'filter-and-search',
    interaction: async (page) => {
      await clickTextButton(page, 'Active');
      await page.waitForTimeout(250);
      const searchInput = await page.waitForSelector('input[placeholder="Search subscriptions"]', {
        timeout: 15000,
      });
      await searchInput.click({clickCount: 3});
      await searchInput.type('active', {delay: 35});
      await page.waitForTimeout(400);
    },
  },
  {
    key: 'settings',
    path: '/settings',
    readyText: 'Widget styling',
    interactionLabel: 'type-widget-heading',
    interaction: async (page) => {
      const inputHandle = await page.waitForSelector('input[name="buyMoreHeading"]', {
        timeout: 15000,
      });
      await inputHandle.click({clickCount: 3});
      await inputHandle.type('Bench heading', {delay: 35});
      await page.waitForTimeout(400);
    },
  },
  {
    key: 'billing',
    path: '/billing',
    readyText: 'Current package and available plans',
    interactionLabel: 'navigate-to-settings',
    interaction: async (page) => {
      await clickNavLink(page, 'Settings');
      await page.waitForFunction(
        () => document.body.innerText.includes('Widget styling'),
        {timeout: 15000},
      );
    },
  },
];

function getEnv(name, fallback = '') {
  return String(process.env[name] || fallback).trim();
}

function parseBoolean(value, fallback) {
  if (!value) return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(value).trim().toLowerCase());
}

function toNumber(value, fallback) {
  if (value == null) return fallback;
  const normalized = String(value).trim();
  if (!normalized) return fallback;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function quantile(values, q) {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.ceil(sorted.length * q) - 1));
  return sorted[index];
}

function roundMetric(value) {
  return value == null ? null : Math.round(value * 100) / 100;
}

function routeUrl(baseUrl, routePath) {
  return `${baseUrl.replace(/\/$/, '')}${routePath}`;
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, {recursive: true});
}

async function loadPuppeteer() {
  try {
    const module = await import('puppeteer');
    return module.default;
  } catch {}

  const localBenchPath = path.join(
    process.cwd(),
    '.bench-tools',
    'node_modules',
    'puppeteer',
    'lib',
    'esm',
    'puppeteer',
    'puppeteer.js',
  );

  try {
    const module = await import(pathToFileURL(localBenchPath).href);
    return module.default;
  } catch {
    throw new Error(
      'Puppeteer is not installed. Run: npm install --prefix ./.bench-tools puppeteer',
    );
  }
}

async function maybeWaitForManualLogin(page, firstUrl) {
  const allowPrompt = !parseBoolean(getEnv('SHOPIFY_BENCH_DISABLE_LOGIN_PROMPT'), false);
  const headless = parseBoolean(getEnv('SHOPIFY_BENCH_HEADLESS'), false);
  if (headless || !allowPrompt) return;

  const currentUrl = page.url();
  const bodyText = await page.evaluate(() => document.body?.innerText || '');
  const looksUnauthed =
    /login|log in|sign in|two-step|verification/i.test(currentUrl) ||
    /log in|sign in|verify|Shopify Admin/i.test(bodyText);

  if (!looksUnauthed) return;

  const rl = readline.createInterface({input, output});
  output.write(`\nBrowser opened for manual Shopify login.\nTarget URL: ${firstUrl}\nFinish login in the browser, then press Enter here to continue.\n\n`);
  await rl.question('');
  rl.close();
}

async function installMetricObservers(page) {
  await page.evaluateOnNewDocument(() => {
    const metricStore = {
      lcp: 0,
      cls: 0,
      inp: 0,
      inpCandidates: {},
      marks: [],
    };

    window.__subbulkVitals = metricStore;

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        metricStore.lcp = Math.max(metricStore.lcp, entry.startTime || 0);
      }
    }).observe({type: 'largest-contentful-paint', buffered: true});

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.hadRecentInput) continue;
        metricStore.cls += entry.value || 0;
      }
    }).observe({type: 'layout-shift', buffered: true});

    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const interactionId = entry.interactionId || 0;
        const duration = entry.duration || 0;
        if (!interactionId || !duration) continue;
        const current = metricStore.inpCandidates[interactionId] || 0;
        if (duration > current) {
          metricStore.inpCandidates[interactionId] = duration;
        }
        metricStore.inp = Math.max(metricStore.inp, duration);
      }
    }).observe({type: 'event', buffered: true, durationThreshold: 16});
  });
}

async function clickTextButton(page, text) {
  const clicked = await page.evaluate((targetText) => {
    const candidates = Array.from(document.querySelectorAll('button, [role="button"]'));
    const element = candidates.find((node) => node.textContent?.trim() === targetText);
    if (!element) return false;
    element.click();
    return true;
  }, text);

  if (!clicked) {
    throw new Error(`Could not find button with text: ${text}`);
  }
}

async function clickNavLink(page, text) {
  const clicked = await page.evaluate((targetText) => {
    const candidates = Array.from(document.querySelectorAll('a'));
    const element = candidates.find((node) => node.textContent?.trim() === targetText);
    if (!element) return false;
    element.click();
    return true;
  }, text);

  if (!clicked) {
    throw new Error(`Could not find nav link with text: ${text}`);
  }
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const store = window.__subbulkVitals || {lcp: 0, cls: 0, inp: 0};
    return {
      lcp: Number(store.lcp || 0),
      cls: Number(store.cls || 0),
      inp: Number(store.inp || 0),
    };
  });
}

async function benchmarkRoute(page, baseUrl, route, waitAfterLoadMs, waitAfterInteractionMs) {
  const url = routeUrl(baseUrl, route.path);
  await page.goto(url, {waitUntil: 'networkidle2', timeout: 60000});
  await page.waitForFunction(
    (expectedText) => document.body.innerText.includes(expectedText),
    {timeout: 20000},
    route.readyText,
  );
  await page.waitForTimeout(waitAfterLoadMs);

  const before = await collectMetrics(page);
  await route.interaction(page);
  await page.waitForTimeout(waitAfterInteractionMs);
  const after = await collectMetrics(page);

  return {
    url,
    readyText: route.readyText,
    interactionLabel: route.interactionLabel,
    beforeInteraction: before,
    afterInteraction: after,
  };
}

function summarizeRuns(routeKey, runs) {
  const lcpValues = runs.map((run) => run.afterInteraction.lcp);
  const clsValues = runs.map((run) => run.afterInteraction.cls);
  const inpValues = runs.map((run) => run.afterInteraction.inp);

  const p75 = {
    lcp: roundMetric(quantile(lcpValues, 0.75)),
    cls: roundMetric(quantile(clsValues, 0.75)),
    inp: roundMetric(quantile(inpValues, 0.75)),
  };

  return {
    routeKey,
    runCount: runs.length,
    thresholds: {
      lcp: 2500,
      cls: 0.1,
      inp: 200,
    },
    p75,
    pass: {
      lcp: p75.lcp != null && p75.lcp < 2500,
      cls: p75.cls != null && p75.cls < 0.1,
      inp: p75.inp != null && p75.inp < 200,
    },
    runs,
  };
}

function printSummary(summary) {
  output.write(`\n[${summary.routeKey}] p75 -> LCP ${summary.p75.lcp} ms | CLS ${summary.p75.cls} | INP ${summary.p75.inp} ms\n`);
  output.write(`Pass -> LCP ${summary.pass.lcp ? 'yes' : 'no'} | CLS ${summary.pass.cls ? 'yes' : 'no'} | INP ${summary.pass.inp ? 'yes' : 'no'}\n`);
}

async function main() {
  const puppeteer = await loadPuppeteer();
  const baseUrl = getEnv('SHOPIFY_BENCH_BASE_URL');
  if (!baseUrl) {
    throw new Error('Missing SHOPIFY_BENCH_BASE_URL. Example: https://admin.shopify.com/store/<store-handle>/apps/<app-handle>');
  }

  const iterations = toNumber(getEnv('SHOPIFY_BENCH_ITERATIONS'), 5);
  const waitAfterLoadMs = toNumber(getEnv('SHOPIFY_BENCH_WAIT_AFTER_LOAD_MS'), 1500);
  const waitAfterInteractionMs = toNumber(getEnv('SHOPIFY_BENCH_WAIT_AFTER_INTERACTION_MS'), 1500);
  const headless = parseBoolean(getEnv('SHOPIFY_BENCH_HEADLESS'), false);
  const outputDir = getEnv('SHOPIFY_BENCH_OUTPUT_DIR', path.join(process.cwd(), 'document', 'benchmark-results'));
  const userDataDir = getEnv('SHOPIFY_BENCH_USER_DATA_DIR', path.join(process.cwd(), '.bench', 'chrome-profile'));
  const executablePath = getEnv('PUPPETEER_EXECUTABLE_PATH') || undefined;

  if (iterations <= 0) {
    throw new Error(`SHOPIFY_BENCH_ITERATIONS must be greater than 0. Received: ${iterations}`);
  }

  if (waitAfterLoadMs < 0 || waitAfterInteractionMs < 0) {
    throw new Error(
      `Wait durations must be 0 or greater. Received load=${waitAfterLoadMs}, interaction=${waitAfterInteractionMs}`,
    );
  }

  await ensureDirectory(outputDir);
  await ensureDirectory(path.dirname(userDataDir));

  const browser = await puppeteer.launch({
    headless,
    executablePath,
    userDataDir,
    defaultViewport: {width: 1440, height: 1080, deviceScaleFactor: 1},
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(30000);
    await installMetricObservers(page);
    await page.goto(routeUrl(baseUrl, DEFAULT_ROUTES[0].path), {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });
    await maybeWaitForManualLogin(page, routeUrl(baseUrl, DEFAULT_ROUTES[0].path));

    const routeSummaries = [];
    for (const route of DEFAULT_ROUTES) {
      const runs = [];
      for (let index = 0; index < iterations; index += 1) {
        const run = await benchmarkRoute(
          page,
          baseUrl,
          route,
          waitAfterLoadMs,
          waitAfterInteractionMs,
        );
        runs.push({
          index: index + 1,
          ...run,
        });
      }

      const summary = summarizeRuns(route.key, runs);
      routeSummaries.push(summary);
      printSummary(summary);
    }

    const report = {
      generatedAt: new Date().toISOString(),
      config: {
        baseUrl,
        iterations,
        waitAfterLoadMs,
        waitAfterInteractionMs,
        headless,
        userDataDir,
      },
      routes: routeSummaries,
    };

    const fileName = `admin-web-vitals-${Date.now()}.json`;
    const filePath = path.join(outputDir, fileName);
    await fs.writeFile(filePath, JSON.stringify(report, null, 2));
    output.write(`\nSaved report to ${filePath}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});