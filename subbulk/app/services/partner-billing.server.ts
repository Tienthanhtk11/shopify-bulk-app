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

function parseCsv(value: string | undefined, defaults: string[] = []) {
  const source = value && value.trim().length > 0 ? value.split(",") : defaults;

  return Array.from(
    new Set(source.map((item) => normalizeToken(item)).filter(Boolean)),
  );
}

function getPartnerPlanConfigs(): PartnerPlanConfig[] {
  return [
    {
      planKey: "free",
      aliases: parseCsv(process.env.PARTNER_PLAN_FREE_NAMES, ["Free"]),
      gids: parseCsv(process.env.PARTNER_PLAN_FREE_GIDS),
    },
    {
      planKey: "growth",
      aliases: parseCsv(process.env.PARTNER_PLAN_GROWTH_NAMES, ["Growth", "Premium"]),
      gids: parseCsv(process.env.PARTNER_PLAN_GROWTH_GIDS),
    },
    {
      planKey: "scale",
      aliases: parseCsv(process.env.PARTNER_PLAN_SCALE_NAMES, ["Scale", "Ultra"]),
      gids: parseCsv(process.env.PARTNER_PLAN_SCALE_GIDS),
    },
  ];
}

export function resolvePartnerDashboardPlan(input: {
  planName?: string | null;
  shopifySubscriptionGid?: string | null;
}): ResolvedPartnerPlan {
  const normalizedName = normalizeToken(input.planName);
  const normalizedGid = normalizeToken(input.shopifySubscriptionGid);
  const configs = getPartnerPlanConfigs();

  if (normalizedGid) {
    const gidMatch = configs.find((config) => config.gids.includes(normalizedGid));
    if (gidMatch) {
      return { planKey: gidMatch.planKey, matchedBy: "gid" };
    }
  }

  if (normalizedName) {
    const nameMatch = configs.find((config) => config.aliases.includes(normalizedName));
    if (nameMatch) {
      return { planKey: nameMatch.planKey, matchedBy: "name" };
    }
  }

  if (normalizedName.includes("scale") || normalizedName.includes("ultra")) {
    return { planKey: "scale", matchedBy: "heuristic" };
  }

  if (normalizedName.includes("growth") || normalizedName.includes("premium")) {
    return { planKey: "growth", matchedBy: "heuristic" };
  }

  if (normalizedName.includes("free")) {
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