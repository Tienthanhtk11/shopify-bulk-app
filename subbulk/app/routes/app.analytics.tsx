import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { TitleBar } from "@shopify/app-bridge-react";
import {
  Badge,
  BlockStack,
  Box,
  Card,
  InlineGrid,
  InlineStack,
  List,
  Page,
  Text,
} from "@shopify/polaris";
import {
  buildSubscriptionAnalytics,
  listAdminSubscriptionContracts,
} from "../models/subscription-contracts.server";
import { authenticate } from "../shopify.server";

function formatPercent(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`;
}

function barWidth(value: number, maxValue: number) {
  if (maxValue <= 0) return "8%";
  return `${Math.max((value / maxValue) * 100, 8)}%`;
}

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const rows = await listAdminSubscriptionContracts(admin, 100);
  return {
    analytics: buildSubscriptionAnalytics(rows),
  };
};

export default function AnalyticsPage() {
  const { analytics } = useLoaderData<typeof loader>();
  const maxSeriesValue = Math.max(
    ...analytics.monthlySeries.map((item) => item.value),
    1,
  );

  return (
    <Page>
      <TitleBar title="Analytics" />
      <BlockStack gap="500">
        <InlineGrid columns={{ xs: 1, md: 4 }} gap="400">
          {[
            {
              label: "Total contracts",
              value: analytics.total,
              footnote: `${analytics.statusCounts.active} active now`,
              tone: "info",
            },
            {
              label: "Active rate",
              value: `${analytics.activeRate.toFixed(1)}%`,
              footnote: analytics.activeRate >= 60 ? "Healthy base" : "Needs more retention",
              tone: analytics.activeRate >= 60 ? "success" : "attention",
            },
            {
              label: "Churn rate",
              value: `${analytics.churnRate.toFixed(1)}%`,
              footnote: analytics.churnRate > 25 ? "High cancellation mix" : "Within watch range",
              tone: analytics.churnRate > 25 ? "critical" : "attention",
            },
            {
              label: "30-day growth",
              value: formatPercent(analytics.growthRate),
              footnote: `${analytics.recentCreated} new vs ${analytics.previousCreated} previous`,
              tone: analytics.growthRate >= 0 ? "success" : "critical",
            },
          ].map((item) => (
            <Card key={item.label}>
              <BlockStack gap="100">
                <Text as="p" variant="bodySm" tone="subdued">
                  {item.label}
                </Text>
                <Text as="p" variant="heading2xl">
                  {item.value}
                </Text>
                <Badge tone={item.tone as "info" | "success" | "attention" | "critical"}>
                  {item.footnote}
                </Badge>
              </BlockStack>
            </Card>
          ))}
        </InlineGrid>

        <InlineGrid columns={{ xs: 1, md: "1.5fr 1fr" }} gap="400">
          <Card>
            <BlockStack gap="300">
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h2" variant="headingMd">
                    Subscription health
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    Snapshot from Shopify subscription contract data.
                  </Text>
                </BlockStack>
                <Badge tone={analytics.churnRate > 25 ? "critical" : "success"}>
                  {analytics.churnRate > 25 ? "Needs attention" : "Stable"}
                </Badge>
              </InlineStack>
              <Text as="p" variant="bodyMd">
                {analytics.healthSummary}
              </Text>
              <InlineGrid columns={{ xs: 1, md: 3 }} gap="300">
                <Card>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Renewals due in 7 days
                    </Text>
                    <Text as="p" variant="headingLg">
                      {analytics.dueIn7Days}
                    </Text>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Renewals due in 30 days
                    </Text>
                    <Text as="p" variant="headingLg">
                      {analytics.dueIn30Days}
                    </Text>
                  </BlockStack>
                </Card>
                <Card>
                  <BlockStack gap="100">
                    <Text as="p" variant="bodySm" tone="subdued">
                      Avg units / contract
                    </Text>
                    <Text as="p" variant="headingLg">
                      {analytics.averageQuantity.toFixed(1)}
                    </Text>
                  </BlockStack>
                </Card>
              </InlineGrid>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Billing outlook
              </Text>
              <List type="bullet">
                <List.Item>{analytics.dueIn7Days} contracts due in 7 days</List.Item>
                <List.Item>{analytics.dueIn30Days} contracts due in 30 days</List.Item>
                <List.Item>{analytics.recentCreated} contracts created in the last 30 days</List.Item>
                <List.Item>{analytics.previousCreated} contracts created in the prior 30-day window</List.Item>
              </List>
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Subscription growth
              </Text>
              <Text as="p" variant="bodySm" tone="subdued">
                Newly created contracts by month, based on the latest Admin records.
              </Text>
              <BlockStack gap="250">
                {analytics.monthlySeries.length === 0 ? (
                  <Text as="p" variant="bodyMd" tone="subdued">
                    Chua co du du lieu de hien thi bieu do.
                  </Text>
                ) : (
                  analytics.monthlySeries.map((item) => (
                    <InlineGrid
                      key={item.label}
                      columns={{ xs: "72px 1fr 40px" }}
                      gap="200"
                    >
                      <Text as="span" variant="bodySm" tone="subdued">
                        {item.label}
                      </Text>
                      <Box
                        background="bg-fill-brand"
                        borderRadius="200"
                        minHeight="4"
                        width={barWidth(item.value, maxSeriesValue)}
                      />
                      <Text as="span" alignment="end" variant="bodySm">
                        {item.value}
                      </Text>
                    </InlineGrid>
                  ))
                )}
              </BlockStack>
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Status distribution
              </Text>
              {[
                {
                  label: "Active",
                  value: analytics.statusCounts.active,
                  tone: "success" as const,
                },
                {
                  label: "Paused",
                  value: analytics.statusCounts.paused,
                  tone: "attention" as const,
                },
                {
                  label: "Cancelled",
                  value: analytics.statusCounts.cancelled,
                  tone: "critical" as const,
                },
              ].map((item) => (
                <BlockStack key={item.label} gap="100">
                  <InlineStack align="space-between">
                    <Text as="span" variant="bodyMd">
                      {item.label}
                    </Text>
                    <Badge tone={item.tone}>{item.value}</Badge>
                  </InlineStack>
                  <Box
                    background="bg-fill-brand"
                    borderRadius="200"
                    minHeight="4"
                    width={barWidth(item.value, analytics.total || 1)}
                  />
                </BlockStack>
              ))}
            </BlockStack>
          </Card>
        </InlineGrid>

        <InlineGrid columns={{ xs: 1, md: 2 }} gap="400">
          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Top subscribed products
              </Text>
              {analytics.topProducts.length === 0 ? (
                <Text as="p" variant="bodyMd" tone="subdued">
                  No product-level contract data yet.
                </Text>
              ) : (
                analytics.topProducts.map((item) => (
                  <InlineStack key={item.title} align="space-between">
                    <Text as="span" variant="bodyMd">
                      {item.title}
                    </Text>
                    <Badge>{item.contracts}</Badge>
                  </InlineStack>
                ))
              )}
            </BlockStack>
          </Card>

          <Card>
            <BlockStack gap="300">
              <Text as="h2" variant="headingMd">
                Recent contracts
              </Text>
              {analytics.newestContracts.length === 0 ? (
                <Text as="p" variant="bodyMd" tone="subdued">
                  No recent contracts found.
                </Text>
              ) : (
                analytics.newestContracts.map((item) => (
                  <BlockStack key={item.shortId} gap="100">
                    <InlineStack align="space-between" blockAlign="center">
                      <Text as="span" variant="bodyMd" fontWeight="semibold">
                        #{item.shortId}
                      </Text>
                      <Badge
                        tone={
                          item.status === "ACTIVE"
                            ? "success"
                            : item.status === "PAUSED"
                              ? "attention"
                              : "critical"
                        }
                      >
                        {item.status}
                      </Badge>
                    </InlineStack>
                    <Text as="p" variant="bodySm">
                      {item.customerName} · {item.lineTitle}
                    </Text>
                    <Text as="p" variant="bodySm" tone="subdued">
                      Created {formatDate(item.createdAt)} · Next billing {formatDate(item.nextBillingDate)}
                    </Text>
                  </BlockStack>
                ))
              )}
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
