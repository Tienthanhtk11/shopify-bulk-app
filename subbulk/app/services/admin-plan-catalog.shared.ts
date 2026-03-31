import type { InternalPlanKey } from "./partner-billing.server";

export type AdminPlanCatalogItem = {
  key: InternalPlanKey;
  name: string;
  monthlyPrice: string;
  yearlyPrice: string;
  tagline: string;
  bestFor: string;
  merchantFacingHighlights: string[];
  opsHighlights: string[];
};

const PLAN_DISPLAY_NAME_BY_KEY: Record<InternalPlanKey, string> = {
  free: "Free",
  growth: "Premium",
  scale: "Ultra",
};

const LEGACY_PLAN_NAMES_BY_KEY: Record<InternalPlanKey, string[]> = {
  free: ["free"],
  growth: ["growth", "premium"],
  scale: ["scale", "ultra"],
};

export function getCanonicalPlanName(planKey: string | null | undefined) {
  const normalized = String(planKey || "free").trim().toLowerCase();
  if (normalized.includes("scale") || normalized.includes("ultra")) {
    return PLAN_DISPLAY_NAME_BY_KEY.scale;
  }

  if (normalized.includes("growth") || normalized.includes("premium")) {
    return PLAN_DISPLAY_NAME_BY_KEY.growth;
  }

  return PLAN_DISPLAY_NAME_BY_KEY.free;
}

export function normalizePlanDisplayName(planKey: string | null | undefined, displayName: string | null | undefined) {
  const normalizedKey = String(planKey || "free").trim().toLowerCase() as InternalPlanKey;
  const normalizedName = String(displayName || "").trim().toLowerCase();
  const canonical = getCanonicalPlanName(normalizedKey);
  const legacyNames = LEGACY_PLAN_NAMES_BY_KEY[normalizedKey] || LEGACY_PLAN_NAMES_BY_KEY.free;

  if (!normalizedName || legacyNames.includes(normalizedName)) {
    return canonical;
  }

  return String(displayName || canonical).trim();
}

export const ADMIN_PLAN_CATALOG: AdminPlanCatalogItem[] = [
  {
    key: "free",
    name: "Free",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    tagline: "Sandbox onboarding and limited storefront activation",
    bestFor: "Trial merchants validating widget fit before monetizing subscriptions",
    merchantFacingHighlights: [
      "Widget settings and product selection",
      "Basic subscribe-and-save preview",
      "Limited merchant onboarding checklist",
    ],
    opsHighlights: [
      "No advanced analytics",
      "No automation surfaces",
      "No priority support",
    ],
  },
  {
    key: "growth",
    name: "Premium",
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    tagline: "Seal-style core subscription stack for growing stores",
    bestFor: "Merchants needing full rule management, portal controls, and analytics",
    merchantFacingHighlights: [
      "Full subscription rule builder and subscription operations",
      "Customer portal actions like pause, resume, and cancel",
      "Analytics and billing visibility for store operators",
    ],
    opsHighlights: [
      "Standard support lane",
      "Admin plan reassignment and lifecycle controls",
      "Best default plan for most production merchants",
    ],
  },
  {
    key: "scale",
    name: "Ultra",
    monthlyPrice: "$79",
    yearlyPrice: "$790",
    tagline: "High-touch subscription operations inspired by Seal's broader suite",
    bestFor: "Larger brands that need automation, premium operations, and future forecasting surfaces",
    merchantFacingHighlights: [
      "Everything in Premium",
      "Automation-ready features and premium support",
      "Room for payment calendar and inventory forecast tooling",
    ],
    opsHighlights: [
      "Priority support and onboarding",
      "Highest entitlement tier for internal exception handling",
      "Target tier for upcoming advanced retention tooling",
    ],
  },
];

export function getAdminPlanCatalogItem(planKey: string | null | undefined) {
  return (
    ADMIN_PLAN_CATALOG.find((item) => item.key === planKey) ??
    ADMIN_PLAN_CATALOG.find((item) => item.key === "free")
  );
}
