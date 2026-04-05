import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
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
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { listAdminPlanDefinitions } from "../services/admin-plan-catalog.server";
import { createManualTestSubscription, getBillingTestFallbackState } from "../services/billing-test-fallback.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { getManagedPricingPageState } from "../services/managed-pricing.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session, redirect } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "").trim();

  if (intent !== "start_test_charge") {
    return json({ error: "Unsupported billing action." }, { status: 400 });
  }

  const managedPricing = getManagedPricingPageState(session.shop);
  const billingTestFallback = getBillingTestFallbackState();
  if (!billingTestFallback.enabled) {
    return json({ error: "Manual test billing fallback is disabled for this environment." }, { status: 403 });
  }

  if (managedPricing.ready) {
    return json({ error: "Managed pricing is already live. Use the Shopify-hosted pricing page instead." }, { status: 409 });
  }

  const rawPlanKey = String(formData.get("planKey") || "free").trim().toLowerCase();
  if (rawPlanKey !== "growth" && rawPlanKey !== "scale") {
    return json({ error: "Manual test billing fallback only supports Premium and Ultra." }, { status: 400 });
  }

  try {
    const result = await createManualTestSubscription({
      admin,
      shopDomain: session.shop,
      planKey: rawPlanKey,
      billingInterval: formData.get("billingInterval"),
    });

    return redirect(result.confirmationUrl, { target: "_top" });
  } catch (error) {
    return json(
      {
        error: error instanceof Error ? error.message : "Unable to create the test subscription.",
      },
      { status: 400 },
    );
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const entitlements = resolveEntitlements(latestPlan);
  const url = new URL(request.url);
  const planCatalog = await listAdminPlanDefinitions();
  const managedPricing = getManagedPricingPageState(session.shop);
  const billingTestFallback = getBillingTestFallbackState();

  return {
    shop: session.shop,
    latestPlan,
    entitlements,
    planCatalog,
    managedPricing,
    billingTestFallback,
    requiredFeature: url.searchParams.get("required") || null,
    writeBlocked: url.searchParams.get("writeBlocked") || null,
  };
};

export default function BillingPage() {
  const { shop, latestPlan, entitlements, planCatalog, managedPricing, billingTestFallback, requiredFeature, writeBlocked } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const featureEntries = Object.entries(entitlements.features);
  const showResolutionBanner = entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess;
  const visiblePlans = planCatalog.filter((plan) => entitlements.planKey === plan.key || (plan.isActive && plan.isPublic));
  const showBillingTestFallback = !managedPricing.ready && billingTestFallback.enabled;

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

        {managedPricing.configured && !managedPricing.ready ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Shopify-hosted pricing is not published yet
              </Text>
              <Text as="p" variant="bodyMd">
                The app handle is configured, but SubBulk intentionally hides the external pricing page until Partner Dashboard pricing content is published. This prevents merchants and reviewers from landing on a Shopify-hosted 404.
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        {actionData?.error ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Billing test flow failed
              </Text>
              <Text as="p" variant="bodyMd">
                {actionData.error}
              </Text>
            </BlockStack>
          </Card>
        ) : null}

        {showBillingTestFallback ? (
          <Card>
            <BlockStack gap="100">
              <InlineStack align="space-between" blockAlign="center">
                <Text as="h2" variant="headingMd">
                  Manual test billing fallback is active
                </Text>
                <Badge tone="info">Test only</Badge>
              </InlineStack>
              <Text as="p" variant="bodyMd">
                Managed pricing stays the production path, but this environment can temporarily create Shopify Billing API test charges for Premium and Ultra until the hosted pricing page is published.
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                These requests use test charges, open Shopify approval in the top window, and return to the billing welcome screen for reconciliation.
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
                {managedPricing.ready
                  ? "You can open the Shopify-hosted pricing page below to change or upgrade the merchant package."
                  : managedPricing.configured
                    ? "Shopify-hosted pricing remains hidden until Partner Dashboard managed pricing is fully published."
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
              {managedPricing.ready && managedPricing.url ? (
                <a href={managedPricing.url} target="_top" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="primary">Open Shopify pricing page</Button>
                </a>
              ) : null}
            </InlineStack>

            {!managedPricing.ready ? (
              <Text as="p" variant="bodySm" tone="subdued">
                {managedPricing.configured
                  ? "Plan switching will be re-enabled here after Shopify managed pricing content is published."
                  : "Direct plan switching becomes available after managed pricing is configured in environment and Partner Dashboard."}
              </Text>
            ) : null}

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
                      {managedPricing.ready && managedPricing.url ? (
                        <a href={managedPricing.url} target="_top" rel="noreferrer" style={{ textDecoration: "none" }}>
                          <Button variant={isCurrent ? "secondary" : "primary"} fullWidth>
                            {isCurrent ? "Review in Shopify billing" : "Change to this plan"}
                          </Button>
                        </a>
                      ) : showBillingTestFallback && plan.key !== "free" ? (
                        <BlockStack gap="200">
                          <Form method="post">
                            <input type="hidden" name="intent" value="start_test_charge" />
                            <input type="hidden" name="planKey" value={plan.key} />
                            <input type="hidden" name="billingInterval" value="monthly" />
                            <Button variant={isCurrent ? "secondary" : "primary"} fullWidth submit>
                              {isCurrent ? "Re-run monthly test charge" : "Start monthly test charge"}
                            </Button>
                          </Form>
                          <Form method="post">
                            <input type="hidden" name="intent" value="start_test_charge" />
                            <input type="hidden" name="planKey" value={plan.key} />
                            <input type="hidden" name="billingInterval" value="annual" />
                            <Button fullWidth submit>
                              {isCurrent ? "Re-run annual test charge" : "Start annual test charge"}
                            </Button>
                          </Form>
                        </BlockStack>
                      ) : (
                        <Text as="p" variant="bodySm" tone="subdued">
                          {managedPricing.configured
                            ? "Plan switching is temporarily hidden until Shopify managed pricing content is published."
                            : "Direct plan change link becomes available after setting the managed pricing app handle in environment."}
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