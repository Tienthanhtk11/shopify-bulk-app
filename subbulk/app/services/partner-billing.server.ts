export type InternalPlanKey = "free" | "growth" | "scale";

type PartnerPlanConfig = {
  planKey: InternalPlanKey;
  aliases: string[];
  gids: string[];
};

type ResolvedPartnerPlan = {
  planKey: InternalPlanKey;
  matchedBy: "gid" | "name" | "heuristic" | "default";
};

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

  return Array.from(new Set([normalized, normalizedLastSegment, trailingDigits].filter(Boolean)));
}

function parseCsv(value: string | undefined, defaults: string[] = []) {
  const source = value && value.trim().length > 0 ? value.split(",") : defaults;

  return Array.from(
    new Set(source.map((item) => normalizeToken(item)).filter(Boolean)),
  );
}

function parseGidCsv(value: string | undefined) {
  const source = value && value.trim().length > 0 ? value.split(",") : [];

  return Array.from(
    new Set(source.flatMap((item) => expandGidCandidates(item)).filter(Boolean)),
  );
}

function getPartnerPlanConfigs(): PartnerPlanConfig[] {
  return [
    {
      planKey: "free",
      aliases: parseCsv(process.env.PARTNER_PLAN_FREE_NAMES, ["Free"]),
      gids: parseGidCsv(process.env.PARTNER_PLAN_FREE_GIDS),
    },
    {
      planKey: "growth",
      aliases: parseCsv(process.env.PARTNER_PLAN_GROWTH_NAMES, ["Growth", "Premium"]),
      gids: parseGidCsv(process.env.PARTNER_PLAN_GROWTH_GIDS),
    },
    {
      planKey: "scale",
      aliases: parseCsv(process.env.PARTNER_PLAN_SCALE_NAMES, ["Scale", "Ultra"]),
      gids: parseGidCsv(process.env.PARTNER_PLAN_SCALE_GIDS),
    },
  ];
}

export function resolvePartnerDashboardPlan(input: {
  planName?: string | null;
  shopifySubscriptionGid?: string | null;
  lineItemPlanNames?: Array<string | null | undefined>;
}): ResolvedPartnerPlan {
  const nameSignals = Array.from(
    new Set([input.planName, ...(input.lineItemPlanNames || [])].map((value) => normalizeToken(value)).filter(Boolean)),
  );
  const gidSignals = expandGidCandidates(input.shopifySubscriptionGid);
  const configs = getPartnerPlanConfigs();

  if (gidSignals.length > 0) {
    const gidMatch = configs.find((config) => gidSignals.some((gid) => config.gids.includes(gid)));
    if (gidMatch) {
      return { planKey: gidMatch.planKey, matchedBy: "gid" };
    }
  }

  if (nameSignals.length > 0) {
    const nameMatch = configs.find((config) => nameSignals.some((name) => config.aliases.includes(name)));
    if (nameMatch) {
      return { planKey: nameMatch.planKey, matchedBy: "name" };
    }
  }

  if (nameSignals.some((name) => name.includes("scale") || name.includes("ultra"))) {
    return { planKey: "scale", matchedBy: "heuristic" };
  }

  if (nameSignals.some((name) => name.includes("growth") || name.includes("premium"))) {
    return { planKey: "growth", matchedBy: "heuristic" };
  }

  if (nameSignals.some((name) => name.includes("free"))) {
    return { planKey: "free", matchedBy: "heuristic" };
  }

  return { planKey: "free", matchedBy: "default" };
}

export function getPartnerPlanConfigSummary() {
  return getPartnerPlanConfigs().map((config) => ({
    planKey: config.planKey,
    aliases: config.aliases,
    gids: config.gids,
  }));
}