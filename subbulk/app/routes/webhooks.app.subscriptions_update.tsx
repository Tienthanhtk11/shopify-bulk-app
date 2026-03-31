import type { ActionFunctionArgs } from "@remix-run/node";
import { recordMerchantEvent, syncMerchantPlanSnapshot } from "../models/merchant.server";
import { resolvePartnerDashboardPlan } from "../services/partner-billing.server";
import { authenticate } from "../shopify.server";

function readString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function readBoolean(value: unknown) {
  return typeof value === "boolean" ? value : false;
}

function readBillingInterval(appSubscription: Record<string, unknown>) {
  const lineItems = Array.isArray(appSubscription.line_items)
    ? appSubscription.line_items
    : Array.isArray(appSubscription.lineItems)
      ? appSubscription.lineItems
      : [];

  const firstLineItem =
    lineItems.length > 0 && typeof lineItems[0] === "object" && lineItems[0] !== null
      ? (lineItems[0] as Record<string, unknown>)
      : null;

  const plan =
    firstLineItem && typeof firstLineItem.plan === "object" && firstLineItem.plan !== null
      ? (firstLineItem.plan as Record<string, unknown>)
      : null;

  const pricingDetails =
    plan && typeof plan.pricing_details === "object" && plan.pricing_details !== null
      ? (plan.pricing_details as Record<string, unknown>)
      : plan && typeof plan.pricingDetails === "object" && plan.pricingDetails !== null
        ? (plan.pricingDetails as Record<string, unknown>)
        : null;

  return readString(pricingDetails?.interval) || readString(firstLineItem?.interval);
}

function readLineItemPlanNames(appSubscription: Record<string, unknown>) {
  const lineItems = Array.isArray(appSubscription.line_items)
    ? appSubscription.line_items
    : Array.isArray(appSubscription.lineItems)
      ? appSubscription.lineItems
      : [];

  return lineItems
    .map((lineItem) => {
      if (typeof lineItem !== "object" || lineItem === null) return null;
      const lineItemRecord = lineItem as Record<string, unknown>;
      const plan =
        typeof lineItemRecord.plan === "object" && lineItemRecord.plan !== null
          ? (lineItemRecord.plan as Record<string, unknown>)
          : null;

      return readString(plan?.name) || readString(lineItemRecord.name);
    })
    .filter((value): value is string => Boolean(value));
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { payload, topic, shop } = await authenticate.webhook(request);

  console.log(`Received ${topic} webhook for ${shop}`);

  const appSubscription = (payload as { app_subscription?: Record<string, unknown> }).app_subscription;
  const status = String(appSubscription?.status || "unknown").toLowerCase();
  const name = String(appSubscription?.name || "Managed plan");
  const adminGraphqlApiId = readString(appSubscription?.admin_graphql_api_id);
  const lineItemPlanNames = readLineItemPlanNames(appSubscription ?? {});
  const resolvedPlan = resolvePartnerDashboardPlan({
    planName: name,
    shopifySubscriptionGid: adminGraphqlApiId,
    lineItemPlanNames,
  });

  await syncMerchantPlanSnapshot({
    shopDomain: shop,
    planKey: resolvedPlan.planKey,
    planName: name,
    status,
    billingInterval: readBillingInterval(appSubscription ?? {}),
    isTest: readBoolean(appSubscription?.test) || readBoolean(appSubscription?.is_test),
    shopifySubscriptionGid: adminGraphqlApiId,
    rawPayload: {
      ...(typeof payload === "object" && payload !== null ? payload : {}),
      _subbulkResolvedPlanKey: resolvedPlan.planKey,
      _subbulkMatchedBy: resolvedPlan.matchedBy,
      _subbulkLineItemPlanNames: lineItemPlanNames,
    },
  });

  await recordMerchantEvent({
    shopDomain: shop,
    type: "billing.subscription_updated",
    source: "webhook",
    payload,
  });

  if (resolvedPlan.matchedBy === "default") {
    await recordMerchantEvent({
      shopDomain: shop,
      type: "billing.subscription_updated.unmapped",
      source: "webhook",
      severity: "warning",
      payload: {
        name,
        adminGraphqlApiId,
        lineItemPlanNames,
      },
    });
  }

  return new Response();
};