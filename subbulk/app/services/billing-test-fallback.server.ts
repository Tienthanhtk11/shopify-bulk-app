import type { AdminApiContext } from "@shopify/shopify-app-remix/server";
import {
  buildShopifySubscriptionInput,
  createShopifySubscription,
  getShopifyBillingState,
} from "./billing.server";
import type { InternalPlanKey } from "./partner-billing.server";

export type BillingTestFallbackInterval = "monthly" | "annual";

export function getBillingTestFallbackState() {
  const state = getShopifyBillingState();
  return {
    enabled: state.enabled,
    testOnly: true,
  };
}

export function buildManualTestSubscriptionInput(input: {
  appUrl: string;
  planKey: InternalPlanKey;
  billingInterval?: BillingTestFallbackInterval | string | null;
  currencyCode?: string;
}) {
  return buildShopifySubscriptionInput(input);
}

export async function createManualTestSubscription(input: {
  admin: AdminApiContext;
  shopDomain: string;
  planKey: InternalPlanKey;
  billingInterval?: BillingTestFallbackInterval | string | null;
}) {
  return createShopifySubscription(input);
}