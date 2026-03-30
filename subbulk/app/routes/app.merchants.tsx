import type { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Card,
  InlineGrid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { listMerchants, upsertMerchantFromSession } from "../models/merchant.server";
import { assertInternalAdminSession } from "../services/internal-admin.server";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  await upsertMerchantFromSession(session);
  assertInternalAdminSession(session);

  const merchants = await listMerchants();
  return { merchants };
};

export default function MerchantsPage() {
  const { merchants } = useLoaderData<typeof loader>();

  return (
    <Page>
      <TitleBar title="Merchants" />
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 1, md: 4 }} gap="400">
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Total merchants
              </Text>
              <Text as="p" variant="heading2xl">
                {merchants.length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Active
              </Text>
              <Text as="p" variant="heading2xl">
                {merchants.filter((merchant) => merchant.status === "active").length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Uninstalled
              </Text>
              <Text as="p" variant="heading2xl">
                {merchants.filter((merchant) => merchant.status === "uninstalled").length}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Pending deletions
              </Text>
              <Text as="p" variant="heading2xl">
                {
                  merchants.filter(
                    (merchant) => merchant.latestDeletionRequest?.status === "pending",
                  ).length
                }
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="300">
            <Text as="h1" variant="headingLg">
              Merchant list
            </Text>
            {merchants.map((merchant) => (
              <Card key={merchant.id}>
                <InlineGrid columns={{ xs: 1, md: "2fr 1fr 1fr 120px" }} gap="300">
                  <BlockStack gap="100">
                    <Text as="h2" variant="headingMd">
                      {merchant.shopDomain}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {merchant.email || "No email stored"}
                    </Text>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Merchant status
                    </Text>
                    <Badge tone={merchant.status === "active" ? "success" : "attention"}>
                      {merchant.status}
                    </Badge>
                  </BlockStack>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Latest plan
                    </Text>
                    <Text as="p" variant="bodyMd">
                      {merchant.latestPlan?.planName || "No plan snapshot"}
                    </Text>
                  </BlockStack>
                  <InlineStack align="end">
                    <Link to={`/app/merchants/${merchant.id}`}>View</Link>
                  </InlineStack>
                </InlineGrid>
              </Card>
            ))}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}