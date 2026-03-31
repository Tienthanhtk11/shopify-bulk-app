import type { LoaderFunctionArgs } from "@remix-run/node";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { useLoaderData } from "@remix-run/react";
import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { listAdminPlanDefinitions } from "../services/admin-plan-catalog.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { getManagedPricingPageUrl } from "../services/managed-pricing.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const entitlements = resolveEntitlements(latestPlan);
  const url = new URL(request.url);
  const planCatalog = await listAdminPlanDefinitions();

  return {
    shop: session.shop,
    latestPlan,
    entitlements,
    planCatalog,
    managedPricingUrl: getManagedPricingPageUrl(session.shop),
    requiredFeature: url.searchParams.get("required") || null,
    writeBlocked: url.searchParams.get("writeBlocked") || null,
  };
};

export default function BillingPage() {
  const { shop, latestPlan, entitlements, planCatalog, managedPricingUrl, requiredFeature, writeBlocked } = useLoaderData<typeof loader>();
  const featureEntries = Object.entries(entitlements.features);
  const showResolutionBanner = entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess;
  const visiblePlans = planCatalog.filter((plan) => entitlements.planKey === plan.key || (plan.isActive && plan.isPublic));

  return (
    <Page>
      <TitleBar title="Billing & plan access" />
      <BlockStack gap="500">
        {requiredFeature ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Additional access required
              </Text>
              <Text as="p" variant="bodyMd">
                Your current plan does not include the feature: {FEATURE_LABELS[requiredFeature as keyof typeof FEATURE_LABELS] || requiredFeature}.
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        {writeBlocked ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Write access is blocked
              </Text>
              <Text as="p" variant="bodyMd">
                Reason: {writeBlocked}. Merchant write actions are blocked until billing returns to an active or trialing state, or the required feature is available on the current plan.
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        {showResolutionBanner ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Paid access is currently inactive
              </Text>
              <Text as="p" variant="bodyMd">
                The latest Partner Dashboard plan snapshot is marked as {entitlements.billingStatus}. Paid features stay locked until the subscription returns to an active or trialing state.
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Current plan
              </Text>
              <Text as="p" variant="headingXl">
                {entitlements.planName}
              </Text>
              <Badge tone={entitlements.isPaid ? "success" : "attention"}>
                {entitlements.isPaid ? "Paid access" : "Free access"}
              </Badge>
              <Text as="p" variant="bodySm" tone="subdued">
                Shop: {shop}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Latest billing status
              </Text>
              <Text as="p" variant="headingLg">
                {latestPlan?.status || "no_plan_recorded"}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {managedPricingUrl
                  ? "You can open the Shopify-hosted pricing page below to change or upgrade the merchant package."
                  : "Set SHOPIFY_MANAGED_PRICING_APP_HANDLE to expose direct plan-change links in Shopify admin."}
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" blockAlign="start">
              <BlockStack gap="100">
                <Text as="h2" variant="headingMd">
                  Current package and available plans
                </Text>
                <Text as="p" variant="bodySm" tone="subdued">
                  Merchants can review their current package here and move to a different plan through Shopify managed pricing.
                </Text>
              </BlockStack>
              {managedPricingUrl ? (
                <a href={managedPricingUrl} target="_top" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="primary">Open Shopify pricing page</Button>
                </a>
              ) : null}
            </InlineStack>

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="300">
              {visiblePlans.map((plan) => {
                const isCurrent = entitlements.planKey === plan.key;
                return (
                  <Card key={plan.key}>
                    <BlockStack gap="200">
                      <InlineStack align="space-between" blockAlign="center">
                        <BlockStack gap="050">
                          <Text as="h3" variant="headingMd">
                            {plan.name}
                          </Text>
                          <Text as="p" variant="bodySm" tone="subdued">
                            {plan.tagline}
                          </Text>
                        </BlockStack>
                        <Badge tone={isCurrent ? "success" : plan.isActive ? "info" : "attention"}>
                          {isCurrent ? "Current" : plan.isActive ? "Available" : "Hidden"}
                        </Badge>
                      </InlineStack>
                      <Text as="p" variant="headingLg">
                        {plan.monthlyPrice}
                      </Text>
                      <Text as="p" variant="bodySm" tone="subdued">
                        {plan.yearlyPrice} yearly
                      </Text>
                      <Text as="p" variant="bodyMd">
                        {plan.bestFor}
                      </Text>
                      <BlockStack gap="100">
                        {plan.merchantFacingHighlights.map((highlight) => (
                          <Text key={highlight} as="p" variant="bodySm">
                            • {highlight}
                          </Text>
                        ))}
                      </BlockStack>
                      {managedPricingUrl ? (
                        <a href={managedPricingUrl} target="_top" rel="noreferrer" style={{ textDecoration: "none" }}>
                          <Button variant={isCurrent ? "secondary" : "primary"} fullWidth>
                            {isCurrent ? "Review in Shopify billing" : "Change to this plan"}
                          </Button>
                        </a>
                      ) : (
                        <Text as="p" variant="bodySm" tone="subdued">
                          Direct plan change link becomes available after setting the managed pricing app handle in environment.
                        </Text>
                      )}
                    </BlockStack>
                  </Card>
                );
              })}
            </InlineGrid>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Enabled features
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Plan matrix: Free keeps onboarding and widget setup basics, Premium unlocks the main merchant operations, and Ultra adds premium automation/support surfaces.
            </Text>
            <BlockStack gap="0">
              {featureEntries.map(([featureKey, enabled], index) => (
                <BlockStack key={featureKey} gap="200">
                  {index > 0 ? <Divider /> : null}
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="p" variant="bodyMd">
                      {FEATURE_LABELS[featureKey as keyof typeof FEATURE_LABELS]}
                    </Text>
                    <Badge tone={enabled ? "success" : "attention"}>
                      {enabled ? "Enabled" : "Locked"}
                    </Badge>
                  </InlineStack>
                </BlockStack>
              ))}
            </BlockStack>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}