import prisma from "../db.server";
import { ADMIN_PLAN_CATALOG, normalizePlanDisplayName } from "./admin-plan-catalog.shared";

type AdminPlanDefinitionRecord = Awaited<ReturnType<typeof prisma.adminPlanDefinition.findMany>>[number];

function stringifyList(items: string[]) {
  return JSON.stringify(items.filter(Boolean));
}

function parseList(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map((item) => String(item).trim()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function toViewModel(record: AdminPlanDefinitionRecord) {
  return {
    id: record.id,
    key: record.planKey,
    name: normalizePlanDisplayName(record.planKey, record.displayName),
    monthlyPrice: record.monthlyPrice,
    yearlyPrice: record.yearlyPrice,
    tagline: record.tagline,
    bestFor: record.bestFor,
    merchantFacingHighlights: parseList(record.merchantFacingHighlightsJson),
    opsHighlights: parseList(record.opsHighlightsJson),
    isActive: record.isActive,
    isPublic: record.isPublic,
    sortOrder: record.sortOrder,
  };
}

export async function ensureAdminPlanDefinitions() {
  for (const [index, plan] of ADMIN_PLAN_CATALOG.entries()) {
    await prisma.adminPlanDefinition.upsert({
      where: { planKey: plan.key },
      create: {
        planKey: plan.key,
        displayName: plan.name,
        monthlyPrice: plan.monthlyPrice,
        yearlyPrice: plan.yearlyPrice,
        tagline: plan.tagline,
        bestFor: plan.bestFor,
        merchantFacingHighlightsJson: stringifyList(plan.merchantFacingHighlights),
        opsHighlightsJson: stringifyList(plan.opsHighlights),
        sortOrder: (index + 1) * 10,
      },
      update: {},
    });
  }
}

export async function listAdminPlanDefinitions() {
  await ensureAdminPlanDefinitions();
  const plans = await prisma.adminPlanDefinition.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return plans.map(toViewModel);
}

export async function getAdminPlanDefinitionByKey(planKey: string | null | undefined) {
  await ensureAdminPlanDefinitions();
  const normalizedKey = String(planKey || "free").trim().toLowerCase();
  const record = await prisma.adminPlanDefinition.findUnique({ where: { planKey: normalizedKey } });
  return record ? toViewModel(record) : null;
}

export async function updateAdminPlanDefinition(input: {
  planKey: string;
  displayName: string;
  monthlyPrice: string;
  yearlyPrice: string;
  tagline: string;
  bestFor: string;
  merchantFacingHighlights: string[];
  opsHighlights: string[];
  isActive: boolean;
  isPublic: boolean;
  sortOrder: number;
}) {
  await ensureAdminPlanDefinitions();
  const record = await prisma.adminPlanDefinition.update({
    where: { planKey: input.planKey },
    data: {
      displayName: input.displayName,
      monthlyPrice: input.monthlyPrice,
      yearlyPrice: input.yearlyPrice,
      tagline: input.tagline,
      bestFor: input.bestFor,
      merchantFacingHighlightsJson: stringifyList(input.merchantFacingHighlights),
      opsHighlightsJson: stringifyList(input.opsHighlights),
      isActive: input.isActive,
      isPublic: input.isPublic,
      sortOrder: input.sortOrder,
    },
  });

  return toViewModel(record);
}
