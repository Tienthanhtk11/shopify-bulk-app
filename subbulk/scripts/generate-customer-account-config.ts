import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

function loadDotEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex <= 0) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function readRequiredAppUrl() {
  loadDotEnv();

  const rawValue = String(process.env.SHOPIFY_APP_URL || "").trim();
  if (!rawValue) {
    throw new Error(
      "Missing SHOPIFY_APP_URL. Run with SHOPIFY_APP_URL set or define it in .env before building the customer account extension.",
    );
  }

  const url = new URL(rawValue);
  return url.toString().replace(/\/$/, "");
}

function main() {
  const appUrl = readRequiredAppUrl();
  const outputPath = resolve(
    process.cwd(),
    "extensions/sub-bulk-customer-account/src/generated/app-url.js",
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(
    outputPath,
    `export const APP_URL = ${JSON.stringify(appUrl)};\n`,
    "utf8",
  );
}

main();