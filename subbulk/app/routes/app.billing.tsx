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
import { Form, useActionData, useLoaderData, useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  getLatestMerchantPlan,
  upsertMerchantFromSession,
} from "../models/merchant.server";
import { FloatingToast } from "../lib/floating-toast";
import { listAdminPlanDefinitions } from "../services/admin-plan-catalog.server";
import { createManualTestSubscription } from "../services/billing-test-fallback.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session, redirect } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "").trim();

  if (intent !== "subscribe") {
    return json({ ok: false, error: "Unsupported billing action." }, { status: 400 });
  }

  const rawPlanKey = String(formData.get("planKey") || "").trim().toLowerCase();
  if (rawPlanKey !== "growth" && rawPlanKey !== "scale") {
    return json({ ok: false, error: "Only Premium and Ultra plans can be subscribed." }, { status: 400 });
  }

  const billingInterval = String(formData.get("billingInterval") || "monthly").trim();

  const result = await createManualTestSubscription({
    admin,
    shopDomain: session.shop,
    planKey: rawPlanKey,
    billingInterval,
  });

  console.log("[billing.action] Subscription created! confirmationUrl:", result.confirmationUrl);
  return redirect(result.confirmationUrl, { target: "_top" });
};

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
    requiredFeature: url.searchParams.get("required") || null,
    writeBlocked: url.searchParams.get("writeBlocked") || null,
  };
};

export default function BillingPage() {
  const { shop, latestPlan, entitlements, planCatalog, requiredFeature, writeBlocked } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);
  const featureEntries = Object.entries(entitlements.features);
  const showResolutionBanner = entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess;
  const visiblePlans = planCatalog.filter((plan) => entitlements.planKey === plan.key || (plan.isActive && plan.isPublic));

  useEffect(() => {
    if (!actionData || !("error" in actionData) || !actionData.error) return;
    setToast({ message: actionData.error, tone: "critical" });
  }, [actionData]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  return (
    <Page>
      <TitleBar title="Billing & plan access" />
      <BlockStack gap="500">
        {toast ? <FloatingToast message={toast.message} tone={toast.tone} /> : null}
        {requiredFeature ? (
          <Card>
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Additional access required
              </Text>
              <Text as="p" variant="bodyMd">
                Your current plan does not include the feature: {FEATURE_LABELS[requiredFeature as keyof typeof FEATURE_LABELS] || requiredFeature}.
                Please upgrade to unlock this feature.
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
                The latest plan snapshot is marked as {entitlements.billingStatus}. Paid features stay locked until the subscription returns to an active or trialing state.
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
                Choose a plan below to subscribe via Shopify Billing.
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="300">
            <BlockStack gap="100">
              <Text as="h2" variant="headingMd">
                Available plans
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Choose a plan that fits your needs. You will be redirected to Shopify to confirm and approve the subscription.
              </Text>
            </BlockStack>

            <InlineGrid columns={{ xs: 1, md: 3 }} gap="300">
              {visiblePlans.map((plan) => {
                const isCurrent = entitlements.planKey === plan.key;
                const isFree = plan.key === "free";
                const isUpgrade = !isCurrent && (
                  (entitlements.planKey === "free") ||
                  (entitlements.planKey === "growth" && plan.key === "scale")
                );

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

                      {isCurrent ? (
                        <Button variant="secondary" fullWidth disabled>
                          Current plan
                        </Button>
                      ) : isFree ? (
                        <Text as="p" variant="bodySm" tone="subdued">
                          Cancel your paid subscription on Shopify to return to Free.
                        </Text>
                      ) : (
                        <BlockStack gap="200">
                          <Form method="post">
                            <input type="hidden" name="intent" value="subscribe" />
                            <input type="hidden" name="planKey" value={plan.key} />
                            <input type="hidden" name="billingInterval" value="monthly" />
                            <Button
                              variant={isUpgrade ? "primary" : "secondary"}
                              fullWidth
                              submit
                              loading={busy}
                            >
                              {isUpgrade ? `Upgrade to ${plan.name} (Monthly)` : `Switch to ${plan.name} (Monthly)`}
                            </Button>
                          </Form>
                          <Form method="post">
                            <input type="hidden" name="intent" value="subscribe" />
                            <input type="hidden" name="planKey" value={plan.key} />
                            <input type="hidden" name="billingInterval" value="annual" />
                            <Button fullWidth submit loading={busy}>
                              {isUpgrade ? `Upgrade to ${plan.name} (Annual)` : `Switch to ${plan.name} (Annual)`}
                            </Button>
                          </Form>
                        </BlockStack>
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