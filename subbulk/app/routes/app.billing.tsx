import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Card,
  Divider,
  InlineGrid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { getLatestMerchantPlan, upsertMerchantFromSession } from "../models/merchant.server";
import { FEATURE_LABELS } from "../services/entitlements.shared";
import { resolveEntitlements } from "../services/entitlements.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  const latestPlan = await getLatestMerchantPlan(session.shop);
  const entitlements = resolveEntitlements(latestPlan);
  const url = new URL(request.url);

  return {
    latestPlan,
    entitlements,
    requiredFeature: url.searchParams.get("required") || null,
  };
};

export default function BillingPage() {
  const { latestPlan, entitlements, requiredFeature } = useLoaderData<typeof loader>();
  const featureEntries = Object.entries(entitlements.features);

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
                Configure Managed Pricing in the Partner Dashboard to enable production plan selection.
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Enabled features
            </Text>
            <Text as="p" variant="bodySm" tone="subdued">
              Plan matrix: Free keeps onboarding and widget setup basics, Growth unlocks the main merchant operations, and Scale adds premium automation/support surfaces.
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