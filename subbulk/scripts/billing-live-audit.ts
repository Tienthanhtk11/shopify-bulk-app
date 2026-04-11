import "@shopify/shopify-api/adapters/node";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { Prisma, PrismaClient } from "../generated/prisma/client";
import { ApiVersion, shopifyApi } from "@shopify/shopify-api";

type EnvMap = Record<string, string>;

type ActiveSubscriptionNode = {
  id: string | null;
  name: string | null;
  status: string | null;
  test: boolean | null;
  lineItems: Array<{
    id: string | null;
    pricingInterval: string | null;
  }>;
};

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

function getArgValue(flag: string) {
  const exact = process.argv.find((arg) => arg.startsWith(`${flag}=`));
  if (exact) return exact.slice(flag.length + 1);

  const index = process.argv.findIndex((arg) => arg === flag);
  if (index >= 0) return process.argv[index + 1] || null;

  return null;
}

function getRequiredEnv(name: keyof EnvMap) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeDate(value: Date | string | null | undefined) {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

async function fetchActiveSubscriptions(shop: string, refreshToken: string) {
  const api = shopifyApi({
    apiKey: getRequiredEnv("SHOPIFY_API_KEY"),
    apiSecretKey: getRequiredEnv("SHOPIFY_API_SECRET"),
    apiVersion: ApiVersion.January25,
    scopes: (process.env.SCOPES || "").split(",").filter(Boolean),
    hostName: new URL(process.env.SHOPIFY_APP_URL || "https://app.thanhpt.online").host,
    isEmbeddedApp: true,
  });

  const { session } = await api.auth.refreshToken({ shop, refreshToken });
  const response = await fetch(`https://${shop}/admin/api/2025-01/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": session.accessToken || "",
    },
    body: JSON.stringify({
      query: `query SubBulkCurrentAppInstallationSubscriptions {
        currentAppInstallation {
          activeSubscriptions {
            id
            name
            status
            test
            lineItems {
              id
              plan {
                pricingDetails {
                  __typename
                  ... on AppRecurringPricing {
                    interval
                  }
                }
              }
            }
          }
        }
      }`,
    }),
  });

  const payload = (await response.json()) as {
    data?: {
      currentAppInstallation?: {
        activeSubscriptions?: Array<{
          id?: string | null;
          name?: string | null;
          status?: string | null;
          test?: boolean | null;
          lineItems?: Array<{
            id?: string | null;
            plan?: {
              pricingDetails?: {
                interval?: string | null;
              } | null;
            } | null;
          }>;
        }>;
      };
    };
    errors?: unknown;
  };

  return {
    responseOk: response.ok,
    status: response.status,
    errors: payload.errors || null,
    subscriptions: (payload.data?.currentAppInstallation?.activeSubscriptions || []).map(
      (node): ActiveSubscriptionNode => ({
        id: node.id || null,
        name: node.name || null,
        status: node.status || null,
        test: typeof node.test === "boolean" ? node.test : null,
        lineItems: (node.lineItems || []).map((line) => ({
          id: line.id || null,
          pricingInterval: line.plan?.pricingDetails?.interval || null,
        })),
      }),
    ),
  };
}

async function main() {
  loadDotEnv();

  const targetShop = getArgValue("--shop");
  const prisma = new PrismaClient();

  try {
    const session = await prisma.session.findFirst({
      where: {
        isOnline: false,
        ...(targetShop ? { shop: targetShop } : {}),
      },
      orderBy: { shop: "asc" },
    });

    if (!session) {
      console.log(
        JSON.stringify(
          {
            ok: false,
            reason: "no_offline_session",
            targetShop: targetShop || null,
          },
          null,
          2,
        ),
      );
      return;
    }

    const latestPlan = await prisma.merchantPlan.findFirst({
      where: {
        merchant: {
          shopDomain: session.shop,
        },
      },
      orderBy: { createdAt: "desc" },
      include: {
        merchant: {
          select: {
            shopDomain: true,
          },
        },
      },
    });

    const unmappedEvents = await prisma.merchantEvent.findMany({
      where: {
        merchant: {
          shopDomain: session.shop,
        },
        type: {
          contains: "unmapped",
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        type: true,
        severity: true,
        createdAt: true,
        payloadJson: true,
      },
    });

    const summary = {
      ok: true,
      shop: session.shop,
      session: {
        expires: normalizeDate(session.expires),
        refreshTokenExpires: normalizeDate(session.refreshTokenExpires),
        hasRefreshToken: Boolean(session.refreshToken),
        scope: session.scope,
      },
      latestPlan: latestPlan
        ? {
            shopDomain: latestPlan.merchant.shopDomain,
            planKey: latestPlan.planKey,
            planName: latestPlan.planName,
            status: latestPlan.status,
            billingInterval: latestPlan.billingInterval,
            shopifySubscriptionGid: latestPlan.shopifySubscriptionGid,
            createdAt: latestPlan.createdAt.toISOString(),
            rawPayloadJson: latestPlan.rawPayloadJson,
          }
        : null,
      unmappedEvents: unmappedEvents.map((event) => ({
        type: event.type,
        severity: event.severity,
        createdAt: event.createdAt.toISOString(),
        payloadJson: event.payloadJson,
      })),
      envMapping: {
        freeNames: process.env.PARTNER_PLAN_FREE_NAMES || "",
        freeGids: process.env.PARTNER_PLAN_FREE_GIDS || "",
        growthNames: process.env.PARTNER_PLAN_GROWTH_NAMES || "",
        growthGids: process.env.PARTNER_PLAN_GROWTH_GIDS || "",
        scaleNames: process.env.PARTNER_PLAN_SCALE_NAMES || "",
        scaleGids: process.env.PARTNER_PLAN_SCALE_GIDS || "",
      },
      liveShopify: null as unknown,
    };

    if (!session.refreshToken) {
      summary.liveShopify = {
        ok: false,
        reason: "no_refresh_token",
      };
    } else {
      try {
        summary.liveShopify = {
          ok: true,
          ...(await fetchActiveSubscriptions(session.shop, session.refreshToken)),
        };
      } catch (error) {
        summary.liveShopify = {
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    }

    console.log(JSON.stringify(summary, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    console.error(
      JSON.stringify(
        {
          ok: false,
          reason: "database_unreachable",
          databaseUrl: process.env.DATABASE_URL || null,
          message: error.message,
          hint:
            "Set DATABASE_URL to a reachable Postgres instance before running audit:billing-live.",
        },
        null,
        2,
      ),
    );
    process.exit(1);
  }

  console.error(error instanceof Error ? error.stack || error.message : String(error));
  process.exit(1);
});