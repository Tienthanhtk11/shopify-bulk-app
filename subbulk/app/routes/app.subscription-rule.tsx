import type { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData, useLocation, useNavigate } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Button,
  Card,
  EmptyState,
  InlineGrid,
  InlineStack,
  Page,
  Text,
} from "@shopify/polaris";
import { getSubscriptionRule, parseExplicitGids } from "../models/subscription-rule.server";
import { listWidgetEnabledProducts } from "../models/widget-enabled-product.server";
import { authenticate } from "../shopify.server";

function ruleDiscountLabel(
  discountType: string,
  discountValue: string,
  title: string,
) {
  return discountType === "FIXED"
    ? `$${discountValue} off ${title}`
    : `${discountValue}% off ${title}`;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const [rule, widgetProducts] = await Promise.all([
    getSubscriptionRule(session.shop),
    listWidgetEnabledProducts(session.shop),
  ]);

  const productCount = rule
    ? rule.productScope === "EXPLICIT"
      ? parseExplicitGids(rule.explicitProductGidsJson).length
      : widgetProducts.length
    : 0;

  const intervalCount = rule?.planIntervalsJson
    ? (() => {
        try {
          const parsed = JSON.parse(rule.planIntervalsJson);
          return Array.isArray(parsed) ? parsed.length : 0;
        } catch {
          return 0;
        }
      })()
    : 0;

  return {
    rule,
    productCount,
    intervalCount,
  };
};

export default function SubscriptionRulePage() {
  const { rule, productCount, intervalCount } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname !== "/app/subscription-rule") {
    return <Outlet />;
  }

  return (
    <Page>
      <TitleBar title="Subscription rule" />
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 1, md: 4 }} gap="400">
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Rules in store
              </Text>
              <Text as="p" variant="heading2xl">
                {rule ? 1 : 0}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Product coverage
              </Text>
              <Text as="p" variant="heading2xl">
                {productCount}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Plan intervals
              </Text>
              <Text as="p" variant="heading2xl">
                {intervalCount}
              </Text>
            </BlockStack>
          </Card>
          <Card>
            <BlockStack gap="100">
              <Text as="p" variant="bodySm" tone="subdued">
                Scope
              </Text>
              <Text as="p" variant="heading2xl">
                {rule?.productScope === "EXPLICIT" ? "Fixed" : "Widget"}
              </Text>
            </BlockStack>
          </Card>
        </InlineGrid>

        <Card>
          <BlockStack gap="400">
            <InlineStack align="space-between" blockAlign="center">
              <BlockStack gap="100">
                <Text as="h1" variant="headingLg">
                  Subscription rules
                </Text>
                <Text as="p" variant="bodyMd" tone="subdued">
                  This version currently manages one primary subscription rule per
                  shop, with a list-style surface similar to dedicated subscription
                  apps.
                </Text>
              </BlockStack>
              <Button
                onClick={() => navigate("/app/subscription-rule/editor")}
                variant="primary"
              >
                {rule ? "Edit rule" : "Create rule"}
              </Button>
            </InlineStack>

            {!rule ? (
              <EmptyState
                heading="No subscription rule configured yet"
                image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              >
                <p>Create your first subscription rule and connect it to products.</p>
                <Button
                  onClick={() => navigate("/app/subscription-rule/editor")}
                  variant="primary"
                >
                  Create rule
                </Button>
              </EmptyState>
            ) : (
              <Card>
                <InlineGrid columns={{ xs: 1, md: "2fr 1fr 1fr auto" }} gap="400">
                  <BlockStack gap="100">
                    <InlineStack gap="200" blockAlign="center">
                      <Text as="h2" variant="headingMd">
                        {rule.title}
                      </Text>
                      <Badge tone="info">
                        {rule.productScope === "EXPLICIT"
                          ? "Manual product list"
                          : "Widget-enabled list"}
                      </Badge>
                    </InlineStack>
                    <Text as="p" variant="bodySm" tone="subdued">
                      {ruleDiscountLabel(
                        rule.discountType,
                        rule.discountValue,
                        "subscription orders",
                      )}
                    </Text>
                  </BlockStack>

                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Products
                    </Text>
                    <Text as="p" variant="bodyMd">
                      {productCount} products
                    </Text>
                  </BlockStack>

                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Delivery cadence
                    </Text>
                    <Text as="p" variant="bodyMd">
                      {intervalCount} interval options
                    </Text>
                  </BlockStack>

                  <InlineStack align="end">
                    <Button onClick={() => navigate("/app/subscription-rule/editor")}>
                      Open
                    </Button>
                  </InlineStack>
                </InlineGrid>
              </Card>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
