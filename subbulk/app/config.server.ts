const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function readRequiredString(
  name: string,
  options?: { disallowValues?: string[] },
) {
  const rawValue = process.env[name];
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  if (options?.disallowValues?.includes(value)) {
    throw new Error(`Environment variable ${name} must be replaced with a real value.`);
  }

  return value;
}

function readOptionalString(
  name: string,
  options?: { disallowValues?: string[] },
) {
  const rawValue = process.env[name];
  const value = typeof rawValue === "string" ? rawValue.trim() : "";
  if (!value) return null;

  if (options?.disallowValues?.includes(value)) {
    throw new Error(`Environment variable ${name} must be replaced with a real value.`);
  }

  return value;
}

function readRequiredUrl(name: string) {
  const value = readRequiredString(name);

  try {
    return new URL(value);
  } catch {
    throw new Error(`Environment variable ${name} must be a valid absolute URL.`);
  }
}

function readOptionalUrl(name: string) {
  const value = readOptionalString(name);
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    throw new Error(`Environment variable ${name} must be a valid absolute URL.`);
  }
}

function readOptionalInteger(name: string) {
  const value = readOptionalString(name);
  if (!value) return null;

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid integer.`);
  }

  return parsed;
}

function readBooleanFlag(name: string) {
  const normalized = String(process.env[name] || "").trim().toLowerCase();
  return ["1", "true", "yes", "on", "ready"].includes(normalized);
}

function readCsv(name: string) {
  return String(process.env[name] || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function readLowercaseCsv(name: string) {
  return readCsv(name).map((part) => part.toLowerCase());
}

function normalizeHostEntry(value: string) {
  const candidate = value.trim().toLowerCase();
  if (!candidate) return null;

  try {
    return new URL(candidate).hostname.toLowerCase();
  } catch {
    return candidate;
  }
}

function readOptionalFunctionId(name: string) {
  const value = readOptionalString(name);
  if (!value) return null;

  if (!UUID_PATTERN.test(value)) {
    throw new Error(`Environment variable ${name} must be a valid UUID.`);
  }

  return value;
}

function normalizeToken(value: string | null | undefined) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function expandGidCandidates(value: string | null | undefined) {
  const raw = String(value || "").trim();
  if (!raw) return [] as string[];

  const normalized = normalizeToken(raw);
  const lastPathSegment = raw.split("/").filter(Boolean).at(-1) || "";
  const normalizedLastSegment = normalizeToken(lastPathSegment);
  const trailingDigits = raw.match(/(\d+)$/)?.[1] || "";

  return Array.from(
    new Set([normalized, normalizedLastSegment, trailingDigits].filter(Boolean)),
  );
}

function readPartnerPlanNames(name: string, defaults: string[]) {
  const source = readCsv(name);
  const values = source.length > 0 ? source : defaults;

  return Array.from(new Set(values.map((value) => normalizeToken(value)).filter(Boolean)));
}

function readPartnerPlanGids(name: string) {
  return Array.from(
    new Set(readCsv(name).flatMap((value) => expandGidCandidates(value)).filter(Boolean)),
  );
}

function readCanonicalShopifyAppUrl() {
  return readOptionalUrl("SHOPIFY_APP_URL") ?? readOptionalUrl("HOST") ?? new URL("http://localhost");
}

type ServerConfig = {
  readonly shopifyApiKey: string;
  readonly shopifyApiSecret: string;
  readonly shopifyAppUrl: URL;
  readonly shopifyAppUrlString: string;
  readonly databaseUrl: string;
  readonly internalAdminSessionSecret: string;
  readonly jobRunnerSecret: string;
  readonly scopes: string[];
  readonly shopCustomDomain: string | null;
  readonly shopifyAdminAppHandle: string | null;
  readonly shopifyBillingTestFallbackEnabled: boolean;
  readonly internalAdminHosts: string[];
  readonly shopifyBulkDiscountFunctionId: string | null;
  readonly frontendPort: number | null;
  readonly port: number | null;
  readonly isProduction: boolean;
};

export const serverConfig: ServerConfig = Object.freeze({
  get shopifyApiKey() {
    return readRequiredString("SHOPIFY_API_KEY");
  },
  get shopifyApiSecret() {
    return readRequiredString("SHOPIFY_API_SECRET");
  },
  get shopifyAppUrl() {
    return readRequiredUrl("SHOPIFY_APP_URL");
  },
  get shopifyAppUrlString() {
    return readRequiredUrl("SHOPIFY_APP_URL").toString().replace(/\/$/, "");
  },
  get databaseUrl() {
    return readRequiredString("DATABASE_URL");
  },
  get internalAdminSessionSecret() {
    return readRequiredString("INTERNAL_ADMIN_SESSION_SECRET", {
      disallowValues: ["development-only-secret", "doi_thanh_secret_cookie_rieng"],
    });
  },
  get jobRunnerSecret() {
    return readRequiredString("JOB_RUNNER_SECRET");
  },
  get scopes() {
    return readCsv("SCOPES");
  },
  get shopCustomDomain() {
    return readOptionalString("SHOP_CUSTOM_DOMAIN");
  },
  get shopifyAdminAppHandle() {
    return readOptionalString("SHOPIFY_ADMIN_APP_HANDLE", {
      disallowValues: ["bmg-bulk-subscription"],
    });
  },
  get shopifyBillingTestFallbackEnabled() {
    return readBooleanFlag("SHOPIFY_BILLING_TEST_FALLBACK_ENABLED");
  },
  get internalAdminHosts() {
    return readCsv("INTERNAL_ADMIN_HOSTS")
      .map(normalizeHostEntry)
      .filter((value): value is string => Boolean(value));
  },
  get shopifyBulkDiscountFunctionId() {
    return readOptionalFunctionId("SHOPIFY_BULK_DISCOUNT_FUNCTION_ID");
  },
  get frontendPort() {
    return readOptionalInteger("FRONTEND_PORT");
  },
  get port() {
    return readOptionalInteger("PORT");
  },
  get isProduction() {
    return process.env.NODE_ENV === "production";
  },
});

export function readViteRuntimeConfig() {
  const appUrl = readCanonicalShopifyAppUrl();

  return {
    appUrl,
    appUrlString: appUrl.toString().replace(/\/$/, ""),
    hostName: appUrl.hostname,
    frontendPort: readOptionalInteger("FRONTEND_PORT") ?? 8002,
    port: readOptionalInteger("PORT") ?? 3000,
  };
}

export function readInternalAdminAccessConfig() {
  return {
    shops: readLowercaseCsv("INTERNAL_ADMIN_SHOPS"),
    emails: readLowercaseCsv("INTERNAL_ADMIN_EMAILS"),
  };
}

export function readManagedPricingConfig() {
  return {
    appHandle: readOptionalString("SHOPIFY_MANAGED_PRICING_APP_HANDLE"),
    ready: readBooleanFlag("SHOPIFY_MANAGED_PRICING_READY"),
  };
}

export function readPartnerPlanEnvConfig() {
  return {
    free: {
      aliases: readPartnerPlanNames("PARTNER_PLAN_FREE_NAMES", ["Free"]),
      gids: readPartnerPlanGids("PARTNER_PLAN_FREE_GIDS"),
    },
    growth: {
      aliases: readPartnerPlanNames("PARTNER_PLAN_GROWTH_NAMES", ["Growth", "Premium"]),
      gids: readPartnerPlanGids("PARTNER_PLAN_GROWTH_GIDS"),
    },
    scale: {
      aliases: readPartnerPlanNames("PARTNER_PLAN_SCALE_NAMES", ["Scale", "Ultra"]),
      gids: readPartnerPlanGids("PARTNER_PLAN_SCALE_GIDS"),
    },
  };
}
