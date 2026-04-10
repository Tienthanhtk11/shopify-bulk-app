import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Banner,
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
  syncMerchantPlanSnapshot,
  upsertMerchantFromSession,
} from "../models/merchant.server";
import { FloatingToast } from "../lib/floating-toast";
import { listAdminPlanDefinitions } from "../services/admin-plan-catalog.server";
import { cancelShopifySubscription, createShopifySubscription, getShopifyBillingState } from "../services/billing.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { isMerchantPlanCancellationScheduled } from "../services/merchant-plan-timeline.shared";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const formData = await request.formData();
  const intent = String(formData.get("intent") || "").trim();
  const host = String(formData.get("host") || "").trim() || null;
  const latestPlan = await getLatestMerchantPlan(session.shop);

  if (intent === "cancel") {
    if (latestPlan && isMerchantPlanCancellationScheduled(latestPlan)) {
      return json({
        ok: true,
        message: latestPlan.currentPeriodEndAt
          ? `Auto-renew is already off. Paid access stays available until ${new Date(latestPlan.currentPeriodEndAt).toLocaleDateString("en-US")}.`
          : "Auto-renew is already off for this subscription.",
      });
    }

    try {
      const result = await cancelShopifySubscription({
        admin,
        shopDomain: session.shop,
        latestPlan,
        prorate: false,
      });

      await syncMerchantPlanSnapshot({
        shopDomain: session.shop,
        planKey: latestPlan?.planKey || "free",
        planName: result.planName,
        status: result.status,
        billingInterval: result.billingInterval,
        isTest: result.isTest,
        shopifySubscriptionGid: result.subscriptionGid,
        currentPeriodEndAt: result.currentPeriodEnd ? new Date(result.currentPeriodEnd) : latestPlan?.currentPeriodEndAt ?? null,
        canceledAt: new Date(),
        rawPayload: {
          source: "billing.cancel",
          subscriptionGid: result.subscriptionGid,
          status: result.status,
          currentPeriodEnd: result.currentPeriodEnd,
          prorate: false,
        },
      });

      return json({
        ok: true,
        message: result.currentPeriodEnd
          ? `Auto-renew is off. Paid access stays available until ${new Date(result.currentPeriodEnd).toLocaleDateString("en-US")}.`
          : "Subscription cancellation submitted.",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to cancel the Shopify billing subscription.";
      return json({ ok: false, error: message }, { status: 400 });
    }
  }

  if (intent !== "subscribe") {
    return json({ ok: false, error: "Unsupported billing action." }, { status: 400 });
  }

  const rawPlanKey = String(formData.get("planKey") || "").trim().toLowerCase();
  if (rawPlanKey !== "growth" && rawPlanKey !== "scale") {
    return json({ ok: false, error: "Only Premium and Ultra plans can be subscribed." }, { status: 400 });
  }

  const billingInterval = String(formData.get("billingInterval") || "monthly").trim();

  try {
    const result = await createShopifySubscription({
      admin,
      shopDomain: session.shop,
      planKey: rawPlanKey,
      billingInterval,
      host,
      currentPlan: latestPlan,
    });

    console.log("[billing.action] Subscription created! confirmationUrl:", result.confirmationUrl);
    return json({ ok: true, confirmationUrl: result.confirmationUrl });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create the Shopify billing subscription.";
    return json({ ok: false, error: message }, { status: 400 });
  }
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const entitlements = resolveEntitlements(latestPlan);
  const url = new URL(request.url);
  const planCatalog = await listAdminPlanDefinitions();
  const billingState = getShopifyBillingState();

  return {
    shop: session.shop,
    host: url.searchParams.get("host") || null,
    latestPlan,
    entitlements,
    planCatalog,
    billingState,
    requiredFeature: url.searchParams.get("required") || null,
    writeBlocked: url.searchParams.get("writeBlocked") || null,
  };
};

export default function BillingPage() {
  const { shop, host, latestPlan, entitlements, planCatalog, billingState, requiredFeature, writeBlocked } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const nav = useNavigation();
  const busy = nav.state !== "idle";
  const [toast, setToast] = useState<{
    message: string;
    tone: "success" | "critical";
  } | null>(null);
  const featureEntries = Object.entries(entitlements.features);
  const showResolutionBanner = entitlements.planKey !== "free" && !entitlements.hasActivePlanAccess;
  const cancellationScheduled = entitlements.isCancellationScheduled;
  const scheduledEndDate = entitlements.accessEndsAt ? new Date(entitlements.accessEndsAt) : null;
  const visiblePlans = planCatalog.filter((plan) => entitlements.planKey === plan.key || (plan.isActive && plan.isPublic));
  const currentPlanIsPaid = entitlements.planKey !== "free";

  useEffect(() => {
    if (!actionData || !("error" in actionData) || !actionData.error) return;
    setToast({ message: actionData.error, tone: "critical" });
  }, [actionData]);

  useEffect(() => {
    if (!actionData || !("message" in actionData) || !actionData.message) return;
    setToast({ message: actionData.message, tone: "success" });
  }, [actionData]);

  useEffect(() => {
    if (!actionData || !("confirmationUrl" in actionData) || !actionData.confirmationUrl) return;

    const openedWindow = window.open(actionData.confirmationUrl, "_top");
    if (!openedWindow) {
      window.location.assign(actionData.confirmationUrl);
    }
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
        <Banner tone="info" title="Shopify handles the approval step">
          <p>
            Plan changes stay embedded until Shopify opens its approval screen. After approval, the app returns to the in-app billing confirmation flow automatically.
          </p>
          <p>
            Shopify applies upgrades immediately. Lower-priced changes can be prorated or deferred to the next billing cycle depending on the current plan and billing interval.
          </p>
          {billingState.testMode ? (
            <p>
              This environment is currently using Shopify test charges for safe end-to-end verification.
            </p>
          ) : null}
        </Banner>
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
        {cancellationScheduled ? (
          <Banner tone="warning" title="Auto-renew is off for the current paid plan">
            <p>
              {scheduledEndDate
                ? `This subscription remains available until ${scheduledEndDate.toLocaleDateString("en-US")}. After that date, the shop returns to the Free plan unless a new paid plan is approved.`
                : "This subscription is scheduled to end at the close of the current billing period unless a new paid plan is approved."}
            </p>
          </Banner>
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
              {cancellationScheduled ? <Badge tone="warning">Auto-renew off</Badge> : null}
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
                {entitlements.billingStatus || latestPlan?.status || "no_plan_recorded"}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                {cancellationScheduled
                  ? scheduledEndDate
                    ? `Auto-renew is off. Access stays available until ${scheduledEndDate.toLocaleDateString("en-US")}.`
                    : "Auto-renew is off for the current subscription."
                  : "Choose a plan below to open Shopify's approval flow."}
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
                Choose a plan that fits your needs. Shopify handles the confirmation and returns the merchant to this embedded app afterward.
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
                const isDowngrade = !isCurrent && !isFree && !isUpgrade;

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
                        <BlockStack gap="200">
                          <Button variant="secondary" fullWidth disabled>
                            Current plan
                          </Button>
                          {currentPlanIsPaid ? (
                            cancellationScheduled ? (
                              <Button fullWidth disabled tone="critical" variant="secondary">
                                Auto-renew already off
                              </Button>
                            ) : (
                              <Form method="post">
                                <input type="hidden" name="intent" value="cancel" />
                                <Button fullWidth submit loading={busy} tone="critical" variant="secondary">
                                  Cancel auto-renew
                                </Button>
                              </Form>
                            )
                          ) : null}
                        </BlockStack>
                      ) : isFree ? (
                        currentPlanIsPaid ? (
                          cancellationScheduled ? (
                            <Text as="p" variant="bodySm" tone="subdued">
                              Free plan will resume automatically when the current billing period ends.
                            </Text>
                          ) : (
                            <Form method="post">
                              <input type="hidden" name="intent" value="cancel" />
                              <Button fullWidth submit loading={busy} tone="critical" variant="secondary">
                                Cancel and return to Free
                              </Button>
                            </Form>
                          )
                        ) : (
                          <Text as="p" variant="bodySm" tone="subdued">
                            Free plan is active.
                          </Text>
                        )
                      ) : (
                        <BlockStack gap="200">
                          <Form method="post">
                            <input type="hidden" name="intent" value="subscribe" />
                            <input type="hidden" name="planKey" value={plan.key} />
                            <input type="hidden" name="billingInterval" value="monthly" />
                            {host ? <input type="hidden" name="host" value={host} /> : null}
                            <Button
                              variant={isUpgrade ? "primary" : "secondary"}
                              fullWidth
                              submit
                              loading={busy}
                            >
                              {isUpgrade
                                ? `Upgrade to ${plan.name} (Monthly)`
                                : isDowngrade
                                  ? `Downgrade to ${plan.name} (Monthly)`
                                  : `Switch to ${plan.name} (Monthly)`}
                            </Button>
                          </Form>
                          <Form method="post">
                            <input type="hidden" name="intent" value="subscribe" />
                            <input type="hidden" name="planKey" value={plan.key} />
                            <input type="hidden" name="billingInterval" value="annual" />
                            {host ? <input type="hidden" name="host" value={host} /> : null}
                            <Button fullWidth submit loading={busy}>
                              {isUpgrade
                                ? `Upgrade to ${plan.name} (Annual)`
                                : isDowngrade
                                  ? `Downgrade to ${plan.name} (Annual)`
                                  : `Switch to ${plan.name} (Annual)`}
                            </Button>
                          </Form>
                          {isDowngrade ? (
                            <Text as="p" variant="bodySm" tone="subdued">
                              Shopify may defer this lower-priced change until the next billing cycle, especially for annual plans.
                            </Text>
                          ) : null}
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