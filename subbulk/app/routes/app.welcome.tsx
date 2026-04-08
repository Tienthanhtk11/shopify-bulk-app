import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import { Badge, BlockStack, Button, Card, InlineGrid, Page, Text } from "@shopify/polaris";
import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { reconcileMerchantBillingFromAdmin } from "../services/merchant-billing.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const reconciliation = await reconcileMerchantBillingFromAdmin(admin, session.shop);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const entitlements = resolveEntitlements(latestPlan);

  return {
    shop: session.shop,
    reconciliation,
    latestPlan,
    entitlements,
  };
};

export default function WelcomePage() {
  const { shop, reconciliation, latestPlan, entitlements } = useLoaderData<typeof loader>();
  const primarySubscription = reconciliation.subscriptions[0] ?? null;

  return (
    <Page>
      <TitleBar title="Billing welcome" />
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="200">
            <Text as="h1" variant="headingLg">
              Billing reconciliation complete
            </Text>
            <Text as="p" variant="bodyMd">
              Shop: {shop}
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              This is the Shopify billing return screen. It refreshes the latest billing state into the internal merchant snapshot before the merchant continues.
            </Text>
            <Badge tone={reconciliation.persisted ? "success" : "attention"}>
              {reconciliation.reason}
            </Badge>
          </BlockStack>
        </Card>

        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Latest internal plan
              </Text>
              <Text as="p" variant="headingLg">
                {latestPlan?.planName || "No plan snapshot"}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Status: {latestPlan?.status || "none"}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Active Shopify subscription
              </Text>
              <Text as="p" variant="headingLg">
                {primarySubscription?.name || "No active subscription"}
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Interval: {primarySubscription?.billingInterval || "unknown"}
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Access unlocked right now
            </Text>
            {Object.entries(entitlements.features)
              .filter(([, enabled]) => enabled)
              .map(([featureKey]) => (
                <Text key={featureKey} as="p" variant="bodyMd">
                  {FEATURE_LABELS[featureKey as keyof typeof FEATURE_LABELS]}
                </Text>
              ))}
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap="200">
            <Link to="/app/billing">
              <Button variant="primary">Open billing</Button>
            </Link>
            <Link to="/app/subscriptions">
              <Button>Continue to subscriptions</Button>
            </Link>
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}